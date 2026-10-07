import type { SVGProps } from "react";
import { cx, seeded } from "../shared";

type StickPenTypefaceProps = SVGProps<SVGSVGElement> & {
  text?: string;
  color?: string;
  density?: number;
  scale?: number;
  grain?: number;
  contrast?: number;
  shape?: number;
  seed?: number;
};

const glyphs: Record<string, { width: number; d: string }> = {
  a: { width: 10, d: "M8.2 6.2 C5.3 3.2 1.5 5.8 2.1 9.1 C2.9 13 7.5 12.2 8.15 7.2 Q7.95 10.8 9.35 12.4" },
  b: { width: 10, d: "M2.2 1 Q1.8 6.8 2.2 13 M2.35 8.1 C5.1 4.25 9.3 6.1 8.55 9.85 C7.85 13.35 4.05 13.3 2.25 10.25" },
  c: { width: 9, d: "M8.2 6.3 C4.7 4.1 1.4 6.8 2.15 9.8 C2.85 12.8 6.25 13.5 8.5 11.1" },
  d: { width: 10, d: "M8.5 1.1 Q8.9 7.1 8.25 13 M8.15 8 C5.25 4.1 1.55 6.1 2.15 9.8 C2.8 13.4 6.85 13.2 8.3 9.4" },
  e: { width: 9, d: "M2.05 9.1 Q5.2 8.9 7.75 7.55 C6.6 4.65 2.3 5.15 2.05 8.8 C1.8 12.45 6.1 13.7 8.4 10.9" },
  f: { width: 8, d: "M6.8 2.2 C4.05 .1 3.05 3.65 3.45 7.2 Q3.9 10.8 2.5 15.3 M1.15 7.25 Q4.05 6.55 7.35 7.2" },
  g: { width: 10, d: "M8.35 6.3 C5.2 3.9 1.65 6.35 2.15 9.75 C2.7 13.2 6.55 13.05 8.2 9.3 M8.35 6.2 Q8.2 11.4 7.3 14.25 C6.25 17.15 2.25 16.65 2.55 14.2" },
  h: { width: 10, d: "M2.2 1.05 Q1.75 7.15 2.15 13 M2.35 8.1 C4.4 5.35 8.45 5.45 8.25 9.1 Q8.05 11.3 8.75 13" },
  i: { width: 5, d: "M2.55 6 Q2.25 9.75 2.65 13 M2.7 2.4 Q2.45 2.1 2.75 1.85" },
  j: { width: 6, d: "M3.85 6 Q4.15 10.4 3.35 14.2 C2.65 17.25 .25 16.45 1.15 14.2 M3.85 2.4 Q3.58 2.1 3.92 1.85" },
  k: { width: 10, d: "M2.2 1.1 Q1.75 6.8 2.2 13 M8.4 5.5 Q5.1 7.7 2.2 9.1 M5.1 8.25 Q6.7 10.85 9 13" },
  l: { width: 7.8, d: "M3.8 1 Q3.18 7.25 3.82 13" },
  m: { width: 14, d: "M2.1 6.1 Q1.9 9.8 2.25 13 M2.4 8.15 C3.85 5.4 6.35 5.55 6.35 9.1 Q6.3 10.9 6.75 13 M6.6 8.25 C8.3 5.25 11.5 5.6 11.45 9.25 Q11.4 11.1 12.05 13" },
  n: { width: 10, d: "M2.1 6.1 Q1.9 9.7 2.25 13 M2.45 8.15 C4.15 5.25 8.55 5.45 8.35 9.2 Q8.2 11.05 8.8 13" },
  o: { width: 10, d: "M5.1 5.5 C8.9 5.35 9.55 10.9 6.35 12.55 C2.9 14.3 .95 9.9 2.6 7.3 C3.2 6.35 4.1 5.75 5.1 5.5" },
  p: { width: 10, d: "M2.15 6.1 Q2 10.8 2.05 16 M2.35 8.1 C5.2 4.3 9.35 6.25 8.55 9.95 C7.75 13.5 4 13.25 2.25 10.35" },
  q: { width: 10, d: "M8.25 6.2 C5.1 3.9 1.55 6.35 2.15 9.75 C2.75 13.3 6.65 13.05 8.25 9.35 M8.3 6.35 Q8.55 11 8.15 16" },
  r: { width: 8, d: "M2.15 6.1 Q1.9 9.75 2.25 13 M2.45 8.2 C3.45 5.85 6.2 5.5 7.15 6.65" },
  s: { width: 8, d: "M7.3 6.6 C4.05 4.7 1.55 7.2 4.65 8.9 C8 10.75 6.15 13.7 2 11.85" },
  t: { width: 8, d: "M4.25 3 Q3.75 8.1 4.15 11.25 C4.55 13.65 6.55 13.35 7.35 12.05 M1.45 6.8 Q4.1 6.25 7.35 6.75" },
  u: { width: 10, d: "M2.1 6.15 Q1.8 9.6 2.35 11.4 C3.25 14.3 7.35 12.9 8.25 8.25 M8.35 6.2 Q8.05 10.1 8.8 13" },
  v: { width: 9, d: "M1.5 6.2 Q3.15 11.25 4.75 13 Q6.6 10.3 8 6.2" },
  w: { width: 13, d: "M1.25 6.2 Q2.7 11.4 4.15 13 Q5.5 10.45 6.35 7.75 Q7.5 11.45 9.05 13 Q10.7 10.35 11.8 6.2" },
  x: { width: 9, d: "M1.65 6.3 Q4.6 9.4 7.8 13 M7.65 6.1 Q4.6 9.1 1.45 12.95" },
  y: { width: 9, d: "M1.55 6.2 Q3.35 11.1 5.25 12.8 Q6.9 9.8 8 6.15 M5.3 12.7 Q4.1 16.65 1.5 15.2" },
  z: { width: 9, d: "M1.45 6.35 Q4.6 5.75 7.75 6.25 Q4.8 9.2 1.55 12.9 Q4.7 13.45 8.1 12.85" },
  "0": { width: 10, d: "M5.1 1.2 C8.8 1.15 9.7 4.25 9.15 7.65 C8.55 11.55 5.95 13.45 3.25 12.15 C1.1 11.1 1.15 6.05 2.25 3.6 C2.85 2.2 3.95 1.35 5.1 1.2 M3.25 10.9 Q5.85 6.45 8.35 2.65" },
  "1": { width: 6.5, d: "M3.7 1.45 Q3.25 6.6 3.55 13 M1.65 3.35 Q2.7 2.25 3.85 1.35 M1.75 12.85 Q3.45 12.55 5.35 12.82" },
  "2": { width: 9, d: "M1.55 3.6 C2.8 .95 7.75 1.2 7.65 4.25 C7.55 6.25 4.25 7.8 2.05 12.7 Q5.1 12.25 8.15 12.78" },
  "3": { width: 9, d: "M1.65 2.75 C4.35 .6 8.45 1.85 7.05 5.25 C6.5 6.55 4.6 6.95 3.35 7.05 C5.55 6.92 8.65 8.05 7.65 10.85 C6.75 13.35 2.95 13.6 1.35 11.6" },
  "4": { width: 9.5, d: "M7.05 1.35 Q4.15 5.7 1.65 9.45 Q4.9 9.05 8.25 9.25 M7.15 1.25 Q6.85 6.95 7.15 13" },
  "5": { width: 9, d: "M7.85 1.65 Q4.65 1.3 2.2 1.75 Q1.95 4.65 2.15 6.95 C4.9 5.6 8.1 6.85 7.95 9.85 C7.75 13.3 3.15 13.65 1.55 11.35" },
  "6": { width: 9.5, d: "M8.05 2.15 C5.75 .55 2.1 2.8 1.85 7.65 C1.65 11.6 4.35 13.7 6.85 11.95 C9.15 10.35 8.15 6.75 5.4 6.85 C3.85 6.9 2.55 7.85 1.95 9.2" },
  "7": { width: 8.5, d: "M1.25 1.65 Q4.75 1.15 8 1.55 Q5.1 6.15 3.35 13" },
  "8": { width: 9.5, d: "M5.2 1.2 C8.35 1.25 8.55 5.4 5.2 6.8 C1.75 5.7 2 1.3 5.2 1.2 M5.2 6.8 C9.2 7.65 8.95 13.25 5 13.05 C1.05 12.85 1.2 7.75 5.2 6.8" },
  "9": { width: 9.5, d: "M7.75 5.85 C7.05 7.25 5.6 8.05 4.1 7.88 C1.4 7.55 1.15 3.8 3.15 2.1 C5.65 0 8.5 2.15 8.25 6.25 C7.95 10.15 5.35 13.1 2.25 12.35" },
  "!": { width: 7.2, d: "M3.72 1.2 Q3.35 5.92 3.7 9.4 M3.76 12 Q4.08 12.48 3.68 12.9" },
  "?": { width: 9, d: "M1.55 3.2 C3.1 .75 7.8 1.35 7.35 4.55 C7.12 6.35 5.2 7.1 4.4 8.85 M4.35 12.1 L4.36 12.8" },
  ".": { width: 4, d: "M2.1 12.1 L2.12 12.8" },
  ",": { width: 4.5, d: "M2.6 11.8 Q2.4 13.15 1.65 14.05" },
  "'": { width: 3.8, d: "M2.7 1.55 Q2.35 2.95 1.85 4.15" },
  "’": { width: 3.8, d: "M2.7 1.55 Q2.35 2.95 1.85 4.15" },
  "\"": { width: 6, d: "M2.1 1.55 Q1.85 2.85 1.45 4.1 M4.75 1.55 Q4.5 2.85 4.1 4.1" },
  ":": { width: 4.5, d: "M2.2 5.4 L2.23 6 M2.2 11.9 L2.23 12.5" },
  ";": { width: 4.5, d: "M2.2 5.4 L2.23 6 M2.6 11.8 Q2.4 13.15 1.65 14.05" },
  "-": { width: 7, d: "M1.1 7.2 Q3.6 6.85 6.2 7.15" },
  "+": { width: 8, d: "M4 3.8 Q3.75 7.1 4 10.4 M1.5 7.15 Q4 6.9 6.7 7.1" },
  "&": { width: 10, d: "M6.85 4.05 C6.4 1.6 2.95 1.7 3.05 4.2 C3.15 6.35 7.15 7.25 7.75 10.25 C6.25 13.25 1.95 13.05 1.75 10.15 C1.6 7.75 4.4 6.65 6.15 6.15 M7.5 8.05 Q8.6 10.45 9.35 12.7" },
  "/": { width: 7, d: "M6.2 1.2 Q4.6 6.7 1.5 13" },
  " ": { width: 5, d: "" }
};

export function StickPenTypeface({
  text = "playful!",
  color = "#111111",
  density = 7,
  scale = 22,
  grain = 28,
  contrast = 72,
  shape = 58,
  seed = 1,
  className,
  style,
  ...props
}: StickPenTypefaceProps) {
  const letters = text.toLowerCase().split("").map((char) => glyphs[char] ? char : "?");
  const gap = Math.max(1.7, 5.7 - density / 2.6);
  const glyphScale = 1 + scale / 66;
  const strokeWidth = Math.max(1.18, 0.98 + contrast / 96);
  const rawWidth = letters.reduce((sum, char) => sum + glyphs[char].width * glyphScale + gap, -gap);
  const fitScale = Math.min(1, 144 / Math.max(1, rawWidth));
  const fittedWidth = rawWidth * fitScale;
  const startX = 80 - fittedWidth / 2;
  let cursor = 0;

  return (
    <svg
      viewBox="0 0 160 54"
      className={cx(className)}
      style={{ display: "block", width: "100%", height: "auto", overflow: "visible", ...style }}
      role="img"
      aria-label={text}
      {...props}
    >
      {letters.map((letter, index) => {
        const glyph = glyphs[letter];
        const noiseSeed = seed + index * 21.7 + grain + shape;
        const x = startX + cursor * fitScale + (seeded(noiseSeed) - 0.5) * 0.9;
        const y = 15.6 + (seeded(noiseSeed + 2) - 0.5) * ((shape - 20) / 28);
        const rotate = (seeded(noiseSeed + 4) - 0.5) * (1.5 + shape / 24);
        const isNarrowGlyph = glyph.width <= 7.8 || /[!.:;]/.test(letter);
        const narrowBoost = 1 + Math.max(0, 8.2 - glyph.width) * 0.045;
        const punctuationWeight = letter === "!" ? 1.08 : letter === "?" ? 1.1 : 1;
        const naturalWidth = strokeWidth * narrowBoost * punctuationWeight * (0.84 + seeded(noiseSeed + 8) * 0.44);
        const visibleStrokeWidth = Math.min(isNarrowGlyph ? 1.82 : 2.18, Math.max(isNarrowGlyph ? 1.42 : 1.18, naturalWidth));
        cursor += glyph.width * glyphScale + gap;

        const node = (
          <g
            key={`${letter}-${index}`}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotate.toFixed(2)} ${(glyph.width / 2).toFixed(2)} 7) scale(${(glyphScale * fitScale).toFixed(3)} ${glyphScale.toFixed(3)})`}
          >
            {isNarrowGlyph ? null : (
              <path
                d={glyph.d}
                fill="none"
                stroke={color}
                strokeWidth={visibleStrokeWidth * 0.62}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.16 + contrast / 1200}
                vectorEffect="non-scaling-stroke"
                transform={`translate(${((seeded(noiseSeed + 10) - 0.5) * 0.18).toFixed(2)} ${((seeded(noiseSeed + 12) - 0.5) * 0.18).toFixed(2)})`}
              />
            )}
            <path
              d={glyph.d}
              fill="none"
              stroke={color}
              strokeWidth={visibleStrokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={1}
              vectorEffect="non-scaling-stroke"
            />
            {!isNarrowGlyph && seeded(noiseSeed + 14) > 0.34 ? (
              <path
                d={glyph.d}
                fill="none"
                stroke={color}
                strokeWidth={visibleStrokeWidth * 0.34}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.18 + grain / 460}
                vectorEffect="non-scaling-stroke"
                transform={`translate(${((seeded(noiseSeed + 16) - 0.5) * 0.28).toFixed(2)} ${((seeded(noiseSeed + 18) - 0.5) * 0.28).toFixed(2)})`}
              />
            ) : null}
          </g>
        );
        return node;
      })}
    </svg>
  );
}
