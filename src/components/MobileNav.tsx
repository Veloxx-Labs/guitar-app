"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: "/chords",
      label: "Chords",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
          <circle cx="9" cy="9" r="1.6" fill="currentColor" />
          <circle cx="15" cy="15" r="1.6" fill="currentColor" />
        </svg>
      ),
    },
    {
      href: "/tuner",
      label: "Tuner",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="3" x2="12" y2="7" />
          <line x1="12" y1="12" x2="16.5" y2="7.5" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
      ),
    },
    {
      href: "/metronome",
      label: "Metro",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 21l4.5-17h3L18 21H6z" />
          <line x1="12" y1="17" x2="16.5" y2="7" />
          <circle cx="16.5" cy="7" r="2" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--hairline)] bg-[var(--canvas)]/95 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+4px)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 text-[12px] font-semibold tracking-[-0.2px] transition-colors ${
                active ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25 scale-105"
                    : "bg-[var(--surface-soft)]/80 text-[var(--muted)] hover:bg-[var(--surface-cream-strong)] hover:text-[var(--ink)]"
                }`}
              >
                {it.icon}
              </span>
              <span className="leading-none">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
