"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { autoCorrelate, noteFromFreq, A4_DEFAULT } from "@/lib/audio/pitch";

type Status = "idle" | "requesting" | "tuning" | "denied" | "error";

interface DisplayReading {
  note: string;
  octave: number;
  cents: number;
  freq: number;
  isInTune: boolean;
}

export default function TunerPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<Status>("idle");
  const [reading, setReading] = useState<DisplayReading | null>(null);
  const [a4, setA4] = useState(A4_DEFAULT);
  const a4Ref = useRef(a4);
  a4Ref.current = a4;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const filterHighRef = useRef<BiquadFilterNode | null>(null);
  const filterLowRef = useRef<BiquadFilterNode | null>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Pitch stability and physical damping refs
  const freqRingRef = useRef<number[]>([]);
  const smoothedCentsRef = useRef<number>(0);
  const currentNoteKeyRef = useRef<string>("");
  const lastSignalTimeRef = useRef<number>(0);
  const lastUiUpdateRef = useRef<number>(0);
  const wasInTuneRef = useRef<boolean>(false);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    filterHighRef.current?.disconnect();
    filterLowRef.current?.disconnect();
    filterHighRef.current = null;
    filterLowRef.current = null;

    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
    statusRef.current = "idle";
    setStatus("idle");
    setReading(null);
    freqRingRef.current = [];
    smoothedCentsRef.current = 0;
    currentNoteKeyRef.current = "";
    lastSignalTimeRef.current = 0;
    wasInTuneRef.current = false;
  }, []);

  const start = useCallback(async () => {
    if (statusRef.current === "tuning" || statusRef.current === "requesting") return;
    statusRef.current = "requesting";
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });
      streamRef.current = stream;

      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      if (ctx.state === "suspended") await ctx.resume();
      audioCtxRef.current = ctx;

      // Studio-grade audio pre-filtering:
      // High-pass at 65Hz cuts wind rumble, table bumps, and AC mains noise
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 65;
      highpass.Q.value = 0.707;
      filterHighRef.current = highpass;

      // Low-pass at 1100Hz cuts pick scratch, hiss, and high harmonic confusion
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 1100;
      lowpass.Q.value = 0.707;
      filterLowRef.current = lowpass;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // Connect graph: Mic -> Highpass -> Lowpass -> Analyser
      const source = ctx.createMediaStreamSource(stream);
      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      const tick = () => {
        if (!analyserRef.current || !audioCtxRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);

        const detectedFreq = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
        const now = Date.now();

        if (detectedFreq) {
          // Add to short history ring
          freqRingRef.current.push(detectedFreq);
          if (freqRingRef.current.length > 5) freqRingRef.current.shift();

          // Multi-frame consensus: compute median
          const sorted = [...freqRingRef.current].sort((a, b) => a - b);
          const median = sorted[Math.floor(sorted.length / 2)];

          // Ensure stability: at least 3 samples are close to the median (within 5%)
          const consistentCount = sorted.filter((f) => Math.abs(f - median) / median < 0.05).length;

          if (consistentCount >= 3) {
            const noteInfo = noteFromFreq(median, a4Ref.current);
            if (noteInfo) {
              const noteKey = `${noteInfo.note}${noteInfo.octave}`;

              // If switching to a new note, jump directly; if on same note, apply EMA damping
              if (currentNoteKeyRef.current !== noteKey) {
                currentNoteKeyRef.current = noteKey;
                smoothedCentsRef.current = noteInfo.cents;
              } else {
                // Exponential moving average: smooths out jitter while remaining responsive
                smoothedCentsRef.current =
                  smoothedCentsRef.current * 0.82 + noteInfo.cents * 0.18;
              }

              // Deadband / In-Tune lock: ±3 cents is considered in-tune
              const inTune = Math.abs(smoothedCentsRef.current) <= 3.5;

              // Soft haptic feedback when achieving in-tune
              if (inTune && !wasInTuneRef.current) {
                try {
                  if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(15);
                  }
                } catch {}
              }
              wasInTuneRef.current = inTune;

              lastSignalTimeRef.current = now;

              // Throttle UI update to ~35fps for maximum smoothness without render thrashing
              if (now - lastUiUpdateRef.current >= 28) {
                lastUiUpdateRef.current = now;
                setReading({
                  note: noteInfo.note,
                  octave: noteInfo.octave,
                  cents: smoothedCentsRef.current,
                  freq: median,
                  isInTune: inTune,
                });
              }
            }
          }
        } else {
          // Silence or below noise floor:
          // Sustain hold: hold last note for 1.2s before clearing to "Play a string"
          if (lastSignalTimeRef.current > 0 && now - lastSignalTimeRef.current > 1200) {
            lastSignalTimeRef.current = 0;
            currentNoteKeyRef.current = "";
            freqRingRef.current = [];
            wasInTuneRef.current = false;
            setReading(null);
          }
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

  // Auto-start tuner on mount, clean up on unmount
  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  // Dot position: -50 -> 0%, 0 -> 50%, +50 -> 100%
  // When in tune, snaps dead-center inside the target ring
  const rawCents = reading ? reading.cents : 0;
  const clampedCents = Math.max(-50, Math.min(50, rawCents));
  const dotPct = reading?.isInTune ? 50 : ((clampedCents + 50) / 100) * 100;
  const isInTune = reading?.isInTune ?? false;
  const hasSignal = status === "tuning" && reading !== null;

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
                transition: "left 100ms ease-out",
                paddingLeft: "20px",
                paddingRight: "20px",
                marginLeft: "-20px",
                marginRight: "-20px",
              }}
            >
              <div
                className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-colors duration-150 ${isInTune ? "bg-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.7)]" : "bg-[#E53935]"}`}
              />
            </div>
          )}
        </div>

        {/* Note / cents read — subtle, appears only when signal */}
        <div className="h-[28px] flex items-center justify-center pb-4">
          {hasSignal && reading ? (
            <span className={`text-[13px] font-medium tracking-[0.2px] ${isInTune ? "text-[#00E676]" : "text-[var(--ink)]"}`}>
              {reading.note}
              {reading.octave} · {reading.cents > 0 ? "+" : ""}{reading.cents.toFixed(0)}¢ {isInTune ? "· In tune" : ""}
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
