/**
 * Genera los 3 PNGs fuente que @capacitor/assets necesita:
 *   - assets/icon.png              → 1024x1024, azul full-bleed + logo
 *                                    blanco (iOS y Android legacy).
 *   - assets/icon-foreground.png   → 1024x1024, sólo el logo blanco
 *                                    (balanza + lupa) centrado en el
 *                                    safe area, sobre transparente.
 *   - assets/icon-background.png   → 1024x1024, azul sólido.
 *
 * Cómo funciona:
 * El PNG original es un cuadrado azul con el logo hecho de CUTOUTS
 * TRANSPARENTES adentro (no son pixels blancos). Hay además padding
 * transparente afuera del cuadrado. Si lo flatteneamos con azul, los
 * cutouts internos también se pintan de azul y el logo desaparece.
 *
 * Solución: flood fill desde los bordes del canvas hacia adentro,
 * pintando de azul sólo la transparencia exterior. Al chocar con
 * pixels opacos (el borde del cuadrado azul) se detiene, por lo que
 * los cutouts internos (logo) quedan intactos.
 */
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "assets", "icon-1024.png");
const OUT_ICON = path.join(ROOT, "assets", "icon.png");
const OUT_FG = path.join(ROOT, "assets", "icon-foreground.png");
const OUT_BG = path.join(ROOT, "assets", "icon-background.png");

const SIZE = 1024;
// Color de marca: lo samplearemos del PNG para no hardcodear.
// Fallback por si falla el sampleo.
const FALLBACK_BLUE = { r: 89, g: 152, b: 210 };

async function main() {
  const { data: rgba, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.width !== SIZE || info.height !== SIZE) {
    throw new Error(
      `Source icon debe ser ${SIZE}x${SIZE}, recibido ${info.width}x${info.height}`
    );
  }
  const W = info.width;
  const H = info.height;

  // Samplea un pixel del cuadrado azul cerca del tope (y=150) para
  // obtener el color de marca sin mezclarlo con ningún cutout.
  const sampleIdx = (150 * W + Math.floor(W / 2)) * 4;
  const blue =
    rgba[sampleIdx + 3] > 200
      ? { r: rgba[sampleIdx], g: rgba[sampleIdx + 1], b: rgba[sampleIdx + 2] }
      : FALLBACK_BLUE;
  console.log(`Azul: rgb(${blue.r}, ${blue.g}, ${blue.b})`);

  // Flood fill desde los bordes hacia adentro.
  // Sólo pinta los pixels transparentes ALCANZABLES desde afuera;
  // los cutouts internos del logo no son alcanzables, así que quedan.
  const buf = Buffer.from(rgba);
  const visited = new Uint8Array(W * H);
  const stack = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (visited[p]) return;
    visited[p] = 1;
    const i = p * 4;
    if (buf[i + 3] > 10) return; // pixel opaco: tope, no expandir
    // Pintar de azul opaco
    buf[i] = blue.r;
    buf[i + 1] = blue.g;
    buf[i + 2] = blue.b;
    buf[i + 3] = 255;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  };

  // Seed: todos los pixels del perímetro.
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }

  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    push(x, y);
  }

  // 1) icon.png: flatten los cutouts internos (alpha=0 restantes) a blanco.
  //    Resultado: 1024x1024 opaco, azul full-bleed + logo blanco.
  const iconBuf = Buffer.from(buf);
  for (let i = 0; i < iconBuf.length; i += 4) {
    if (iconBuf[i + 3] < 255) {
      // blend simple sobre blanco
      const a = iconBuf[i + 3] / 255;
      iconBuf[i] = Math.round(iconBuf[i] * a + 255 * (1 - a));
      iconBuf[i + 1] = Math.round(iconBuf[i + 1] * a + 255 * (1 - a));
      iconBuf[i + 2] = Math.round(iconBuf[i + 2] * a + 255 * (1 - a));
      iconBuf[i + 3] = 255;
    }
  }
  await sharp(iconBuf, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(OUT_ICON);
  console.log(`✓ ${path.relative(ROOT, OUT_ICON)}`);

  // 2) icon-background.png: azul sólido 1024x1024.
  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: blue.r, g: blue.g, b: blue.b, alpha: 1 },
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(OUT_BG);
  console.log(`✓ ${path.relative(ROOT, OUT_BG)}`);

  // 3) icon-foreground.png: sólo el logo blanco centrado en el safe area.
  //    - Donde había cutout interno (alpha=0 después del flood fill) → blanco opaco.
  //    - Resto → transparente.
  //    Después trimmeamos y escalamos al 65% del canvas.
  const maskBuf = Buffer.alloc(W * H * 4);
  for (let i = 0; i < buf.length; i += 4) {
    if (buf[i + 3] === 0) {
      // cutout interno del logo
      maskBuf[i] = 255;
      maskBuf[i + 1] = 255;
      maskBuf[i + 2] = 255;
      maskBuf[i + 3] = 255;
    } else if (buf[i + 3] < 255) {
      // borde antialiased — usar alpha invertido como alpha blanco
      const a = 255 - buf[i + 3];
      maskBuf[i] = 255;
      maskBuf[i + 1] = 255;
      maskBuf[i + 2] = 255;
      maskBuf[i + 3] = a;
    }
    // else: pixel azul opaco → queda transparente (todo en 0)
  }

  // Encode a PNG primero para que el .trim() pueda leerlo.
  const maskPng = await sharp(maskBuf, {
    raw: { width: W, height: H, channels: 4 },
  })
    .png()
    .toBuffer();

  const trimmed = await sharp(maskPng).trim().toBuffer();

  const FG_INNER = Math.round(SIZE * 0.65);
  const fgLogo = await sharp(trimmed)
    .resize(FG_INNER, FG_INNER, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const fgPad = Math.round((SIZE - FG_INNER) / 2);
  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: fgLogo, top: fgPad, left: fgPad }])
    .png({ compressionLevel: 9 })
    .toFile(OUT_FG);
  console.log(`✓ ${path.relative(ROOT, OUT_FG)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
