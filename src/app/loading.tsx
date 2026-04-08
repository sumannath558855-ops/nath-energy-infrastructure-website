function LoadingLogoMark() {
  return (
    <div className="relative flex h-8 w-10 items-center justify-center" aria-hidden="true">
      <div className="relative h-full w-full">
        <span className="absolute left-[4%] top-[10%] h-[82%] w-[14%] rounded-full bg-white" />
        <span className="absolute left-[24%] top-[10%] h-[82%] w-[14%] rounded-full bg-white" />
        <span className="absolute left-[12%] top-[18%] h-[14%] w-[20%] origin-left rotate-[56deg] rounded-full bg-white" />

        <span className="absolute left-[46%] top-[10%] h-[82%] w-[12%] rounded-full bg-[#8fffd1]" />
        <span className="absolute left-[46%] top-[10%] h-[12%] w-[28%] rounded-full bg-[#8fffd1]" />
        <span className="absolute left-[46%] top-[44%] h-[12%] w-[24%] rounded-full bg-[#8fffd1]" />
        <span className="absolute left-[46%] bottom-[8%] h-[12%] w-[28%] rounded-full bg-[#8fffd1]" />

        <span className="absolute right-[8%] top-[10%] h-[82%] w-[12%] rounded-full bg-[#8fc7ff]" />
        <span className="absolute right-[2%] top-[10%] h-[12%] w-[24%] rounded-full bg-[#8fc7ff]" />
        <span className="absolute right-[2%] bottom-[8%] h-[12%] w-[24%] rounded-full bg-[#8fc7ff]" />

        <span className="absolute inset-[6%] rounded-full border border-white/8" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07131e] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(73,211,160,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(96,167,255,0.22),_transparent_26%)]" />
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(150deg,#071521,#0b2940_48%,#0e8f67_88%)] text-lg font-semibold text-primary-foreground shadow-[0_24px_70px_rgba(0,0,0,0.28)] supports-backdrop-filter:backdrop-blur-xl">
          <span className="absolute inset-0 animate-ping rounded-[2rem] border border-primary/40" />
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.34),_transparent_34%)]" />
          <span className="absolute inset-[5px] rounded-[1.6rem] border border-white/10" />
          <span className="absolute -right-3 -bottom-3 size-12 rounded-full bg-[#8fffd1]/20 blur-xl" />
          <LoadingLogoMark />
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
