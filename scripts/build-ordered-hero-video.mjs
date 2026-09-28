// Ordered, frame-counted montage of the existing photographic poses.
// This is not generative video: interpolation cannot invent missing anatomy.
// Usage: node scripts/build-ordered-hero-video.mjs <path-to-ffmpeg> [--sample]
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const ffmpeg = process.argv[2];
const sample = process.argv.includes("--sample");
if (!ffmpeg) throw new Error("Informe o caminho do executável FFmpeg.");
const runtime = join(root, ".sites-runtime");
await mkdir(runtime, { recursive: true });
const resume = process.argv.find((arg) => arg.startsWith("--resume="))?.slice(9);
const staging = resume ? resolve(resume) : await mkdtemp(join(runtime, "hero-ordered-"));
if (!staging.startsWith(runtime + sep)) throw new Error("O checkpoint deve estar dentro de .sites-runtime.");
const width = 1584, height = 992, fps = 30;
const poses = {
  idle: "hero-patinhas.png",
  turn: "hero-patinhas-frame-turn.png",
  approach: "hero-patinhas-frame-approach.png",
  lick: "hero-patinhas-interaction.png",
  reaction: "hero-patinhas-frame-reaction.png",
  release: "hero-patinhas-frame-release.png",
};

// Each phase owns an exact, contiguous range. A single lick progresses into
// the dog's reaction, with no approach/lick ping-pong or random pose order.
const phases = [
  { name: "Repouso inicial", from: "idle", to: "idle", frames: 45 },
  { name: "Gato vira para o cachorro", from: "idle", to: "turn", frames: 36 },
  { name: "Pausa antes da aproximação", from: "turn", to: "turn", frames: 6 },
  { name: "Aproximação", from: "turn", to: "approach", frames: 18 },
  { name: "Início do contato", from: "approach", to: "approach", frames: 3 },
  { name: "Lambida", from: "approach", to: "lick", frames: 9 },
  { name: "Contato", from: "lick", to: "lick", frames: 3 },
  { name: "Reação do cachorro", from: "lick", to: "reaction", frames: 9 },
  { name: "Pausa da reação", from: "reaction", to: "reaction", frames: 9 },
  { name: "Gato se afasta", from: "reaction", to: "release", frames: 24 },
  { name: "Pausa após o carinho", from: "release", to: "release", frames: 6 },
  { name: "Retorno ao repouso", from: "release", to: "idle", frames: 30 },
  { name: "Repouso final e emenda do loop", from: "idle", to: "idle", frames: 162 },
];
const totalFrames = phases.reduce((sum, phase) => sum + phase.frames, 0);
if (totalFrames !== 360) throw new Error("A sequência precisa conter exatamente 360 frames.");
if (resume) {
  const checkpoint = JSON.parse(await readFile(join(staging, "frame-order.json"), "utf8"));
  if (checkpoint.outputFrames !== totalFrames || JSON.stringify(checkpoint.phases) !== JSON.stringify(phases)) throw new Error("Checkpoint incompatível com a ordem atual.");
}

function run(args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: ["ignore", "ignore", "pipe"] });
    let error = "";
    child.stderr.on("data", (chunk) => { error += chunk.toString(); });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolveRun() : reject(new Error(`FFmpeg ${code}: ${error}`)));
  });
}

for (const [pose, filename] of Object.entries(poses)) {
  if (resume) continue;
  await run(["-i", join(root, "public/images", filename), "-vf", `scale=${width}:${height}:flags=lanczos,setsar=1,format=rgb24`, "-frames:v", "1", join(staging, `${pose}.png`)]);
}

const segmentPaths = [];
let frameOffset = 0;
const frameManifest = [];
for (const [index, phase] of phases.entries()) {
  const path = join(staging, `segment-${String(index).padStart(2, "0")}.mkv`);
  console.log(`${phase.name}: frames ${frameOffset}–${frameOffset + phase.frames - 1}`);
  if (resume) {
    // Reuse the already inspected lossless segments, not the earlier MP4.
  } else if (phase.from === phase.to) {
    await run(["-loop", "1", "-framerate", String(fps), "-i", join(staging, `${phase.from}.png`), "-frames:v", String(phase.frames), "-c:v", "libx264rgb", "-preset", "fast", "-crf", "0", path]);
  } else {
    const interval = (phase.frames - 1) / fps;
    // Source poses are separate photographs, not adjacent motion frames.
    // Optical-flow block matching visibly melted eyes, ears and mouths.
    // A short eased dissolve keeps the original anatomy intact. This is an
    // honest photographic sequence, not a substitute for real video footage.
    const progress = `clip((T/${interval}-0.2)/0.6,0,1)`;
    const weight = `(0.5-0.5*cos(PI*${progress}))`;
    await run([
      "-loop", "1", "-framerate", String(fps), "-i", join(staging, `${phase.from}.png`),
      "-loop", "1", "-framerate", String(fps), "-i", join(staging, `${phase.to}.png`),
      "-filter_complex", `[0:v]format=gbrp[a];[1:v]format=gbrp[b];[a][b]blend=all_expr='A*(1-${weight})+B*${weight}':shortest=1,setpts=N/(${fps}*TB)[transition]`,
      "-map", "[transition]", "-frames:v", String(phase.frames), "-c:v", "libx264rgb", "-preset", "fast", "-crf", "0", path,
    ]);
  }
  segmentPaths.push(path);
  for (let n = 0; n < phase.frames; n++) frameManifest.push({ frame: frameOffset + n, time: Number(((frameOffset + n) / fps).toFixed(4)), phase: phase.name });
  frameOffset += phase.frames;
  if (sample && index === 3) break;
}

const list = join(staging, "segments.txt");
await writeFile(list, segmentPaths.map((path) => `file '${path.replaceAll("\\", "/")}'`).join("\n"));
const montage = join(staging, "montage.mkv");
await run(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", montage]);

// Freeze the shop, floor, paws and bodies on the original photo. Only heads
// and their contact region move, inside soft-edged elliptical VIDEO masks.
const headMask = "255*clip(max((1-sqrt(pow((X-1040)/235,2)+pow((Y-370)/260,2)))*12,(1-sqrt(pow((X-1310)/210,2)+pow((Y-450)/245,2)))*12),0,1)";
const outputFrames = sample ? frameManifest.length : totalFrames;
const destination = sample ? join(runtime, "hero-ordered-sample.mp4") : join(root, "public/videos/hero-patinhas-ordered-v3.mp4");
await mkdir(join(root, "public/videos"), { recursive: true });
await run([
  "-loop", "1", "-framerate", String(fps), "-i", join(staging, "idle.png"), "-i", montage,
  "-filter_complex", `[1:v]settb=expr=1/${fps},setpts=N,format=gbrp[animation];color=c=black:s=${width}x${height}:r=${fps},format=gray,geq=lum='${headMask}',trim=end_frame=1,loop=loop=-1:size=1:start=0,setpts=N/(${fps}*TB)[mask];[animation][mask]alphamerge[heads];[0:v][heads]overlay=shortest=1:format=auto,format=yuv420p[out]`,
  "-map", "[out]", "-frames:v", String(outputFrames), "-r", String(fps), "-fps_mode", "cfr", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-movflags", "+faststart", destination,
]);
await writeFile(join(staging, "frame-order.json"), JSON.stringify({ fps, width, height, outputFrames, phases, frames: frameManifest }, null, 2));
console.log(`Vídeo gerado: ${destination}\nFrames organizados: ${join(staging, "frame-order.json")}`);
