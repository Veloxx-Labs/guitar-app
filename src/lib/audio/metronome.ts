// Simple scheduler holder — actual scheduling is inside component via Web Audio
export type TimeSig = { beats: number; noteValue: number };
export const TIME_SIGS: TimeSig[] = [
  { beats: 2, noteValue: 4 },
  { beats: 3, noteValue: 4 },
  { beats: 4, noteValue: 4 },
  { beats: 5, noteValue: 4 },
  { beats: 6, noteValue: 8 },
  { beats: 7, noteValue: 8 },
];

export const SUBDIVISIONS = [
  { label: "Quarter", value: 1 },
  { label: "Eighth", value: 2 },
  { label: "Triplet", value: 3 },
  { label: "16th", value: 4 },
];

export function bpmToIntervalMs(bpm: number) {
  return 60000 / bpm;
}
