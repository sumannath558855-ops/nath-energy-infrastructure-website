"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent } from "react";

import { motion } from "framer-motion";
import {
  Brush,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Factory,
  Hammer,
  Leaf,
  MoonStar,
  PhoneCall,
  ShieldCheck,
  SunMedium,
  Upload,
  Waves,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Service = {
  title: string;
  description: string;
  icon: typeof Hammer;
};

const services: Service[] = [
  {
    title: "Road Construction",
    description: "Road and highway EPC packages for public and industrial infrastructure.",
    icon: Hammer,
  },
  {
    title: "Drainage & Sewage",
    description: "Drainage, sewer, and associated civil utility infrastructure works.",
    icon: Waves,
  },
  {
    title: "Civil Infrastructure",
    description: "General civil execution for government, municipal, and industrial works.",
    icon: Building2,
  },
  {
    title: "Apartment Painting",
    description: "Painting solutions for apartment buildings, large residential blocks, and project-based property works.",
    icon: Brush,
  },
  {
    title: "Commercial Rooftop Solar",
    description: "Solar EPC for factories, institutions, warehouses, and large buildings.",
    icon: Factory,
  },
  {
    title: "Ground-Mounted Solar",
    description: "Utility and large-scale ground solar projects for industrial and land-based opportunities.",
    icon: Leaf,
  },
];

const focusPoints = [
  "Government departments and tender-based projects",
  "Industrial and commercial EPC requirements",
  "Municipal and institutional infrastructure works",
  "No house construction or domestic solar work",
];

export function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    projectType: "",
    projectDetails: "",
    website: "",
  });
  const formStartedAtRef = useRef<number>(0);
  const messageLink = `https://wa.me/916026514250?text=${encodeURIComponent(
    "Hi, I need EPC service"
  )}`;

  if (isMounted && formStartedAtRef.current === 0) {
    formStartedAtRef.current = Date.now();
  }

  function scrollToSection(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    const fileName = file?.name ?? "";
    setSelectedFile(file);
    setUploadedFile(fileName);
  }

  function updateForm(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("company", form.company);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("projectType", form.projectType);
      formData.append("projectDetails", form.projectDetails);
      formData.append("website", form.website);
      formData.append("uploadedFile", uploadedFile);
      formData.append("formStartedAt", String(formStartedAtRef.current || Date.now()));

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const response = await fetch("/api/inquiry", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Inquiry submission failed. Please try WhatsApp or call directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        <a
          href="tel:+916026514250"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-[#081a29] px-5 text-sm font-medium text-white shadow-[0_18px_50px_rgba(8,26,41,0.28)]"
        >
          Call Now
        </a>
        <a
          href={messageLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#18b86d] px-5 text-sm font-medium text-white shadow-[0_18px_50px_rgba(24,184,109,0.3)]"
        >
          WhatsApp
        </a>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 supports-backdrop-filter:backdrop-blur-xl">
        <div className="section-shell flex h-18 items-center justify-between gap-4">
          <button type="button" onClick={() => scrollToSection("#top")} className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.15rem] border border-border bg-white p-1 shadow-[0_18px_50px_rgba(8,26,41,0.14)] dark:border-white/10 dark:bg-white">
              <Image
                src="/nath-logo.jpeg"
                alt="Nath Energy & Infrastructure logo"
                width={64}
                height={64}
                className="h-full w-full scale-110 object-contain"
              />
            </div>
            <div className="text-left">
              <p className="font-heading text-lg leading-none">Nath Energy & Infrastructure</p>
              <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                EPC for infrastructure & solar
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-6 md:flex">
            <button type="button" onClick={() => scrollToSection("#services")} className="text-sm text-muted-foreground hover:text-foreground">
              Services
            </button>
            <button type="button" onClick={() => scrollToSection("#inquiry")} className="text-sm text-muted-foreground hover:text-foreground">
              Inquiry
            </button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {isMounted && resolvedTheme === "dark" ? <SunMedium data-icon="inline-start" /> : <MoonStar data-icon="inline-start" />}
              {isMounted && resolvedTheme === "dark" ? "Light" : "Dark"}
            </Button>
          </div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-[#06111c] py-20 text-white sm:py-28">
        <div className="hero-grid absolute inset-0 opacity-15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(58,240,170,0.24),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(95,184,255,0.16),_transparent_24%)]" />
        <div className="section-shell relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.72rem] font-semibold tracking-[0.24em] text-[#93ffcf] uppercase">
              Trusted EPC Support For Roads, Civil Works, Solar, And Project Delivery.
            </span>
            <h1 className="mt-6 font-heading text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              A EPC solution provider for government, industrial, and commercial projects.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              We focus on roads, drainage, civil works, commercial rooftop solar, and
              ground-mounted solar projects. No residential construction, domestic and industrial solar installation work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToSection("#inquiry")}
              >
                Request Quote
                <ArrowRight data-icon="inline-end" />
              </Button>
              <a
                href={messageLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 text-sm font-medium text-white"
              >
                WhatsApp Us
              </a>
              <a
                href="tel:+916026514250"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 text-sm font-medium text-white"
              >
                Talk to Engineer
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="soft-card glow-border rounded-[2rem] border border-white/10 bg-white/90 p-6 text-foreground backdrop-blur-2xl dark:bg-white/8 dark:text-white"
          >
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-border bg-background/80 p-5 dark:border-white/10 dark:bg-white/6">
                <p className="text-xs tracking-[0.22em] text-primary uppercase">Who we work with</p>
                <p className="mt-3 text-lg leading-8 text-foreground/80 dark:text-white/78">
                  Government bodies, infrastructure developers, industries, institutions, municipalities,
                  factories, and landowners for utility solar.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-background/80 p-5 dark:border-white/10 dark:bg-white/6">
                <p className="text-xs tracking-[0.22em] text-primary uppercase">What we do not take</p>
                <p className="mt-3 text-lg leading-8 text-foreground/80 dark:text-white/78">
                  House construction, residential household works, and small domestic solar installations.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-background/80 p-5 dark:border-white/10 dark:bg-white/6">
                <p className="text-xs tracking-[0.22em] text-primary uppercase">Primary goal</p>
                <p className="mt-3 text-lg leading-8 text-foreground/80 dark:text-white/78">
                  Generate serious EPC leads, consultation bookings, tender inquiries, and quotation requests.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="section-shell py-20 sm:py-24">
        <div className="max-w-3xl">
          <span className="eyebrow">Services</span>
          <h2 className="section-title mt-6">What we are ready to execute.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Clear service categories for large-scale EPC opportunities only.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div key={service.title} className="soft-card rounded-[1.8rem] p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-heading text-2xl">{service.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-shell py-4 pb-20 sm:pb-24">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="soft-card rounded-[2rem] p-7">
            <span className="eyebrow">Focus</span>
            <h2 className="section-title mt-6">Direct, serious, and commercial.</h2>
            <div className="mt-6 grid gap-3">
              {focusPoints.map((item) => (
                <div key={item} className="rounded-[1.2rem] bg-muted/60 px-4 py-4 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="soft-card rounded-[2rem] p-7">
            <span className="eyebrow">Approach</span>
            <h2 className="section-title mt-6">Why clients should contact you.</h2>
            <div className="mt-6 grid gap-3">
              {[
                { icon: ShieldCheck, text: "Tender-ready EPC positioning" },
                { icon: BriefcaseBusiness, text: "Built for government and industrial inquiries" },
                { icon: Leaf, text: "Strong focus on commercial and utility solar" },
                { icon: PhoneCall, text: "Fast consultation and quotation response" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.text} className="flex items-center gap-3 rounded-[1.2rem] bg-muted/60 px-4 py-4">
                    <div className="rounded-xl bg-primary/12 p-2 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-8">
        <div className="rounded-[2rem] bg-[#081a29] px-6 py-8 text-white sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs tracking-[0.22em] text-[#93ffcf] uppercase">Tender Inquiry</p>
              <h2 className="mt-3 font-heading text-3xl">Have a government tender or industrial EPC requirement?</h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-white/72">
                Share your BOQ, tender document, site scope, or project brief and we will review the opportunity with you.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToSection("#inquiry")}
              >
                Submit Tender Inquiry
              </Button>
              <a
                href={messageLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 text-sm font-medium text-white"
              >
                Talk on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry" className="section-shell pb-20 sm:pb-24">
        <div className="soft-card glow-border rounded-[2.2rem] p-6 sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-xl">
              <span className="eyebrow">Inquiry Form</span>
              <h2 className="section-title mt-6">Request a quote or project consultation.</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Use this form for commercial, industrial, government, municipal, and utility-scale project discussions.
              </p>
            </div>

            <div className="rounded-[1.8rem] bg-muted/40 p-5 sm:p-6">
              {!submitted ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name">
                      <Input
                        className="h-12 rounded-2xl"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(event) => updateForm("name", event.target.value)}
                      />
                    </Field>
                    <Field label="Company">
                      <Input
                        className="h-12 rounded-2xl"
                        placeholder="Company / department"
                        value={form.company}
                        onChange={(event) => updateForm("company", event.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone">
                      <Input
                        className="h-12 rounded-2xl"
                        placeholder="+91"
                        value={form.phone}
                        onChange={(event) => updateForm("phone", event.target.value)}
                      />
                    </Field>
                    <Field label="Email">
                      <Input
                        className="h-12 rounded-2xl"
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={(event) => updateForm("email", event.target.value)}
                      />
                    </Field>
                  </div>

                  <Field label="Project type">
                    <Select value={form.projectType} onValueChange={(value) => updateForm("projectType", String(value))}>
                      <SelectTrigger className="h-12 w-full rounded-2xl px-4">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="road">Road construction</SelectItem>
                            <SelectItem value="drainage">Drainage / sewage</SelectItem>
                            <SelectItem value="civil">Civil infrastructure</SelectItem>
                            <SelectItem value="painting">Apartment Painting</SelectItem>
                            <SelectItem value="rooftop">Commercial rooftop solar</SelectItem>
                            <SelectItem value="ground">Ground-mounted utility solar</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Project details">
                    <Textarea
                      className="min-h-32 rounded-[1.6rem] px-4 py-4"
                      placeholder="Location, scale, budget, tender stage, or what you need."
                      value={form.projectDetails}
                      onChange={(event) => updateForm("projectDetails", event.target.value)}
                    />
                  </Field>

                  <div className="hidden" aria-hidden="true">
                    <Field label="Website">
                      <Input
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(event) => updateForm("website", event.target.value)}
                        placeholder="Leave this field empty"
                      />
                    </Field>
                  </div>

                  <Field label="Upload BOQ / Tender / Drawing">
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[1.3rem] border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                      <Upload className="size-4 text-primary" />
                      <span className="truncate">{uploadedFile || "Choose file"}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </Field>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                    <a
                      href={messageLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium"
                    >
                      WhatsApp Instead
                    </a>
                  </div>

                  {submitError ? (
                    <p className="text-sm text-destructive">{submitError}</p>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-[1.8rem] bg-[#081a29] p-6 text-white">
                  <p className="text-xs tracking-[0.22em] text-[#93ffcf] uppercase">Inquiry received</p>
                  <h3 className="mt-3 font-heading text-3xl">We will get back to you.</h3>
                  <p className="mt-4 text-base leading-8 text-white/74">
                    Your request has been captured. You can also continue directly on WhatsApp for faster follow-up.
                  </p>
                  <a
                    href={messageLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
                  >
                    Continue on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-[#08141f] py-14 text-white">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-heading text-2xl">Nath Energy & Infrastructure</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/64">
              EPC-focused company for infrastructure and solar opportunities in government, industrial,
              commercial, institutional, and municipal sectors.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.24em] text-[#93ffcf] uppercase">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-white/72">
              <p>nathenergyinfrastructure@gmail.com</p>
              <p>S.K Road Silchar, Cachar Assam Pin-788110</p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.24em] text-[#93ffcf] uppercase">Quick Action</p>
            <div className="mt-4 flex flex-col gap-3">
              <Button
                className="h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToSection("#inquiry")}
              >
                Request Quote
              </Button>
              <a
                href="tel:+916026514250"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/6 text-sm font-medium text-white"
              >
                Talk to Engineer
              </a>
              <a
                href={messageLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/6 text-sm font-medium text-white"
              >
                WhatsApp
              </a>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
