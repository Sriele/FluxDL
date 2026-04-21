import { useMemo, useState } from "react";

import { AppShell } from "./components/AppShell";
import { MainPage } from "./pages/MainPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { AppRoute, NavigationItem } from "./types";

const routeTitles: Record<AppRoute, string> = {
  main: "Main",
  settings: "Settings",
};

function MainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 10.5v-5Zm8 8A1.5 1.5 0 0 1 13.5 12h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-5ZM4 15a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm11-8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.8 3h2.4l.46 2.28c.48.15.94.34 1.37.57l1.94-1.29 1.7 1.7-1.29 1.94c.23.43.42.89.57 1.37L20.23 10v2.4l-2.28.46c-.15.48-.34.94-.57 1.37l1.29 1.94-1.7 1.7-1.94-1.29c-.43.23-.89.42-1.37.57L13.2 19.4h-2.4l-.46-2.25a7.08 7.08 0 0 1-1.39-.58l-1.92 1.28-1.7-1.7 1.28-1.92a7.08 7.08 0 0 1-.58-1.39L3.78 12.4V10l2.25-.45c.15-.49.34-.95.58-1.39L5.33 6.24l1.7-1.7 1.92 1.28c.44-.24.9-.43 1.39-.58L10.8 3Zm1.2 5.25a3.95 3.95 0 1 0 0 7.9 3.95 3.95 0 0 0 0-7.9Z" />
    </svg>
  );
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>("main");

  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      { id: "main", label: "Main", icon: <MainIcon /> },
      { id: "settings", label: "Settings", icon: <SettingsIcon /> },
    ],
    [],
  );

  return (
    <AppShell
      activeRoute={activeRoute}
      navigationItems={navigationItems}
      onNavigate={setActiveRoute}
    >
      <div className="page-heading">
        <p className="eyebrow">FluxDL</p>
        <h1>{routeTitles[activeRoute]}</h1>
      </div>

      {activeRoute === "main" ? <MainPage /> : <SettingsPage />}
    </AppShell>
  );
}
