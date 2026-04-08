import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_SUBMIT_TIME_MS = 3000;
const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);

type InquiryPayload = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  projectType?: string;
  projectDetails?: string;
  uploadedFile?: string;
  website?: string;
  formStartedAt?: number;
};

type AttachmentPayload = {
  filename: string;
  content: Buffer;
  contentType: string;
};

const requestLog = new Map<string, number[]>();
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const inquiryToEmail =
  process.env.INQUIRY_TO_EMAIL || "nathenergyinfrastructure@gmail.com";

const transporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);

  return recentRequests.length > RATE_LIMIT_MAX_REQUESTS;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function validatePayload(payload: InquiryPayload) {
  const name = sanitizeText(payload.name || "", 120);
  const company = sanitizeText(payload.company || "", 160);
  const phone = sanitizeText(payload.phone || "", 30);
  const email = sanitizeText(payload.email || "", 160);
  const projectType = sanitizeText(payload.projectType || "", 80);
  const projectDetails = sanitizeText(payload.projectDetails || "", 2000);
  const uploadedFile = sanitizeText(payload.uploadedFile || "", 160);
  const website = sanitizeText(payload.website || "", 200);
  const formStartedAt =
    typeof payload.formStartedAt === "number" ? payload.formStartedAt : 0;

  if (!name || !company || !phone || !email || !projectType || !projectDetails) {
    return { ok: false, message: "Missing required fields." };
  }

  if (website) {
    return { ok: false, message: "Bot submission detected." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Invalid email address." };
  }

  if (!formStartedAt || Date.now() - formStartedAt < MIN_SUBMIT_TIME_MS) {
    return { ok: false, message: "Form submitted too quickly." };
  }

  return {
    ok: true,
    data: {
      name,
      company,
      phone,
      email,
      projectType,
      projectDetails,
      uploadedFile,
    },
  };
}

function validateAttachment(file: File) {
  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return {
      ok: false,
      message: "File is too large. Please upload a file up to 10MB.",
    };
  }

  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
    return {
      ok: false,
      message: "Unsupported file type. Please upload PDF, Word, Excel, JPG, or PNG.",
    };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const body: InquiryPayload = {
      name: String(formData.get("name") || ""),
      company: String(formData.get("company") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      projectType: String(formData.get("projectType") || ""),
      projectDetails: String(formData.get("projectDetails") || ""),
      uploadedFile: String(formData.get("uploadedFile") || ""),
      website: String(formData.get("website") || ""),
      formStartedAt: Number(formData.get("formStartedAt") || 0),
    };
    const validation = validatePayload(body);

    if (!validation.ok || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    if (!transporter) {
      return NextResponse.json(
        {
          success: false,
          message: "Email delivery is not configured yet.",
        },
        { status: 500 }
      );
    }

    const { name, company, phone, email, projectType, projectDetails, uploadedFile } =
      validation.data;
    const safeDetails = escapeHtml(projectDetails).replace(/\n/g, "<br />");
    const attachmentEntry = formData.get("attachment");
    let attachment: AttachmentPayload | undefined;

    if (attachmentEntry instanceof File && attachmentEntry.size > 0) {
      const attachmentValidation = validateAttachment(attachmentEntry);

      if (!attachmentValidation.ok) {
        return NextResponse.json(
          {
            success: false,
            message: attachmentValidation.message,
          },
          { status: 400 }
        );
      }

      const bytes = await attachmentEntry.arrayBuffer();
      attachment = {
        filename: attachmentEntry.name,
        content: Buffer.from(bytes),
        contentType: attachmentEntry.type || "application/octet-stream",
      };
    }

    await transporter.sendMail({
      from: smtpUser,
      to: inquiryToEmail,
      replyTo: email,
      subject: `New Inquiry: ${projectType} | ${name}`,
      text: [
        "New website inquiry received",
        "",
        `Name: ${name}`,
        `Company: ${company}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Project Type: ${projectType}`,
        `Uploaded File: ${uploadedFile || "No file name provided"}`,
        "",
        "Project Details:",
        projectDetails,
      ].join("\n"),
      html: `
        <h2>New Website Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Uploaded File:</strong> ${escapeHtml(uploadedFile || "No file name provided")}</p>
        <p><strong>Project Details:</strong></p>
        <p>${safeDetails}</p>
      `,
      attachments: attachment
        ? [
            {
              filename: attachment.filename,
              content: attachment.content,
              contentType: attachment.contentType,
            },
          ]
        : [],
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully and sent by email.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process inquiry.",
      },
      { status: 500 }
    );
  }
}
