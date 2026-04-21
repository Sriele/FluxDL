#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
struct AppInfo {
    name: &'static str,
    version: &'static str,
}

#[tauri::command]
fn get_app_info() -> AppInfo {
    AppInfo {
        name: "FluxDL",
        version: env!("CARGO_PKG_VERSION"),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_app_info])
        .run(tauri::generate_context!())
        .expect("error while running FluxDL");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn app_info_uses_fluxdl_identity() {
        let info = get_app_info();

        assert_eq!(info.name, "FluxDL");
        assert_eq!(info.version, env!("CARGO_PKG_VERSION"));
    }
}
