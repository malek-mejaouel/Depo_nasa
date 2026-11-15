import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const esbuildPath = path.join(__dirname, "node_modules", "esbuild", "bin", "esbuild");
const htmlPath = path.join(__dirname, "..", "firmground-app-built", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const jsMatch = html.match(/src=["']\.\/assets\/(index-[^"']+\.js)["']/);
const cssMatch = html.match(/href=["']\.\/assets\/(index-[^"']+\.css)["']/);
const jsName = jsMatch ? jsMatch[1] : "index-CtcCxMKD.js";
const cssName = cssMatch ? cssMatch[1] : "index-ChfYFD5d.css";

const outJs = path.join(__dirname, "..", "firmground-app-built", "assets", jsName);
const outCss = path.join(__dirname, "..", "firmground-app-built", "assets", cssName);
const generatedCss = path.join(__dirname, "..", "firmground-app-built", "assets", jsName.replace(/\.js$/, ".css"));

console.log(`Building Firm Ground frontend with esbuild -> ${jsName}, ${cssName}...`);
execFileSync(process.execPath, [
  esbuildPath,
  path.join(__dirname, "src", "main.jsx"),
  "--bundle",
  "--minify",
  "--jsx=automatic",
  `--outfile=${outJs}`,
  "--loader:.js=jsx",
  "--loader:.png=dataurl"
], { stdio: "inherit" });

if (fs.existsSync(generatedCss)) {
  fs.copyFileSync(generatedCss, outCss);
  console.log(`Synced CSS bundle to ${cssName}`);
}
console.log("Build complete.");
