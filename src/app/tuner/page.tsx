"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { autoCorrelate, noteFromFreq, A4_DEFAULT } from "@/lib/audio/pitch";

type Status = "idle" | "requesting" | "tuning" | "denied" | "error";

export default function TunerPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<Status>("idle");
  const [freq, setFreq] = useState<number | null>(null);
  const [a4, setA4] = useState(A4_DEFAULT);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const freqHistoryRef = useRef<number[]>([]);

  const noteInfo = freq ? noteFromFreq(freq, a4) : null;
  const cents = noteInfo?.cents ?? 0;
  const isInTune = noteInfo !== null && Math.abs(cents) < 4 && (freq ?? 0) > 40;
  const hasSignal = status === "tuning" && freq !== null && noteInfo !== null;

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") audioCtxRef.current.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    statusRef.current = "idle";
    setStatus("idle");
    setFreq(null);
    freqHistoryRef.current = [];
  }, []);

  const start = useCallback(async () => {
    if (statusRef.current === "tuning" || statusRef.current === "requesting") return;
    statusRef.current = "requesting";
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false },
      });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (ctx.state === "suspended") await ctx.resume();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyserRef.current = analyser;
      const buffer = new Float32Array(analyser.fftSize);
      const tick = () => {
        if (!analyserRef.current || !audioCtxRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);
        const detected = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
        if (detected) {
          freqHistoryRef.current.push(detected);
          if (freqHistoryRef.current.length > 5) freqHistoryRef.current.shift();
          const sorted = [...freqHistoryRef.current].sort((a, b) => a - b);
          setFreq(sorted[Math.floor(sorted.length / 2)]);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      statusRef.current = "tuning";
      setStatus("tuning");
      tick();
    } catch (err) {
      const e = err as DOMException;
      const newStatus = e?.name === "NotAllowedError" ? "denied" : "error";
      statusRef.current = newStatus;
      setStatus(newStatus);
    }
  }, []);

  // Auto-start tuner once on mount, cleanup on unmount
  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  // dot position: -50 -> 0%, 0 -> 50%, +50 -> 100%
  const clampedCents = Math.max(-50, Math.min(50, cents));
  const dotPct = ((clampedCents + 50) / 100) * 100;

  return (
    <div className="h-full overflow-hidden bg-transparent flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between">
        <h1 className="font-sans font-black text-[32px] sm:text-[38px] tracking-[-1px] text-[var(--ink)] leading-none select-none">
          Tuner
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

      {/* Meter — matches homepage bg */}
      <div className="flex-1 flex flex-col relative bg-transparent min-h-[320px]">
        {/* -50 / +50 */}
        <div className="flex justify-between px-5 sm:px-8 pt-6">
          <span className="text-[13px] font-normal text-[var(--muted)] tabular-nums">-50</span>
          <span className="text-[13px] font-normal text-[var(--muted)] tabular-nums">+50</span>
        </div>

        {/* horizontal line + center circle */}
        <div className="relative flex-1 flex items-center px-5 sm:px-8">
          {/* line */}
          <div className="w-full h-[1.5px] bg-[var(--ink)] rounded-full opacity-90" />

          {/* center outline circle — static, like image */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full border-[1.8px] border-[var(--ink)] bg-[var(--canvas)] pointer-events-none" />

          {/* moving dot — red, green when in tune, hidden when idle/has no signal */}
          {hasSignal && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 will-change-transform"
              style={{
                left: `${dotPct}%`,
                transition: "left 90ms linear",
                paddingLeft: "20px",
                paddingRight: "20px",
                marginLeft: "-20px",
                marginRight: "-20px",
              }}
            >
              <div
                className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-colors duration-150 ${isInTune ? "bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.6)]" : "bg-[#E53935]"}`}
              />
            </div>
          )}
        </div>

        {/* Note / cents read — subtle, appears only when signal */}
        <div className="h-[28px] flex items-center justify-center pb-4">
          {hasSignal && noteInfo ? (
            <span className={`text-[13px] font-medium tracking-[0.2px] ${isInTune ? "text-[#00E676]" : "text-[var(--ink)]"}`}>
              {noteInfo.note}
              {noteInfo.octave} · {cents > 0 ? "+" : ""}{cents.toFixed(0)}¢ {isInTune ? "· In tune" : ""}
            </span>
          ) : status === "requesting" ? (
            <span className="text-[13px] text-[var(--muted)]">Requesting mic…</span>
          ) : status === "denied" ? (
            <button onClick={start} className="text-[13px] text-[#E53935] hover:text-[var(--ink)] underline underline-offset-4">
              Mic denied — tap to retry
            </button>
          ) : (
            <span className="text-[13px] text-[var(--muted)]">Play a string</span>
          )}
        </div>

        {/* Bottom controls — clean, minimal reference pitch */}
        <div className="px-4 sm:px-6 pb-6 pt-2 flex items-center justify-center bg-transparent">
          <div className="relative">
            <select
              value={a4}
              onChange={(e) => setA4(parseInt(e.target.value, 10))}
              className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full bg-[var(--surface-soft)] border border-[var(--hairline)] text-[12.5px] font-medium text-[var(--ink)] tabular-nums hover:bg-[var(--surface-card)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 cursor-pointer shadow-sm"
              aria-label="Reference pitch"
            >
              {[435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445].map((v) => (
                <option key={v} value={v}>
                  {v}.0 Hz
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M8 9l4 4 4-4" />
                <path d="M8 15l4-4 4 4" opacity="0.5" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
