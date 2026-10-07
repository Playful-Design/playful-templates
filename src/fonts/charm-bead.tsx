import { useEffect, useRef, type HTMLAttributes } from "react";
import * as THREE from "three";
import { cx, mixHex, readableMonoOn, seeded } from "../shared";

export type CharmBeadTypefaceProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  color?: string;
  colors?: readonly string[];
  density?: number;
  scale?: number;
  grain?: number;
  contrast?: number;
  shape?: number;
};

function normalizeText(value: string) {
  return (
    value
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ")
      .split("")
      .filter((character) => /[a-zA-Z0-9 !?.,:;'"@#&+$*()/_-]/.test(character))
      .join("")
      .trim()
      .slice(0, 18) || "PLAYFUL!"
  ).toUpperCase();
}

function roundedRectShape(width: number, height: number, radius: number) {
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  const shapePath = new THREE.Shape();
  shapePath.moveTo(-w + r, -h);
  shapePath.lineTo(w - r, -h);
  shapePath.quadraticCurveTo(w, -h, w, -h + r);
  shapePath.lineTo(w, h - r);
  shapePath.quadraticCurveTo(w, h, w - r, h);
  shapePath.lineTo(-w + r, h);
  shapePath.quadraticCurveTo(-w, h, -w, h - r);
  shapePath.lineTo(-w, -h + r);
  shapePath.quadraticCurveTo(-w, -h, -w + r, -h);
  return shapePath;
}

function cubeGeometry(size: number, corner: number, depth: number) {
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(size, size, corner), {
    depth,
    bevelEnabled: true,
    bevelSize: Math.min(corner * 0.35, depth * 0.7),
    bevelThickness: Math.min(depth * 0.42, corner * 0.45),
    bevelSegments: 8,
    curveSegments: 10,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function roundBeadGeometry(radius: number, depth: number) {
  const shapePath = new THREE.Shape();
  shapePath.absarc(0, 0, radius, 0, Math.PI * 2, false);
  const geometry = new THREE.ExtrudeGeometry(shapePath, {
    depth,
    bevelEnabled: true,
    bevelSize: Math.min(radius * 0.16, depth * 0.62),
    bevelThickness: Math.min(depth * 0.44, radius * 0.18),
    bevelSegments: 12,
    curveSegments: 72,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function makeLetterTexture(renderer: THREE.WebGLRenderer, letter: string, fill: string) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 1024;
  const ctx = textureCanvas.getContext("2d");

  if (ctx) {
    const baseline = letter === "!" || letter === "?" ? 520 : 538;
    ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '900 790px "Arial Rounded MT Bold", "SF Pro Rounded", Arial, sans-serif';
    ctx.lineJoin = "round";

    if (fill === "#FFFFFF") {
      ctx.strokeStyle = "rgba(80,30,90,.34)";
      ctx.lineWidth = 34;
      ctx.strokeText(letter, 528, baseline + 17);
    }

    ctx.strokeStyle = fill === "#FFFFFF" ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.2)";
    ctx.lineWidth = fill === "#FFFFFF" ? 14 : 9;
    ctx.strokeText(letter, 496, baseline - 21);
    ctx.fillStyle = fill;
    ctx.shadowColor = fill === "#FFFFFF" ? "rgba(90,26,120,.22)" : "transparent";
    ctx.shadowBlur = fill === "#FFFFFF" ? 3 : 0;
    ctx.fillText(letter, 512, baseline);

    if (fill !== "#FFFFFF") {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(0,0,0,.72)";
      ctx.lineWidth = 18;
      ctx.strokeText(letter, 530, baseline + 22);
      ctx.strokeStyle = "rgba(0,0,0,.5)";
      ctx.lineWidth = 9;
      ctx.strokeText(letter, 522, baseline + 11);

      const gloss = ctx.createLinearGradient(276, 210, 730, 710);
      gloss.addColorStop(0, "rgba(255,255,255,0)");
      gloss.addColorStop(0.32, "rgba(255,255,255,.26)");
      gloss.addColorStop(0.5, "rgba(255,255,255,.08)");
      gloss.addColorStop(0.72, "rgba(255,255,255,.2)");
      gloss.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
      ctx.strokeStyle = "rgba(255,255,255,.28)";
      ctx.lineWidth = 5;
      ctx.strokeText(letter, 500, baseline - 28);
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function CharmBeadTypeface({
  text = "PLAYFUL!",
  color,
  colors,
  density = 5,
  scale = 22.08,
  grain = 30.1,
  contrast = 31.2,
  shape = 48.2,
  className,
  style,
  ...props
}: CharmBeadTypefaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const beadTone = color ?? colors?.[0] ?? "#FFFFFF";
  const letters = normalizeText(text).split("");
  const desiredRadius = Math.max(3.8, Math.min(8.2, scale / 3.25));
  const desiredGap = Math.max(0.78, 4.25 - density / 3.15);
  const rawWidth =
    letters.reduce((sum, letter) => sum + (letter === " " ? desiredRadius * 1.35 : desiredRadius * 2), 0) +
    Math.max(0, letters.length - 1) * desiredGap;
  const fit = Math.min(1, 140 / Math.max(1, rawWidth));
  const beadRadius = desiredRadius * fit;
  const gap = desiredGap * fit;
  const totalWidth =
    letters.reduce((sum, letter) => sum + (letter === " " ? beadRadius * 1.35 : beadRadius * 2), 0) +
    Math.max(0, letters.length - 1) * gap;
  const startX = 80 - totalWidth / 2;
  const centerY = 27;
  const cubeMix = Math.max(0.02, Math.min(0.98, (contrast - 30) / 60));
  const angleMix = Math.max(0.2, Math.min(1.2, shape / 60));

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(4, Math.max(2, (window.devicePixelRatio || 1) * 1.8)));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-80, 80, 27, -27, 0.1, 220);
    camera.position.set(0, 0, 105);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.86));
    const key = new THREE.DirectionalLight(0xffffff, 4.4);
    key.position.set(-46, 52, 92);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x96e9ff, 0.34);
    fill.position.set(52, -24, 46);
    scene.add(fill);
    const pinkKick = new THREE.PointLight(0xff9fc5, 0.42, 150);
    pinkKick.position.set(38, 20, 48);
    scene.add(pinkKick);

    const root = new THREE.Group();
    scene.add(root);
    let cursorX = startX;

    letters.forEach((letter, letterIndex) => {
      const advance = letter === " " ? beadRadius * 1.35 : beadRadius * 2;
      if (letter === " ") {
        cursorX += advance + gap;
        return;
      }

      const localSeed = letterIndex * 47.31 + grain * 1.7 + shape;
      const svgX = cursorX + advance / 2;
      cursorX += advance + gap;
      const svgY =
        centerY +
        Math.sin((letterIndex - letters.length / 2) * 0.72) * (0.16 + grain / 260) +
        (seeded(localSeed + 4) - 0.5) * (0.18 + grain / 260);
      const radius = beadRadius * (0.92 + seeded(localSeed + 21) * 0.14);
      const isCube = seeded(localSeed + 17) < cubeMix;
      const cubeSize = radius * 1.9;
      const depth = radius * (isCube ? 0.98 : 0.58);
      const textColor = readableMonoOn(beadTone);
      const side = mixHex(beadTone, textColor === "#FFFFFF" ? "#000000" : "#111111", 0.48);
      const group = new THREE.Group();
      group.position.set(svgX - 80, 27 - svgY, 0);
      group.rotation.z = THREE.MathUtils.degToRad((seeded(localSeed + 9) - 0.5) * (7 + grain / 11));
      group.rotation.x = THREE.MathUtils.degToRad((seeded(localSeed + 31) - 0.5) * (isCube ? 13 : 7) * angleMix);
      group.rotation.y = THREE.MathUtils.degToRad(((seeded(localSeed + 33) - 0.5) * (isCube ? 28 : 15) + (isCube ? -7 : -3)) * angleMix);

      const material = new THREE.MeshPhysicalMaterial({
        color: beadTone,
        emissive: new THREE.Color(mixHex(beadTone, "#FFFFFF", 0.22)),
        emissiveIntensity: 0.06,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transmission: 0.08,
        thickness: radius * 0.1,
        ior: 1.46,
        sheen: 0.34,
        sheenColor: new THREE.Color(mixHex(beadTone, "#ffffff", 0.22)),
      });
      const sideMaterial = new THREE.MeshPhysicalMaterial({
        color: side,
        roughness: 0.42,
        metalness: 0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.28,
      });

      const beadMesh = new THREE.Mesh(
        isCube ? cubeGeometry(cubeSize, radius * 0.58, depth) : roundBeadGeometry(radius, depth),
        material
      );
      beadMesh.castShadow = true;
      beadMesh.receiveShadow = true;
      group.add(beadMesh);

      if (isCube) {
        const bevelLine = new THREE.Mesh(cubeGeometry(cubeSize * 1.03, radius * 0.62, Math.max(0.1, depth * 0.16)), sideMaterial);
        bevelLine.position.z = -depth * 0.34;
        bevelLine.scale.set(1.025, 1.025, 1);
        group.add(bevelLine);
        beadMesh.position.z = depth * 0.12;
      } else {
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(radius * 0.88, Math.max(0.06, depth * 0.025), 8, 72),
          new THREE.MeshBasicMaterial({ color: mixHex(beadTone, "#ffffff", 0.38), transparent: true, opacity: 0.42, depthWrite: false })
        );
        rim.position.z = depth / 2 + 0.24;
        group.add(rim);
      }

      const letterTexture = makeLetterTexture(renderer, letter, textColor);
      const letterMaterial = new THREE.MeshBasicMaterial({ map: letterTexture, transparent: true, depthWrite: false, depthTest: false });
      const letterPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(radius * (isCube ? 1.72 : 1.64), radius * (isCube ? 1.72 : 1.64)),
        letterMaterial
      );
      letterPlane.position.z = depth / 2 + 0.72;
      group.add(letterPlane);
      root.add(group);
    });

    const resizeAndRender = () => {
      const rect = wrap.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      renderer.render(scene, camera);
    };

    const observer = new ResizeObserver(resizeAndRender);
    observer.observe(wrap);
    resizeAndRender();

    return () => {
      observer.disconnect();
      root.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose();
            });
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [angleMix, beadRadius, beadTone, centerY, cubeMix, gap, grain, letters, shape, startX]);

  return (
    <div
      {...props}
      ref={wrapRef}
      className={cx(className)}
      style={{ position: "relative", width: "100%", aspectRatio: "160 / 54", overflow: "visible", ...style }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
    </div>
  );
}
