// Build a continuous clip from the approved poses using motion-compensated
// intermediate frames. No browser timers or abrupt image swaps are required.
// Usage: node scripts/build-hero-video.mjs <path-to-ffmpeg>
import { copyFile, mkdir, mkdtemp } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const ffmpeg = process.argv[2];
const sample = process.argv.includes("--sample");
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
  const normalized = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", join(root, "public/images", filename), "-vf", "scale=1584:992:flags=lanczos,format=rgb24", "-frames:v", "1", join(staging, `${pose}.png`)], { stdio: "inherit" });
  if (normalized.status !== 0) throw new Error(`Falha ao normalizar ${pose}`);
}
// Quarter-second key poses keep tongue motion brief instead of stretching
// facial deformation across long transitions. Native-size source images
// preserve fur detail without fabricating detail via artificial upscaling.
const sequence = sample ? ["turn", "approach", "approach", "approach"] : [
  "idle", "turn", "turn", "approach",
  "lick", "approach", "lick", "approach", "lick", "reaction",
  "reaction", "release", "release", "turn", "idle", "idle", "idle",
];
for (const [index, pose] of sequence.entries()) {
  await copyFile(join(staging, `${pose}.png`), join(staging, `pose-${String(index).padStart(2, "0")}.png`));
}
await mkdir(join(root, "public/videos"), { recursive: true });
const result = spawnSync(ffmpeg, [
  "-hide_banner", "-loglevel", "warning", "-y", "-framerate", "4", "-i", join(staging, "pose-%02d.png"),
  "-vf", `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bilat:me=epzs:mb_size=16:search_param=64:vsbmc=1:scd=none,tpad=start_mode=clone:start_duration=${sample ? 0 : 1.75}:stop_mode=clone:stop_duration=8`,
  "-t", sample ? "0.7" : "12", "-r", "30", "-fps_mode", "cfr", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "16",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", sample ? join(runtime, "hero-quality-sample.mp4") : join(root, "public/videos/hero-patinhas-natural-hq.mp4"),
], { stdio: "inherit" });
if (result.status !== 0) throw new Error(`FFmpeg falhou: ${result.status}`);
