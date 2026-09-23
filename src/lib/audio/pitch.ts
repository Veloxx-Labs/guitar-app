// Pitch detection via autocorrelation (AMDF-style) — no deps
// Based on common autocorrelation tuner algo, clamped to guitar range.

export const NOTES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
export const A4_DEFAULT = 440;

export function noteFromFreq(freq: number, a4 = A4_DEFAULT): { note: string; octave: number; midi: number; cents: number; refFreq: number } | null {
  if (!freq || freq < 20 || freq > 5000) return null;
  const midi = 69 + 12 * Math.log2(freq / a4);
  const rounded = Math.round(midi);
  const refFreq = a4 * Math.pow(2, (rounded - 69) / 12);
  const cents = 1200 * Math.log2(freq / refFreq);
  const note = NOTES[((rounded % 12) + 12) % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return { note, octave, midi: rounded, cents, refFreq };
}

export function autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
  // check silence / low volume
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.008) return null;

  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let foundGood = false;
  const correlations = new Array(MAX_SAMPLES);

  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;
    correlations[offset] = correlation;
  }

  let lastCorrelation = 1;
  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    const correlation = correlations[offset];
    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGood = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGood) {
      // we passed the best
      break;
    }
    lastCorrelation = correlation;
  }

  if (bestOffset === -1) {
    // fallback: find max correlation above threshold
    let maxCor = 0;
    let maxOff = -1;
    for (let o = 0; o < MAX_SAMPLES; o++) {
      if (correlations[o] > maxCor) {
        maxCor = correlations[o];
        maxOff = o;
      }
    }
    if (maxCor > 0.3 && maxOff > 0) bestOffset = maxOff;
  }

  if (bestOffset === -1 || bestOffset === 0) return null;

  // refine with parabolic interpolation
  let shift = 0;
  if (bestOffset > 0 && bestOffset < MAX_SAMPLES - 1) {
    const c0 = correlations[bestOffset - 1];
    const c1 = correlations[bestOffset];
    const c2 = correlations[bestOffset + 1];
    const denom = c0 + c2 - 2 * c1;
    if (denom !== 0) shift = 0.5 * (c0 - c2) / denom;
  }

  const freq = sampleRate / (bestOffset + shift);
  if (freq < 40 || freq > 2000) return null;
  return freq;
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
