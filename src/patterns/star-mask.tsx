import { useId, type SVGProps } from "react";

export type StarMaskPatternProps = SVGProps<SVGSVGElement> & {
  colors?: readonly string[];
  density?: number;
  scale?: number;
  contrast?: number;
  shape?: number;
  solid?: boolean;
  cutoutOnly?: boolean;
  excludeY?: readonly [number, number];
  preserveAspectRatio?: string;
};

function clamp(value: number | undefined, fallback: number, min: number, max: number) {
  const next = Number.isFinite(value) ? Number(value) : fallback;
  return Math.min(max, Math.max(min, next));
}

function starPolygonPoints(cx: number, cy: number, outerRadius: number, rotate = 0) {
  return Array.from({ length: 10 })
    .map((_, index) => {
      const angle = ((-90 + rotate + index * 36) * Math.PI) / 180;
      const radius = index % 2 === 0 ? outerRadius : outerRadius * 0.42;
      return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
    })
    .join(" ");
}

function starGrid(density: number, scale: number, shape: number) {
  const drift = (shape - 50) / 50;

  if (density <= 1.5) {
    return [
      {
        x: 80,
        y: 40,
        radius: Math.max(22, Math.min(34, scale * 1.12)),
        rotate: -6 + drift * 8,
      },
    ];
  }

  const columns = Math.max(3, Math.min(6, Math.round(density / 2.4)));
  const rows = Math.max(4, Math.min(8, Math.round(density / 1.8)));
  const cellW = 160 / columns;
  const cellH = 80 / rows;
  const maxRadius = Math.min(cellW, cellH) * 0.52;
  const baseRadius = Math.max(5.2, Math.min(13.5, scale * 0.7));
  const radius = Math.min(maxRadius, baseRadius);

  return Array.from({ length: columns * rows }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: cellW * (col + 0.5) + (row % 2 === 1 ? drift * 2.2 : -drift * 1.2),
      y: cellH * (row + 0.5),
      radius: radius * (0.92 + ((col + row) % 3) * 0.035),
      rotate: (row % 2 ? 8 : -8) + drift * 3,
    };
  });
}

export function StarMaskPattern({
  colors = ["#f7fbff", "#0b4fa8", "#ffffff", "#d8ebff"],
  density = 8,
  scale = 12,
  contrast = 80,
  shape = 55,
  solid = false,
  cutoutOnly = false,
  excludeY,
  preserveAspectRatio = "none",
  style,
  ...props
}: StarMaskPatternProps) {
  const id = useId().replace(/:/g, "");
  const [paper = "#f7fbff", shadow = "#0b4fa8", shine = "#ffffff"] = colors;
  const d = clamp(density, 8, 1, 20);
  const s = clamp(scale, 12, 1, 80);
  const k = clamp(contrast, 80, 0, 100);
  const sh = clamp(shape, 55, 0, 100);
  const stars = starGrid(d, s, sh).filter((star) => !excludeY || star.y < excludeY[0] || star.y > excludeY[1]);
  const opacity = solid ? 1 : Math.min(0.96, 0.36 + k / 260);

  return (
    <svg
      viewBox="0 0 160 80"
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      {...props}
    >
      <defs>
        <mask id={`playful-star-mask-${id}`}>
          <rect width="160" height="80" fill="#fff" />
          {stars.map((star, index) => (
            <polygon
              key={`star-hole-${index}`}
              points={starPolygonPoints(star.x, star.y, star.radius, star.rotate)}
              fill="#000"
            />
          ))}
        </mask>
        <clipPath id={`playful-star-cuts-${id}`}>
          {stars.map((star, index) => (
            <polygon
              key={`star-clip-${index}`}
              points={starPolygonPoints(star.x, star.y, star.radius, star.rotate)}
            />
          ))}
        </clipPath>
        <filter id={`playful-star-mask-soft-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.42" />
        </filter>
      </defs>
      {cutoutOnly ? (
        <g>
          {stars.map((star, index) => (
            <polygon
              key={`star-cutout-shadow-${index}`}
              points={starPolygonPoints(star.x + 0.36, star.y + 0.42, star.radius * 1.02, star.rotate)}
              fill={shadow}
              opacity="0.18"
              filter={`url(#playful-star-mask-soft-${id})`}
            />
          ))}
          {stars.map((star, index) => (
            <polygon
              key={`star-cutout-${index}`}
              points={starPolygonPoints(star.x, star.y, star.radius, star.rotate)}
              fill={paper}
              opacity={opacity}
            />
          ))}
        </g>
      ) : (
        <rect width="160" height="80" fill={paper} opacity={opacity} mask={`url(#playful-star-mask-${id})`} />
      )}
      {!solid && !cutoutOnly ? (
        <g clipPath={`url(#playful-star-cuts-${id})`}>
          {stars.map((star, index) => (
            <polygon
              key={`star-inner-${index}`}
              points={starPolygonPoints(star.x + 0.34, star.y + 0.46, star.radius * 1.02, star.rotate)}
              fill="none"
              stroke={shadow}
              strokeWidth="1.1"
              opacity="0.16"
              filter={`url(#playful-star-mask-soft-${id})`}
            />
          ))}
          {stars.map((star, index) => (
            <polygon
              key={`star-shine-${index}`}
              points={starPolygonPoints(star.x - 0.18, star.y - 0.24, star.radius * 0.96, star.rotate)}
              fill="none"
              stroke={shine}
              strokeWidth="0.2"
              opacity="0.32"
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
}
