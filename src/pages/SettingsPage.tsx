import { useEffect, useState } from "react";

import { getAppInfo } from "../services/appInfo";
import type { AppInfo } from "../types";

const fallbackInfo: AppInfo = {
  name: "FluxDL",
  version: "0.1.0",
};

export function SettingsPage() {
  const [appInfo, setAppInfo] = useState<AppInfo>(fallbackInfo);

  useEffect(() => {
    let isMounted = true;

    getAppInfo()
      .then((info) => {
        if (isMounted) {
          setAppInfo(info);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAppInfo(fallbackInfo);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="settings-layout" aria-label="Application settings">
      <div className="workspace-panel">
        <p className="panel-label">Application</p>
        <div className="settings-list">
          <div className="settings-row">
            <span>Name</span>
            <strong>{appInfo.name}</strong>
          </div>
          <div className="settings-row">
            <span>Version</span>
            <strong>{appInfo.version}</strong>
          </div>
        </div>
      </div>

      <div className="workspace-panel">
        <p className="panel-label">Preferences</p>
        <div className="settings-list">
          <div className="settings-row">
            <span>Theme</span>
            <strong>System</strong>
          </div>
          <div className="settings-row">
            <span>Platform</span>
            <strong>Linux / Windows</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
