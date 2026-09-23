"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChordDiagram } from "@/components/chords/ChordDiagram";
import { AppleDropdown } from "@/components/chords/AppleDropdown";
import {
  ROOT_OPTIONS,
  CHORD_TYPE_OPTIONS,
  EXTENSION_OPTIONS,
  getChordData,
} from "@/lib/chords/chordService";

export default function ChordsPage() {
  const router = useRouter();
  const [root, setRoot] = useState<string>("G");
  const [chordType, setChordType] = useState<string>("major");
  const [extension, setExtension] = useState<string>("none");
  const [voicingIndex, setVoicingIndex] = useState<number>(0);

  const { chord, displayName, availableInversions } = useMemo(() => {
    return getChordData(root, chordType, extension);
  }, [root, chordType, extension]);

  const positions = chord.positions || [];
  const safeVoicingIndex = Math.min(voicingIndex, Math.max(0, positions.length - 1));
  const activePosition = positions[safeVoicingIndex] || {
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
    barres: [],
    midi: [43, 47, 50, 55, 59, 67],
  };

  const combinedExtensionOptions = useMemo(() => {
    const list = [...EXTENSION_OPTIONS];
    if (availableInversions && availableInversions.length > 0) {
      availableInversions.forEach((inv) => {
        list.push({
          value: inv,
          label: inv,
        });
      });
    }
    return list;
  }, [availableInversions]);

  const handleRootChange = (newRoot: string) => {
    setRoot(newRoot);
    setVoicingIndex(0);
  };

  const handleTypeChange = (newType: string) => {
    setChordType(newType);
    setVoicingIndex(0);
  };

  const handleExtChange = (newExt: string) => {
    setExtension(newExt);
    setVoicingIndex(0);
  };

  const prevVoicing = () => {
    if (safeVoicingIndex > 0) {
      setVoicingIndex(safeVoicingIndex - 1);
    }
  };

  const nextVoicing = () => {
    if (safeVoicingIndex < positions.length - 1) {
      setVoicingIndex(safeVoicingIndex + 1);
    }
  };

  return (
    <div className="h-full overflow-hidden bg-transparent flex flex-col justify-between select-none font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display',system-ui,sans-serif]">
      {/* Top Header — Identical style across Tuner, Metronome, and Chords */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-1 sm:pb-2 flex items-center justify-between">
        <h1 className="font-sans font-black text-[30px] sm:text-[38px] tracking-[-1px] text-[var(--ink)] leading-none select-none">
          Chords
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4 overflow-hidden">
        {/* Apple-style Grouped Container Card */}
        <div className="w-full max-w-[420px] bg-white/75 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)] p-4 sm:p-7 flex flex-col items-center gap-4 sm:gap-6 transition-all">
          
          {/* 3 Apple Popover Dropdowns matching user reference image */}
          <div className="w-full grid grid-cols-3 gap-2 sm:gap-2.5 relative z-30">
            <AppleDropdown
              label="Root"
              headerTitle="root note"
              value={root}
              options={ROOT_OPTIONS}
              onChange={handleRootChange}
              align="left"
            />
            <AppleDropdown
              label="Type"
              headerTitle="chord type"
              value={chordType}
              options={CHORD_TYPE_OPTIONS}
              onChange={handleTypeChange}
              align="center"
            />
            <AppleDropdown
              label="Extension"
              headerTitle="extension"
              value={extension}
              options={combinedExtensionOptions}
              onChange={handleExtChange}
              align="right"
            />
          </div>

          {/* Apple Style Header & Capsule Voicing Stepper */}
          <div className="w-full flex items-center justify-between pt-1 px-1">
            <div className="flex flex-col">
              <span className="text-[28px] sm:text-[32px] font-bold tracking-[-0.6px] leading-tight text-[#000000] dark:text-[#FFFFFF]">
                {displayName}
              </span>
            </div>

            {positions.length > 1 && (
              <div className="flex items-center gap-1 bg-[#767680]/12 dark:bg-[#767680]/24 rounded-full p-1 border border-black/[0.04] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={prevVoicing}
                  disabled={safeVoicingIndex <= 0}
                  aria-label="Previous Voicing"
                  className="w-7 h-7 rounded-full bg-white dark:bg-[#2C2C2E] text-[#007AFF] shadow-sm flex items-center justify-center hover:opacity-90 active:scale-90 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <svg width="10" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 1.5L2 6L6.5 10.5" />
                  </svg>
                </button>
                <span className="text-[12px] font-semibold text-[#8E8E93] dark:text-[#98989D] px-2 tabular-nums select-none">
                  {safeVoicingIndex + 1} of {positions.length}
                </span>
                <button
                  type="button"
                  onClick={nextVoicing}
                  disabled={safeVoicingIndex >= positions.length - 1}
                  aria-label="Next Voicing"
                  className="w-7 h-7 rounded-full bg-white dark:bg-[#2C2C2E] text-[#007AFF] shadow-sm flex items-center justify-center hover:opacity-90 active:scale-90 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <svg width="10" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 1.5L6 6L1.5 10.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Chord Diagram with Apple System Blue (#007AFF) and SF styling */}
          <div className="w-full flex justify-center py-2 relative z-10">
            <ChordDiagram position={activePosition} width={250} height={300} />
          </div>

        </div>
      </div>

      <div />
    </div>
  );
}
