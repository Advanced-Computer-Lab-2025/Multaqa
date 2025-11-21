#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");

const isWindows = process.platform === "win32";
const scriptDir = __dirname;

try {
  if (isWindows) {
    // Run PowerShell script on Windows
    const psScript = path.join(scriptDir, "kill-port.ps1");
    execSync(`powershell -ExecutionPolicy Bypass -File "${psScript}"`, {
      stdio: "inherit",
      cwd: path.join(scriptDir, ".."),
    });
  } else {
    // Run bash script on Mac/Linux
    const shScript = path.join(scriptDir, "kill-port.sh");
    execSync(`bash "${shScript}"`, {
      stdio: "inherit",
      cwd: path.join(scriptDir, ".."),
    });
  }
} catch (error) {
  // Ignore errors - port might already be free
  process.exit(0);
}