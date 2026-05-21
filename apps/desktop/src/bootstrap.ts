export const BOOTSTRAP_STATUS_EVENT = "bootstrap:status";

export type BootstrapPhase = "starting" | "ready" | "error";

export interface BootstrapStatus {
  phase: BootstrapPhase;
  detail: string;
}
