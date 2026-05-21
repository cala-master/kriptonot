import type { BootstrapStatus } from "./bootstrap";

interface AppProps {
  status: BootstrapStatus;
}

export function App({ status }: AppProps) {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">kriptonot desktop bootstrap</p>
        <h1>kriptonot</h1>
        <p className="summary">
          Local-first desktop notes infrastructure is online. This shell intentionally
          contains no business logic yet.
        </p>
      </section>

      <section className="status-panel" aria-live="polite">
        <div>
          <p className="panel-label">Startup status</p>
          <p className={`status-pill status-${status.phase}`}>{status.phase}</p>
        </div>
        <p className="status-detail">{status.detail}</p>
      </section>

      <section className="placeholder-panel">
        <p className="panel-label">Next milestone placeholder</p>
        <p>
          Future note and fragment flows will mount here after the desktop shell,
          storage bootstrap, and package contracts are in place.
        </p>
      </section>
    </main>
  );
}
