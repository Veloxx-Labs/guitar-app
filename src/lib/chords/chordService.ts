import guitarData from "@tombatossals/chords-db/lib/guitar.json";

export interface ChordPosition {
  frets: number[]; // 6 elements [E6, A5, D4, G3, B2, E1], -1 for mute, 0 for open, 1..n for fret
  fingers: number[]; // 6 elements [E6, A5, D4, G3, B2, E1], 0 for open/mute, 1=index, 2=middle, 3=ring, 4=pinky
  baseFret: number;
  barres: number[];
  capo?: boolean;
  midi: number[];
}

export interface ChordEntry {
  key: string;
  suffix: string;
  positions: ChordPosition[];
}

export interface RootOption {
  value: string; // "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"
  label: string; // "A", "A# / Bb", ...
  shortLabel?: string;
  dbKey: string; // key in chords-db
}

export const ROOT_OPTIONS: RootOption[] = [
  { value: "A", label: "A", shortLabel: "A", dbKey: "A" },
  { value: "A#", label: "A# / Bb", shortLabel: "A#", dbKey: "Bb" },
  { value: "B", label: "B", shortLabel: "B", dbKey: "B" },
  { value: "C", label: "C", shortLabel: "C", dbKey: "C" },
  { value: "C#", label: "C# / Db", shortLabel: "C#", dbKey: "C#" },
  { value: "D", label: "D", shortLabel: "D", dbKey: "D" },
  { value: "D#", label: "D# / Eb", shortLabel: "D#", dbKey: "Eb" },
  { value: "E", label: "E", shortLabel: "E", dbKey: "E" },
  { value: "F", label: "F", shortLabel: "F", dbKey: "F" },
  { value: "F#", label: "F# / Gb", shortLabel: "F#", dbKey: "F#" },
  { value: "G", label: "G", shortLabel: "G", dbKey: "G" },
  { value: "G#", label: "G# / Ab", shortLabel: "G#", dbKey: "Ab" },
];

export interface ChordTypeOption {
  value: string;
  label: string;
  shortLabel?: string;
  defaultSuffix: string;
}

export const CHORD_TYPE_OPTIONS: ChordTypeOption[] = [
  { value: "major", label: "Major", shortLabel: "Major", defaultSuffix: "major" },
  { value: "minor", label: "Minor", shortLabel: "Minor", defaultSuffix: "minor" },
  { value: "7", label: "Dominant 7th", shortLabel: "7th", defaultSuffix: "7" },
  { value: "maj7", label: "Major 7th", shortLabel: "maj7", defaultSuffix: "maj7" },
  { value: "m7", label: "Minor 7th", shortLabel: "m7", defaultSuffix: "m7" },
  { value: "dim", label: "Diminished", shortLabel: "dim", defaultSuffix: "dim" },
  { value: "dim7", label: "Diminished 7th", shortLabel: "dim7", defaultSuffix: "dim7" },
  { value: "aug", label: "Augmented", shortLabel: "aug", defaultSuffix: "aug" },
  { value: "sus2", label: "Suspended 2 (sus2)", shortLabel: "sus2", defaultSuffix: "sus2" },
  { value: "sus4", label: "Suspended 4 (sus4)", shortLabel: "sus4", defaultSuffix: "sus4" },
  { value: "m7b5", label: "Half Diminished (m7b5)", shortLabel: "m7b5", defaultSuffix: "m7b5" },
  { value: "alt", label: "Altered (alt)", shortLabel: "alt", defaultSuffix: "alt" },
];

export interface ExtensionOption {
  value: string;
  label: string;
  shortLabel?: string;
}

export const EXTENSION_OPTIONS: ExtensionOption[] = [
  { value: "none", label: "Standard / None", shortLabel: "Standard" },
  { value: "add9", label: "add9", shortLabel: "add9" },
  { value: "sus2", label: "sus2", shortLabel: "sus2" },
  { value: "sus4", label: "sus4", shortLabel: "sus4" },
  { value: "7sus4", label: "7sus4", shortLabel: "7sus4" },
  { value: "6", label: "6th (add6)", shortLabel: "6th" },
  { value: "69", label: "6/9", shortLabel: "6/9" },
  { value: "7", label: "7th", shortLabel: "7th" },
  { value: "maj7", label: "Major 7th", shortLabel: "maj7" },
  { value: "m7", label: "Minor 7th", shortLabel: "m7" },
  { value: "9", label: "9th", shortLabel: "9th" },
  { value: "maj9", label: "Major 9th", shortLabel: "maj9" },
  { value: "m9", label: "Minor 9th", shortLabel: "m9" },
  { value: "11", label: "11th", shortLabel: "11th" },
  { value: "maj11", label: "Major 11th", shortLabel: "maj11" },
  { value: "m11", label: "Minor 11th" },
  { value: "13", label: "13th" },
  { value: "maj13", label: "Major 13th" },
  { value: "7b5", label: "7b5" },
  { value: "7b9", label: "7b9" },
  { value: "7#9", label: "7#9 (Hendrix)" },
  { value: "9b5", label: "9b5" },
  { value: "aug7", label: "aug7" },
  { value: "dim7", label: "dim7" },
  { value: "m7b5", label: "m7b5" },
];

// MIDI note number to pitch name
const PITCH_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export function getNotesFromMidi(midiNumbers: number[]): string[] {
  const noteSet = new Set<string>();
  for (const m of midiNumbers) {
    if (typeof m === "number" && !isNaN(m)) {
      noteSet.add(PITCH_NAMES[m % 12]);
    }
  }
  return Array.from(noteSet);
}

// Find chords for given root, type, and extension
export function getChordData(
  rootValue: string,
  chordTypeValue: string,
  extensionValue: string
): {
  chord: ChordEntry;
  actualSuffix: string;
  notes: string[];
  displayName: string;
  availableInversions: string[];
} {
  const rootObj = ROOT_OPTIONS.find((r) => r.value === rootValue) || ROOT_OPTIONS[10]; // default G
  const dbKey = rootObj.dbKey;
  const chordsForRoot: ChordEntry[] = (guitarData.chords as Record<string, ChordEntry[]>)[dbKey] || [];

  // Determine target suffix
  let targetSuffix = "major";
  if (extensionValue !== "none") {
    // If extension is selected, see if there's a minor or major specific variant
    if (chordTypeValue === "minor") {
      if (extensionValue === "add9") targetSuffix = "madd9";
      else if (extensionValue === "6") targetSuffix = "m6";
      else if (extensionValue === "69") targetSuffix = "m69";
      else if (extensionValue === "7") targetSuffix = "m7";
      else if (extensionValue === "9") targetSuffix = "m9";
      else if (extensionValue === "11") targetSuffix = "m11";
      else targetSuffix = extensionValue;
    } else {
      targetSuffix = extensionValue;
    }
  } else {
    // Use chord type default suffix
    const typeObj = CHORD_TYPE_OPTIONS.find((t) => t.value === chordTypeValue);
    targetSuffix = typeObj?.defaultSuffix || chordTypeValue;
  }

  // Search for the chord with targetSuffix
  let match = chordsForRoot.find((c) => c.suffix.toLowerCase() === targetSuffix.toLowerCase());

  // Fallback 1: if not found, try type's default suffix
  if (!match) {
    const typeObj = CHORD_TYPE_OPTIONS.find((t) => t.value === chordTypeValue);
    const fallbackSuffix = typeObj?.defaultSuffix || "major";
    match = chordsForRoot.find((c) => c.suffix.toLowerCase() === fallbackSuffix.toLowerCase());
  }

  // Fallback 2: first chord in root
  if (!match && chordsForRoot.length > 0) {
    match = chordsForRoot[0];
  }

  // If still nothing, create a safe fallback position
  if (!match) {
    match = {
      key: rootObj.value,
      suffix: targetSuffix,
      positions: [
        {
          frets: [-1, 3, 2, 0, 1, 0],
          fingers: [0, 3, 2, 0, 1, 0],
          baseFret: 1,
          barres: [],
          midi: [48, 52, 55, 60, 64],
        },
      ],
    };
  }

  // Notes from first position's MIDI
  const midi = match.positions[0]?.midi || [];
  const notes = getNotesFromMidi(midi);

  // Available slash / inversions for this key
  const availableInversions = chordsForRoot
    .filter((c) => c.suffix.startsWith("/"))
    .map((c) => c.suffix);

  // Format readable display name
  const prettySuffix = formatSuffix(match.suffix);
  const displayName = `${rootObj.value} ${prettySuffix}`.trim();

  return {
    chord: match,
    actualSuffix: match.suffix,
    notes,
    displayName,
    availableInversions,
  };
}

function formatSuffix(suffix: string): string {
  if (suffix === "major") return "";
  if (suffix === "minor") return "m";
  return suffix;
}

