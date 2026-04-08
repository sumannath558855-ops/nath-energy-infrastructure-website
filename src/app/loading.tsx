import Image from "next/image";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07131e] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(73,211,160,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(96,167,255,0.22),_transparent_26%)]" />
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative flex h-32 w-44 items-center justify-center overflow-hidden rounded-[2rem] border border-white/20 bg-white p-1 text-lg font-semibold text-primary-foreground shadow-[0_24px_70px_rgba(0,0,0,0.28)] supports-backdrop-filter:backdrop-blur-xl">
          <span className="absolute inset-0 animate-ping rounded-[2rem] border border-primary/40" />
          <span className="absolute inset-[6px] rounded-[1.6rem] border border-slate-200/80" />
          <Image
            src="/nath-logo.jpeg"
            alt="Nath Energy & Infrastructure logo"
            width={176}
            height={128}
            quality={100}
            priority
            className="relative z-10 h-full w-full scale-[1.06] object-contain"
          />
        </div>
        <div className="text-center">
          <p className="font-heading text-2xl tracking-[0.08em] uppercase">
            Nath Energy & Infrastructure
          </p>
          <p className="mt-2 text-sm text-white/70">
            Preparing the EPC experience...
          </p>
        </div>
      </div>
    </main>
  );
}
