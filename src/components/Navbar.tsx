"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoodleLogo from "./NoodleLogo";
import { useTheme } from "./ThemeProvider";

const nav = [
  { href: "/chords", label: "Chords" },
  { href: "/tuner", label: "Tuner" },
  { href: "/metronome", label: "Metronome" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-[var(--hairline)]/40 bg-[var(--canvas)]/45 backdrop-blur-2xl shadow-[0_1px_16px_rgba(20,20,19,0.04)] transition-colors">
      <div className="mx-auto max-w-[1240px] h-full flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface-cream-strong)] dark:bg-white/10 border border-[var(--hairline)] group-hover:border-[var(--primary)]/30 transition-all p-1 shadow-sm overflow-hidden">
            <NoodleLogo size={22} animated="hover-spin" />
          </span>
          <span className="font-serif text-[20px] tracking-[-0.5px] font-medium flex items-baseline gap-[1px]">
            Noodle
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--primary)] inline-block translate-y-[-6px] ml-[1px]" />
          </span>
          <span className="hidden sm:inline-flex text-[11px] font-mono tracking-[1.2px] text-[var(--muted)] border border-[var(--hairline)] rounded-full px-2 py-0.5 ml-2 bg-white/60 dark:bg-white/5">
            GUITAR
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-[13.5px] font-medium tracking-[-0.2px] transition-colors border ${
                  active
                    ? "bg-[var(--surface-cream-strong)] border-[var(--hairline)] text-[var(--ink)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-[var(--hairline)]" />
          <Link
            href="/tuner"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--ink)] text-[var(--canvas)] text-[13px] font-medium hover:opacity-90 transition-opacity dark:bg-white dark:text-[#141413]"
          >
            Open Tuner
          </Link>
        </nav>

        {/* Theme Toggle Button (Desktop & Mobile) - Clean, switchable, no hamburger */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-9 h-9 rounded-full border border-[var(--hairline)] bg-[var(--surface-soft)] hover:bg-[var(--surface-card)] active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--ink)]">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
