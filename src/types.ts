import type { ReactNode } from "react";

export type AppRoute =
  | "overview"
  | "downloading"
  | "downloadStorage"
  | "bookmark"
  | "live"
  | "social"
  | "notifications"
  | "streamingStorage";

export interface NavigationItem {
  id: AppRoute;
  label: string;
  icon: ReactNode;
  count?: string;
  separatorBefore?: boolean;
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
