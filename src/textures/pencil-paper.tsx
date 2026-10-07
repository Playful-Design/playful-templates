import type { HTMLAttributes } from "react";

type PencilPaperTextureProps = HTMLAttributes<HTMLDivElement> & {
  color?: string;
  strokeCount?: number;
};

export function PencilPaperTexture({ color = "#111111", strokeCount = 5, style, ...props }: PencilPaperTextureProps) {
  const strokes = Array.from({ length: strokeCount });

  return (
    <div {...props} style={{ position: "absolute", inset: 0, background: "#f7f7f4", overflow: "hidden", ...style }}>
      <svg viewBox="0 0 100 62" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
        {strokes.map((_, index) => {
          const y = 12 + index * 8.2;
          return (
            <path
              key={index}
              d={`M-4 ${y} C18 ${y - 6}, 31 ${y + 6}, 48 ${y} S78 ${y - 4}, 104 ${y + 1}`}
              fill="none"
              stroke={color}
              strokeWidth={0.18 + (index % 2) * 0.12}
              strokeLinecap="round"
              strokeDasharray="1.6 .35"
              opacity={0.4}
            />
          );
        })}
      </svg>
    </div>
  );
}
