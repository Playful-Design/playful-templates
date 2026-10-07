import type { HTMLAttributes } from "react";
import { hexToRgba } from "../shared";

type GridGradientPatternProps = HTMLAttributes<HTMLDivElement> & {
  color?: string;
  cellSize?: number;
  glowSize?: number;
};

export function GridGradientPattern({ color = "#FFE949", cellSize = 36, glowSize = 72, style, ...props }: GridGradientPatternProps) {
  return (
    <div
      {...props}
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: [
          `linear-gradient(${hexToRgba("#cfd8dd", 0.16)} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${hexToRgba("#cfd8dd", 0.16)} 1px, transparent 1px)`,
          `linear-gradient(${hexToRgba("#cfd8dd", 0.24)} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${hexToRgba("#cfd8dd", 0.24)} 1px, transparent 1px)`,
          `radial-gradient(ellipse ${glowSize}% 58% at 50% -4%, ${hexToRgba(color, 0.98)} 0 24%, ${hexToRgba(color, 0.56)} 43%, transparent 76%)`,
          "linear-gradient(180deg, #f3f4f4, #e9ecee)",
        ].join(", "),
        backgroundSize: `9px 9px, 9px 9px, ${cellSize}px ${cellSize}px, ${cellSize}px ${cellSize}px, 100% 100%, 100% 100%`,
        ...style,
      }}
    />
  );
}
