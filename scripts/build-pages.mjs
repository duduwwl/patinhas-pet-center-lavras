import { build } from "vite";
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sourceRoot = join(projectRoot, "pages-src");
const outputRoot = join(projectRoot, "docs");
const sourceImages = join(projectRoot, "public", "images");
const outputImages = join(outputRoot, "images");

await mkdir(join(sourceRoot, "images"), { recursive: true });
await copyFile(join(sourceImages, "hero-patinhas.png"), join(sourceRoot, "images", "hero-patinhas.png"));

await build({
  configFile: false,
  root: sourceRoot,
  base: "./",
  publicDir: false,
  build: { outDir: outputRoot, emptyOutDir: true },
});

await mkdir(outputImages, { recursive: true });
for (const filename of await readdir(sourceImages)) {
  await copyFile(join(sourceImages, filename), join(outputImages, filename));
}
await copyFile(join(projectRoot, "public", "favicon.svg"), join(outputRoot, "favicon.svg"));
await writeFile(join(outputRoot, ".nojekyll"), "");
console.log(`GitHub Pages gerado em ${outputRoot}`);
