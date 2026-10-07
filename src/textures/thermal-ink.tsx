import { useId, type HTMLAttributes } from "react";

type ThermalInkTextureProps = HTMLAttributes<HTMLDivElement> & {
  image?: string;
  color?: string;
  intensity?: number;
  grain?: number;
};

function uid(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function ThermalInkTexture({
  image,
  color = "#00A8D7",
  intensity = 1,
  grain = 0.22,
  style,
  ...props
}: ThermalInkTextureProps) {
  const rawId = uid(useId());
  const opacity = Math.max(0.35, Math.min(1, intensity));
  const noise = Math.max(0, Math.min(0.5, grain));

  return (
    <div
      {...props}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        background: color,
        ...style,
      }}
    >
      {image ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(1) contrast(1.2) brightness(.48)",
            opacity: 0.72,
          }}
        />
      ) : null}
      {image ? (
        <svg
          viewBox="0 0 160 80"
          preserveAspectRatio="none"
          aria-hidden
          style={{ position: "absolute", inset: "-2%", width: "104%", height: "104%", display: "block" }}
        >
          <defs>
            <filter id={`${rawId}-cold`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0 0 .14 .72 1" />
                <feFuncG type="table" tableValues="0 0 .14 .72 1" />
                <feFuncB type="table" tableValues="0 0 .14 .72 1" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation=".34" />
            </filter>
            <filter id={`${rawId}-green`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0 .06 .9 .34 0" />
                <feFuncG type="table" tableValues="0 .06 .9 .34 0" />
                <feFuncB type="table" tableValues="0 .06 .9 .34 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation=".4" />
            </filter>
            <filter id={`${rawId}-warm`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0 .34 1 .54 0" />
                <feFuncG type="table" tableValues="0 .34 1 .54 0" />
                <feFuncB type="table" tableValues="0 .34 1 .54 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation=".36" />
            </filter>
            <filter id={`${rawId}-hot`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="1 .94 .34 .06 0" />
                <feFuncG type="table" tableValues="1 .94 .34 .06 0" />
                <feFuncB type="table" tableValues="1 .94 .34 .06 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation=".3" />
            </filter>
            <filter id={`${rawId}-edge-source`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" result="gray" />
              <feConvolveMatrix in="gray" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" bias=".42" result="edge" />
              <feComponentTransfer in="edge">
                <feFuncR type="gamma" amplitude="1.1" exponent=".58" offset="-.04" />
                <feFuncG type="gamma" amplitude="1.1" exponent=".58" offset="-.04" />
                <feFuncB type="gamma" amplitude="1.1" exponent=".58" offset="-.04" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation=".18" />
            </filter>
            <filter id={`${rawId}-field-soft`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={0.018 + noise * 0.035} numOctaves="2" seed="41" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.1 + opacity * 1.4} xChannelSelector="R" yChannelSelector="G" result="warped" />
              <feGaussianBlur in="warped" stdDeviation=".44" />
            </filter>
            {["cold", "green", "warm", "hot", "edge"].map((band) => (
              <mask key={band} id={`${rawId}-${band}-mask`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" mask-type="luminance">
                <rect width="160" height="80" fill="black" />
                <image
                  href={image}
                  x="-8"
                  y="-5"
                  width="176"
                  height="90"
                  preserveAspectRatio="xMidYMid slice"
                  filter={`url(#${rawId}-${band === "edge" ? "edge-source" : band})`}
                />
              </mask>
            ))}
            <linearGradient id={`${rawId}-cold-ramp`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#001CFF" />
              <stop offset="42%" stopColor="#00D7FF" />
              <stop offset="100%" stopColor="#00FFB3" />
            </linearGradient>
            <linearGradient id={`${rawId}-green-ramp`} x1="12%" y1="0%" x2="88%" y2="100%">
              <stop offset="0%" stopColor="#00D7FF" />
              <stop offset="44%" stopColor="#39FF45" />
              <stop offset="100%" stopColor="#FFF600" />
            </linearGradient>
            <linearGradient id={`${rawId}-warm-ramp`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF93A" />
              <stop offset="42%" stopColor="#FF8A00" />
              <stop offset="100%" stopColor="#FF1E2F" />
            </linearGradient>
            <linearGradient id={`${rawId}-hot-ramp`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="18%" stopColor="#FFF600" />
              <stop offset="42%" stopColor="#FF1E2F" />
              <stop offset="72%" stopColor="#D600FF" />
              <stop offset="100%" stopColor="#001CFF" />
            </linearGradient>
          </defs>
          <rect width="160" height="80" fill={color} opacity=".5" />
          <g filter={`url(#${rawId}-field-soft)`} opacity={opacity}>
            <g mask={`url(#${rawId}-cold-mask)`}>
              <rect width="160" height="80" fill={`url(#${rawId}-cold-ramp)`} />
            </g>
            <g mask={`url(#${rawId}-green-mask)`}>
              <rect width="160" height="80" fill={`url(#${rawId}-green-ramp)`} />
            </g>
            <g mask={`url(#${rawId}-warm-mask)`}>
              <rect width="160" height="80" fill={`url(#${rawId}-warm-ramp)`} />
            </g>
            <g mask={`url(#${rawId}-hot-mask)`}>
              <rect width="160" height="80" fill={`url(#${rawId}-hot-ramp)`} />
            </g>
          </g>
          <g mask={`url(#${rawId}-edge-mask)`} opacity=".36">
            <rect width="160" height="80" fill="#FFF600" style={{ mixBlendMode: "screen" }} />
            <rect width="160" height="80" fill="#001CFF" opacity=".16" style={{ mixBlendMode: "multiply" }} />
          </g>
        </svg>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: "-8%",
            background: [
              "radial-gradient(ellipse at 58% 48%, #FF1E2F 0 11%, #FF8A00 17%, transparent 31%)",
              "radial-gradient(ellipse at 48% 47%, #FFF600 0 22%, transparent 42%)",
              "radial-gradient(ellipse at 44% 39%, #39FF45 0 31%, transparent 55%)",
              "linear-gradient(130deg, #001CFF, #00D7FF 36%, #39FF45 58%, #FFF600 76%, #FF5A00)",
            ].join(", "),
            filter: "blur(8px) saturate(1.4) contrast(1.12)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,.72) 0 .55px, transparent .95px)",
          backgroundSize: "6px 6px",
          mixBlendMode: "screen",
          opacity: 0.22,
        }}
      />
    </div>
  );
}
