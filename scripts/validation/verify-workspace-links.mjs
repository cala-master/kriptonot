import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
const workspaceYaml = readFileSync("pnpm-workspace.yaml", "utf8");

assert.equal(rootPackageJson.private, true);
assert.equal(rootPackageJson.packageManager, "pnpm@11.1.2");

for (const scriptName of [
  "validate",
  "test",
  "test:contracts",
  "test:integration",
  "manual:bootstrap",
  "app:dev",
  "app:build",
  "app:typecheck",
  "app:tauri:dev",
  "app:tauri:build"
]) {
  assert.ok(rootPackageJson.scripts[scriptName], `Missing root script: ${scriptName}`);
}

assert.ok(workspaceYaml.includes("apps/*"));
assert.ok(workspaceYaml.includes("packages/*"));

const expectedPackages = new Map([
  ["apps/desktop/package.json", "@kriptonot/desktop"],
  ["packages/note-model/package.json", "@kriptonot/note-model"],
  ["packages/marker-parser/package.json", "@kriptonot/marker-parser"],
  ["packages/fragment-store/package.json", "@kriptonot/fragment-store"],
  ["packages/crypto-fragments/package.json", "@kriptonot/crypto-fragments"],
  ["packages/storage-sqlite/package.json", "@kriptonot/storage-sqlite"],
  ["packages/ui-contracts/package.json", "@kriptonot/ui-contracts"],
  ["packages/validation-schemas/package.json", "@kriptonot/validation-schemas"],
  ["packages/test-kit/package.json", "@kriptonot/test-kit"]
]);

for (const [path, expectedName] of expectedPackages) {
  const packageJson = JSON.parse(readFileSync(path, "utf8"));
  assert.equal(packageJson.name, expectedName, `Unexpected package name in ${path}`);
}

const desktopPackageJson = JSON.parse(readFileSync("apps/desktop/package.json", "utf8"));

for (const scriptName of ["dev", "build", "typecheck", "tauri"]) {
  assert.ok(desktopPackageJson.scripts[scriptName], `Missing desktop script: ${scriptName}`);
}

for (const dependencyName of ["react", "react-dom", "@tauri-apps/api"]) {
  assert.ok(
    desktopPackageJson.dependencies?.[dependencyName],
    `Missing desktop dependency: ${dependencyName}`
  );
}

for (const dependencyName of [
  "vite",
  "typescript",
  "@vitejs/plugin-react",
  "@tauri-apps/cli"
]) {
  assert.ok(
    desktopPackageJson.devDependencies?.[dependencyName],
    `Missing desktop devDependency: ${dependencyName}`
  );
}

console.log("verify-workspace-links: ok");
