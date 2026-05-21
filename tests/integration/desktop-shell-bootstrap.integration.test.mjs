import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("desktop shell wires a one-way bootstrap status event from Rust to React", () => {
  const frontendBootstrap = readFileSync("apps/desktop/src/bootstrap.ts", "utf8");
  const frontendMain = readFileSync("apps/desktop/src/main.tsx", "utf8");
  const rustBootstrap = readFileSync("apps/desktop/src-tauri/src/bootstrap.rs", "utf8");
  const shellRunbook = readFileSync("docs/manual-validation/milestone-05-empty-shell.md", "utf8");

  assert.ok(frontendBootstrap.includes('export const BOOTSTRAP_STATUS_EVENT = "bootstrap:status"'));
  assert.ok(frontendBootstrap.includes('export type BootstrapPhase = "starting" | "ready" | "error"'));
  assert.ok(frontendMain.includes("listen<BootstrapStatus>(BOOTSTRAP_STATUS_EVENT"));
  assert.ok(rustBootstrap.includes('pub const BOOTSTRAP_STATUS_EVENT: &str = "bootstrap:status";'));
  assert.ok(rustBootstrap.includes("Emitter"));
  assert.ok(rustBootstrap.includes('phase: "ready"'));
  assert.ok(rustBootstrap.includes('phase: "error"'));
  assert.ok(shellRunbook.includes("kriptonot-bootstrap.sqlite3"));
  assert.equal(existsSync("apps/desktop/src-tauri/icons/icon.png"), true);
});
