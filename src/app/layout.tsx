import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import CapacitorInit from "@/components/CapacitorInit";
import MobileNav from "@/components/MobileNav";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noodle — Tuner & Metronome for Guitar",
  description: "Warm, precise guitar tuner and metronome — built for players and learners. Noodle keeps you in tune and in time.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf9f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${jetbrains.variable} h-full overflow-hidden overscroll-none select-none antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem("noodle-theme");
                var d = t !== "light";
                if (d) document.documentElement.classList.add("dark");
                else document.documentElement.classList.remove("dark");
                if (window.location.protocol === "capacitor:" || window.location.protocol === "http:" && window.location.hostname === "localhost") {
                  document.documentElement.classList.add("capacitor-native");
                  document.documentElement.style.setProperty("--safe-top", "38px");
                }
              } catch(e) {
                document.documentElement.classList.add("dark");
              }
            })();`,
          }}
        />
      </head>
      <body className="h-full overflow-hidden overscroll-none flex flex-col bg-[var(--canvas)] text-[var(--ink)]">
        <ThemeProvider>
          <CapacitorInit />
          <Navbar />
          <main className="flex-1 pt-[calc(4rem+var(--safe-top,0px))] pb-20 lg:pb-0 overflow-hidden flex flex-col">{children}</main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
