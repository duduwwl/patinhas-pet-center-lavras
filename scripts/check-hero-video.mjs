// Decode EVERY output frame; audit geometry, seams and consecutive changes.
// Usage: node scripts/check-hero-video.mjs <ffmpeg> <video> <frame-order.json>
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
const [ffmpeg, video, manifestPath] = process.argv.slice(2);
if (!ffmpeg || !video || !manifestPath) throw new Error("Informe FFmpeg, vídeo e manifesto.");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const chunks = [];
let decoderLog = "";
await new Promise((resolve, reject) => {
  const child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "info", "-i", video, "-vf", "scale=160:100:flags=area,format=rgb24,showinfo", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"], { stdio: ["ignore", "pipe", "pipe"] });
  let error = "";
  child.stdout.on("data", (chunk) => chunks.push(chunk));
  child.stderr.on("data", (chunk) => { error += chunk; decoderLog += chunk; });
  child.once("error", reject);
  child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(error)));
});
const bytes = Buffer.concat(chunks);
const size = 160 * 100 * 3;
assert.equal(bytes.length % size, 0);
const count = bytes.length / size;
assert.equal(count, manifest.outputFrames, "Missing or duplicated output frames");
const times = [...decoderLog.matchAll(/n:\s*(\d+)\s+pts:\s*-?\d+\s+pts_time:([\d.e+-]+)/g)].map((match) => Number(match[2]));
assert.equal(times.length, count, "Every frame must have a timestamp");
times.forEach((time, index) => assert.ok(Math.abs(time - index / manifest.fps) < 0.0001, `Incorrect time at frame ${index}: ${time}`));
const frames = Array.from({ length: count }, (_, index) => bytes.subarray(index * size, (index + 1) * size));
const delta = (a, b, region) => {
  let sum = 0, samples = 0;
  for (let y = 0; y < 100; y++) for (let x = 0; x < 160; x++) {
    if (!region(x, y)) continue;
    for (let c = 0; c < 3; c++) { const offset = (y * 160 + x) * 3 + c; sum += Math.abs(a[offset] - b[offset]); samples++; }
  }
  return sum / samples;
};
const active = (x, y) => x >= 80 && y >= 10 && y < 70;
const background = (x, y) => x < 70 || y >= 76;
const audit = frames.map((frame, index) => ({
  ...manifest.frames[index],
  motionDelta: index ? Number(delta(frame, frames[index - 1], active).toFixed(3)) : 0,
  backgroundDelta: Number(delta(frame, frames[0], background).toFixed(3)),
}));
const maxBackgroundDelta = Math.max(...audit.map((item) => item.backgroundDelta));
assert.ok(maxBackgroundDelta < 1, `Unstable background: ${maxBackgroundDelta}`);
const loopDelta = delta(frames[0], frames.at(-1), () => true);
if (count === 360) assert.ok(loopDelta < 1, `Loop seam: ${loopDelta}`);
const largestChanges = [...audit].sort((a, b) => b.motionDelta - a.motionDelta).slice(0, 8);
assert.ok(largestChanges[0].motionDelta < 8, "Abrupt cut found in the photographic transition");
const report = { frameCount: count, fps: manifest.fps, seconds: count / manifest.fps, maxBackgroundDelta, loopDelta, largestChanges, frames: audit };
await writeFile(join(dirname(manifestPath), "frame-audit.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ frameCount: count, maxBackgroundDelta, loopDelta, largestChanges }, null, 2));
