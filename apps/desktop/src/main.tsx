import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { listen } from "@tauri-apps/api/event";
import { App } from "./App";
import {
  BOOTSTRAP_STATUS_EVENT,
  type BootstrapStatus
} from "./bootstrap";
import "./styles.css";

const initialStatus: BootstrapStatus = {
  phase: "starting",
  detail: "Waiting for the Rust backend to initialize the local SQLite runtime."
};

function BootstrapShell() {
  const [status, setStatus] = useState<BootstrapStatus>(initialStatus);

  useEffect(() => {
    let isMounted = true;

    const unlistenPromise = listen<BootstrapStatus>(BOOTSTRAP_STATUS_EVENT, (event) => {
      if (isMounted) {
        setStatus(event.payload);
      }
    });

    return () => {
      isMounted = false;
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return <App status={status} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BootstrapShell />
  </StrictMode>
);
