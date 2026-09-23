"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function MetronomePage() {
  const router = useRouter();
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [accentOn, setAccentOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const ctxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const totalBeatRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beatsPerMeasure);
  const isPlayingRef = useRef(false);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { beatsRef.current = beatsPerMeasure; }, [beatsPerMeasure]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const getCtx = useCallback(async () => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const scheduleClick = useCallback((time: number, isAccent: boolean) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = isAccent ? 1200 : 800;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.9, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.start(time);
    osc.stop(time + 0.13);
  }, []);

  const schedulerRef = useRef<() => void>(() => {});
  useEffect(() => {
    schedulerRef.current = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const secPerBeat = 60 / bpmRef.current;
      while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
        const beat = currentBeatRef.current;
        scheduleClick(nextNoteTimeRef.current, accentOn && beat === 0);
        const delay = Math.max(0, (nextNoteTimeRef.current - ctx.currentTime) * 1000);
        const b = beat;
        setTimeout(() => setCurrentBeat(b), delay);
        nextNoteTimeRef.current += secPerBeat;
        currentBeatRef.current = (currentBeatRef.current + 1) % beatsRef.current;
        totalBeatRef.current += 1;
      }
      timerRef.current = window.setTimeout(() => schedulerRef.current(), 25);
    };
  }, [scheduleClick, accentOn]);

  const start = useCallback(async () => {
    const ctx = await getCtx();
    currentBeatRef.current = 0;
    totalBeatRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.06;
    setCurrentBeat(0);
    setIsPlaying(true);
    isPlayingRef.current = true;
    schedulerRef.current();
  }, [getCtx]);

  const stop = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentBeat(0);
  }, []);

  const toggle = () => (isPlaying ? stop() : start());

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);



  const handleTap = () => {
    const now = performance.now();
    const recent = tapTimes.filter((t) => now - t < 3000);
    const next = [...recent, now];
    setTapTimes(next);
    if (next.length >= 2) {
      const intervals = next.slice(1).map((t, i) => t - next[i]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / avg);
      if (newBpm >= 40 && newBpm <= 208) setBpm(newBpm);
    }
  };

  return (
    <div className="h-full overflow-hidden bg-transparent flex flex-col justify-between select-none">
      {/* Top Header — Identical style across all pages */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-1 sm:pb-2 flex items-center justify-between">
        <h1 className="font-sans font-black text-[30px] sm:text-[38px] tracking-[-1px] text-[var(--ink)] leading-none select-none">
          Metronome
        </h1>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-soft)] border border-[var(--hairline)] text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)]/20 hover:bg-[var(--surface-card)] active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
          aria-label="Go back"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      {/* Main Metronome Dial and Controls */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-2">
        <div className="w-full max-w-[400px] flex flex-col px-4 gap-3 justify-center py-2 bg-transparent overflow-hidden">
          {/* Pills */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setBeatsPerMeasure((v) => (v === 4 ? 3 : v === 3 ? 6 : 4))}
              className="flex-1 py-[11px] rounded-[10px] bg-[#2A2A2A] hover:bg-[#333333] active:bg-[#1E1E1E] text-white text-[14px] font-semibold tracking-[0.1px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              {beatsPerMeasure}/4
            </button>
            <button
              onClick={() => setAccentOn((v) => !v)}
              className={`flex-1 py-[11px] rounded-[10px] text-[14px] font-semibold tracking-[0.1px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${accentOn ? "bg-[#2A2A2A] text-white hover:bg-[#333333]" : "bg-[#1E1E1E] text-white/50 hover:bg-[#252525]"}`}
            >
              {accentOn ? "Accent On" : "Accent Off"}
            </button>
          </div>

          {/* Arc */}
          <div className="flex flex-col items-center py-2">
            <div className="relative w-[280px] h-[150px]">
              <svg width="280" height="150" viewBox="0 0 280 150" className="absolute inset-0">
                <path d="M 10 140 A 130 130 0 0 1 270 140" fill="none" stroke="var(--hairline)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {/* BPM */}
              <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-[var(--ink)] text-[64px] font-bold leading-none tracking-[-1px] tabular-nums">{bpm}</div>
                <div className="text-[var(--muted)] text-[12px] tracking-[1px] font-medium mt-1">BPM</div>
              </div>
            </div>

            {/* 4 dots */}
            <div className="flex gap-[4px] mt-2">
              {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <span
                  key={i}
                  className={`w-[10px] h-[10px] rounded-full transition-colors ${isPlaying && currentBeat === i ? "bg-[#F25C5C]" : "bg-[#2E2E2E]"}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-1 mb-2 bg-[#2A2A2A] rounded-[12px] flex items-center justify-between px-3 py-2">
            <button
              onClick={handleTap}
              className="px-4 py-1.5 text-white text-[13px] font-bold tracking-[0.6px] hover:bg-white/10 active:bg-white/15 rounded-[8px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              TAP
            </button>
            <button
              onClick={toggle}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-[44px] h-[44px] rounded-full bg-white hover:bg-[#E8E8E8] active:bg-[#D8D8D8] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0E0E0E" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0E0E0E" aria-hidden className="ml-[2px]">
                  <path d="M8 5.14v14l11-7z" />
                </svg>
              )}
            </button>
            <span className="w-[38px] text-center text-white text-[18px] font-bold tabular-nums">{isPlaying ? currentBeat + 1 : 1}</span>
          </div>
        </div>
      </div>

      <div />
    </div>
  );
}
