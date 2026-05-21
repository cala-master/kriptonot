import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("desktop workspace scripts expose the bootstrap lifecycle", () => {
  const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const desktopPackageJson = JSON.parse(readFileSync("apps/desktop/package.json", "utf8"));

  assert.equal(rootPackageJson.scripts["app:dev"], "pnpm --filter @kriptonot/desktop dev");
  assert.equal(rootPackageJson.scripts["app:build"], "pnpm --filter @kriptonot/desktop build");
  assert.equal(rootPackageJson.scripts["app:typecheck"], "pnpm --filter @kriptonot/desktop typecheck");
  assert.equal(rootPackageJson.scripts["app:tauri:dev"], "pnpm --filter @kriptonot/desktop tauri dev");
  assert.equal(rootPackageJson.scripts["app:tauri:build"], "pnpm --filter @kriptonot/desktop tauri build");

  assert.ok(desktopPackageJson.scripts.dev.includes("vite"));
  assert.ok(desktopPackageJson.scripts.typecheck.includes("tsc --noEmit"));
  assert.ok(desktopPackageJson.scripts.tauri.includes("tauri"));
});
