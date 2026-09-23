import { NoodleMark } from "./NoodleLogo";

export default function FooterWordmark({ capitalize = false }: { capitalize?: boolean }) {
  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--surface-soft)] dark:bg-[#141413] overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-6 py-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#1f1e1b] border border-[var(--hairline)] shadow-sm mb-6">
          <span className="w-6 h-6 rounded-full bg-[var(--surface-cream-strong)] flex items-center justify-center animate-noodle-float">
            <NoodleMark size={14} />
          </span>
          <span className="text-[11px] font-mono tracking-[1.5px] text-[var(--muted)] uppercase">Noodle — Guitar Tools</span>
        </div>
        <div
          className={`font-sans font-semibold tracking-[-0.04em] leading-none select-none text-[54px] sm:text-[92px] md:text-[132px] lg:text-[170px] xl:text-[210px] ${capitalize ? "capitalize" : ""}`}
        >
          <span className="text-[var(--ink)]">Noodl</span>
          <span className="inline-block translate-y-[-0.44em] text-[0.62em] text-[var(--primary)]">e</span>
        </div>
        <p className="mt-6 text-[13px] sm:text-[14px] text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          Warm paper, blue signal. Tuner and metronome built for daily practice — in tune, in time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-[12px] font-mono">
          <a href="/tuner" className="px-3 py-1.5 rounded-full border border-[var(--hairline)] bg-white dark:bg-[#1f1e1b] hover:border-[var(--primary)]/40 transition-colors">
            Tuner →
          </a>
          <a href="/metronome" className="px-3 py-1.5 rounded-full border border-[var(--hairline)] bg-white dark:bg-[#1f1e1b] hover:border-[var(--primary)]/40 transition-colors">
            Metronome →
          </a>
        </div>
        <div className="mt-10 text-[11px] font-mono tracking-[0.8px] text-[var(--muted-soft)]">© {new Date().getFullYear()} Noodle · Built for guitar players & learners</div>
      </div>
    </footer>
  );
}
