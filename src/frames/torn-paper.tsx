"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { hexToRgba, mixHex, seeded } from "../shared";

type TornPoint = {
  x: number;
  y: number;
};

export type TornPaperFrameProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  paperColor?: string;
  edgeSeed?: number;
  seed?: number;
  density?: number;
  scale?: number;
  grain?: number;
  contrast?: number;
  tearShape?: number;
  shape?: number;
  shadowDepth?: number;
  contentStyle?: CSSProperties;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pointList(points: TornPoint[], width: number, height: number) {
  return points
    .map((point) => `${((point.x / width) * 100).toFixed(2)}% ${((point.y / height) * 100).toFixed(2)}%`)
    .join(", ");
}

function pathFromPoints(points: TornPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ")
    .concat(" Z");
}

function toPixels(points: TornPoint[], width: number, height: number) {
  return points.map((point) => ({
    x: (point.x / 100) * width,
    y: (point.y / 100) * height,
  }));
}

function tearAnchors(tearShape: number) {
  const sides = Math.round(clamp(tearShape, 3, 5));
  if (sides === 3) {
    return [
      { x: 9.5, y: 12.5 },
      { x: 94.5, y: 24.5 },
      { x: 25, y: 96 },
    ];
  }
  if (sides === 5) {
    return [
      { x: 42, y: 4.8 },
      { x: 94, y: 26 },
      { x: 86, y: 91.5 },
      { x: 27, y: 96.5 },
      { x: 5.8, y: 38 },
    ];
  }
  return [
    { x: 5.4, y: 12.3 },
    { x: 93.8, y: 6.3 },
    { x: 96.4, y: 86.8 },
    { x: 12.8, y: 95.5 },
  ];
}

function mix(clean: number, rough: number, amount: number) {
  return clean + (rough - clean) * amount;
}

function cutoutAnchors(tearShape: number, tearChaos: number) {
  const sides = Math.round(clamp(tearShape, 3, 5));
  if (sides === 3) {
    return [
      { x: mix(14, 20, tearChaos), y: mix(18, 25, tearChaos) },
      { x: mix(89, 81, tearChaos), y: mix(29, 35, tearChaos) },
      { x: mix(30, 36, tearChaos), y: mix(90, 82, tearChaos) },
    ];
  }
  if (sides === 5) {
    return [
      { x: mix(43, 45, tearChaos), y: mix(9.8, 17, tearChaos) },
      { x: mix(89.5, 80.5, tearChaos), y: mix(30, 35, tearChaos) },
      { x: mix(80.5, 73, tearChaos), y: mix(86.5, 79.5, tearChaos) },
      { x: mix(30, 34, tearChaos), y: mix(91, 84, tearChaos) },
      { x: mix(10.8, 18, tearChaos), y: mix(40.5, 44.5, tearChaos) },
    ];
  }
  return [
    { x: mix(10.5, 16, tearChaos), y: mix(15.5, 21, tearChaos) },
    { x: mix(88.5, 83, tearChaos), y: mix(11.2, 16, tearChaos) },
    { x: mix(91.5, 86, tearChaos), y: mix(83.4, 78.5, tearChaos) },
    { x: mix(16, 21.5, tearChaos), y: mix(90.5, 85.5, tearChaos) },
  ];
}

function edgeStepCount(length: number, density: number, cutout = false) {
  const spacing = clamp(78 - density * (cutout ? 3.6 : 4.7), cutout ? 24 : 16, cutout ? 76 : 62);
  return Math.round(clamp(length / spacing, cutout ? 3 : 4, cutout ? 54 : 96));
}

function makeResponsiveTornPoints({
  density,
  scale,
  anchors,
  seed,
  width,
  height,
  cutout = false,
}: {
  density: number;
  scale: number;
  anchors: TornPoint[];
  seed: number;
  width: number;
  height: number;
  cutout?: boolean;
}) {
  const pixelAnchors = toPixels(anchors, width, height);
  const shortSide = Math.max(1, Math.min(width, height));
  const tearChaos = clamp((scale - 12) / 24, 0, 1);
  const normalAmount = (cutout ? 0.012 : 0.028) * shortSide + tearChaos * (cutout ? 0.028 : 0.07) * shortSide;
  const tangentAmount = (cutout ? 0.004 : 0.012) * shortSide + tearChaos * (cutout ? 0.014 : 0.034) * shortSide;
  const points: TornPoint[] = [];

  pixelAnchors.forEach((from, index) => {
    const to = pixelAnchors[(index + 1) % pixelAnchors.length];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const tx = dx / length;
    const ty = dy / length;
    const steps = edgeStepCount(length, density, cutout);

    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      const taper = 0.22 + Math.sin(Math.PI * t) * 0.78;
      const tangentNoise = (seeded(seed + index * 21.7 + step * 7.1) - 0.5) * 2;
      const normalNoise = (seeded(seed + index * 67.1 + step * 11.37) - 0.5) * 2;
      const tooth = (seeded(seed + index * 103.9 + step * 2.33) - 0.5) * (cutout ? 0.35 : 0.9);
      const eased = clamp(t + tangentNoise * 0.012 * tearChaos, 0, 0.998);

      points.push({
        x: clamp(
          from.x + dx * eased + nx * (normalNoise * normalAmount * taper + tooth * normalAmount * 0.42) + tx * tangentNoise * tangentAmount,
          -shortSide * 0.08,
          width + shortSide * 0.08,
        ),
        y: clamp(
          from.y + dy * eased + ny * (normalNoise * normalAmount * taper + tooth * normalAmount * 0.42) + ty * tangentNoise * tangentAmount,
          -shortSide * 0.08,
          height + shortSide * 0.08,
        ),
      });
    }
  });

  return points;
}

function useMeasuredBox() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 360, height: 360 });

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const update = (entry?: ResizeObserverEntry) => {
      const rect = entry?.contentRect ?? node.getBoundingClientRect();
      setBox((current) => {
        const width = Math.max(1, Math.round(rect.width || current.width));
        const height = Math.max(1, Math.round(rect.height || current.height));
        if (Math.abs(current.width - width) < 1 && Math.abs(current.height - height) < 1) return current;
        return { width, height };
      });
    };

    update();
    const observer = new ResizeObserver((entries) => update(entries[0]));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, box] as const;
}

export function TornPaperFrame({
  children,
  paperColor = "#ffffff",
  edgeSeed,
  seed,
  density = 8,
  scale = 22,
  grain = 18,
  contrast = 68,
  tearShape,
  shape,
  shadowDepth = 0.72,
  contentStyle,
  style,
  ...props
}: TornPaperFrameProps) {
  const [rootRef, box] = useMeasuredBox();
  const reactId = useId().replace(/:/g, "");
  const resolvedSeed = edgeSeed ?? seed ?? 7;
  const resolvedShape = tearShape ?? shape ?? 4;
  const tearChaos = clamp((scale - 12) / 24, 0, 1);
  const width = Math.max(1, box.width);
  const height = Math.max(1, box.height);
  const shortSide = Math.max(1, Math.min(width, height));
  const unit = shortSide / 100;

  const geometry = useMemo(() => {
    const points = makeResponsiveTornPoints({
      density,
      scale,
      anchors: tearAnchors(resolvedShape),
      seed: resolvedSeed,
      width,
      height,
    });
    const innerPoints = makeResponsiveTornPoints({
      density: density * 0.86,
      scale: scale * 0.9,
      anchors: cutoutAnchors(resolvedShape, tearChaos),
      seed: resolvedSeed + 101,
      width,
      height,
      cutout: true,
    });
    const outerPath = pathFromPoints(points);
    const innerPath = pathFromPoints(innerPoints);
    const framePath = `${outerPath} ${innerPath}`;

    return {
      outerPath,
      innerPath,
      framePath,
      innerPolygon: `polygon(${pointList(innerPoints, width, height)})`,
    };
  }, [density, height, resolvedSeed, resolvedShape, scale, tearChaos, width]);

  const uid = `torn-${reactId}-${Math.round(resolvedSeed * 1000)}-${Math.round(density * 10)}-${Math.round(scale * 10)}-${Math.round(resolvedShape * 10)}`;
  const shadow = clamp(shadowDepth, 0, 1.5);
  const pulpColor = mixHex(paperColor, "#ffffff", 0.58);
  const fiberColor = mixHex(paperColor, "#111111", 0.18);
  const grainOpacity = clamp(0.14 + grain / 110 + contrast / 1000, 0.18, 0.58);
  const fiberCount = Math.round(clamp((width + height) / (42 - clamp(density, 3, 14) * 1.6), 12, 72));

  const fiberLines = useMemo(() => {
    return Array.from({ length: fiberCount }, (_, index) => {
      const y = shortSide * 0.05 + (index / Math.max(1, fiberCount - 1)) * (height - shortSide * 0.1);
      const startX = -shortSide * 0.04 + seeded(resolvedSeed + index * 2.1) * shortSide * 0.1;
      const endX = width + shortSide * 0.04 - seeded(resolvedSeed + index * 4.7) * shortSide * 0.08;
      const lift = (seeded(resolvedSeed + index * 3.73) - 0.5) * shortSide * (0.05 + tearChaos * 0.06);
      const c1x = width * (0.22 + seeded(index + 4) * 0.1);
      const c2x = width * (0.61 + seeded(index + 8) * 0.13);
      return `M ${startX.toFixed(2)} ${y.toFixed(2)} C ${c1x.toFixed(2)} ${(y + lift).toFixed(2)}, ${c2x.toFixed(2)} ${(y - lift * 0.7).toFixed(2)}, ${endX.toFixed(2)} ${(y + lift * 0.35).toFixed(2)}`;
    });
  }, [fiberCount, height, resolvedSeed, shortSide, tearChaos, width]);

  const sharedDefs = (
    <defs>
      <filter id={`${uid}-edge-noise`} x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence
          type="turbulence"
          baseFrequency={0.024 + tearChaos * 0.038 + grain / 4600}
          numOctaves={6}
          seed={Math.round(resolvedSeed)}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={(0.34 + tearChaos * 1.25) * unit}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id={`${uid}-tight-shadow`} x="-22%" y="-22%" width="144%" height="144%">
        <feGaussianBlur stdDeviation={(0.22 + shadow * 0.36) * unit} />
      </filter>
      <filter id={`${uid}-soft-shadow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={(0.72 + shadow * 0.86) * unit} />
      </filter>
      <pattern id={`${uid}-paper-grain`} width={18 * unit} height={15 * unit} patternUnits="userSpaceOnUse">
        <rect width={18 * unit} height={15 * unit} fill={paperColor} />
        <path
          d={`M ${-2 * unit} ${3.2 * unit} C ${4.6 * unit} ${1.1 * unit}, ${11.5 * unit} ${2.1 * unit}, ${20 * unit} ${0.8 * unit}`}
          stroke={hexToRgba(pulpColor, 0.72)}
          strokeWidth={0.34 * unit + grain / 260}
          opacity={grainOpacity}
          fill="none"
        />
        <path
          d={`M ${1.5 * unit} ${11.6 * unit} C ${6.4 * unit} ${8.9 * unit}, ${12.1 * unit} ${10.6 * unit}, ${18.6 * unit} ${8.4 * unit}`}
          stroke={hexToRgba(fiberColor, 0.2)}
          strokeWidth={0.26 * unit + grain / 440}
          opacity={0.58}
          fill="none"
        />
        <path
          d={`M ${3.1 * unit} ${6.4 * unit} C ${7.6 * unit} ${5.1 * unit}, ${11.2 * unit} ${5.9 * unit}, ${16.8 * unit} ${4.5 * unit}`}
          stroke={hexToRgba(fiberColor, 0.13)}
          strokeWidth={0.2 * unit + grain / 540}
          opacity={0.48}
          fill="none"
        />
        <circle cx={4.5 * unit} cy={12.4 * unit} r={0.32 * unit + grain / 280} fill={hexToRgba(pulpColor, 0.28)} />
        <circle cx={13.2 * unit} cy={5.5 * unit} r={0.24 * unit + grain / 360} fill={hexToRgba(fiberColor, 0.1)} />
      </pattern>
      <clipPath id={`${uid}-frame-clip`}>
        <path d={geometry.framePath} clipRule="evenodd" />
      </clipPath>
    </defs>
  );

  return (
    <div
      {...props}
      ref={rootRef}
      style={{
        position: "relative",
        overflow: "visible",
        isolation: "isolate",
        ...style,
      }}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {sharedDefs}
        <path
          d={geometry.outerPath}
          fill="rgba(38,36,33,.15)"
          transform={`translate(${(0.9 + shadow * 1.15) * unit} ${(1 + shadow * 1.3) * unit})`}
          filter={`url(#${uid}-soft-shadow)`}
          opacity={0.46 + shadow * 0.22}
        />
        <path
          d={geometry.outerPath}
          fill="rgba(25,24,22,.22)"
          transform={`translate(${(0.28 + shadow * 0.48) * unit} ${(0.38 + shadow * 0.62) * unit})`}
          filter={`url(#${uid}-tight-shadow)`}
          opacity={0.32 + shadow * 0.24}
        />
        <path d={geometry.outerPath} fill={`url(#${uid}-paper-grain)`} filter={`url(#${uid}-edge-noise)`} />
        <path
          d={geometry.outerPath}
          fill={hexToRgba("#ffffff", 0.16 + tearChaos * 0.16)}
          transform={`translate(${-0.28 * unit} ${-0.24 * unit})`}
          filter={`url(#${uid}-tight-shadow)`}
        />
      </svg>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100%",
          clipPath: geometry.innerPolygon,
          WebkitClipPath: geometry.innerPolygon,
          overflow: "hidden",
          background: paperColor,
          ...contentStyle,
        }}
      >
        {children}
      </div>
      <svg
        aria-hidden
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {sharedDefs}
        <path
          d={geometry.framePath}
          fill={`url(#${uid}-paper-grain)`}
          fillRule="evenodd"
          filter={`url(#${uid}-edge-noise)`}
          opacity={0.84 + tearChaos * 0.16}
        />
        <path
          d={geometry.framePath}
          fill="rgba(255,255,255,.32)"
          fillRule="evenodd"
          opacity={0.2 + tearChaos * 0.26}
        />
        <g clipPath={`url(#${uid}-frame-clip)`} opacity={0.4 + tearChaos * 0.46}>
          {fiberLines.map((line, index) => (
            <path
              key={index}
              d={line}
              fill="none"
              stroke={index % 3 === 0 ? hexToRgba("#ffffff", 0.58) : hexToRgba(fiberColor, 0.18 + contrast / 2000)}
              strokeWidth={index % 4 === 0 ? 0.34 * unit + tearChaos * 0.2 : 0.22 * unit + grain / 420}
              strokeLinecap="round"
            />
          ))}
        </g>
        <path
          d={geometry.outerPath}
          fill="none"
          stroke={hexToRgba("#ffffff", 0.45 + tearChaos * 0.22)}
          strokeWidth={0.34 * unit + tearChaos * 0.42 * unit + grain / 300}
          filter={`url(#${uid}-edge-noise)`}
        />
        <path
          d={geometry.innerPath}
          fill="none"
          stroke={hexToRgba(fiberColor, 0.13 + contrast / 1400)}
          strokeWidth={0.34 * unit + tearChaos * 0.16 * unit}
          transform={`translate(${(0.1 + shadow * 0.16) * unit} ${(0.15 + shadow * 0.22) * unit})`}
        />
        <path
          d={geometry.outerPath}
          fill="none"
          stroke={hexToRgba(fiberColor, 0.1 + contrast / 1200)}
          strokeWidth={0.2 * unit + tearChaos * 0.18 * unit}
          transform={`translate(${0.18 * unit} ${0.22 * unit})`}
        />
      </svg>
    </div>
  );
}
