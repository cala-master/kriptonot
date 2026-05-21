use std::{
    fs::create_dir_all,
    path::PathBuf,
    sync::Mutex,
};

use rusqlite::Connection;
use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager};

pub const BOOTSTRAP_STATUS_EVENT: &str = "bootstrap:status";

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BootstrapStatusPayload {
    pub phase: &'static str,
    pub detail: String,
}

pub struct BootstrapState(pub Mutex<BootstrapStatusPayload>);

pub fn initialize(app: &AppHandle) -> BootstrapStatusPayload {
    match initialize_database(app) {
        Ok(database_path) => BootstrapStatusPayload {
            phase: "ready",
            detail: format!(
                "Frontend mounted and SQLite bootstrap succeeded at {}.",
                database_path.display()
            ),
        },
        Err(error) => BootstrapStatusPayload {
            phase: "error",
            detail: format!("SQLite bootstrap failed: {error}"),
        },
    }
}

pub fn emit_current_status(app: &AppHandle) -> tauri::Result<()> {
    let state = app.state::<BootstrapState>();
    let payload = state.0.lock().expect("bootstrap status mutex poisoned").clone();

    app.emit(BOOTSTRAP_STATUS_EVENT, payload)
}

fn initialize_database(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("could not resolve app data directory: {error}"))?;

    create_dir_all(&app_data_dir)
        .map_err(|error| format!("could not create app data directory {}: {error}", app_data_dir.display()))?;

    let database_path = app_data_dir.join("kriptonot-bootstrap.sqlite3");
    let connection = Connection::open(&database_path)
        .map_err(|error| format!("could not open database {}: {error}", database_path.display()))?;

    connection
        .execute_batch(
            "
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            SELECT 1;
            ",
        )
        .map_err(|error| format!("could not initialize sqlite pragmas: {error}"))?;

    Ok(database_path)
}
