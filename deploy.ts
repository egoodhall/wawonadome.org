#!/usr/bin/env bun
import { spawn } from "child_process";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

async function main() {
  console.log("🚀 Starting GitHub Pages deployment process...");

  // First, run the build
  console.log("📦 Building the project...");
  const buildProcess = spawn("bun", ["run", "build"], { stdio: "inherit", shell: true });

  await new Promise((resolve, reject) => {
    buildProcess.on("close", code => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });

  // Create a .nojekyll file to prevent Jekyll processing
  console.log("📄 Creating .nojekyll file...");
  const distDir = "dist";
  if (!existsSync(distDir)) {
    await mkdir(distDir, { recursive: true });
  }
  
  await Bun.write(`${distDir}/.nojekyll`, "");

  // Deploy to GitHub Pages
  console.log("🚀 Deploying to GitHub Pages...");
  const deployProcess = spawn("bun", ["run", "deploy"], { stdio: "inherit", shell: true });

  await new Promise((resolve, reject) => {
    deployProcess.on("close", code => {
      if (code === 0) {
        console.log("✅ Deployment successful!");
        resolve(null);
      } else {
        reject(new Error(`Deployment failed with code ${code}`));
      }
    });
  });
}

main().catch(error => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
}); 
