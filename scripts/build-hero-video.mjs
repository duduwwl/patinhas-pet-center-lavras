// Build a continuous clip from the approved poses using motion-compensated
// intermediate frames. No browser timers or abrupt image swaps are required.
// Usage: node scripts/build-hero-video.mjs <path-to-ffmpeg>
import { copyFile, mkdir, mkdtemp } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const ffmpeg = process.argv[2];
if (!ffmpeg) throw new Error("Informe o caminho do executável FFmpeg.");
const runtime = join(root, ".sites-runtime");
await mkdir(runtime, { recursive: true });
const staging = await mkdtemp(join(runtime, "hero-video-"));
const poses = {
  idle: "hero-patinhas.png",
  turn: "hero-patinhas-frame-turn.png",
  approach: "hero-patinhas-frame-approach.png",
  lick: "hero-patinhas-interaction.png",
  reaction: "hero-patinhas-frame-reaction.png",
  release: "hero-patinhas-frame-release.png",
};
// Normalize input geometry first: differing PNG dimensions otherwise reset
// FFmpeg's temporal filter and silently discard intermediate frames.
for (const [pose, filename] of Object.entries(poses)) {
  const normalized = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", join(root, "public/images", filename), "-vf", "scale=1280:800,format=rgb24", "-frames:v", "1", join(staging, `${pose}.png`)], { stdio: "inherit" });
  if (normalized.status !== 0) throw new Error(`Falha ao normalizar ${pose}`);
}
// Half-second key poses: rest, approach, three licks, happy reaction,
// separation and a calm return to the exact opening pose for a seamless loop.
const sequence = [
  "idle", "idle", "idle", "idle", "turn", "turn", "approach",
  "lick", "approach", "lick", "approach", "lick", "reaction",
  "reaction", "release", "release", "turn", "idle", "idle",
  "idle", "idle", "idle", "idle", "idle", "idle", "idle",
];
for (const [index, pose] of sequence.entries()) {
  await copyFile(join(staging, `${pose}.png`), join(staging, `pose-${String(index).padStart(2, "0")}.png`));
}
await mkdir(join(root, "public/videos"), { recursive: true });
const result = spawnSync(ffmpeg, [
  "-hide_banner", "-loglevel", "warning", "-y", "-framerate", "2", "-i", join(staging, "pose-%02d.png"),
  "-vf", "scale=1280:800,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none,tpad=stop_mode=clone:stop_duration=2",
  "-t", "12", "-r", "30", "-fps_mode", "cfr", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "21",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(root, "public/videos/hero-patinhas-completo.mp4"),
], { stdio: "inherit" });
if (result.status !== 0) throw new Error(`FFmpeg falhou: ${result.status}`);
