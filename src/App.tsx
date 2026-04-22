import { Fragment, useMemo, useState } from "react";

import { AppShell } from "./components/AppShell";
import { DownloadingPage } from "./pages/DownloadingPage";
import { MainPage } from "./pages/MainPage";
import type { AppRoute, NavigationItem } from "./types";

const routeTitles: Record<AppRoute, string> = {
  overview: "Overview",
  downloading: "Downloading",
  downloadStorage: "Storage",
  bookmark: "Bookmark",
  live: "Live",
  social: "Social",
  notifications: "Notifications",
  streamingStorage: "Storage",
};

const routeSections: Record<AppRoute, string> = {
  overview: "Download",
  downloading: "Download",
  downloadStorage: "Download",
  bookmark: "Download",
  live: "Streaming",
  social: "Streaming",
  notifications: "Streaming",
  streamingStorage: "Streaming",
};

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h7v7H4V5Z" />
      <path d="M13 5h7v4h-7V5Z" />
      <path d="M13 11h7v8h-7v-8Z" />
      <path d="M4 14h7v5H4v-5Z" />
    </svg>
  );
}

function DownloadingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 18h14" />
    </svg>
  );
}

function StorageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6c0-1.1 3.1-2 7-2s7 .9 7 2-3.1 2-7 2-7-.9-7-2Z" />
      <path d="M5 6v6c0 1.1 3.1 2 7 2s7-.9 7-2V6" />
      <path d="M5 12v6c0 1.1 3.1 2 7 2s7-.9 7-2v-6" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h10v15l-5-3-5 3V5Z" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h8a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4Z" />
      <path d="m10 10 5 2-5 2v-4Z" />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M16 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M3.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M13 18a4 4 0 0 1 7.5-2" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 17h12l-1.5-2v-4.5a4.5 4.5 0 0 0-9 0V15L6 17Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>("overview");
  const [downloadPathSegments, setDownloadPathSegments] = useState<string[]>([]);
  const currentPage =
    activeRoute === "downloading" ? (
      <DownloadingPage onPathChange={setDownloadPathSegments} />
    ) : (
      <MainPage />
    );
  const pagePathSegments =
    activeRoute === "downloading"
      ? [routeTitles[activeRoute], ...downloadPathSegments]
      : [routeTitles[activeRoute]];

  function handleNavigate(route: AppRoute) {
    setActiveRoute(route);

    if (route !== "downloading") {
      setDownloadPathSegments([]);
    }
  }

  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      { id: "overview", label: "Overview", icon: <OverviewIcon /> },
      { id: "downloading", label: "Downloading", icon: <DownloadingIcon /> },
      { id: "downloadStorage", label: "Storage", icon: <StorageIcon /> },
      { id: "bookmark", label: "Bookmark", icon: <BookmarkIcon /> },
      {
        id: "live",
        label: "Live",
        icon: <LiveIcon />,
        separatorBefore: true,
      },
      {
        id: "social",
        label: "Social",
        icon: <SocialIcon />,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <NotificationsIcon />,
      },
      {
        id: "streamingStorage",
        label: "Storage",
        icon: <StorageIcon />,
      },
    ],
    [],
  );

  return (
    <AppShell
      activeRoute={activeRoute}
      navigationItems={navigationItems}
      onNavigate={handleNavigate}
    >
      <div className="page-heading">
        <nav className="page-path" aria-label="Current path">
          <span>{routeSections[activeRoute]}</span>
          {pagePathSegments.map((segment, index) => (
            <Fragment key={`${segment}-${index}`}>
              <span aria-hidden="true">/</span>
              <span
                className={
                  index === pagePathSegments.length - 1
                    ? "page-path-current"
                    : undefined
                }
              >
                {segment}
              </span>
            </Fragment>
          ))}
        </nav>
        <div className="page-title-row">
          <h1>{routeTitles[activeRoute]}</h1>
        </div>
      </div>

      {currentPage}
    </AppShell>
  );
}
