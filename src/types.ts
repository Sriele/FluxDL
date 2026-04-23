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

export type DownloadStatus = "active" | "paused" | "stopped";

export type DownloadKind = "single" | "multiScan";

export interface DownloadListItem {
  id: string;
  name: string;
  kind: DownloadKind;
  status: DownloadStatus;
  progress: number;
  speedLabel: string;
  sizeLabel: string;
  etaLabel: string;
  sourceCount?: number;
}

export type StorageDownloadKind = "mono" | "multiple";

export type ArchiveState = "none" | "zip" | "extracted";

export type StorageItemStatus = "ready" | "missing" | "issue";

export type StorageFileType = "folder" | "zip" | "video" | "image" | "document";

export interface StorageDownloadChild {
  id: string;
  name: string;
  relativePath: string;
  fileType: StorageFileType;
  status: StorageItemStatus;
  sizeLabel: string;
}

export interface StorageDownloadItem {
  id: string;
  name: string;
  kind: StorageDownloadKind;
  fileType: StorageFileType;
  path: string;
  folder: string;
  sizeLabel: string;
  fileCount: number;
  archiveState: ArchiveState;
  downloadedAtLabel: string;
  lastModifiedLabel: string;
  status: StorageItemStatus;
  children?: StorageDownloadChild[];
}

export interface StorageItemInfo {
  path: string;
  name: string;
  exists: boolean;
  is_directory: boolean;
  size_bytes: number;
}
