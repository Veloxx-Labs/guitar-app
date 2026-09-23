import React from "react";
import { ChordPosition } from "@/lib/chords/chordService";

interface ChordDiagramProps {
  position: ChordPosition;
  className?: string;
  width?: number;
  height?: number;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  position,
  className = "",
  width = 240,
  height = 290,
}) => {
  const { frets, fingers, baseFret = 1 } = position;

  const numStrings = 6;
  const numFrets = 5;

  const marginX = 36;
  const marginY = 48;
  const stringSpacing = (width - 2 * marginX) / (numStrings - 1);
  const fretSpacing = (height - marginY - 16) / numFrets;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-auto h-auto max-w-full drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Guitar chord diagram"
      >
        {/* Nut (Apple Style: Thick dark bar if baseFret is 1) */}
        {baseFret === 1 ? (
          <line
            x1={marginX}
            y1={marginY}
            x2={width - marginX}
            y2={marginY}
            stroke="currentColor"
            className="text-[#1C1C1E] dark:text-[#E5E5EA]"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ) : (
          <>
            {/* Regular first fret wire */}
            <line
              x1={marginX}
              y1={marginY}
              x2={width - marginX}
              y2={marginY}
              stroke="currentColor"
              className="text-[#8E8E93] dark:text-[#636366]"
              strokeWidth="2"
            />
            {/* Base fret label on left side — Apple SF Pro Mono style */}
            <text
              x={marginX - 10}
              y={marginY + fretSpacing * 0.6}
              className="fill-[#8E8E93] dark:fill-[#98989D] text-[12px] font-mono font-semibold"
              textAnchor="end"
              dominantBaseline="central"
            >
              {baseFret}fr
            </text>
          </>
        )}

        {/* Horizontal Fret Lines (Apple System Gray) */}
        {Array.from({ length: numFrets }).map((_, fIdx) => {
          const y = marginY + (fIdx + 1) * fretSpacing;
          return (
            <line
              key={`fret-${fIdx}`}
              x1={marginX}
              y1={y}
              x2={width - marginX}
              y2={y}
              stroke="currentColor"
              className="text-[#AEAEB2] dark:text-[#48484A]"
              strokeWidth="1.8"
            />
          );
        })}

        {/* Vertical String Lines (Apple System Gray) */}
        {Array.from({ length: numStrings }).map((_, sIdx) => {
          const x = marginX + sIdx * stringSpacing;
          return (
            <line
              key={`string-${sIdx}`}
              x1={x}
              y1={marginY}
              x2={x}
              y2={marginY + numFrets * fretSpacing}
              stroke="currentColor"
              className="text-[#8E8E93] dark:text-[#636366]"
              strokeWidth="1.8"
            />
          );
        })}

        {/* Open (O) and Mute (X) string markers above nut */}
        {frets.map((fret, sIdx) => {
          const x = marginX + sIdx * stringSpacing;
          const markerY = marginY - 18;

          if (fret === 0) {
            // Open string (O) — Apple SF Symbol style circle
            return (
              <circle
                key={`open-${sIdx}`}
                cx={x}
                cy={markerY}
                r="7"
                fill="none"
                stroke="currentColor"
                className="text-[#1C1C1E] dark:text-[#E5E5EA]"
                strokeWidth="2.2"
              />
            );
          } else if (fret < 0) {
            // Muted string (X) — Apple SF Symbol style cross
            const r = 5.5;
            return (
              <g key={`mute-${sIdx}`} className="text-[#8E8E93] dark:text-[#98989D]">
                <line
                  x1={x - r}
                  y1={markerY - r}
                  x2={x + r}
                  y2={markerY + r}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <line
                  x1={x + r}
                  y1={markerY - r}
                  x2={x - r}
                  y2={markerY + r}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            );
          }
          return null;
        })}

        {/* Finger Dots — Apple System Blue (#007AFF) with bold SF typography */}
        {frets.map((fret, sIdx) => {
          if (fret <= 0) return null;

          const relativeFret = fret;
          if (relativeFret < 1 || relativeFret > numFrets) return null;

          const x = marginX + sIdx * stringSpacing;
          const y = marginY + (relativeFret - 0.5) * fretSpacing;
          const fingerNumber = fingers[sIdx];

          return (
            <g key={`dot-${sIdx}`} className="transition-transform duration-150">
              {/* Apple System Blue circle with subtle elevation shadow */}
              <circle
                cx={x}
                cy={y}
                r="15"
                fill="#007AFF"
                className="drop-shadow-[0_2px_4px_rgba(0,122,255,0.35)]"
              />
              {/* White bold finger number in SF font */}
              {fingerNumber > 0 && (
                <text
                  x={x}
                  y={y}
                  fill="#FFFFFF"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {fingerNumber}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
