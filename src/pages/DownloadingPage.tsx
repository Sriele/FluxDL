import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import type { DownloadListItem, DownloadStatus } from "../types";

export type DownloadingMode = "mono" | "multiple" | "scanner";

type ChildItemStatus = "success" | "active" | "paused" | "failed";

export interface ChildDownloadItem {
  id: string;
  name: string;
  status: ChildItemStatus;
  sizeLabel: string;
}

export interface MultipleDownloadItem {
  id: string;
  name: string;
  status: "active" | "paused" | "failed";
  completedLinks: number;
  failedLinks: number;
  pausedLinks: number;
  totalLinks: number;
  progress: number;
  speedLabel: string;
  sizeLabel: string;
  etaLabel: string;
  children: ChildDownloadItem[];
}

export interface ScannerItem {
  id: string;
  name: string;
  sourceUrl: string;
  completedLinks: number;
  failedLinks: number;
  pausedLinks: number;
  discoveredLinks: number;
  queuedLinks: number;
  progress: number;
  statusLabel: string;
  children: ChildDownloadItem[];
}

interface DownloadingPageProps {
  onPathChange?: (segments: string[]) => void;
}

const modePathLabels: Record<DownloadingMode, string> = {
  mono: "Mono",
  multiple: "Multiple",
  scanner: "Scanner",
};

export const monoDownloads: DownloadListItem[] = [
  {
    id: "wow-wrath",
    name: "WoW: Wrath Of The Lich King",
    kind: "single",
    status: "active",
    progress: 89,
    speedLabel: "16.03 Mbps",
    sizeLabel: "18.70 Gb",
    etaLabel: "2h 35min",
  },
  {
    id: "avengers-infinity-war",
    name: "Avengers: Infinity War (1080p)",
    kind: "single",
    status: "active",
    progress: 78,
    speedLabel: "17.40 Mbps",
    sizeLabel: "12.10 Gb",
    etaLabel: "32 min",
  },
  {
    id: "mnist-dataset",
    name: "MNIST Dataset",
    kind: "single",
    status: "active",
    progress: 56,
    speedLabel: "4.06 Mbps",
    sizeLabel: "150.70 Mb",
    etaLabel: "3h 5min",
  },
  {
    id: "star-trek-discovery",
    name: "Star Trek Discovery (S1)",
    kind: "single",
    status: "paused",
    progress: 39,
    speedLabel: "0 Mbps",
    sizeLabel: "5.35 Gb",
    etaLabel: "Paused",
  },
  {
    id: "the-farthest",
    name: "The Farthest (1080p)",
    kind: "single",
    status: "paused",
    progress: 8,
    speedLabel: "0 Mbps",
    sizeLabel: "4.25 Gb",
    etaLabel: "Paused",
  },
  {
    id: "adobe-master-collection",
    name: "Adobe Master Collection CS6",
    kind: "single",
    status: "stopped",
    progress: 22,
    speedLabel: "0 Mbps",
    sizeLabel: "9.30 Gb",
    etaLabel: "Stopped",
  },
  {
    id: "linux-image-pack",
    name: "Linux image pack mirror",
    kind: "single",
    status: "stopped",
    progress: 18,
    speedLabel: "0 Mbps",
    sizeLabel: "2.80 Gb",
    etaLabel: "Stopped",
  },
];

export const multipleDownloads: MultipleDownloadItem[] = [
  {
    id: "harry-potter",
    name: "Harry Potter Collection",
    status: "active",
    completedLinks: 9,
    failedLinks: 1,
    pausedLinks: 0,
    totalLinks: 15,
    progress: 60,
    speedLabel: "24.80 Mbps",
    sizeLabel: "42.10 Gb",
    etaLabel: "1h 12min",
    children: [
      { id: "hp-01", name: "Harry Potter 01", status: "success", sizeLabel: "3.90 Gb" },
      { id: "hp-02", name: "Harry Potter 02", status: "success", sizeLabel: "4.10 Gb" },
      { id: "hp-03", name: "Harry Potter 03", status: "success", sizeLabel: "4.00 Gb" },
      { id: "hp-04", name: "Harry Potter 04", status: "success", sizeLabel: "4.35 Gb" },
      { id: "hp-05", name: "Harry Potter 05", status: "success", sizeLabel: "4.45 Gb" },
      { id: "hp-06", name: "Harry Potter 06", status: "success", sizeLabel: "4.55 Gb" },
      { id: "hp-07", name: "Harry Potter 07", status: "success", sizeLabel: "4.75 Gb" },
      { id: "hp-08", name: "Harry Potter 08", status: "success", sizeLabel: "4.80 Gb" },
      { id: "hp-bonus-01", name: "Behind the scenes", status: "success", sizeLabel: "1.70 Gb" },
      { id: "hp-bonus-02", name: "Deleted scenes", status: "failed", sizeLabel: "820 Mb" },
      { id: "hp-bonus-03", name: "Interviews pack", status: "active", sizeLabel: "940 Mb" },
      { id: "hp-bonus-04", name: "Soundtrack archive", status: "active", sizeLabel: "1.10 Gb" },
      { id: "hp-bonus-05", name: "Poster pack", status: "active", sizeLabel: "430 Mb" },
      { id: "hp-bonus-06", name: "Subtitles archive", status: "active", sizeLabel: "180 Mb" },
      { id: "hp-bonus-07", name: "Metadata bundle", status: "active", sizeLabel: "90 Mb" },
    ],
  },
  {
    id: "linux-mirror-pack",
    name: "Linux ISO mirror pack",
    status: "paused",
    completedLinks: 4,
    failedLinks: 0,
    pausedLinks: 2,
    totalLinks: 6,
    progress: 67,
    speedLabel: "0 Mbps",
    sizeLabel: "18.40 Gb",
    etaLabel: "Paused",
    children: [
      { id: "linux-ubuntu", name: "Ubuntu desktop ISO", status: "success", sizeLabel: "5.80 Gb" },
      { id: "linux-fedora", name: "Fedora workstation ISO", status: "success", sizeLabel: "2.20 Gb" },
      { id: "linux-debian", name: "Debian installer ISO", status: "success", sizeLabel: "3.70 Gb" },
      { id: "linux-arch", name: "Arch Linux ISO", status: "success", sizeLabel: "950 Mb" },
      { id: "linux-mint", name: "Linux Mint ISO", status: "paused", sizeLabel: "3.20 Gb" },
      { id: "linux-popos", name: "Pop!_OS ISO", status: "paused", sizeLabel: "2.55 Gb" },
    ],
  },
  {
    id: "course-video-bundle",
    name: "Course video bundle",
    completedLinks: 18,
    status: "failed",
    failedLinks: 2,
    pausedLinks: 4,
    totalLinks: 24,
    progress: 75,
    speedLabel: "0 Mbps",
    sizeLabel: "30.80 Gb",
    etaLabel: "Needs review",
    children: [
      { id: "course-01", name: "Module 01", status: "success", sizeLabel: "1.40 Gb" },
      { id: "course-02", name: "Module 02", status: "success", sizeLabel: "1.35 Gb" },
      { id: "course-03", name: "Module 03", status: "success", sizeLabel: "1.55 Gb" },
      { id: "course-04", name: "Module 04", status: "success", sizeLabel: "1.20 Gb" },
      { id: "course-05", name: "Module 05", status: "success", sizeLabel: "1.60 Gb" },
      { id: "course-06", name: "Module 06", status: "success", sizeLabel: "1.25 Gb" },
      { id: "course-07", name: "Module 07", status: "success", sizeLabel: "1.80 Gb" },
      { id: "course-08", name: "Module 08", status: "success", sizeLabel: "1.45 Gb" },
      { id: "course-09", name: "Module 09", status: "success", sizeLabel: "1.50 Gb" },
      { id: "course-10", name: "Module 10", status: "success", sizeLabel: "1.75 Gb" },
      { id: "course-11", name: "Module 11", status: "success", sizeLabel: "1.30 Gb" },
      { id: "course-12", name: "Module 12", status: "success", sizeLabel: "1.25 Gb" },
      { id: "course-13", name: "Module 13", status: "success", sizeLabel: "1.65 Gb" },
      { id: "course-14", name: "Module 14", status: "success", sizeLabel: "1.10 Gb" },
      { id: "course-15", name: "Module 15", status: "success", sizeLabel: "1.35 Gb" },
      { id: "course-16", name: "Module 16", status: "success", sizeLabel: "1.40 Gb" },
      { id: "course-17", name: "Module 17", status: "success", sizeLabel: "1.20 Gb" },
      { id: "course-18", name: "Module 18", status: "success", sizeLabel: "1.55 Gb" },
      { id: "course-19", name: "Module 19", status: "failed", sizeLabel: "1.30 Gb" },
      { id: "course-20", name: "Module 20", status: "failed", sizeLabel: "1.45 Gb" },
      { id: "course-21", name: "Module 21", status: "paused", sizeLabel: "1.50 Gb" },
      { id: "course-22", name: "Module 22", status: "paused", sizeLabel: "1.40 Gb" },
      { id: "course-23", name: "Module 23", status: "paused", sizeLabel: "1.35 Gb" },
      { id: "course-24", name: "Module 24", status: "paused", sizeLabel: "1.25 Gb" },
    ],
  },
];

export const scannerItems: ScannerItem[] = [
  {
    id: "archive-page",
    name: "Course archive page scan",
    sourceUrl: "https://example.com/archive",
    completedLinks: 21,
    failedLinks: 2,
    pausedLinks: 0,
    discoveredLinks: 28,
    queuedLinks: 5,
    progress: 64,
    statusLabel: "Scanning",
    children: [
      { id: "archive-01", name: "Lesson index", status: "success", sizeLabel: "Ready" },
      { id: "archive-02", name: "Module archive", status: "success", sizeLabel: "Ready" },
      { id: "archive-03", name: "Video playlist", status: "success", sizeLabel: "Ready" },
      { id: "archive-04", name: "Documents", status: "failed", sizeLabel: "403" },
      { id: "archive-05", name: "Source pack", status: "failed", sizeLabel: "Timeout" },
      { id: "archive-06", name: "Media directory", status: "active", sizeLabel: "Scanning" },
    ],
  },
  {
    id: "media-library",
    name: "Media library scan",
    sourceUrl: "https://example.com/library",
    completedLinks: 31,
    failedLinks: 0,
    pausedLinks: 3,
    discoveredLinks: 41,
    queuedLinks: 7,
    progress: 38,
    statusLabel: "Indexing",
    children: [
      { id: "library-01", name: "Image folder", status: "success", sizeLabel: "Ready" },
      { id: "library-02", name: "Video folder", status: "success", sizeLabel: "Ready" },
      { id: "library-03", name: "Documents folder", status: "success", sizeLabel: "Ready" },
      { id: "library-04", name: "Private folder", status: "paused", sizeLabel: "Paused" },
      { id: "library-05", name: "Audio folder", status: "paused", sizeLabel: "Paused" },
      { id: "library-06", name: "Mirrors folder", status: "paused", sizeLabel: "Paused" },
    ],
  },
  {
    id: "release-page",
    name: "Release page scan",
    sourceUrl: "https://example.com/releases",
    completedLinks: 14,
    failedLinks: 1,
    pausedLinks: 0,
    discoveredLinks: 15,
    queuedLinks: 0,
    progress: 82,
    statusLabel: "Filtering",
    children: [
      { id: "release-01", name: "Windows package", status: "success", sizeLabel: "Ready" },
      { id: "release-02", name: "Linux package", status: "success", sizeLabel: "Ready" },
      { id: "release-03", name: "macOS package", status: "success", sizeLabel: "Ready" },
      { id: "release-04", name: "Checksums", status: "success", sizeLabel: "Ready" },
      { id: "release-05", name: "Legacy build", status: "failed", sizeLabel: "Gone" },
    ],
  },
];

function LinkScanIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1" />
      <path d="M8 6.5 7 4" />
      <path d="M5.5 8 3 7" />
      <path d="M16 17.5 17 20" />
      <path d="M18.5 16 21 17" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function getProgressStyle(progress: number): CSSProperties {
  return { "--download-progress": `${progress}%` } as CSSProperties;
}

function getStatusLabel(status: DownloadStatus) {
  if (status === "active") {
    return "Active";
  }

  if (status === "paused") {
    return "Paused";
  }

  return "Stopped";
}

function getItemsByStatus(status: DownloadStatus) {
  return monoDownloads.filter((item) => item.status === status);
}

function getAverageProgress(items: DownloadListItem[]) {
  if (items.length === 0) {
    return 0;
  }

  return Math.round(
    items.reduce((total, item) => total + item.progress, 0) / items.length,
  );
}

function getSpeedValue(speedLabel: string) {
  const value = Number.parseFloat(speedLabel);

  return Number.isFinite(value) ? value : 0;
}

function getAverageSpeedLabel(items: DownloadListItem[]) {
  const activeItems = items.filter((item) => item.status === "active");

  if (activeItems.length === 0) {
    return "0 Mbps";
  }

  const averageSpeed =
    activeItems.reduce((total, item) => total + getSpeedValue(item.speedLabel), 0) /
    activeItems.length;

  return `${averageSpeed.toFixed(2)} Mbps`;
}

function getChildStatusLabel(status: ChildItemStatus) {
  if (status === "success") {
    return "Succeeded";
  }

  if (status === "active") {
    return "Active";
  }

  if (status === "paused") {
    return "Paused";
  }

  return "Failed";
}

function getLinkStatusSummary({
  completedLinks,
  failedLinks,
  pausedLinks,
  totalLinks,
}: {
  completedLinks: number;
  failedLinks: number;
  pausedLinks: number;
  totalLinks: number;
}) {
  const notes = [
    failedLinks > 0 ? `${failedLinks} failed` : null,
    pausedLinks > 0 ? `${pausedLinks} paused` : null,
  ].filter(Boolean);

  return `${completedLinks}/${totalLinks} link${notes.length > 0 ? ` (${notes.join(", ")})` : ""}`;
}

function DownloadRow({ item }: { item: DownloadListItem }) {
  const statusLabel =
    item.status === "active" ? item.etaLabel : getStatusLabel(item.status);

  return (
    <article className="download-row" data-status={item.status}>
      <div className="download-row-main">
        <div className="download-name-wrap">
          <span className="download-status-dot" aria-hidden="true" />
          <h3>{item.name}</h3>
        </div>

        <div
          className="download-progress"
          style={getProgressStyle(item.progress)}
          role="progressbar"
          aria-label={`${item.name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={item.progress}
        >
          <span />
        </div>
      </div>

      <div className="download-row-meta">
        <span>{item.progress}%</span>
        <span>{item.sizeLabel}</span>
        <strong>{item.speedLabel}</strong>
        <span>{statusLabel}</span>
      </div>
    </article>
  );
}

function DownloadSection({
  title,
  count,
  items,
  muted = false,
}: {
  title: string;
  count: number;
  items: DownloadListItem[];
  muted?: boolean;
}) {
  return (
    <section className="download-section" data-muted={muted || undefined}>
      <div className="download-section-heading">
        <div>
          <p className="panel-label">{title}</p>
          <span>{count} items</span>
        </div>
      </div>

      <div className="download-list">
        {items.map((item) => (
          <DownloadRow item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

function ModeCard({
  mode,
  title,
  detail,
  preview,
  onOpen,
}: {
  mode: DownloadingMode;
  title: string;
  detail: string;
  preview: Array<{ label: string; value: string }>;
  onOpen: (mode: DownloadingMode) => void;
}) {
  return (
    <button
      className="download-overview-card"
      data-mode={mode}
      type="button"
      onClick={() => onOpen(mode)}
    >
      <span className="download-overview-card-top">
        <span>
          <span className="panel-label">{title}</span>
          <span className="download-overview-card-count">Open section</span>
        </span>
        <span className="download-overview-open">
          <ChevronRightIcon />
        </span>
      </span>

      <span className="download-overview-card-value">{detail}</span>

      <span className="download-overview-preview">
        {preview.map((item) => (
          <span key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </span>
        ))}
      </span>
    </button>
  );
}

function DetailShell({
  mode,
  title,
  label,
  children,
  onBack,
}: {
  mode: DownloadingMode;
  title: string;
  label: string;
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <section className="download-detail-page" data-mode={mode}>
      <div className="download-detail-heading">
        <button type="button" className="download-back-button" onClick={onBack}>
          <BackIcon />
          <span>Back</span>
        </button>

        <div>
          <p className="panel-label">{label}</p>
          <h2>{title}</h2>
        </div>
      </div>

      {children}
    </section>
  );
}

function ChildItemList({ items }: { items: ChildDownloadItem[] }) {
  return (
    <div className="child-item-list">
      {items.map((item) => (
        <article className="child-item-row" data-status={item.status} key={item.id}>
          <div>
            <h3>{item.name}</h3>
            <span>{item.sizeLabel}</span>
          </div>
          <strong className="child-status-badge">
            {getChildStatusLabel(item.status)}
          </strong>
        </article>
      ))}
    </div>
  );
}

function MonoDownloadsView({ onBack }: { onBack: () => void }) {
  const activeDownloads = getItemsByStatus("active");
  const pausedDownloads = getItemsByStatus("paused");
  const stoppedDownloads = getItemsByStatus("stopped");

  const summaryItems = [
    { label: "Active", value: activeDownloads.length.toString() },
    { label: "Paused", value: pausedDownloads.length.toString() },
    { label: "Stopped", value: stoppedDownloads.length.toString() },
    { label: "Avg speed", value: getAverageSpeedLabel(monoDownloads) },
  ];

  return (
    <DetailShell
      label="Mono"
      mode="mono"
      onBack={onBack}
      title="Compact download list"
    >
      <div className="download-summary-bar">
        {summaryItems.map((item) => (
          <div className="download-summary-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="download-stack">
        <DownloadSection
          title="Active"
          count={activeDownloads.length}
          items={activeDownloads}
        />
        <DownloadSection
          title="Paused"
          count={pausedDownloads.length}
          items={pausedDownloads}
          muted
        />
        <DownloadSection
          title="Stopped"
          count={stoppedDownloads.length}
          items={stoppedDownloads}
          muted
        />
      </div>
    </DetailShell>
  );
}

function MultipleDownloadsView({ onBack }: { onBack: () => void }) {
  const [selectedBatch, setSelectedBatch] = useState<MultipleDownloadItem | null>(
    null,
  );
  const completedTotal = multipleDownloads.reduce(
    (total, item) => total + item.completedLinks,
    0,
  );
  const failedTotal = multipleDownloads.reduce(
    (total, item) => total + item.failedLinks,
    0,
  );
  const pausedTotal = multipleDownloads.reduce(
    (total, item) => total + item.pausedLinks,
    0,
  );

  if (selectedBatch) {
    return (
      <DetailShell
        label="Multiple"
        mode="multiple"
        onBack={() => setSelectedBatch(null)}
        title={selectedBatch.name}
      >
        <div className="download-detail-stats">
          <div>
            <span>Links</span>
            <strong>
              {selectedBatch.completedLinks}/{selectedBatch.totalLinks}
            </strong>
          </div>
          <div>
            <span>Failed</span>
            <strong>{selectedBatch.failedLinks}</strong>
          </div>
          <div>
            <span>Paused</span>
            <strong>{selectedBatch.pausedLinks}</strong>
          </div>
        </div>

        <ChildItemList items={selectedBatch.children} />
      </DetailShell>
    );
  }

  return (
    <DetailShell
      label="Multiple"
      mode="multiple"
      onBack={onBack}
      title="Grouped download batches"
    >
      <div className="download-detail-stats">
        <div>
          <span>Batches</span>
          <strong>{multipleDownloads.length}</strong>
        </div>
        <div>
          <span>Links done</span>
          <strong>{completedTotal}</strong>
        </div>
        <div>
          <span>Failed</span>
          <strong>{failedTotal}</strong>
        </div>
        <div>
          <span>Paused</span>
          <strong>{pausedTotal}</strong>
        </div>
        <div>
          <span>Speed</span>
          <strong>44.70 Mbps</strong>
        </div>
      </div>

      <div className="multiple-download-list">
        {multipleDownloads.map((item) => (
          <button
            className="multiple-download-row"
            data-status={item.status}
            key={item.id}
            type="button"
            onClick={() => setSelectedBatch(item)}
          >
            <div className="multiple-download-main">
              <h3>{item.name}</h3>
              <span>{item.sizeLabel}</span>
            </div>

            <strong className="multiple-link-count">
              {getLinkStatusSummary(item)}
            </strong>

            <div
              className="download-progress"
              style={getProgressStyle(item.progress)}
              role="progressbar"
              aria-label={`${item.name} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={item.progress}
            >
              <span />
            </div>

            <div className="multiple-download-meta">
              <strong>{item.speedLabel}</strong>
              <span>{item.etaLabel}</span>
            </div>
          </button>
        ))}
      </div>
    </DetailShell>
  );
}

function ScannerView({ onBack }: { onBack: () => void }) {
  const [selectedScan, setSelectedScan] = useState<ScannerItem | null>(null);
  const completedTotal = scannerItems.reduce(
    (total, item) => total + item.completedLinks,
    0,
  );
  const failedTotal = scannerItems.reduce(
    (total, item) => total + item.failedLinks,
    0,
  );
  const pausedTotal = scannerItems.reduce(
    (total, item) => total + item.pausedLinks,
    0,
  );

  if (selectedScan) {
    return (
      <DetailShell
        label="Scanner"
        mode="scanner"
        onBack={() => setSelectedScan(null)}
        title={selectedScan.name}
      >
        <div className="download-detail-stats">
          <div>
            <span>Links</span>
            <strong>
              {selectedScan.completedLinks}/{selectedScan.discoveredLinks}
            </strong>
          </div>
          <div>
            <span>Failed</span>
            <strong>{selectedScan.failedLinks}</strong>
          </div>
          <div>
            <span>Paused</span>
            <strong>{selectedScan.pausedLinks}</strong>
          </div>
          <div>
            <span>Queued</span>
            <strong>{selectedScan.queuedLinks}</strong>
          </div>
        </div>

        <ChildItemList items={selectedScan.children} />
      </DetailShell>
    );
  }

  return (
    <DetailShell
      label="Scanner"
      mode="scanner"
      onBack={onBack}
      title="Running page scans"
    >
      <div className="download-detail-stats">
        <div>
          <span>Succeeded</span>
          <strong>{completedTotal}</strong>
        </div>
        <div>
          <span>Failed</span>
          <strong>{failedTotal}</strong>
        </div>
        <div>
          <span>Paused</span>
          <strong>{pausedTotal}</strong>
        </div>
      </div>

      <div className="scanner-list">
        {scannerItems.map((item) => (
          <button
            className="scanner-row"
            key={item.id}
            type="button"
            onClick={() => setSelectedScan(item)}
          >
            <span className="multi-scan-icon">
              <LinkScanIcon />
            </span>

            <div className="scanner-row-main">
              <h3>{item.name}</h3>
              <span>{item.sourceUrl}</span>
            </div>

            <div
              className="download-progress"
              style={getProgressStyle(item.progress)}
              role="progressbar"
              aria-label={`${item.name} scan progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={item.progress}
            >
              <span />
            </div>

            <div className="scanner-row-meta">
              <strong>{item.statusLabel}</strong>
              <span>
                {getLinkStatusSummary({
                  completedLinks: item.completedLinks,
                  failedLinks: item.failedLinks,
                  pausedLinks: item.pausedLinks,
                  totalLinks: item.discoveredLinks,
                })}
              </span>
              <span>{item.queuedLinks} queued</span>
            </div>
          </button>
        ))}
      </div>
    </DetailShell>
  );
}

export function DownloadingPage({ onPathChange }: DownloadingPageProps) {
  const [mode, setMode] = useState<DownloadingMode | null>(null);
  const activeDownloads = getItemsByStatus("active");
  const pausedDownloads = getItemsByStatus("paused");
  const stoppedDownloads = getItemsByStatus("stopped");

  useEffect(() => {
    onPathChange?.(mode ? [modePathLabels[mode]] : []);

    return () => {
      onPathChange?.([]);
    };
  }, [mode, onPathChange]);

  if (mode === "mono") {
    return <MonoDownloadsView onBack={() => setMode(null)} />;
  }

  if (mode === "multiple") {
    return <MultipleDownloadsView onBack={() => setMode(null)} />;
  }

  if (mode === "scanner") {
    return <ScannerView onBack={() => setMode(null)} />;
  }

  return (
    <section className="download-overview-page" aria-label="Downloading overview">
      <div className="download-overview-hero">
        <div>
          <p className="panel-label">Downloading</p>
          <h2>Download overview</h2>
        </div>
        <div className="download-overview-total">
          <span>Total</span>
          <strong>
            {monoDownloads.length + multipleDownloads.length + scannerItems.length}
          </strong>
        </div>
      </div>

      <div className="download-overview-grid">
        <ModeCard
          detail={`${monoDownloads.length} files`}
          mode="mono"
          onOpen={setMode}
          preview={[
            { label: "Active", value: activeDownloads.length.toString() },
            { label: "Paused", value: pausedDownloads.length.toString() },
            { label: "Stopped", value: stoppedDownloads.length.toString() },
          ]}
          title="Mono"
        />
        <ModeCard
          detail={`${multipleDownloads.length} batches`}
          mode="multiple"
          onOpen={setMode}
          preview={multipleDownloads.slice(0, 2).map((item) => ({
            label: item.name,
            value: getLinkStatusSummary(item),
          }))}
          title="Multiple"
        />
        <ModeCard
          detail={`${scannerItems.length} scans`}
          mode="scanner"
          onOpen={setMode}
          preview={scannerItems.slice(0, 2).map((item) => ({
            label: item.name,
            value: getLinkStatusSummary({
              completedLinks: item.completedLinks,
              failedLinks: item.failedLinks,
              pausedLinks: item.pausedLinks,
              totalLinks: item.discoveredLinks,
            }),
          }))}
          title="Scanner"
        />
      </div>
    </section>
  );
}
