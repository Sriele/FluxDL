import { invoke } from "@tauri-apps/api/core";

import type { AppInfo } from "../types";

export function getAppInfo() {
  return invoke<AppInfo>("get_app_info");
}
