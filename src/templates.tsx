import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { GridGradientPattern } from "./patterns/grid-gradient";
import { StarMaskPattern } from "./patterns/star-mask";
import { TornPaperFrame } from "./frames/torn-paper";
import { PencilPaperTexture } from "./textures/pencil-paper";
import { ThermalInkTexture } from "./textures/thermal-ink";
import { MarkerAlphabetTypeface } from "./fonts/marker-alphabet";
import { StickPenTypeface } from "./fonts/stick-pen";
import { CharmBeadTypeface } from "./fonts/charm-bead";
import { hexToRgba, mixHex, seeded } from "./shared";

export type TemplatePreset =
  | "smart-sprinkles"
  | "cyanotype-photo"
  | "grid-gradient"
  | "crossword-emboss"
  | "fairy-gradients"
  | "river-puffer-pattern"
  | "pencil-paper"
  | "soft-cloud-pattern"
  | "drape-flow"
  | "mineral-marble-pattern"
  | "shadow-plaid"
  | "shadow-plaid-pattern"
  | "metal-uv-texture"
  | "net-art-mask"
  | "ascii-field"
  | "woven-image-strips"
  | "vhs-photo-repeat"
  | "paper-punch-overlay"
  | "led-crystal-overlay"
  | "baby-stars"
  | "star-glisten-overlay"
  | "lumen-star-film"
  | "white-space-glitter"
  | "ribbed"
  | "cloth-curtain-overlay"
  | "thermal-ink"
  | "cyanotype-paper"
  | "xray-paper"
  | "x-ray-film"
  | "knit-typeface"
  | "knitted-type"
  | "honey-typeface"
  | "inky-soft"
  | "print-dot-typeface"
  | "bead-typeface"
  | "charm-bead-typeface"
  | "connected-oval-typeface"
  | "dotie-oval-type"
  | "heart-matrix-typeface"
  | "cross-stitch-lined-typeface"
  | "cross-stitch-lines"
  | "ransom-note-typeface"
  | "marker-alphabet-typeface"
  | "playful-blocks-typeface"
  | "stick-pen-typeface"
  | "torn-paper"
  | "ios-desktop-frame"
  | "stamp-frame"
  | "polaroid-dump";

export type PlayfulTemplateProps = HTMLAttributes<HTMLDivElement> & {
  preset?: TemplatePreset | string;
  text?: string;
  typeCase?: "uppercase" | "lowercase" | "default";
  image?: string;
  color?: string;
  colors?: string[];
  density?: number;
  scale?: number;
  grain?: number;
  contrast?: number;
  shape?: number;
  seed?: number;
  children?: ReactNode;
};

export const playfulTemplatePresets = {
  fonts: [
    "knit-typeface",
    "honey-typeface",
    "print-dot-typeface",
    "bead-typeface",
    "charm-bead-typeface",
    "connected-oval-typeface",
    "heart-matrix-typeface",
    "cross-stitch-lined-typeface",
    "ransom-note-typeface",
    "marker-alphabet-typeface",
    "playful-blocks-typeface",
    "stick-pen-typeface",
  ],
  patterns: [
    "grid-gradient",
    "fairy-gradients",
    "pencil-paper",
    "soft-cloud-pattern",
    "drape-flow",
    "shadow-plaid",
  ],
  textures: [
    "smart-sprinkles",
    "metal-uv-texture",
    "net-art-mask",
    "woven-image-strips",
    "paper-punch-overlay",
    "baby-stars",
    "lumen-star-film",
    "white-space-glitter",
    "ribbed",
    "thermal-ink",
    "cyanotype-paper",
    "x-ray-film",
  ],
  frames: ["torn-paper", "ios-desktop-frame", "stamp-frame", "polaroid-dump"],
} as const;

const aliases: Record<string, TemplatePreset> = {
  "cyanotype-photo": "smart-sprinkles",
  "crossword-emboss": "grid-gradient",
  "river-puffer-pattern": "fairy-gradients",
  "mineral-marble-pattern": "drape-flow",
  "shadow-plaid-pattern": "shadow-plaid",
  "ascii-field": "net-art-mask",
  "vhs-photo-repeat": "woven-image-strips",
  "led-crystal-overlay": "paper-punch-overlay",
  "star-glisten-overlay": "baby-stars",
  "cloth-curtain-overlay": "ribbed",
  "xray-paper": "x-ray-film",
  "knitted-type": "knit-typeface",
  "inky-soft": "honey-typeface",
  "dotie-oval-type": "connected-oval-typeface",
};

function canonical(preset = "grid-gradient") {
  return aliases[preset] ?? preset;
}

function clamp(value: number | undefined, fallback: number, min: number, max: number) {
  const next = Number.isFinite(value) ? Number(value) : fallback;
  return Math.min(max, Math.max(min, next));
}

function templateText(text = "playful!", typeCase: PlayfulTemplateProps["typeCase"] = "default") {
  if (typeCase === "uppercase") return text.toUpperCase();
  if (typeCase === "lowercase") return text.toLowerCase();
  return text;
}

function surfaceStyle(style?: CSSProperties): CSSProperties {
  return {
    position: "relative",
    width: "100%",
    minHeight: 220,
    aspectRatio: "2 / 3",
    overflow: "hidden",
    background: "#f6f6f4",
    ...style,
  };
}

function imageLayer(image?: string, opacity = 1, filter = ""): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    backgroundImage: image ? `url(${image})` : "linear-gradient(135deg, #e8e8e4, #f8f8f6)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity,
    filter,
  };
}

function svgNoise(seed = 1) {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='3' seed='${Math.round(seed)}'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E")`;
}

function FullSvg({
  children,
  label,
  style,
}: {
  children: ReactNode;
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 360 540"
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", ...style }}
    >
      {children}
    </svg>
  );
}

function PatternBackground({ preset, color, colors, density, scale, grain, contrast, shape, seed }: Required<Pick<PlayfulTemplateProps, "preset">> & PlayfulTemplateProps) {
  const primary = color ?? colors?.[0] ?? "#111111";
  const c2 = colors?.[1] ?? "#96E9FF";
  const c3 = colors?.[2] ?? "#FF5900";
  const c4 = colors?.[3] ?? "#F7F7F2";
  const d = clamp(density, 8, 1, 20);
  const s = clamp(scale, 22, 1, 80);
  const g = clamp(grain, 32, 0, 100);
  const k = clamp(contrast, 66, 0, 100);
  const sh = clamp(shape, 54, 0, 100);

  if (preset === "grid-gradient") {
    return <GridGradientPattern color={primary} cellSize={s * 1.7} glowSize={70 + sh * 0.8} />;
  }

  if (preset === "pencil-paper") {
    return <PencilPaperTexture color={primary} strokeCount={Math.max(2, Math.round(d / 2))} />;
  }

  if (preset === "soft-cloud-pattern") {
    return (
      <>
        <div style={{ position: "absolute", inset: 0, background: primary, opacity: 0.2 }} />
        <FullSvg>
          {Array.from({ length: Math.round(d + 4) }).map((_, i) => {
            const x = (seeded((seed ?? 1) + i) * 420 - 30).toFixed(2);
            const y = (seeded((seed ?? 1) + i * 2.7) * 560 - 10).toFixed(2);
            const r = 14 + seeded(i + s) * s;
            return (
              <g key={i} opacity={0.56 + seeded(i) * 0.28} filter="url(#cloudBlur)">
                <ellipse cx={x} cy={y} rx={r * 1.4} ry={r * 0.65} fill={c2} />
                <ellipse cx={Number(x) + r * 0.55} cy={Number(y) - r * 0.24} rx={r * 0.9} ry={r * 0.72} fill="#fff" />
                <ellipse cx={Number(x) - r * 0.48} cy={Number(y) - r * 0.1} rx={r * 0.8} ry={r * 0.58} fill={c4} />
              </g>
            );
          })}
          <defs>
            <filter id="cloudBlur"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
        </FullSvg>
      </>
    );
  }

  if (preset === "fairy-gradients") {
    return (
      <>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: [
              `radial-gradient(ellipse at 24% 20%, ${hexToRgba(primary, 0.86)}, transparent 36%)`,
              `radial-gradient(ellipse at 66% 42%, ${hexToRgba(c2, 0.74)}, transparent 38%)`,
              `radial-gradient(ellipse at 34% 78%, ${hexToRgba(c3, 0.76)}, transparent 36%)`,
              `linear-gradient(135deg, ${hexToRgba(c4, 0.56)}, ${hexToRgba("#ffffff", 0.72)})`,
            ].join(","),
            filter: `blur(${Math.max(8, s * 0.7)}px) saturate(${1 + k / 120})`,
            transform: "scale(1.08)",
          }}
        />
        <FullSvg>
          {Array.from({ length: Math.round(d + 3) }).map((_, i) => {
            const x = 26 + seeded(i + 2) * 310;
            const y = 24 + seeded(i + 8) * 490;
            const r = 2.5 + seeded(i + 18) * 8;
            return <path key={i} d={`M${x} ${y - r} C${x + r} ${y - r * 0.6} ${x + r} ${y + r * 0.6} ${x} ${y + r} C${x - r} ${y + r * 0.5} ${x - r} ${y - r * 0.5} ${x} ${y - r}`} fill="#fff" opacity={0.22 + seeded(i) * 0.42} />;
          })}
        </FullSvg>
      </>
    );
  }

  if (preset === "drape-flow") {
    const bend = Math.max(-0.85, Math.min(0.85, (sh - 50) / 35));
    const direction = 0.58;
    const angle = -10 + direction * 34;
    const dragBend = bend * 170;
    return (
      <>
        <div style={{ position: "absolute", inset: "-12%", background: `linear-gradient(${angle}deg, #100923, ${primary} 42%, ${c2})` }} />
        <FullSvg>
          {Array.from({ length: Math.round(d + 5) }).map((_, i) => {
            const y = -40 + i * (520 / (d + 2));
            const wide = 18 + seeded(i) * (s * 2.2);
            const lift = (seeded(i + 9) - 0.5) * 74;
            const cp1x = 88 + dragBend * 0.72;
            const cp2x = 190 + dragBend;
            return (
              <path
                key={i}
                d={`M-50 ${y} C${cp1x.toFixed(2)} ${(y + 80 + seeded(i) * 60 + lift).toFixed(2)} ${cp2x.toFixed(2)} ${(y - 90 - lift * 0.45).toFixed(2)} 420 ${(y + 80 + bend * 52).toFixed(2)}`}
                fill="none"
                stroke={i % 3 === 0 ? c3 : i % 2 ? c2 : "#ffffff"}
                strokeWidth={wide}
                strokeLinecap="round"
                opacity={0.14 + seeded(i + 4) * 0.34}
                filter="url(#drapeBlur)"
              />
            );
          })}
          <defs><filter id="drapeBlur"><feGaussianBlur stdDeviation={g / 24} /></filter></defs>
        </FullSvg>
      </>
    );
  }

  if (preset === "shadow-plaid") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: primary,
          backgroundImage: [
            `repeating-linear-gradient(90deg, transparent 0 ${s * 0.55}px, ${hexToRgba(c2, 0.42)} ${s * 0.55}px ${s * 0.95}px, transparent ${s * 0.95}px ${s * 1.7}px)`,
            `repeating-linear-gradient(0deg, transparent 0 ${s * 0.7}px, ${hexToRgba(c3, 0.46)} ${s * 0.7}px ${s * 1.08}px, transparent ${s * 1.08}px ${s * 1.9}px)`,
            `repeating-linear-gradient(90deg, transparent 0 8px, ${hexToRgba("#111111", 0.2)} 8px 9px, transparent 9px 19px)`,
          ].join(","),
          filter: `contrast(${0.95 + k / 150}) saturate(1.1)`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 22% 18%, ${primary}, transparent 34%), radial-gradient(circle at 74% 52%, ${c2}, transparent 38%), linear-gradient(135deg, ${c3}, ${c4})`,
      }}
    />
  );
}

function TextureBackground(props: PlayfulTemplateProps & { preset: string }) {
  const { preset, image, color, colors, density, scale, grain, contrast, shape, seed } = props;
  const primary = color ?? colors?.[0] ?? "#111111";
  const c2 = colors?.[1] ?? "#ffffff";
  const c3 = colors?.[2] ?? "#96E9FF";
  const d = clamp(density, 8, 1, 20);
  const s = clamp(scale, 22, 1, 80);
  const g = clamp(grain, 38, 0, 100);
  const k = clamp(contrast, 70, 0, 100);
  const sh = clamp(shape, 56, 0, 100);

  if (preset === "smart-sprinkles") {
    return (
      <>
        <div style={imageLayer(image, 1, `grayscale(.15) contrast(${1 + k / 180})`)} />
        <FullSvg>
          {Array.from({ length: Math.round(d * 22) }).map((_, i) => {
            const x = seeded(i + (seed ?? 1)) * 360;
            const y = seeded(i * 2.37 + 5) * 540;
            const star = i % 4 === 0;
            return star ? (
              <path key={i} d={`M${x} ${y - 2} L${x + 0.8} ${y - 0.8} L${x + 2.2} ${y} L${x + 0.8} ${y + 0.8} L${x} ${y + 2} L${x - 0.8} ${y + 0.8} L${x - 2.2} ${y} L${x - 0.8} ${y - 0.8} Z`} fill={seeded(i) > 0.52 ? "#111" : "#fff"} opacity={0.86} />
            ) : (
              <rect key={i} x={x} y={y} width={1.2 + s / 24} height={1.2 + s / 24} fill={seeded(i) > 0.52 ? "#111" : "#fff"} opacity={0.76} />
            );
          })}
        </FullSvg>
      </>
    );
  }

  if (preset === "net-art-mask") {
    return (
      <>
        <div style={imageLayer(image)} />
        <StarMaskPattern
          colors={[primary, c2, "#ffffff", c3]}
          density={d}
          scale={s}
          contrast={k}
          shape={sh}
          solid
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0 }}
        />
      </>
    );
  }

  if (preset === "woven-image-strips") {
    const count = Math.round(d + 5);
    return (
      <>
        <div style={{ ...imageLayer(image), filter: "saturate(1.08)" }} />
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)` }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundImage: image ? `url(${image})` : "linear-gradient(135deg,#d9d9d4,#f7f7f1)",
                backgroundSize: `${count * 100}% 100%`,
                backgroundPosition: `${(i / Math.max(1, count - 1)) * 100}% 50%`,
                transform: `translateY(${(i % 2 ? 1 : -1) * (sh / 26)}px) perspective(400px) rotateY(${i % 2 ? -5 : 5}deg)`,
                boxShadow: i % 2 ? "inset 0 -12px 15px rgba(0,0,0,.18)" : "inset 0 12px 15px rgba(255,255,255,.2)",
              }}
            />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.12) 1px, transparent 1px)`, backgroundSize: `${100 / count}% 100%`, opacity: 0.22 }} />
      </>
    );
  }

  if (preset === "paper-punch-overlay") {
    const holes = Array.from({ length: Math.round(d + 4) }).map((_, i) => {
      const r = Math.max(8, s * 0.7);
      const x = 35 + (i % 4) * 88 + seeded(i) * 12;
      const y = 45 + Math.floor(i / 4) * 92 + seeded(i + 4) * 18;
      return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        r: Number(r.toFixed(2)),
      };
    });
    const maskId = `playful-paper-punch-${Math.round((seed ?? 1) * 1000)}-${Math.round(d * 10)}-${Math.round(s * 10)}`;
    return (
      <>
        <div style={imageLayer(image)} />
        <FullSvg>
          <defs>
            <mask id={maskId}>
              <rect width="360" height="540" fill="#fff" />
              {holes.map((hole, i) => (
                <circle key={i} cx={hole.x} cy={hole.y} r={hole.r} fill="#000" />
              ))}
            </mask>
            <filter id={`${maskId}-inner`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feDropShadow dx="1.1" dy="0.25" stdDeviation="0" floodColor="#8f9695" floodOpacity="0.42" />
            </filter>
          </defs>
          <rect width="360" height="540" fill={primary} mask={`url(#${maskId})`} />
          {holes.map((hole, i) => (
            <circle
              key={`edge-${i}`}
              cx={hole.x}
              cy={hole.y}
              r={hole.r}
              fill="none"
              stroke="#8f9695"
              strokeWidth="1.1"
              opacity=".38"
              filter={`url(#${maskId}-inner)`}
            />
          ))}
        </FullSvg>
      </>
    );
  }

  if (preset === "baby-stars" || preset === "lumen-star-film" || preset === "white-space-glitter") {
    return (
      <>
        <div style={imageLayer(image, 1, `contrast(${1 + k / 260}) saturate(1.06)`)} />
        <FullSvg>
          {Array.from({ length: Math.round(d * 4) }).map((_, i) => {
            const x = seeded(i + 9) * 360;
            const y = seeded(i + 1.7) * 540;
            const r = 2 + seeded(i) * (s / 5);
            return <path key={i} d={`M${x} ${y - r * 2.2} C${x + r * 0.18} ${y - r * 0.4} ${x + r * 1.9} ${y - r * 0.18} ${x + r * 3.1} ${y} C${x + r * 1.5} ${y + r * 0.16} ${x + r * 0.24} ${y + r * 0.44} ${x} ${y + r * 2.4} C${x - r * 0.28} ${y + r * 0.45} ${x - r * 1.45} ${y + r * 0.16} ${x - r * 3.1} ${y} C${x - r * 1.65} ${y - r * 0.18} ${x - r * 0.2} ${y - r * 0.48} ${x} ${y - r * 2.2}`} fill={preset === "lumen-star-film" ? c3 : "#fff"} opacity={0.28 + seeded(i) * 0.45} filter="url(#spark)" />;
          })}
          <defs><filter id="spark"><feGaussianBlur stdDeviation=".65" /></filter></defs>
        </FullSvg>
      </>
    );
  }

  if (preset === "ribbed") {
    return (
      <>
        <div style={imageLayer(image, 1, "saturate(.96) contrast(1.05)")} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,.24) 0 4px, rgba(0,0,0,.12) 4px 9px, transparent 9px ${Math.max(14, s)}px)`, mixBlendMode: "soft-light", opacity: 0.72 }} />
      </>
    );
  }

  if (preset === "thermal-ink") {
    return (
      <ThermalInkTexture
        image={image}
        color={primary === "#111111" ? "#00A8D7" : primary}
        intensity={0.72 + k / 260}
        grain={g / 260}
      />
    );
  }

  if (preset === "cyanotype-paper" || preset === "x-ray-film" || preset === "metal-uv-texture") {
    const filter = preset === "x-ray-film" ? "grayscale(1) invert(.88) contrast(1.35)" : preset === "cyanotype-paper" ? "grayscale(1) contrast(1.2)" : "contrast(1.12) saturate(.75)";
    const blend = preset === "cyanotype-paper" ? "#0E48AA" : preset === "x-ray-film" ? "#051526" : primary;
    return (
      <>
        <div style={imageLayer(image, 1, filter)} />
        <div style={{ position: "absolute", inset: 0, background: blend, mixBlendMode: preset === "metal-uv-texture" ? "overlay" : "color", opacity: preset === "metal-uv-texture" ? 0.38 : 0.82 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${svgNoise(seed)}, repeating-linear-gradient(${preset === "metal-uv-texture" ? 102 : 90}deg, transparent 0 18px, rgba(255,255,255,.16) 18px 19px, transparent 19px 34px)`, opacity: 0.18 + g / 260, mixBlendMode: "screen" }} />
      </>
    );
  }

  return <PatternBackground preset="fairy-gradients" color={primary} colors={colors} density={density} scale={scale} grain={grain} contrast={contrast} shape={shape} seed={seed} />;
}

type InkySoftGlyph = {
  d: string;
  width: number;
};

const inkySoftGlyphs: Record<string, InkySoftGlyph> = {
  A: { width: 28.17, d: "M13.58 1.32 C11.28 0.98 9.75 2.20 8.88 4.35 L1.92 23.85 C1.08 26.15 2.02 28.18 3.82 28.18 C5.55 28.18 6.78 26.48 7.55 24.42 L8.78 21.22 C11.45 20.22 15.20 20.10 17.95 20.92 L19.38 24.58 C20.18 26.65 21.38 28.30 23.12 28.18 C25.02 28.05 25.82 26.02 24.92 23.75 L17.92 5.08 C17.08 2.92 15.82 1.65 13.58 1.32 Z M11.12 15.22 C12.08 12.52 13.02 10.28 13.85 8.32 C14.72 10.32 15.62 12.62 16.48 15.32 C14.95 14.88 12.72 14.85 11.12 15.22 Z" },
  B: { width: 24.2, d: "M3.18 1.92 C6.95 1.05 12.45 1.20 15.45 3.32 C18.15 5.22 17.92 8.88 15.12 11.35 C19.55 12.25 21.55 16.32 20.02 20.78 C18.48 25.32 13.55 28.22 6.45 28.15 C3.85 28.12 2.62 26.72 3.08 24.58 C3.72 21.35 3.55 16.90 3.18 12.58 C2.82 8.68 1.52 3.12 3.18 1.92 Z M7.98 5.92 C7.28 7.60 7.15 9.72 7.58 11.45 C10.45 11.38 13.02 9.82 13.55 8.02 C14.12 6.08 12.02 5.18 7.98 5.92 Z M7.78 15.68 C7.22 17.98 7.35 21.52 8.08 23.62 C12.38 23.92 15.55 22.05 16.08 19.22 C16.58 16.58 12.82 15.02 7.78 15.68 Z" },
  C: { width: 23.34, d: "M13.05 1.40 C16.72 1.20 19.20 2.95 19.45 5.12 C19.65 6.90 17.88 8.12 15.32 7.35 C11.80 6.32 8.55 7.25 6.72 10.12 C4.72 13.25 4.55 18.15 6.82 21.25 C8.68 23.80 12.28 24.32 15.62 22.38 C18.02 20.98 20.02 21.68 19.82 23.72 C19.62 25.85 16.62 28.10 12.62 28.05 C5.12 27.92 1.15 22.65 1.52 15.55 C1.88 8.70 6.18 1.75 13.05 1.40 Z" },
  D: { width: 27.34, d: "M3.62 1.85 C8.75 0.95 15.42 1.98 19.80 5.70 C24.32 9.55 25.12 16.65 21.58 22.45 C18.92 26.82 14.15 28.32 7.25 27.88 C4.55 27.70 3.10 26.55 3.42 24.25 C3.95 20.25 3.82 15.52 3.42 11.62 C2.98 7.35 1.70 2.55 3.62 1.85 Z M8.22 6.28 C7.45 10.80 7.25 17.62 8.08 23.05 C12.55 23.82 15.78 22.42 17.55 19.28 C19.62 15.55 18.90 11.18 15.78 8.50 C13.62 6.65 10.82 5.90 8.22 6.28 Z" },
  E: { width: 27.55, d: "M3.48 2.52 C8.10 1.95 15.45 1.18 22.18 2.58 C24.15 2.98 25.08 4.52 24.10 6.05 C23.22 7.42 20.95 7.75 18.48 7.32 C15.20 6.78 11.05 6.28 8.52 6.92 C7.28 8.20 6.82 10.28 6.78 12.35 C9.92 11.90 13.12 11.45 16.05 11.82 C18.32 12.10 18.88 13.82 17.70 15.22 C16.72 16.38 14.58 16.72 12.05 16.62 L6.85 16.50 C7.02 19.22 8.08 21.58 10.05 23.02 C13.30 22.92 16.52 22.62 19.82 22.75 C22.62 22.85 24.38 23.75 24.20 25.28 C24.00 26.98 21.98 27.82 18.95 27.92 L6.15 28.00 C3.65 27.95 2.42 26.62 2.78 24.60 C3.30 21.65 3.42 18.10 3.28 14.52 C3.10 10.18 2.22 6.35 2.62 4.18 C2.78 3.35 3.05 2.82 3.48 2.52 Z" },
  F: { width: 24.46, d: "M4.35 1.70 C8.65 0.95 14.95 1.15 20.30 2.15 C22.15 2.50 22.80 4.05 21.65 5.25 C20.65 6.30 18.70 6.55 16.15 6.20 L8.20 5.15 C7.35 6.85 7.05 9.05 7.18 11.15 C9.95 10.75 12.85 10.65 15.15 11.20 C16.75 11.60 17.15 13.00 16.20 14.05 C15.30 15.05 13.25 15.30 10.85 15.10 L7.25 14.90 C7.30 18.30 7.10 22.35 6.55 25.55 C6.25 27.35 4.95 28.45 3.65 28.05 C2.30 27.60 2.05 25.85 2.38 23.75 C3.25 18.20 3.15 12.55 2.50 7.90 C2.00 4.30 2.45 2.05 4.35 1.70 Z" },
  G: { width: 28.04, d: "M14.72 1.30 C18.88 1.25 21.78 3.45 22.25 6.00 C22.58 7.75 21.12 8.88 18.85 8.05 C15.68 6.90 11.78 6.45 8.82 8.58 C5.62 10.88 4.35 15.85 5.72 19.70 C6.98 23.22 10.45 24.60 14.62 23.22 C14.88 21.55 14.52 19.82 13.68 18.75 C12.12 18.35 10.85 17.45 10.92 16.15 C11.02 14.72 12.92 14.12 15.82 14.40 C19.32 14.72 23.15 14.40 23.82 16.22 C24.40 17.78 22.48 19.05 20.15 20.25 C20.30 22.60 20.80 25.30 20.10 27.02 C19.45 28.62 17.72 28.80 16.62 27.55 C11.55 29.05 6.82 27.82 4.02 24.58 C0.95 21.02 0.82 14.90 3.52 9.80 C6.05 5.02 10.15 1.35 14.72 1.30 Z" },
  H: { width: 23.93, d: "M4.05 1.75 C5.85 1.45 7.05 2.52 6.88 4.55 C6.68 7.18 6.78 10.35 7.30 13.18 C9.18 13.45 11.42 13.25 13.18 12.65 C13.55 9.22 13.72 5.82 14.35 3.30 C14.82 1.45 16.25 0.85 17.72 1.65 C19.08 2.40 19.38 4.15 19.02 6.32 C18.12 11.88 18.25 19.38 19.28 25.28 C19.65 27.42 18.45 28.75 16.98 28.30 C15.42 27.82 14.80 26.02 14.52 23.90 C14.20 21.58 13.78 19.48 13.12 17.70 C11.28 17.12 8.95 17.22 7.35 18.05 C6.90 20.72 6.45 24.05 5.75 26.10 C5.12 27.92 3.52 28.60 2.45 27.55 C1.40 26.55 1.58 24.25 2.02 22.22 C3.18 16.82 3.15 10.12 2.02 5.05 C1.60 3.18 2.32 2.02 4.05 1.75 Z" },
  I: { width: 30.75, d: "M5.05 1.95 C10.85 1.35 18.70 1.30 25.10 2.15 C27.00 2.40 27.80 3.90 26.70 5.20 C25.75 6.35 23.35 6.70 20.50 6.15 L16.70 5.45 C16.25 10.40 16.05 17.30 16.90 23.15 C19.35 22.75 22.70 22.40 25.30 23.10 C27.00 23.55 27.30 25.15 26.00 26.25 C24.75 27.35 21.90 27.35 18.80 26.95 C14.50 26.40 9.35 27.55 4.40 27.95 C2.15 28.15 0.95 26.80 1.75 25.20 C2.55 23.60 5.40 23.45 8.60 23.90 L11.15 24.25 C12.00 18.70 11.80 11.15 10.65 6.65 C7.95 6.20 5.05 5.65 3.95 4.55 C2.60 3.20 3.20 2.15 5.05 1.95 Z" },
  J: { width: 28.29, d: "M21.85 1.55 C23.98 1.40 25.25 2.58 24.62 4.12 C24.02 5.58 21.48 6.05 18.62 5.78 C17.95 9.92 18.22 15.28 18.88 19.18 C19.62 23.62 16.05 28.15 10.62 28.55 C5.55 28.92 1.95 26.15 1.55 22.40 C1.32 20.22 2.35 18.52 3.95 18.55 C5.58 18.58 6.22 20.40 6.78 22.18 C7.32 23.92 8.90 24.92 10.95 24.42 C13.12 23.90 14.75 21.95 14.42 19.50 C13.92 15.80 13.35 10.42 13.82 6.48 C10.72 6.25 7.32 5.72 5.55 4.85 C3.75 3.95 3.88 2.52 5.88 2.25 C10.58 1.60 16.42 1.92 21.85 1.55 Z" },
  K: { width: 24.52, d: "M4.10 1.45 C5.72 1.20 6.92 2.20 6.80 4.10 C6.55 7.92 6.38 11.22 6.62 14.05 C9.48 10.62 12.72 6.52 15.88 2.92 C17.35 1.25 19.25 0.95 20.20 2.15 C21.10 3.30 20.22 5.18 18.60 6.82 C15.80 9.68 13.12 12.52 10.98 15.02 C14.25 17.98 17.78 21.82 20.55 25.15 C21.85 26.72 21.35 28.35 19.88 28.38 C18.25 28.40 16.62 26.88 15.15 25.22 C12.82 22.58 10.10 20.00 7.42 18.02 C6.92 20.55 6.78 23.65 7.10 25.88 C7.40 27.92 6.22 28.72 4.70 28.08 C3.38 27.52 2.70 25.95 2.78 24.02 C3.02 18.15 2.75 10.92 2.05 5.38 C1.75 3.15 2.45 1.72 4.10 1.45 Z" },
  L: { width: 26.26, d: "M4.55 1.45 C2.75 1.70 1.85 3.05 2.20 4.95 C2.80 8.15 3.20 12.10 2.95 16.10 C2.75 19.15 2.25 22.75 2.85 25.05 C3.35 26.95 4.95 28.00 7.25 27.95 L19.95 27.65 C22.35 27.55 23.70 26.25 23.10 24.75 C22.55 23.35 20.60 22.55 18.10 22.80 L8.25 23.35 C6.85 22.35 6.05 20.40 6.05 18.05 C6.05 13.95 7.15 8.20 7.55 4.15 C7.75 2.25 6.35 1.20 4.55 1.45 Z" },
  M: { width: 30.75, d: "M3.38 1.70 C5.05 1.28 6.15 2.18 6.85 4.12 C7.82 6.75 9.22 10.22 11.10 14.12 C12.75 11.02 14.92 6.95 17.28 3.52 C18.52 1.72 20.18 1.10 21.55 1.92 C22.80 2.68 23.12 4.45 22.78 6.55 C21.88 12.05 22.30 20.00 24.18 25.58 C24.82 27.48 23.82 28.82 22.15 28.42 C20.65 28.05 19.55 26.32 19.18 24.22 C18.55 20.58 18.30 15.98 18.52 12.12 C16.75 14.78 15.10 17.45 13.75 20.22 C12.92 21.90 11.15 22.02 10.12 20.40 C8.75 18.20 7.45 15.42 6.35 12.70 C6.28 16.68 6.62 21.60 7.12 25.48 C7.38 27.52 6.18 28.70 4.55 28.15 C3.08 27.65 2.38 25.98 2.42 23.70 C2.55 17.62 2.15 10.12 1.62 5.40 C1.38 3.28 1.90 2.08 3.38 1.70 Z" },
  N: { width: 26.73, d: "M3.62 1.62 C5.22 1.12 6.52 2.00 7.55 4.22 C9.55 8.55 12.28 13.45 16.22 19.05 C16.08 14.22 15.75 8.45 16.38 4.10 C16.68 2.05 18.10 0.95 19.62 1.52 C21.02 2.05 21.52 3.85 21.20 6.05 C20.32 12.05 20.98 20.08 22.62 25.45 C23.25 27.45 22.12 28.72 20.38 28.18 C18.72 27.65 16.92 25.65 15.20 23.18 C12.42 19.18 9.58 14.72 7.30 10.72 C7.52 15.20 7.22 20.82 6.45 25.55 C6.10 27.70 4.60 28.70 3.28 27.78 C2.08 26.95 2.02 24.75 2.38 22.50 C3.08 18.05 3.22 12.12 2.60 6.08 C2.35 3.75 2.32 2.02 3.62 1.62 Z" },
  O: { width: 20.02, d: "M9.85 1.25 C14.80 1.15 17.95 5.25 17.92 12.00 C17.88 21.28 13.18 28.40 7.55 28.18 C2.92 28.00 0.85 22.82 1.35 15.20 C1.85 7.62 5.32 1.35 9.85 1.25 Z M9.70 6.65 C7.15 6.78 5.15 10.32 4.92 15.22 C4.70 20.00 5.95 23.38 8.22 23.42 C11.25 23.48 13.82 18.92 13.92 13.25 C14.00 8.72 12.38 6.50 9.70 6.65 Z" },
  P: { width: 23.34, d: "M4.05 1.35 C2.35 1.50 1.55 2.75 2.05 4.45 C2.90 7.35 3.10 10.95 2.70 14.80 L1.65 24.65 C1.35 27.10 2.30 28.45 4.00 28.30 C5.60 28.15 6.45 26.40 6.75 24.30 L7.55 18.85 C11.00 18.20 15.45 16.85 17.95 14.25 C20.40 11.70 20.80 7.90 18.60 5.05 C16.15 1.90 10.55 0.75 4.05 1.35 Z M8.10 6.75 C11.25 5.85 14.40 6.55 15.70 8.30 C16.85 9.85 16.25 11.75 14.05 13.40 C12.50 14.55 10.15 15.30 8.00 15.35 C6.55 14.00 5.95 11.05 6.60 8.75 C6.90 7.75 7.40 7.10 8.10 6.75 Z" },
  Q: { width: 29.92, d: "M13.92 1.25 C21.12 1.15 26.42 6.88 26.18 14.58 C25.95 21.95 20.65 28.35 12.95 28.18 C5.45 28.02 0.95 22.85 1.35 15.02 C1.72 7.62 6.72 1.35 13.92 1.25 Z M14.02 6.20 C9.42 6.28 6.02 10.35 5.70 15.20 C5.35 20.32 8.18 23.80 12.98 23.72 C17.92 23.65 21.70 19.52 21.85 14.65 C22.02 9.75 18.65 6.12 14.02 6.20 Z M19.72 20.82 C22.08 21.70 24.52 23.42 26.12 25.15 C27.25 26.38 26.70 27.92 25.15 27.85 C23.42 27.78 21.10 25.88 19.32 23.85 C18.25 22.62 18.45 21.25 19.72 20.82 Z" },
  R: { width: 25.83, d: "M4.05 1.45 C2.10 1.70 1.30 3.05 1.90 4.90 C2.70 7.35 2.90 10.85 2.60 15.10 L2.00 24.95 C1.85 27.35 2.90 28.60 4.45 28.10 C5.70 27.70 6.35 25.55 6.72 23.45 C7.10 21.40 8.50 20.20 10.55 20.65 C12.70 21.10 15.95 24.70 19.30 27.00 C21.10 28.25 22.75 27.50 22.55 25.95 C22.35 24.45 20.50 23.25 18.70 22.05 C16.55 20.60 14.70 18.85 13.20 17.20 C16.35 15.80 18.80 13.10 19.05 9.50 C19.30 5.35 15.95 2.10 10.55 1.42 C8.25 1.12 5.95 1.20 4.05 1.45 Z M8.15 6.35 C11.95 5.55 15.10 6.80 15.10 9.05 C15.10 11.60 11.65 14.50 7.20 14.75 C6.35 12.30 6.60 8.10 8.15 6.35 Z" },
  S: { width: 22.23, d: "M11.08 1.22 C15.35 1.12 18.35 3.25 18.02 5.80 C17.78 7.60 15.92 8.38 13.38 7.42 C10.28 6.25 6.98 7.08 6.45 9.22 C5.95 11.22 8.42 12.30 11.38 13.35 C15.60 14.85 18.45 17.55 17.98 21.38 C17.42 25.75 13.22 28.55 8.25 28.18 C4.45 27.88 1.48 25.85 1.40 23.35 C1.35 21.58 2.92 20.82 5.08 21.92 C8.50 23.68 12.90 23.08 13.50 20.48 C13.95 18.52 11.95 17.38 8.48 16.05 C4.35 14.45 2.02 11.85 2.42 8.45 C2.92 4.18 6.78 1.35 11.08 1.22 Z" },
  T: { width: 26.82, d: "M3.10 1.50 C7.85 2.55 14.25 2.90 20.55 1.45 C22.75 0.95 24.25 1.70 24.35 3.10 C24.45 4.65 22.75 5.60 20.30 5.90 L15.40 6.45 C14.45 9.85 14.20 14.25 14.75 18.80 C15.05 21.25 15.55 24.35 14.72 26.65 C14.15 28.20 12.45 28.75 11.45 27.65 C10.50 26.60 10.65 24.45 11.05 22.30 C11.80 18.10 11.85 12.40 11.12 7.10 C8.45 6.95 5.85 6.55 3.70 5.90 C1.45 5.20 0.45 3.50 1.30 2.25 C1.75 1.60 2.35 1.35 3.10 1.50 Z" },
  U: { width: 23.88, d: "M4.15 1.45 C2.45 1.65 1.60 3.15 1.95 5.30 C2.55 9.10 2.35 14.70 2.95 19.05 C3.70 24.45 7.15 27.95 11.55 28.10 C15.70 28.25 18.80 25.25 19.45 19.70 C19.95 15.45 19.50 9.55 20.20 4.10 C20.45 2.10 19.25 0.95 17.65 1.45 C16.10 1.90 15.65 3.80 15.55 6.00 C15.40 10.25 15.65 15.10 15.15 18.65 C14.72 21.70 13.25 23.35 11.20 23.30 C8.80 23.25 6.95 20.95 6.68 17.85 C6.35 14.00 7.00 8.95 7.45 4.35 C7.65 2.35 6.05 1.20 4.15 1.45 Z" },
  V: { width: 24.29, d: "M3.22 1.65 C4.88 1.20 6.25 2.30 6.85 4.42 C8.05 8.62 9.85 14.78 12.20 21.35 C14.62 15.78 16.58 9.70 17.62 4.30 C18.02 2.20 19.35 1.15 20.85 1.65 C22.22 2.10 22.72 3.85 22.08 5.92 C19.95 12.85 17.12 20.05 14.55 26.02 C13.72 27.95 12.10 28.75 10.88 27.62 C9.78 26.60 9.10 24.92 8.42 23.02 C6.40 17.38 3.90 10.05 2.02 5.32 C1.20 3.25 1.72 2.05 3.22 1.65 Z" },
  W: { width: 29.88, d: "M3.20 1.65 C1.65 1.85 0.95 3.05 1.45 4.95 C2.92 10.85 4.42 18.82 6.25 25.70 C6.85 27.85 8.48 28.68 9.92 27.15 C11.35 25.62 12.12 22.02 13.18 19.22 C13.82 17.50 14.78 16.32 16.02 16.42 C17.48 16.55 18.55 18.08 19.12 20.02 C19.82 22.42 20.12 24.58 21.18 26.25 C22.65 28.35 24.58 27.62 25.08 25.45 C26.55 19.05 26.75 11.35 27.82 4.35 C28.12 2.38 26.88 1.28 25.22 1.85 C23.70 2.38 23.20 4.25 22.95 6.28 C22.40 10.75 22.02 16.25 21.10 20.58 C19.72 18.35 18.28 15.82 16.18 14.78 C13.78 13.58 11.42 14.62 10.48 17.35 C9.90 19.02 9.62 21.10 9.42 22.32 C8.02 17.10 7.08 10.12 6.75 4.70 C6.62 2.50 5.05 1.40 3.20 1.65 Z" },
  X: { width: 25.42, d: "M3.10 1.42 C4.68 0.85 6.00 2.05 7.15 3.78 C8.42 5.68 10.15 7.90 12.25 10.22 C14.10 7.28 16.10 4.15 18.00 2.28 C19.52 0.80 21.38 1.20 21.92 2.72 C22.42 4.12 21.25 5.92 19.72 7.55 C17.82 9.58 16.18 11.92 14.92 14.22 C16.98 17.32 19.30 20.68 21.40 24.02 C22.58 25.90 21.75 27.78 20.05 27.62 C18.45 27.48 16.88 25.52 15.62 23.50 C14.42 21.55 13.08 19.75 11.65 18.12 C9.92 20.92 8.20 24.28 6.72 26.42 C5.50 28.18 3.52 28.75 2.58 27.38 C1.72 26.12 2.52 24.05 4.05 22.08 C5.90 19.68 7.60 16.90 8.98 14.10 C6.72 11.50 4.25 8.85 2.35 6.35 C0.98 4.55 1.40 2.02 3.10 1.42 Z" },
  Y: { width: 24.79, d: "M3.15 1.35 C1.55 1.60 0.90 3.05 1.75 4.90 C3.36 8.38 6.18 11.28 9.62 14.12 C9.58 17.62 8.55 21.65 6.40 24.95 C5.10 26.80 5.70 28.45 7.25 28.55 C8.95 28.65 10.35 26.70 11.30 24.25 C12.22 21.88 12.78 18.72 13.05 15.92 C16.22 13.35 18.82 9.58 20.80 4.40 C21.50 2.45 20.45 1.05 18.80 1.35 C17.25 1.65 16.40 3.35 15.70 5.00 C14.52 7.78 13.08 10.02 11.82 11.28 C11.30 11.80 10.60 11.78 10.05 11.25 C8.10 9.38 6.70 6.60 5.90 3.65 C5.25 2.35 4.45 1.15 3.15 1.35 Z" },
  Z: { width: 28.97, d: "M5.15 1.85 C10.52 2.35 16.68 1.18 22.60 1.72 C24.95 1.92 25.70 3.55 24.05 5.08 C20.05 8.78 15.12 14.10 10.82 19.42 C14.45 18.72 19.62 18.28 22.92 19.18 C25.38 19.85 25.72 22.35 23.55 24.52 C20.92 27.18 15.32 28.38 9.75 27.55 C5.12 26.85 1.75 25.22 1.52 23.15 C1.28 20.98 4.35 19.25 6.55 16.88 C9.55 13.65 13.20 9.98 17.25 6.70 C13.95 6.92 8.28 7.05 5.08 6.42 C2.78 5.98 1.95 4.35 2.95 3.05 C3.45 2.40 4.18 1.75 5.15 1.85 Z M8.85 22.20 C11.88 23.45 17.92 23.05 20.85 21.72 C17.35 21.22 12.15 21.32 8.85 22.20 Z" },
  "0": { width: 20.02, d: "M9.80 1.35 C14.85 1.28 17.92 5.55 17.78 13.62 C17.62 22.72 13.22 28.40 8.18 28.18 C3.30 27.98 1.08 22.65 1.35 14.92 C1.62 7.20 5.35 1.42 9.80 1.35 Z M9.62 6.35 C7.12 6.42 5.25 9.82 5.02 14.92 C4.78 20.12 6.02 23.38 8.45 23.45 C11.10 23.52 13.55 19.45 13.70 13.90 C13.85 8.75 12.25 6.28 9.62 6.35 Z" },
  "1": { width: 14.5, d: "M7.95 1.55 C9.40 1.35 10.38 2.38 10.15 4.02 C9.55 8.15 9.55 17.25 10.40 24.80 C10.62 26.82 9.48 28.18 7.75 27.82 C6.25 27.50 5.60 25.90 5.80 23.92 C6.20 19.62 6.00 12.55 5.45 7.30 C4.55 7.92 3.35 8.30 2.58 7.42 C1.72 6.42 2.35 4.92 3.82 4.02 C5.00 3.30 6.08 2.35 7.95 1.55 Z" },
  "2": { width: 22, d: "M9.80 1.42 C14.32 1.10 18.12 3.60 18.12 7.28 C18.12 10.72 14.55 13.70 10.72 16.65 C8.65 18.25 6.82 19.92 5.60 21.75 C8.65 21.18 13.65 21.08 17.02 21.80 C19.12 22.25 19.62 24.55 17.90 26.10 C15.62 28.15 8.35 28.30 3.25 27.35 C1.22 26.98 0.85 25.05 2.18 23.30 C4.20 20.62 6.80 17.75 9.55 15.25 C12.08 12.95 14.15 10.78 14.02 8.55 C13.90 6.55 11.45 5.52 8.88 6.25 C7.10 6.75 5.82 8.05 4.80 9.60 C3.68 11.28 1.95 10.92 1.55 9.25 C1.05 7.12 2.65 4.92 5.10 3.35 C6.48 2.48 8.08 1.55 9.80 1.42 Z" },
  "3": { width: 21, d: "M8.35 1.38 C13.45 1.05 17.72 3.08 17.65 6.42 C17.60 8.95 15.58 10.95 12.85 12.05 C16.30 13.02 18.45 15.55 18.15 19.25 C17.72 24.70 12.88 28.45 6.95 28.20 C3.05 28.02 0.95 26.25 1.22 23.95 C1.42 22.25 2.92 21.55 4.72 22.58 C7.85 24.38 13.10 23.00 13.48 19.92 C13.82 17.12 10.38 15.85 7.00 16.02 C4.80 16.12 3.82 14.82 4.28 13.32 C4.70 11.92 6.42 11.52 8.15 11.25 C10.88 10.82 13.15 9.32 13.02 7.82 C12.88 6.10 9.92 5.42 6.88 6.35 C4.82 6.98 3.02 6.42 2.82 4.82 C2.60 3.15 5.12 1.60 8.35 1.38 Z" },
  "4": { width: 22, d: "M14.92 1.45 C16.62 1.40 17.40 2.85 17.00 5.02 C16.58 7.32 16.48 10.35 16.72 13.75 C18.12 13.75 19.28 13.88 19.88 14.62 C20.72 15.65 20.02 17.38 18.38 18.05 C17.92 18.22 17.40 18.35 16.88 18.45 C17.08 20.82 17.48 23.55 17.92 25.65 C18.35 27.72 17.08 28.72 15.48 28.08 C14.05 27.52 13.35 25.92 13.18 23.85 C13.05 22.20 12.95 20.58 12.90 18.95 C9.82 19.18 5.82 18.85 3.15 17.92 C1.28 17.28 0.95 15.85 2.25 14.42 C5.25 11.08 9.22 5.90 12.20 2.80 C12.98 2.00 13.88 1.48 14.92 1.45 Z M8.05 14.25 C9.68 14.50 11.38 14.48 12.92 14.25 C12.88 12.35 12.92 10.38 13.05 8.38 C11.48 10.45 9.72 12.55 8.05 14.25 Z" },
  "5": { width: 21.5, d: "M4.88 1.92 C8.25 2.30 13.70 1.60 16.95 1.82 C19.05 1.95 19.62 3.68 18.25 5.10 C16.55 6.90 10.65 6.80 6.95 6.40 C6.52 7.82 6.35 9.35 6.42 10.72 C12.58 10.22 17.65 13.28 17.95 18.22 C18.25 23.48 13.92 28.22 7.65 28.12 C3.80 28.05 1.35 26.32 1.48 23.92 C1.58 22.10 3.08 21.42 4.78 22.55 C7.28 24.22 12.82 23.35 13.32 19.45 C13.82 15.52 8.18 14.22 4.35 16.12 C2.60 16.98 1.42 15.95 1.72 14.15 C2.22 11.02 2.30 6.45 2.20 4.30 C2.15 2.68 3.18 1.72 4.88 1.92 Z" },
  "6": { width: 21, d: "M13.25 1.62 C15.40 1.82 16.38 3.45 15.45 4.85 C14.55 6.22 12.15 5.95 10.40 6.62 C7.88 7.58 6.05 10.32 5.32 13.62 C7.15 12.08 10.10 11.28 12.72 12.00 C16.25 12.98 18.35 16.12 17.82 20.10 C17.12 25.40 12.90 28.62 7.95 28.12 C3.45 27.68 1.18 23.38 1.55 17.15 C2.12 7.78 6.88 1.05 13.25 1.62 Z M8.82 16.20 C6.65 16.22 5.18 18.25 5.45 21.08 C5.68 23.52 7.08 24.95 9.02 24.68 C11.32 24.35 13.40 22.18 13.25 19.82 C13.10 17.60 11.32 16.18 8.82 16.20 Z" },
  "7": { width: 20.5, d: "M4.10 1.72 C8.35 2.38 13.88 1.25 17.22 1.75 C19.50 2.10 19.98 3.78 18.45 5.72 C15.25 9.75 12.85 17.25 11.55 25.55 C11.20 27.75 9.62 28.72 8.10 27.72 C6.82 26.88 6.72 24.85 7.18 22.95 C8.28 18.38 10.40 11.25 13.28 6.82 C10.35 7.02 6.65 7.18 4.08 6.35 C2.22 5.75 1.50 3.95 2.25 2.82 C2.65 2.22 3.28 1.60 4.10 1.72 Z" },
  "8": { width: 21, d: "M9.85 1.28 C14.55 1.28 17.65 4.25 17.08 8.28 C16.72 10.72 15.05 12.42 12.92 13.30 C16.05 14.25 18.25 17.22 17.82 20.88 C17.25 25.82 13.20 28.62 8.02 28.20 C3.02 27.78 0.88 24.42 1.52 20.38 C1.98 17.42 3.82 15.25 6.40 14.05 C3.88 12.72 2.58 10.22 3.02 7.52 C3.60 3.85 6.05 1.28 9.85 1.28 Z M9.62 5.25 C7.92 5.25 6.82 6.48 6.78 8.25 C6.72 10.25 8.18 11.62 10.30 11.55 C12.28 11.48 13.48 10.15 13.32 8.22 C13.18 6.40 11.52 5.25 9.62 5.25 Z M8.92 16.62 C6.85 16.78 5.38 18.52 5.38 20.65 C5.38 22.98 6.95 24.40 9.25 24.28 C11.88 24.15 13.70 22.30 13.58 20.02 C13.45 17.72 11.38 16.45 8.92 16.62 Z" },
  "9": { width: 21, d: "M9.85 1.28 C14.50 1.52 17.78 5.30 17.72 11.60 C17.62 21.58 12.55 28.82 6.42 28.05 C4.12 27.75 3.15 26.10 4.15 24.68 C5.12 23.30 7.55 23.62 9.42 22.55 C11.72 21.22 13.02 18.45 13.55 15.20 C11.80 16.75 8.70 17.32 6.05 16.35 C2.72 15.15 1.10 12.12 1.55 8.72 C2.20 3.95 5.58 1.05 9.85 1.28 Z M9.62 5.12 C7.40 5.15 5.68 6.78 5.62 9.18 C5.55 11.50 7.05 13.05 9.35 13.18 C11.78 13.32 13.48 11.72 13.38 9.12 C13.28 6.72 11.85 5.08 9.62 5.12 Z" },
  " ": { width: 10, d: "" },
  "!": { width: 10, d: "M5.12 1.58 C6.75 1.38 7.78 2.38 7.45 4.28 C6.82 7.85 6.48 13.65 6.72 17.92 C6.82 19.85 5.85 20.95 4.55 20.60 C3.35 20.28 2.92 18.92 3.05 17.18 C3.38 12.95 3.10 7.15 2.65 4.18 C2.38 2.45 3.45 1.78 5.12 1.58 Z M5.00 23.02 C6.72 23.00 7.85 24.10 7.65 25.82 C7.45 27.48 5.90 28.58 4.25 28.20 C2.78 27.88 2.10 26.52 2.58 25.05 C3.00 23.78 3.75 23.05 5.00 23.02 Z" },
  "?": { width: 19, d: "M8.95 1.52 C13.28 1.28 16.85 3.85 16.78 7.52 C16.72 10.25 14.82 11.90 12.22 13.62 C10.48 14.78 9.72 16.00 9.85 17.70 C9.98 19.40 8.85 20.42 7.48 20.05 C6.25 19.72 5.78 18.35 5.95 16.75 C6.25 13.90 8.08 11.85 10.45 10.22 C12.25 8.98 12.92 7.60 12.32 6.48 C11.58 5.10 8.82 5.28 6.95 6.92 C5.52 8.20 3.82 7.78 3.35 6.25 C2.75 4.35 5.50 1.72 8.95 1.52 Z M8.02 23.02 C9.75 22.98 10.85 24.15 10.62 25.88 C10.40 27.45 8.90 28.55 7.25 28.15 C5.80 27.82 5.18 26.48 5.65 25.05 C6.05 23.82 6.82 23.05 8.02 23.02 Z" },
  ".": { width: 9, d: "M4.80 23.02 C6.55 23.05 7.62 24.18 7.38 25.82 C7.12 27.52 5.58 28.55 3.95 28.18 C2.48 27.85 1.85 26.48 2.35 25.02 C2.78 23.80 3.55 23.00 4.80 23.02 Z" },
  ",": { width: 10, d: "M5.35 22.35 C7.05 22.48 7.88 23.80 7.25 25.55 C6.58 27.45 4.75 29.22 2.65 30.05 C1.85 30.35 1.12 29.72 1.55 28.98 C2.22 27.82 2.85 26.85 3.12 25.85 C2.22 25.25 2.05 24.05 2.72 23.10 C3.28 22.32 4.25 22.25 5.35 22.35 Z" },
  ":": { width: 9.5, d: "M4.92 9.35 C6.42 9.35 7.38 10.38 7.18 11.82 C6.98 13.25 5.62 14.12 4.20 13.82 C2.92 13.55 2.35 12.38 2.78 11.08 C3.12 10.02 3.82 9.35 4.92 9.35 Z M4.92 22.92 C6.50 22.92 7.45 24.02 7.18 25.58 C6.92 27.05 5.52 28.02 4.02 27.65 C2.72 27.32 2.20 26.15 2.70 24.90 C3.10 23.85 3.78 22.92 4.92 22.92 Z" },
  ";": { width: 10, d: "M5.02 9.35 C6.50 9.35 7.45 10.38 7.25 11.82 C7.05 13.25 5.68 14.12 4.25 13.82 C2.95 13.55 2.42 12.38 2.85 11.08 C3.22 10.02 3.88 9.35 5.02 9.35 Z M5.35 22.35 C7.05 22.48 7.88 23.80 7.25 25.55 C6.58 27.45 4.75 29.22 2.65 30.05 C1.85 30.35 1.12 29.72 1.55 28.98 C2.22 27.82 2.85 26.85 3.12 25.85 C2.22 25.25 2.05 24.05 2.72 23.10 C3.28 22.32 4.25 22.25 5.35 22.35 Z" },
  "'": { width: 7.5, d: "M4.20 1.65 C5.65 1.75 6.32 2.78 5.88 4.25 C5.45 5.72 4.45 7.35 3.00 8.52 C2.25 9.12 1.48 8.45 1.88 7.62 C2.38 6.58 2.72 5.58 2.78 4.72 C1.98 4.25 1.75 3.15 2.32 2.35 C2.72 1.82 3.38 1.60 4.20 1.65 Z" },
  "\"": { width: 13, d: "M4.20 1.65 C5.65 1.75 6.32 2.78 5.88 4.25 C5.45 5.72 4.45 7.35 3.00 8.52 C2.25 9.12 1.48 8.45 1.88 7.62 C2.38 6.58 2.72 5.58 2.78 4.72 C1.98 4.25 1.75 3.15 2.32 2.35 C2.72 1.82 3.38 1.60 4.20 1.65 Z M9.82 1.65 C11.25 1.75 11.92 2.78 11.48 4.25 C11.05 5.72 10.05 7.35 8.60 8.52 C7.85 9.12 7.08 8.45 7.48 7.62 C7.98 6.58 8.32 5.58 8.38 4.72 C7.58 4.25 7.35 3.15 7.92 2.35 C8.32 1.82 8.98 1.60 9.82 1.65 Z" },
  "-": { width: 15, d: "M3.05 13.05 C5.72 12.55 9.70 12.45 12.38 12.92 C14.02 13.20 14.38 14.72 13.12 15.75 C11.55 17.05 5.62 17.18 2.72 16.30 C1.32 15.88 1.20 14.05 3.05 13.05 Z" },
  "_": { width: 17, d: "M3.00 25.10 C6.25 24.45 11.22 24.45 14.42 25.12 C16.02 25.45 16.10 27.12 14.72 27.98 C12.82 29.18 5.05 29.10 2.35 28.12 C1.12 27.65 1.38 25.85 3.00 25.10 Z" },
  "/": { width: 16, d: "M12.55 1.38 C14.02 1.02 14.92 2.25 14.18 4.02 C11.20 11.10 8.05 19.02 5.38 26.28 C4.65 28.25 3.02 28.85 1.92 27.72 C0.98 26.75 1.55 24.72 2.38 23.05 C5.28 17.20 8.42 8.90 10.55 3.32 C11.02 2.08 11.55 1.62 12.55 1.38 Z" },
  "\\": { width: 16, d: "M3.48 1.38 C4.48 1.62 5.02 2.08 5.48 3.32 C7.62 8.90 10.75 17.20 13.65 23.05 C14.48 24.72 15.05 26.75 14.12 27.72 C13.02 28.85 11.38 28.25 10.65 26.28 C7.98 19.02 4.82 11.10 1.85 4.02 C1.10 2.25 2.02 1.02 3.48 1.38 Z" },
  "+": { width: 18, d: "M8.90 4.05 C10.45 3.88 11.38 4.82 11.20 6.38 C11.05 7.72 10.95 9.45 10.98 11.30 C12.85 11.12 14.75 11.18 15.82 11.58 C17.20 12.10 17.35 13.75 16.10 14.82 C15.05 15.72 13.05 16.05 11.05 15.95 C11.15 18.12 11.45 20.25 11.75 21.78 C12.12 23.58 10.98 24.75 9.48 24.35 C8.05 23.95 7.55 22.35 7.55 20.65 C7.55 19.38 7.50 17.78 7.42 16.18 C5.28 16.45 3.18 16.35 2.18 15.55 C1.02 14.65 1.48 12.82 2.95 12.25 C4.05 11.82 5.62 11.65 7.25 11.55 C7.12 9.52 6.95 7.70 6.75 6.52 C6.45 4.75 7.28 4.22 8.90 4.05 Z" },
  "*": { width: 18, d: "M8.70 3.00 C9.85 2.82 10.62 3.72 10.42 5.02 L9.95 8.32 L12.95 5.92 C14.05 5.05 15.35 5.48 15.42 6.72 C15.48 7.72 14.30 8.72 12.92 9.52 L10.62 10.82 L13.45 11.95 C15.18 12.65 15.80 13.95 14.98 15.05 C14.15 16.18 12.58 15.60 11.35 14.50 L9.42 12.75 L8.62 16.10 C8.28 17.48 7.02 18.18 5.98 17.48 C5.05 16.85 5.22 15.42 6.05 14.18 L7.65 11.82 L4.25 12.42 C2.90 12.65 1.95 11.82 2.12 10.65 C2.28 9.52 3.52 9.08 4.98 9.15 L7.58 9.28 L5.62 6.55 C4.75 5.35 5.05 4.05 6.15 3.68 C7.00 3.40 7.92 4.10 8.55 5.18 Z" },
  "#": { width: 22, d: "M7.10 3.45 C8.58 3.22 9.38 4.20 8.98 5.82 L8.18 9.05 C9.55 8.90 10.92 8.80 12.28 8.75 L13.10 5.08 C13.45 3.52 14.70 2.90 15.78 3.65 C16.72 4.32 16.55 5.80 15.98 7.20 L15.45 8.55 C16.70 8.58 17.82 8.82 18.45 9.38 C19.38 10.20 18.82 11.75 17.48 12.42 C16.70 12.80 15.58 12.98 14.38 13.05 L13.55 16.25 C15.32 16.32 16.92 16.58 17.62 17.25 C18.55 18.12 17.92 19.72 16.52 20.35 C15.45 20.82 13.98 20.92 12.50 20.85 L11.70 24.08 C11.28 25.82 9.92 26.55 8.92 25.65 C8.05 24.88 8.38 23.38 8.98 21.98 L9.55 20.62 C8.25 20.50 6.92 20.42 5.68 20.35 L4.95 23.35 C4.52 25.12 3.12 25.80 2.18 24.78 C1.38 23.88 1.82 22.45 2.35 21.05 L2.72 20.08 C1.52 19.80 0.85 19.12 1.12 18.12 C1.42 17.05 2.58 16.58 4.05 16.40 L4.95 12.92 C3.42 12.78 2.25 12.45 1.88 11.62 C1.35 10.45 2.48 9.42 4.02 9.20 C4.62 9.12 5.28 9.08 5.98 9.05 L6.72 5.65 C6.92 4.68 6.28 3.60 7.10 3.45 Z M7.22 13.02 L6.52 16.22 C7.80 16.12 9.15 16.12 10.45 16.18 L11.18 13.02 C9.85 12.95 8.48 12.95 7.22 13.02 Z" },
  "$": { width: 20, d: "M9.75 0.92 C11.05 0.80 11.82 1.60 11.72 2.82 L11.58 4.20 C14.85 4.82 17.02 6.70 16.75 8.85 C16.52 10.58 14.85 11.22 12.85 10.08 C12.22 9.72 11.58 9.45 10.92 9.25 L10.52 13.02 C14.32 14.30 17.62 16.42 17.12 20.58 C16.70 24.22 13.82 26.90 10.10 27.65 L9.90 29.08 C9.72 30.42 8.52 30.95 7.60 30.10 C7.10 29.62 6.95 28.75 7.12 27.75 C3.68 27.35 1.35 25.58 1.30 23.32 C1.25 21.55 2.78 20.98 4.58 22.05 C5.60 22.68 6.68 23.02 7.72 23.15 L8.15 18.12 C4.48 16.75 2.15 14.85 2.42 11.35 C2.68 7.82 5.42 5.05 9.00 4.28 L9.10 2.65 C9.15 1.68 9.22 0.98 9.75 0.92 Z M7.05 11.05 C6.92 12.22 7.55 13.02 8.55 13.62 L8.92 8.88 C7.85 9.22 7.18 10.00 7.05 11.05 Z M10.15 23.02 C11.48 22.48 12.32 21.52 12.38 20.35 C12.45 19.22 11.68 18.42 10.45 17.78 Z" },
  "%": { width: 25, d: "M6.82 2.22 C9.52 2.22 11.10 4.42 10.58 7.42 C10.05 10.45 7.75 12.72 5.12 12.35 C2.60 11.98 1.45 9.52 2.05 6.52 C2.60 3.75 4.35 2.22 6.82 2.22 Z M20.35 2.82 C21.92 2.48 22.82 3.78 21.80 5.45 C17.92 11.80 13.42 19.48 9.52 26.02 C8.58 27.60 6.98 28.08 6.08 27.05 C5.28 26.12 6.05 24.50 7.02 23.25 C11.12 17.92 15.92 9.48 18.58 4.45 C19.10 3.45 19.55 2.98 20.35 2.82 Z M6.32 5.15 C5.35 5.15 4.75 6.00 4.62 7.08 C4.45 8.32 5.08 9.18 6.02 9.18 C7.02 9.18 7.75 8.22 7.80 7.05 C7.85 5.90 7.22 5.15 6.32 5.15 Z M18.95 17.18 C21.65 17.18 23.22 19.38 22.72 22.38 C22.20 25.42 19.88 27.70 17.25 27.32 C14.75 26.95 13.58 24.48 14.20 21.48 C14.75 18.72 16.48 17.18 18.95 17.18 Z M18.45 20.12 C17.48 20.12 16.88 20.98 16.75 22.05 C16.58 23.30 17.22 24.15 18.15 24.15 C19.15 24.15 19.88 23.20 19.92 22.02 C20.00 20.88 19.35 20.12 18.45 20.12 Z" },
  "&": { width: 25, d: "M11.02 1.30 C14.85 1.25 17.62 3.45 17.35 6.55 C17.12 9.22 14.70 11.08 11.62 12.85 C12.98 14.38 14.55 16.00 16.18 17.52 C16.82 16.35 17.35 15.18 17.78 14.08 C18.55 12.08 20.28 11.40 21.42 12.45 C22.45 13.38 21.98 15.32 20.78 17.35 C20.25 18.25 19.62 19.18 18.90 20.08 C20.05 20.98 21.20 21.72 22.28 22.22 C24.12 23.08 24.45 24.92 23.10 25.85 C21.88 26.72 19.75 26.05 17.88 24.80 C17.15 24.32 16.42 23.78 15.68 23.20 C13.52 26.00 10.78 28.18 7.35 28.18 C3.20 28.18 0.90 25.45 1.35 21.60 C1.72 18.45 4.08 16.22 7.18 14.35 C5.72 12.25 4.98 10.15 5.35 7.95 C5.98 4.10 8.20 1.35 11.02 1.30 Z M10.85 5.05 C9.70 5.08 8.85 6.18 8.80 7.55 C8.75 8.75 9.28 9.95 10.15 11.18 C12.02 10.02 13.35 8.75 13.45 7.45 C13.55 6.10 12.42 5.02 10.85 5.05 Z M8.88 17.35 C6.95 18.68 5.78 20.05 5.70 21.65 C5.60 23.38 6.78 24.42 8.62 24.30 C10.25 24.18 11.72 23.02 13.02 21.35 C11.52 20.05 10.12 18.65 8.88 17.35 Z" },
  "@": { width: 29, d: "M14.82 1.28 C22.28 1.32 27.35 6.78 27.08 14.10 C26.82 21.35 21.78 27.92 13.72 28.25 C6.00 28.58 0.95 23.78 1.30 16.08 C1.65 8.55 7.58 1.22 14.82 1.28 Z M14.75 4.95 C9.82 4.92 5.58 9.92 5.25 15.80 C4.98 20.92 8.18 24.65 13.80 24.42 C19.22 24.20 22.98 19.92 23.25 14.48 C23.52 9.18 19.72 5.00 14.75 4.95 Z M15.55 9.02 C17.22 9.05 18.42 9.90 18.78 11.10 C19.25 10.38 20.18 10.38 20.65 11.12 C21.18 11.98 20.65 14.28 20.50 15.88 C20.35 17.42 20.70 18.22 21.52 18.02 C22.28 17.82 22.72 19.02 21.82 19.98 C20.78 21.10 18.95 21.02 17.90 19.75 C16.88 20.82 15.52 21.48 13.82 21.20 C10.98 20.75 9.62 18.08 10.20 15.02 C10.78 11.92 12.85 8.98 15.55 9.02 Z M15.18 12.28 C13.98 12.32 13.05 13.75 12.92 15.50 C12.78 17.12 13.45 18.12 14.62 18.08 C15.85 18.05 16.85 16.72 16.95 14.92 C17.05 13.32 16.35 12.25 15.18 12.28 Z" },
  "(": { width: 13, d: "M9.82 1.52 C11.10 1.32 11.90 2.38 11.20 4.05 C8.75 9.82 8.45 18.60 11.30 25.28 C12.05 27.02 11.18 28.38 9.65 28.18 C7.98 27.95 6.28 25.52 5.05 21.75 C2.92 15.28 3.72 8.18 6.22 4.20 C7.28 2.52 8.35 1.72 9.82 1.52 Z" },
  ")": { width: 13, d: "M3.18 1.52 C4.65 1.72 5.72 2.52 6.78 4.20 C9.28 8.18 10.08 15.28 7.95 21.75 C6.72 25.52 5.02 27.95 3.35 28.18 C1.82 28.38 0.95 27.02 1.70 25.28 C4.55 18.60 4.25 9.82 1.80 4.05 C1.10 2.38 1.90 1.32 3.18 1.52 Z" },
};

function normalizeInkySoftText(value: string) {
  const normalized = value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .toUpperCase()
    .split('')
    .filter((character) => inkySoftGlyphs[character])
    .join('')
    .trim()
    .slice(0, 16);
  return normalized || 'PLAYFUL!';
}

function InkySoftTypeface({
  text,
  colors,
  typeCase,
  density,
  scale,
  grain,
  contrast,
  shape,
}: {
  text: string;
  colors: readonly string[];
  typeCase: PlayfulTemplateProps['typeCase'];
  density: number;
  scale: number;
  grain: number;
  contrast: number;
  shape: number;
}) {
  const [ink = '#111111', paper = '#F8F7F2', _mid = '#CE245E', dark = '#111111'] = colors;
  const displayText = normalizeInkySoftText(typeCase === 'lowercase' ? text.toLowerCase() : text);
  const displayLetters = displayText.split('');
  const gap = Math.max(1.6, 4.8 - density / 3);
  const totalWidth = displayLetters.reduce((sum, letter) => sum + (inkySoftGlyphs[letter]?.width ?? 20) + gap, -gap);
  const usableWidth = 124;
  const glyphScale = Math.min(0.9, (usableWidth / Math.max(1, totalWidth)) * (0.82 + scale / 132));
  const startX = 80 - (totalWidth * glyphScale) / 2;
  const edgeDepth = mixHex(ink, dark, 0.16);
  const softHighlight = mixHex(ink, paper, 0.1);
  let cursor = 0;

  return (
    <svg viewBox="0 0 160 54" preserveAspectRatio="xMidYMid meet" role="img" aria-label={displayText} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
      {displayLetters.map((letter, index) => {
        const glyph = inkySoftGlyphs[letter] ?? inkySoftGlyphs.O;
        const glyphCursor = cursor;
        const seedValue = index * 23.7 + shape + grain;
        const x = startX + glyphCursor * glyphScale + (seeded(seedValue) - 0.5) * (shape / 45);
        const y = 11.5 + (seeded(seedValue + 2) - 0.5) * 1.8;
        const rotate = (seeded(seedValue + 4) - 0.5) * (shape / 18);
        const highlightOpacity = 0.04 + seeded(seedValue + 12) * 0.05;
        cursor += glyph.width + gap;
        if (!glyph.d) return null;

        return (
          <g key={letter + '-' + index} transform={'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + rotate.toFixed(2) + ' ' + (glyph.width / 2).toFixed(2) + ' 16) scale(' + glyphScale.toFixed(3) + ')'}>
            <path d={glyph.d} fill={edgeDepth} fillRule="evenodd" opacity={0.16 + contrast / 3000} transform="translate(.28 .34)" shapeRendering="geometricPrecision" />
            <path d={glyph.d} fill={ink} fillRule="evenodd" stroke={ink} strokeWidth={0.38 + shape / 340} strokeLinecap="round" strokeLinejoin="round" opacity={0.9 + contrast / 900} shapeRendering="geometricPrecision" />
            <path
              d={glyph.d}
              fill="none"
              stroke={softHighlight}
              strokeWidth={0.18}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={highlightOpacity}
              transform={'translate(' + (-0.16 - seeded(seedValue + 13) * 0.12).toFixed(2) + ' ' + (-0.18 - seeded(seedValue + 14) * 0.1).toFixed(2) + ')'}
              shapeRendering="geometricPrecision"
            />
          </g>
        );
      })}
    </svg>
  );
}

function Typeface({ preset, text, color, colors, typeCase, density, scale, grain, contrast, shape, seed }: PlayfulTemplateProps & { preset: string }) {
  const copy = templateText(text, typeCase);
  const primary = color ?? colors?.[0] ?? "#111111";
  const d = clamp(density, 8, 1, 20);
  const s = clamp(scale, 22, 1, 80);
  const g = clamp(grain, 24, 0, 100);
  const k = clamp(contrast, 70, 0, 100);
  const sh = clamp(shape, 54, 0, 100);

  if (preset === "marker-alphabet-typeface") return <MarkerAlphabetTypeface text={copy} color={primary} seed={seed} style={{ width: "100%" }} />;
  if (preset === "stick-pen-typeface") {
    return (
      <StickPenTypeface
        text={copy}
        color={primary}
        density={density}
        scale={scale}
        grain={grain}
        contrast={contrast}
        shape={shape}
        seed={seed}
        style={{ width: "100%" }}
      />
    );
  }
  if (preset === "charm-bead-typeface") {
    return (
      <CharmBeadTypeface
        text={copy}
        color={primary}
        density={density}
        scale={scale}
        grain={grain}
        contrast={contrast}
        shape={shape}
        style={{ width: "100%" }}
      />
    );
  }

  if (preset === "honey-typeface") {
    return (
      <InkySoftTypeface
        text={copy}
        colors={[primary, colors?.[1] ?? "#F8F7F2", colors?.[2] ?? "#CE245E", colors?.[3] ?? "#111111"]}
        typeCase={typeCase}
        density={d}
        scale={s}
        grain={g}
        contrast={k}
        shape={sh}
      />
    );
  }

  const chars = copy.split("");
  const baseSize = Math.max(26, Math.min(72, s * 2));

  if (preset === "bead-typeface") {
    const bead = Math.max(30, baseSize * 0.78);
    const gap = bead * 0.16;
    const visible = chars.filter((char) => char !== " ");
    const width = chars.reduce((sum, char) => sum + (char === " " ? bead * 0.6 : bead + gap), 8);
    let x = 6;
    return (
      <svg viewBox={`0 0 ${width} ${bead + 12}`} role="img" aria-label={copy} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
        <defs>
          <linearGradient id="beadStroke" x1="0" x2="1"><stop offset="0" stopColor="#111" /><stop offset="1" stopColor="#444" /></linearGradient>
        </defs>
        {chars.map((char, i) => {
          if (char === " ") {
            x += bead * 0.58;
            return null;
          }
          const y = 6 + (seeded(i + 2) - 0.5) * 3;
          const rot = (seeded(i + 10) - 0.5) * 5;
          const node = (
            <g key={`${char}-${i}`} transform={`translate(${x} ${y}) rotate(${rot.toFixed(2)} ${bead / 2} ${bead / 2})`}>
              <circle cx={bead / 2} cy={bead / 2} r={bead / 2 - 2} fill={primary} stroke="url(#beadStroke)" strokeWidth={2.5} />
              <text x={bead / 2} y={bead * 0.63} textAnchor="middle" fontFamily="Arial Rounded MT Bold, Arial, sans-serif" fontWeight="800" fontSize={bead * 0.5} fill={readableOn(primary)}>{char}</text>
            </g>
          );
          x += bead + gap;
          return node;
        })}
        {visible.length ? null : <text x="0" y="20">{copy}</text>}
      </svg>
    );
  }

  if (preset === "heart-matrix-typeface") return <MatrixTypeface text={copy} color={primary} shape="heart" scale={s / 20} />;
  if (preset === "print-dot-typeface") return <MatrixTypeface text={copy} color={primary} shape="dot" scale={s / 20} />;

  if (preset === "ransom-note-typeface") {
    let x = 2;
    return (
      <svg viewBox={`0 0 ${Math.max(120, chars.length * baseSize * 0.72)} 70`} role="img" aria-label={copy} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
        {chars.map((char, i) => {
          const w = char === " " ? baseSize * 0.42 : baseSize * (0.52 + seeded(i) * 0.26);
          const h = baseSize * (0.72 + seeded(i + 1) * 0.22);
          const node = char === " " ? null : (
            <g key={`${char}-${i}`} transform={`translate(${x} ${10 + seeded(i + 4) * 8}) rotate(${(seeded(i + 8) - 0.5) * 6})`}>
              <rect width={w} height={h} fill={colors?.[(i % Math.max(1, colors.length))] ?? "#F7F2BF"} />
              <text x={w / 2} y={h * 0.72} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize={h * 0.62} fill={readableOn(colors?.[i % (colors?.length || 1)] ?? "#F7F2BF")}>{char}</text>
            </g>
          );
          x += w + 3;
          return node;
        })}
      </svg>
    );
  }

  const family = preset === "playful-blocks-typeface" ? "Arial Black, Arial, sans-serif" : "Arial Rounded MT Bold, Arial, sans-serif";
  const filter = preset === "knit-typeface" || preset === "cross-stitch-lined-typeface" ? "url(#thread)" : preset === "connected-oval-typeface" ? "url(#smear)" : undefined;
  const stroke = preset === "cross-stitch-lined-typeface" ? primary : "none";

  return (
    <svg viewBox="0 0 620 120" role="img" aria-label={copy} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <filter id="thread"><feGaussianBlur stdDeviation=".35" /></filter>
        <filter id="smear"><feGaussianBlur stdDeviation={Math.max(0, g / 16)} /></filter>
      </defs>
      <text x="16" y="78" fontFamily={family} fontSize={baseSize} fontWeight="900" fill={primary} stroke={stroke} strokeWidth={preset === "cross-stitch-lined-typeface" ? 1.6 : 0} filter={filter} letterSpacing={preset === "connected-oval-typeface" ? 2 : 0}>
        {copy}
      </text>
      {preset === "knit-typeface" || preset === "cross-stitch-lined-typeface" ? (
        <g opacity={0.48}>
          {Array.from({ length: Math.round(d * 8) }).map((_, i) => {
            const x = 18 + i * 7;
            return <path key={i} d={`M${x} 26 L${x + 4} 34 L${x + 8} 26`} fill="none" stroke={primary} strokeWidth={1 + k / 80} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
    </svg>
  );
}

const matrix: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["111", "010", "010", "010", "010", "010", "111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "01010", "00100", "00100", "00100", "01010", "10001"],
  Y: ["10001", "01010", "00100", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00010", "00100", "00100", "01000", "10000", "11111"],
  "!": ["1", "1", "1", "1", "0", "0", "1"],
  "?": ["1110", "0001", "0001", "0110", "0100", "0000", "0100"],
  "'": ["1", "1", "0", "0", "0", "0", "0"],
  "’": ["1", "1", "0", "0", "0", "0", "0"],
  "\"": ["101", "101", "000", "000", "000", "000", "000"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
  ",": ["0", "0", "0", "0", "0", "1", "1"],
  ":": ["0", "1", "0", "0", "0", "1", "0"],
  ";": ["0", "1", "0", "0", "0", "1", "1"],
  "-": ["000", "000", "000", "111", "000", "000", "000"],
  "+": ["000", "010", "010", "111", "010", "010", "000"],
  "&": ["0110", "1001", "1010", "0100", "1010", "1001", "0111"],
  "/": ["001", "001", "010", "010", "100", "100", "000"],
};

function MatrixTypeface({ text, color, shape, scale }: { text: string; color: string; shape: "heart" | "dot"; scale: number }) {
  const chars = text.toUpperCase().split("");
  const cell = 8 * scale;
  const gap = 1.8 * scale;
  let x = 2;
  const width = chars.reduce((sum, char) => sum + ((matrix[char]?.[0]?.length ?? 3) + 1) * (cell + gap), 12);
  return (
    <svg viewBox={`0 0 ${width} ${cell * 8.5}`} role="img" aria-label={text} style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
      {chars.map((char, idx) => {
        if (char === " ") {
          x += cell * 3;
          return null;
        }
        const rows = matrix[char] ?? matrix["?"];
        const node = (
          <g key={`${char}-${idx}`} transform={`translate(${x} ${cell * 0.7})`}>
            {rows.map((row, y) =>
              row.split("").map((bit, col) => {
                if (bit !== "1") return null;
                const cx = col * (cell + gap);
                const cy = y * (cell + gap);
                return shape === "heart" ? (
                  <path key={`${y}-${col}`} d={`M${cx + cell / 2} ${cy + cell * 0.85} C${cx - cell * 0.2} ${cy + cell * 0.34} ${cx + cell * 0.12} ${cy - cell * 0.18} ${cx + cell / 2} ${cy + cell * 0.22} C${cx + cell * 0.88} ${cy - cell * 0.18} ${cx + cell * 1.2} ${cy + cell * 0.34} ${cx + cell / 2} ${cy + cell * 0.85} Z`} fill={color} />
                ) : (
                  <circle key={`${y}-${col}`} cx={cx + cell / 2} cy={cy + cell / 2} r={cell * 0.42} fill={color} />
                );
              })
            )}
          </g>
        );
        x += (rows[0].length + 1) * (cell + gap);
        return node;
      })}
    </svg>
  );
}

function readableOn(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  const int = Number.parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return r * 0.299 + g * 0.587 + b * 0.114 > 156 ? "#111111" : "#ffffff";
}

export function SvgPatternTemplate(props: PlayfulTemplateProps) {
  const {
    preset: _preset,
    text: _text,
    typeCase: _typeCase,
    image: _image,
    color: _color,
    colors: _colors,
    density: _density,
    scale: _scale,
    grain: _grain,
    contrast: _contrast,
    shape: _shape,
    seed: _seed,
    children: _children,
    style,
    ...divProps
  } = props;
  const preset = canonical(props.preset);
  const isTypeface =
    preset.includes("typeface") ||
    preset === "knit-typeface" ||
    preset === "honey-typeface" ||
    preset === "cross-stitch-lined-typeface";

  return (
    <div {...divProps} style={surfaceStyle(style)}>
      {isTypeface ? (
        <div style={{ position: "absolute", inset: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typeface {...props} preset={preset} />
        </div>
      ) : (
        <PatternBackground {...props} preset={preset} />
      )}
    </div>
  );
}

export function TextureTemplate(props: PlayfulTemplateProps) {
  const {
    preset: _preset,
    text: _text,
    typeCase: _typeCase,
    image: _image,
    color: _color,
    colors: _colors,
    density: _density,
    scale: _scale,
    grain: _grain,
    contrast: _contrast,
    shape: _shape,
    seed: _seed,
    children: _children,
    style,
    ...divProps
  } = props;
  const preset = canonical(props.preset);
  return (
    <div {...divProps} style={surfaceStyle(style)}>
      <TextureBackground {...props} preset={preset} />
    </div>
  );
}

export function ImagePatternTemplate(props: PlayfulTemplateProps) {
  return <TextureTemplate {...props} />;
}

export function FrameTemplate({
  preset = "torn-paper",
  children,
  image,
  color,
  colors,
  density,
  scale,
  grain,
  contrast,
  shape,
  seed,
  text: _text,
  typeCase: _typeCase,
  style,
  ...props
}: PlayfulTemplateProps) {
  const resolved = canonical(preset);
  const content = children ?? <div style={imageLayer(image)} />;

  if (resolved === "torn-paper") {
    return (
      <TornPaperFrame
        {...props}
        paperColor={color ?? colors?.[0] ?? "#ffffff"}
        density={density}
        scale={scale}
        grain={grain}
        contrast={contrast}
        tearShape={shape}
        edgeSeed={seed}
        style={surfaceStyle(style)}
      >
        <div style={{ position: "absolute", inset: 12 }}>{content}</div>
      </TornPaperFrame>
    );
  }

  if (resolved === "stamp-frame") {
    return (
      <div {...props} style={{ ...surfaceStyle(style), padding: 18, background: color ?? colors?.[0] ?? "#f5d4df", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.18))" }}>
        <div style={{ position: "absolute", inset: 10, border: "10px dotted rgba(17,17,17,.5)", borderRadius: 4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 30, overflow: "hidden" }}>{content}</div>
      </div>
    );
  }

  if (resolved === "ios-desktop-frame") {
    return (
      <div {...props} style={{ ...surfaceStyle(style), background: "#dfe6ef", padding: 18 }}>
        <div style={{ position: "absolute", inset: 18, borderRadius: 12, background: "#f6f6f4", boxShadow: "0 18px 38px rgba(0,0,0,.16)", overflow: "hidden" }}>{content}</div>
        <div style={{ position: "absolute", top: 24, left: 28, right: 28, height: 18, borderRadius: 999, background: "#ececec" }} />
      </div>
    );
  }

  return (
    <div {...props} style={surfaceStyle(style)}>
      <div style={{ position: "absolute", inset: 0, background: "#f6f3ee" }} />
      {Array.from({ length: Math.round(clamp(density, 5, 1, 8)) }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${8 + seeded(i) * 50}%`,
            top: `${8 + seeded(i + 3) * 58}%`,
            width: `${34 + seeded(i + 5) * 22}%`,
            aspectRatio: "4/5",
            padding: "4% 4% 11%",
            background: "#fff",
            boxShadow: "0 6px 16px rgba(0,0,0,.18)",
            transform: `rotate(${(seeded(i + 7) - 0.5) * 16}deg)`,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>{content}</div>
        </div>
      ))}
    </div>
  );
}
