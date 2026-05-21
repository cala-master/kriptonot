mod bootstrap;

use std::sync::Mutex;

use bootstrap::{emit_current_status, initialize, BootstrapState, BootstrapStatusPayload};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let status = initialize(&app.handle());
            app.manage(BootstrapState(Mutex::new(status)));
            Ok(())
        })
        .on_page_load(|window, _payload| {
            if let Err(error) = emit_current_status(&window.app_handle()) {
                eprintln!("failed to emit bootstrap status: {error}");
            }
        })
        .run(tauri::generate_context!())
        .unwrap_or_else(|error| {
            let fallback = BootstrapStatusPayload {
                phase: "error",
                detail: format!("tauri runtime failed to start: {error}"),
            };

            eprintln!("{}", fallback.detail);
        });
}
