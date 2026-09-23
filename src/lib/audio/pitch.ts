// Pitch detection via YIN Algorithm (de Cheveigné & Kawahara)
// Sub-cent precision, robust harmonic detection, and noise rejection for guitar.

export const NOTES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
export const A4_DEFAULT = 440;

export function noteFromFreq(freq: number, a4 = A4_DEFAULT): { note: string; octave: number; midi: number; cents: number; refFreq: number } | null {
  if (!freq || freq < 50 || freq > 2000) return null;
  const midi = 69 + 12 * Math.log2(freq / a4);
  const rounded = Math.round(midi);
  const refFreq = a4 * Math.pow(2, (rounded - 69) / 12);
  const cents = 1200 * Math.log2(freq / refFreq);
  const note = NOTES[((rounded % 12) + 12) % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return { note, octave, midi: rounded, cents, refFreq };
}

/**
 * YIN pitch detection algorithm:
 * 1. Checks RMS to gate out ambient background noise.
 * 2. Computes the squared difference function.
 * 3. Computes cumulative mean normalized difference (CMND).
 * 4. Applies absolute thresholding (0.12) to pick fundamental over harmonics.
 * 5. Uses parabolic interpolation for exact sub-sample peak location.
 */
export function autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  // Calculate RMS for noise gating
  let sumSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumSquares / SIZE);
  // Rejection threshold: ignore soft room noise, whisper, breathing (< 0.015)
  if (rms < 0.015) return null;

  // Search range: Guitar fundamental range from ~60 Hz (Drop D/C) to ~1200 Hz
  const minPeriod = Math.floor(sampleRate / 1200); // ~36-40 samples
  const maxPeriod = Math.min(Math.floor(SIZE / 2), Math.floor(sampleRate / 60)); // ~735-800 samples

  const halfSize = Math.floor(SIZE / 2);
  const yinBuffer = new Float32Array(maxPeriod + 1);

  // Step 1: Squared difference function
  for (let tau = minPeriod; tau <= maxPeriod; tau++) {
    let diff = 0;
    for (let i = 0; i < halfSize; i++) {
      const delta = buffer[i] - buffer[i + tau];
      diff += delta * delta;
    }
    yinBuffer[tau] = diff;
  }

  // Step 2: Cumulative mean normalized difference
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau <= maxPeriod; tau++) {
    runningSum += yinBuffer[tau];
    if (runningSum > 0) {
      yinBuffer[tau] = (yinBuffer[tau] * tau) / runningSum;
    } else {
      yinBuffer[tau] = 1;
    }
  }

  // Step 3: Absolute thresholding
  // 0.12 threshold ensures strong periodicity (88%+ confidence) and prevents octave doubling
  const THRESHOLD = 0.12;
  let tauEstimate = -1;

  for (let tau = minPeriod; tau <= maxPeriod; tau++) {
    if (yinBuffer[tau] < THRESHOLD) {
      // Find the local minimum in this trough
      while (tau + 1 <= maxPeriod && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      tauEstimate = tau;
      break;
    }
  }

  // Fallback: If no period under 0.12, pick global minimum only if reasonably periodic (< 0.22)
  if (tauEstimate === -1) {
    let minVal = 1;
    let minTau = -1;
    for (let tau = minPeriod; tau <= maxPeriod; tau++) {
      if (yinBuffer[tau] < minVal) {
        minVal = yinBuffer[tau];
        minTau = tau;
      }
    }
    if (minTau !== -1 && minVal < 0.22) {
      tauEstimate = minTau;
    }
  }

  if (tauEstimate === -1) return null;

  // Step 4: Parabolic interpolation for sub-sample accuracy
  let betterTau = tauEstimate;
  if (tauEstimate > minPeriod && tauEstimate < maxPeriod) {
    const s0 = yinBuffer[tauEstimate - 1];
    const s1 = yinBuffer[tauEstimate];
    const s2 = yinBuffer[tauEstimate + 1];
    const denom = 2 * (s0 - 2 * s1 + s2);
    if (denom !== 0) {
      const delta = (s0 - s2) / denom;
      betterTau = tauEstimate + delta;
    }
  }

  const pitch = sampleRate / betterTau;
  if (pitch < 60 || pitch > 1200) return null;
  return pitch;
}

// tunings
export type Tuning = { name: string; notes: string[]; freqs: number[] };
export const TUNINGS: Tuning[] = [
  { name: "Standard", notes: ["E2", "A2", "D3", "G3", "B3", "E4"], freqs: [82.41, 110, 146.83, 196, 246.94, 329.63] },
  { name: "Drop D", notes: ["D2", "A2", "D3", "G3", "B3", "E4"], freqs: [73.42, 110, 146.83, 196, 246.94, 329.63] },
  { name: "Half Step Down", notes: ["D♯2", "G♯2", "C♯3", "F♯3", "A♯3", "D♯4"], freqs: [77.78, 103.83, 138.59, 185, 233.08, 311.13] },
  { name: "Open G", notes: ["D2", "G2", "D3", "G3", "B3", "D4"], freqs: [73.42, 98, 146.83, 196, 246.94, 293.66] },
  { name: "DADGAD", notes: ["D2", "A2", "D3", "G3", "A3", "D4"], freqs: [73.42, 110, 146.83, 196, 220, 293.66] },
];

export function closestString(freq: number, tuning: Tuning): { index: number; diffCents: number } | null {
  let best: { index: number; diffCents: number } | null = null;
  for (let i = 0; i < tuning.freqs.length; i++) {
    const diff = 1200 * Math.log2(freq / tuning.freqs[i]);
    if (best === null || Math.abs(diff) < Math.abs(best.diffCents)) {
      best = { index: i, diffCents: diff };
    }
  }
  if (best && Math.abs(best.diffCents) < 100) return best;
  return null;
}
