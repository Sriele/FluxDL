import type { ReactNode } from "react";

import { bookmarkItems } from "./BookmarkPage";
import {
  initialStorageItems,
  parseStorageSize,
} from "./DownloadStoragePage";
import {
  monoDownloads,
  multipleDownloads,
  scannerItems,
} from "./DownloadingPage";

const overviewDiskTotalGb = 512;

function DownloadingOverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function StorageOverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6c0-1.1 3.1-2 7-2s7 .9 7 2-3.1 2-7 2-7-.9-7-2Z" />
      <path d="M5 6v6c0 1.1 3.1 2 7 2s7-.9 7-2V6" />
      <path d="M5 12v6c0 1.1 3.1 2 7 2s7-.9 7-2v-6" />
    </svg>
  );
}

function BookmarkOverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h10v15l-5-3-5 3V5Z" />
    </svg>
  );
}

function formatGb(value: number) {
  return `${value.toFixed(1)} Gb`;
}

function countBookmarkFavorites() {
  return bookmarkItems.filter((item) =>
    item.activities.some((activity) => activity.kind === "favorite"),
  ).length;
}

function OverviewCard({
  accent,
  children,
  icon,
  kicker,
  title,
}: {
  accent: "download" | "storage" | "bookmark";
  children: ReactNode;
  icon: ReactNode;
  kicker: string;
  title: string;
}) {
  return (
    <article className="overview-card" data-accent={accent}>
      <div className="overview-card-heading">
        <span className="overview-card-icon">{icon}</span>
        <div>
          <p className="panel-label">{kicker}</p>
          <h2>{title}</h2>
        </div>
      </div>

      {children}
    </article>
  );
}

export function MainPage() {
  const activeMono = monoDownloads.filter((item) => item.status === "active").length;
  const activeMultiple = multipleDownloads.filter(
    (item) => item.status === "active",
  ).length;
  const activeScanners = scannerItems.filter((item) => item.progress < 100).length;
  const downloadingActiveTotal = activeMono + activeMultiple + activeScanners;
  const downloadingTotal =
    monoDownloads.length + multipleDownloads.length + scannerItems.length;
  const failedDownloadLinks =
    multipleDownloads.reduce((total, item) => total + item.failedLinks, 0) +
    scannerItems.reduce((total, item) => total + item.failedLinks, 0);

  const storageUsedGb = initialStorageItems.reduce(
    (total, item) => total + parseStorageSize(item.sizeLabel),
    0,
  );
  const storageFreeGb = Math.max(0, overviewDiskTotalGb - storageUsedGb);
  const storageIssueCount = initialStorageItems.filter(
    (item) =>
      item.status !== "ready" ||
      item.children?.some((child) => child.status !== "ready"),
  ).length;

  const downloadedBookmarks = bookmarkItems.filter(
    (item) => item.downloadedCount > 0,
  ).length;
  const scannedBookmarks = bookmarkItems.filter((item) => item.scanCount > 0).length;
  const favoriteBookmarks = countBookmarkFavorites();
  const issueBookmarks = bookmarkItems.filter((item) => item.status === "issue").length;

  return (
    <section className="overview-page" aria-label="Download overview">
      <OverviewCard
        accent="download"
        icon={<DownloadingOverviewIcon />}
        kicker="Downloading"
        title="Queue globale"
      >
        <div className="overview-main-metric">
          <span>En cours</span>
          <strong>{downloadingActiveTotal}</strong>
        </div>

        <div className="overview-metric-grid">
          <div>
            <span>Mono</span>
            <strong>{monoDownloads.length}</strong>
          </div>
          <div>
            <span>Multiple</span>
            <strong>{multipleDownloads.length}</strong>
          </div>
          <div>
            <span>Scanner</span>
            <strong>{scannerItems.length}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{downloadingTotal}</strong>
          </div>
        </div>

        <div className="overview-inline-status">
          <span>Links a revoir</span>
          <strong>{failedDownloadLinks}</strong>
        </div>
      </OverviewCard>

      <OverviewCard
        accent="storage"
        icon={<StorageOverviewIcon />}
        kicker="Storage"
        title="Espace download"
      >
        <div className="overview-storage-balance">
          <div>
            <span>Espace libre total</span>
            <strong>{formatGb(storageFreeGb)}</strong>
          </div>
          <div>
            <span>Pris par FluxDL</span>
            <strong>{formatGb(storageUsedGb)}</strong>
          </div>
        </div>

        <div className="overview-meter" aria-hidden="true">
          <span style={{ inlineSize: `${(storageUsedGb / overviewDiskTotalGb) * 100}%` }} />
        </div>

        <div className="overview-inline-status">
          <span>Elements avec probleme</span>
          <strong>{storageIssueCount}</strong>
        </div>
      </OverviewCard>

      <OverviewCard
        accent="bookmark"
        icon={<BookmarkOverviewIcon />}
        kicker="Bookmark"
        title="Sites suivis"
      >
        <div className="overview-main-metric">
          <span>Nombre de bookmarks</span>
          <strong>{bookmarkItems.length}</strong>
        </div>

        <div className="overview-metric-grid">
          <div>
            <span>Downloaded</span>
            <strong>{downloadedBookmarks}</strong>
          </div>
          <div>
            <span>Scanned</span>
            <strong>{scannedBookmarks}</strong>
          </div>
          <div>
            <span>Favorites</span>
            <strong>{favoriteBookmarks}</strong>
          </div>
          <div>
            <span>Issues</span>
            <strong>{issueBookmarks}</strong>
          </div>
        </div>
      </OverviewCard>
    </section>
  );
}
