import Link from "next/link";

function TunerGraphic() {
  return (
    <svg
      viewBox="0 0 240 108"
      className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="160" cy="54" r="90" fill="#2EE59B" fillOpacity="0.3" />
      <circle cx="160" cy="54" r="65" fill="#4BEAA5" fillOpacity="0.38" />
      <circle cx="160" cy="54" r="43" fill="#7CF0BE" fillOpacity="0.45" />
      <text
        x="160"
        y="58"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#000000"
        fontSize="64"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-3px"
      >
        A
      </text>
    </svg>
  );
}

function ChordsGraphic() {
  return (
    <svg
      viewBox="0 0 280 108"
      className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="chordsClip">
          <polygon points="55,108 95,0 280,0 280,108" />
        </clipPath>
        <linearGradient id="chordsShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3E3E3E" stopOpacity="0.8" />
          <stop offset="25%" stopColor="#3E3E3E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath="url(#chordsClip)">
        {/* Angled guitar group */}
        <g transform="translate(130, 48) rotate(-26)">
          {/* Headstock maple */}
          <rect x="-190" y="-85" width="125" height="170" fill="#EDC693" stroke="#C9A16D" strokeWidth="2" />
          {/* Headstock Fender script */}
          <text
            x="-145"
            y="-30"
            fill="#3E2A0E"
            fontSize="12"
            fontStyle="italic"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            letterSpacing="0.5px"
          >
            Fender
          </text>
          {/* Tuning Pegs */}
          {[-60, -40, -20, 0, 20, 40].map((y, i) => (
            <circle key={i} cx="-82" cy={y} r="5" fill="#F7E9D1" stroke="#B8935F" strokeWidth="1.2" />
          ))}
          {/* Nut */}
          <rect x="-68" y="-80" width="6" height="160" fill="#E8D8C0" stroke="#B8A890" strokeWidth="1" />
          {/* Fretboard rosewood */}
          <rect x="-62" y="-80" width="280" height="160" fill="#1B0E07" />
          {/* Fret wires */}
          {[0, 42, 84, 126, 168, 210].map((x, i) => (
            <line key={i} x1={x} y1="-80" x2={x} y2="80" stroke="#E7D9C1" strokeWidth="2" />
          ))}
          {/* Guitar strings */}
          {[-60, -36, -12, 12, 36, 60].map((y, i) => (
            <line key={i} x1="-66" y1={y} x2="210" y2={y} stroke="#D9C9B0" strokeWidth={i < 3 ? "2" : "1.2"} strokeOpacity="0.9" />
          ))}
          {/* Red chord position dots matching screenshot */}
          <circle cx="21" cy="-12" r="6" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
          <circle cx="63" cy="12" r="6" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
          <circle cx="105" cy="-36" r="6" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
          <circle cx="147" cy="36" r="6" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
        </g>
        {/* Soft blend edge */}
        <polygon points="55,108 95,0 135,0 95,108" fill="url(#chordsShade)" />
      </g>
    </svg>
  );
}

function MetronomeGraphic() {
  return (
    <svg
      viewBox="0 0 240 108"
      className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Slider weight bar */}
      <rect x="42" y="24" width="8" height="60" rx="2" fill="#9A9A9A" />
      {/* Pendulum trail motion circles from dark to bright red */}
      <circle cx="82" cy="54" r="22" fill="#4F2524" />
      <circle cx="106" cy="54" r="23" fill="#6F2A29" />
      <circle cx="132" cy="54" r="24.5" fill="#9C2F2D" />
      <circle cx="160" cy="54" r="26" fill="#C53331" />
      <circle cx="192" cy="54" r="28" fill="#E53935" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="h-full overflow-hidden flex flex-col max-w-[1240px] mx-auto w-full">
      {/* Header */}
      <section className="px-4 sm:px-6 pt-5 sm:pt-7 pb-1 select-none">
        <h1 className="font-sans text-[28px] sm:text-[34px] font-black leading-none tracking-[-0.6px] text-[var(--ink)]">
          Good Evening
        </h1>
        <p className="mt-1.5 text-[12px] sm:text-[13px] text-[var(--muted)] font-sans">
          What do you want to practice today?
        </p>
      </section>

      {/* Cards with pure SVG graphics positioned neatly at the top */}
      <section className="px-4 sm:px-6 pt-5 pb-6 select-none">
        <div className="mb-2.5 text-[11px] font-bold tracking-[1.4px] text-[#8A8A8A] uppercase">
          Tune Plus
        </div>

        <div className="flex flex-col gap-3 sm:gap-3.5">
          {/* 1 — Tuner Block */}
          <Link
            href="/tuner"
            className="group relative flex items-center h-[86px] sm:h-[104px] rounded-[16px] overflow-hidden bg-[#00C97C] shadow-[0_1px_4px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.16)] transition-all active:scale-[0.99]"
          >
            <TunerGraphic />
            <span className="relative z-10 pl-5 sm:pl-6 text-white text-[19px] sm:text-[21px] font-bold tracking-[-0.2px]">
              Tuner
            </span>
          </Link>

          {/* 2 — Chords Block */}
          <Link
            href="/chords"
            className="group relative flex items-center h-[86px] sm:h-[104px] rounded-[16px] overflow-hidden bg-[#3E3E3E] shadow-[0_1px_4px_rgba(0,0,0,0.14)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all active:scale-[0.99]"
          >
            <ChordsGraphic />
            <span className="relative z-10 pl-5 sm:pl-6 text-white text-[19px] sm:text-[21px] font-bold tracking-[-0.2px]">
              Chords
            </span>
          </Link>

          {/* 3 — Metronome Block */}
          <Link
            href="/metronome"
            className="group relative flex items-center h-[86px] sm:h-[104px] rounded-[16px] overflow-hidden bg-[#3E3E3E] shadow-[0_1px_4px_rgba(0,0,0,0.14)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all active:scale-[0.99]"
          >
            <MetronomeGraphic />
            <span className="relative z-10 pl-5 sm:pl-6 text-white text-[19px] sm:text-[21px] font-bold tracking-[-0.2px]">
              Metronome
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
