import { spawnSync } from "node:child_process";

const scripts = [
  "scripts/validation/verify-repo-structure.mjs",
  "scripts/validation/verify-workspace-links.mjs",
  "scripts/validation/verify-doc-coverage.mjs",
  "scripts/validation/verify-fixture-shapes.mjs"
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [script], { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Validation complete.");
