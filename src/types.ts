import type { ReactNode } from "react";

export type AppRoute = "main" | "settings";

export interface NavigationItem {
  id: AppRoute;
  label: string;
  icon: ReactNode;
}

export interface AppShellProps {
  activeRoute: AppRoute;
  navigationItems: NavigationItem[];
  onNavigate: (route: AppRoute) => void;
  children: ReactNode;
}

export interface AppInfo {
  name: string;
  version: string;
}
