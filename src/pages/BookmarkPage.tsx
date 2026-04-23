import { useMemo, useState, type ReactNode } from "react";

import type {
  BookmarkActivityKind,
  BookmarkItem,
  BookmarkStatus,
} from "../types";

type BookmarkFilter = "all" | "downloaded" | "scanned" | "favorites" | "issues";

export const bookmarkItems: BookmarkItem[] = [
  {
    id: "open-media-index",
    siteName: "Open Media Index",
    siteUrl: "https://media.example.com/library/search?q=documentary-pack",
    domain: "media.example.com",
    logoLabel: "OM",
    coverTone: "media",
    status: "ready",
    tags: ["video", "mono", "trusted"],
    downloadedCount: 18,
    scanCount: 4,
    lastActivityLabel: "Today 14:22",
    lastDownloadTitle: "Wildlife documentary pack",
    lastScanQuery: "documentary pack 1080p",
    notes: "Site fiable pour les longs fichiers video. Les derniers scans sont regroupes par titre pour pouvoir retrouver rapidement les lots deja inspectes.",
    activities: [
      {
        id: "open-media-search-1",
        kind: "search",
        title: "documentary pack 1080p",
        sourceLabel: "Titre recherche",
        dateLabel: "Today 13:50",
        resultLabel: "12 links found",
      },
      {
        id: "open-media-favorite-1",
        kind: "favorite",
        title: "Wildlife documentary pack",
        sourceLabel: "Ajoute en favoris",
        dateLabel: "Today 14:02",
        resultLabel: "Ready to download",
      },
      {
        id: "open-media-download-1",
        kind: "download",
        title: "Wildlife documentary pack",
        sourceLabel: "Mono download",
        dateLabel: "Today 14:22",
        resultLabel: "18.4 Gb saved",
      },
    ],
  },
  {
    id: "linux-releases",
    siteName: "Linux Release Mirror",
    siteUrl: "https://mirror.example.org/releases/linux/latest",
    domain: "mirror.example.org",
    logoLabel: "LR",
    coverTone: "mirror",
    status: "watched",
    tags: ["iso", "multiple", "watch"],
    downloadedCount: 6,
    scanCount: 2,
    lastActivityLabel: "Yesterday 21:08",
    lastDownloadTitle: "Linux ISO mirror pack",
    lastScanQuery: "desktop iso 2026",
    notes: "Source utile pour les lots multi-liens. A garder en surveillance pour les nouveaux dossiers de release.",
    activities: [
      {
        id: "linux-search-1",
        kind: "search",
        title: "desktop iso 2026",
        sourceLabel: "Titre recherche",
        dateLabel: "Yesterday 20:36",
        resultLabel: "9 candidates",
      },
      {
        id: "linux-scan-1",
        kind: "scan",
        title: "latest release folder",
        sourceLabel: "Directory scan",
        dateLabel: "Yesterday 20:46",
        resultLabel: "9 links found",
      },
      {
        id: "linux-download-1",
        kind: "download",
        title: "Linux ISO mirror pack",
        sourceLabel: "Multiple batch",
        dateLabel: "Yesterday 21:08",
        resultLabel: "6 files saved",
      },
    ],
  },
  {
    id: "dataset-hub",
    siteName: "Dataset Hub",
    siteUrl: "https://datasets.example.net/collections/images/mnist-preview",
    domain: "datasets.example.net",
    logoLabel: "DH",
    coverTone: "dataset",
    status: "ready",
    tags: ["image", "dataset", "scan"],
    downloadedCount: 3,
    scanCount: 7,
    lastActivityLabel: "Apr 20 10:05",
    lastDownloadTitle: "MNIST preview sample.png",
    lastScanQuery: "mnist preview sample",
    notes: "Principalement des images et petits fichiers metadata. Bon candidat pour brancher une preview reelle plus tard.",
    activities: [
      {
        id: "dataset-favorite-1",
        kind: "favorite",
        title: "MNIST preview collection",
        sourceLabel: "Collection favorite",
        dateLabel: "Apr 20 09:52",
        resultLabel: "48 images kept",
      },
      {
        id: "dataset-scan-1",
        kind: "scan",
        title: "mnist preview sample",
        sourceLabel: "Image scan",
        dateLabel: "Apr 20 10:05",
        resultLabel: "34 assets found",
      },
      {
        id: "dataset-download-1",
        kind: "download",
        title: "MNIST preview sample.png",
        sourceLabel: "Mono download",
        dateLabel: "Apr 20 10:05",
        resultLabel: "150.7 Mb saved",
      },
    ],
  },
  {
    id: "course-vault",
    siteName: "Course Vault",
    siteUrl: "https://learn.example.io/archive/course-video-bundle",
    domain: "learn.example.io",
    logoLabel: "CV",
    coverTone: "course",
    status: "issue",
    tags: ["video", "multiple", "retry"],
    downloadedCount: 22,
    scanCount: 5,
    lastActivityLabel: "Apr 18 19:02",
    lastDownloadTitle: "Course video bundle",
    lastScanQuery: "module archive full course",
    notes: "Le dernier scan contient des modules manquants. Garder ce site visible dans Issues jusqu'a ce que le retry soit pret.",
    activities: [
      {
        id: "course-search-1",
        kind: "search",
        title: "module archive full course",
        sourceLabel: "Titre recherche",
        dateLabel: "Apr 18 18:20",
        resultLabel: "24 modules listed",
      },
      {
        id: "course-scan-1",
        kind: "scan",
        title: "course bundle page",
        sourceLabel: "Page scan",
        dateLabel: "Apr 18 18:31",
        resultLabel: "2 failed",
      },
      {
        id: "course-download-1",
        kind: "download",
        title: "Course video bundle",
        sourceLabel: "Multiple batch",
        dateLabel: "Apr 18 19:02",
        resultLabel: "22/24 saved",
      },
    ],
  },
  {
    id: "photo-wall",
    siteName: "Photo Wall",
    siteUrl: "https://photos.example.app/albums/city-night-reference",
    domain: "photos.example.app",
    logoLabel: "PW",
    coverTone: "photo",
    status: "watched",
    tags: ["photo", "album", "watch"],
    downloadedCount: 0,
    scanCount: 3,
    lastActivityLabel: "Apr 16 11:20",
    lastScanQuery: "city night reference",
    notes: "Les albums scannes sont utiles pour constituer une collection plus tard, mais aucun fichier n'a encore ete telecharge.",
    activities: [
      {
        id: "photo-search-1",
        kind: "search",
        title: "night street album",
        sourceLabel: "Titre recherche",
        dateLabel: "Apr 16 10:54",
        resultLabel: "2 albums kept",
      },
      {
        id: "photo-favorite-1",
        kind: "favorite",
        title: "City night reference",
        sourceLabel: "Album favori",
        dateLabel: "Apr 16 11:08",
        resultLabel: "Watch enabled",
      },
      {
        id: "photo-scan-1",
        kind: "scan",
        title: "city night reference",
        sourceLabel: "Album scan",
        dateLabel: "Apr 16 11:20",
        resultLabel: "48 images found",
      },
    ],
  },
  {
    id: "docs-archive",
    siteName: "Docs Archive",
    siteUrl: "https://docs.example.dev/reference/offline-export",
    domain: "docs.example.dev",
    logoLabel: "DA",
    coverTone: "docs",
    status: "ready",
    tags: ["document", "zip"],
    downloadedCount: 4,
    scanCount: 0,
    lastActivityLabel: "Apr 12 08:40",
    lastDownloadTitle: "Offline documentation export.zip",
    notes: "Archives zip et exports offline. Pas encore d'historique de scan pour ce site.",
    activities: [
      {
        id: "docs-favorite-1",
        kind: "favorite",
        title: "Offline reference export",
        sourceLabel: "Lien favori",
        dateLabel: "Apr 12 08:25",
        resultLabel: "Pinned",
      },
      {
        id: "docs-download-1",
        kind: "download",
        title: "Offline documentation export.zip",
        sourceLabel: "Mono download",
        dateLabel: "Apr 12 08:40",
        resultLabel: "820 Mb saved",
      },
    ],
  },
];

const filterLabels: Record<BookmarkFilter, string> = {
  all: "All",
  downloaded: "Downloaded",
  scanned: "Scanned",
  favorites: "Favorites",
  issues: "Issues",
};

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17v3h3L18 9l-3-3L4 17Z" />
      <path d="m14 7 3 3" />
    </svg>
  );
}

function FavoriteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h10v15l-5-3-5 3V5Z" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7V5h4" />
      <path d="M15 5h4v4" />
      <path d="M19 15v4h-4" />
      <path d="M9 19H5v-4" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.2-4.2" />
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 14h10l1-14" />
    </svg>
  );
}

function ActivityIcon({ kind }: { kind: BookmarkActivityKind }) {
  if (kind === "download") {
    return <DownloadIcon />;
  }

  if (kind === "scan") {
    return <ScanIcon />;
  }

  if (kind === "favorite") {
    return <FavoriteIcon />;
  }

  return <SearchIcon />;
}

function statusLabel(status: BookmarkStatus) {
  if (status === "ready") {
    return "Ready";
  }

  if (status === "watched") {
    return "Watched";
  }

  return "Issue";
}

function activityKindLabel(kind: BookmarkActivityKind) {
  if (kind === "download") {
    return "Download";
  }

  if (kind === "scan") {
    return "Scan";
  }

  if (kind === "favorite") {
    return "Favorite";
  }

  return "Search";
}

function itemMatchesSearch(item: BookmarkItem, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const values = [
    item.siteName,
    item.siteUrl,
    item.domain,
    item.lastDownloadTitle ?? "",
    item.lastScanQuery ?? "",
    item.notes ?? "",
    ...item.tags,
    ...item.activities.flatMap((activity) => [
      activity.title,
      activity.sourceLabel,
      activity.resultLabel,
    ]),
  ];

  return values.some((value) => value.toLowerCase().includes(normalized));
}

function itemMatchesFilter(item: BookmarkItem, filter: BookmarkFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "downloaded") {
    return item.downloadedCount > 0;
  }

  if (filter === "scanned") {
    return item.scanCount > 0;
  }

  if (filter === "favorites") {
    return item.activities.some((activity) => activity.kind === "favorite");
  }

  return item.status === "issue";
}

function BookmarkActionButton({
  children,
  icon,
}: {
  children: string;
  icon: ReactNode;
}) {
  return (
    <button type="button" disabled>
      {icon}
      <span>{children}</span>
    </button>
  );
}

function BookmarkSiteCard({
  item,
  onOpen,
}: {
  item: BookmarkItem;
  onOpen: () => void;
}) {
  return (
    <button
      className="bookmark-site-card"
      data-status={item.status}
      type="button"
      onClick={onOpen}
    >
      <span className="bookmark-site-cover" data-cover={item.coverTone}>
        <span className="bookmark-logo" aria-hidden="true">
          {item.logoLabel}
        </span>
        <span className="bookmark-status" data-status={item.status}>
          {statusLabel(item.status)}
        </span>
      </span>

      <span className="bookmark-site-caption">
        <strong>{item.siteName}</strong>
        <span>{item.domain}</span>
      </span>
    </button>
  );
}

function BookmarkOverview({
  filter,
  filteredItems,
  query,
  onFilterChange,
  onOpen,
  onQueryChange,
}: {
  filter: BookmarkFilter;
  filteredItems: BookmarkItem[];
  query: string;
  onFilterChange: (filter: BookmarkFilter) => void;
  onOpen: (id: string) => void;
  onQueryChange: (query: string) => void;
}) {
  return (
    <>
      <div className="bookmark-board-toolbar">
        <label className="bookmark-search">
          <span>Search</span>
          <input
            type="search"
            value={query}
            placeholder="Site, URL, title, tag"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <div className="bookmark-toolbar-actions" aria-label="Bookmark actions">
          <BookmarkActionButton icon={<AddIcon />}>Add</BookmarkActionButton>
          <BookmarkActionButton icon={<EditIcon />}>Modify</BookmarkActionButton>
          <BookmarkActionButton icon={<TrashIcon />}>Remove</BookmarkActionButton>
        </div>
      </div>

      <div className="bookmark-filter-group" aria-label="Bookmark filters">
        {(Object.keys(filterLabels) as BookmarkFilter[]).map((filterId) => (
          <button
            className="bookmark-filter"
            data-active={filter === filterId || undefined}
            key={filterId}
            type="button"
            onClick={() => onFilterChange(filterId)}
          >
            {filterLabels[filterId]}
          </button>
        ))}
      </div>

      <div className="bookmark-site-grid" aria-label="Bookmarked sites">
        {filteredItems.map((item) => (
          <BookmarkSiteCard item={item} key={item.id} onOpen={() => onOpen(item.id)} />
        ))}

        {filteredItems.length === 0 ? (
          <div className="bookmark-empty">
            <strong>No bookmark found</strong>
            <span>Try another search or filter.</span>
          </div>
        ) : null}
      </div>
    </>
  );
}

function BookmarkDetailView({
  item,
  onBack,
}: {
  item: BookmarkItem;
  onBack: () => void;
}) {
  return (
    <section className="bookmark-detail-view" aria-label={`${item.siteName} bookmark details`}>
      <div className="bookmark-detail-top">
        <button type="button" className="bookmark-back-button" onClick={onBack}>
          <BackIcon />
          <span>Back</span>
        </button>

        <div>
          <p className="panel-label">Bookmark site</p>
          <h2>{item.siteName}</h2>
        </div>

        <div className="bookmark-toolbar-actions" aria-label="Bookmark detail actions">
          <BookmarkActionButton icon={<AddIcon />}>Add favorite</BookmarkActionButton>
          <BookmarkActionButton icon={<EditIcon />}>Modify</BookmarkActionButton>
        </div>
      </div>

      <div className="bookmark-detail-layout">
        <div className="bookmark-result-panel">
          <div className="bookmark-result-heading">
            <div>
              <p className="panel-label">History</p>
              <h3>Research and favorites</h3>
            </div>
            <span>{item.activities.length} items</span>
          </div>

          <div className="bookmark-result-list">
            {item.activities.map((activity) => (
              <article
                className="bookmark-result-row"
                data-kind={activity.kind}
                key={activity.id}
              >
                <span className="bookmark-activity-icon">
                  <ActivityIcon kind={activity.kind} />
                </span>
                <div>
                  <span>{activityKindLabel(activity.kind)}</span>
                  <strong>{activity.title}</strong>
                  <em>{activity.sourceLabel}</em>
                </div>
                <div>
                  <span>{activity.dateLabel}</span>
                  <strong>{activity.resultLabel}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="bookmark-site-description" data-status={item.status}>
          <div className="bookmark-site-cover" data-cover={item.coverTone}>
            <span className="bookmark-logo" aria-hidden="true">
              {item.logoLabel}
            </span>
            <span className="bookmark-status" data-status={item.status}>
              {statusLabel(item.status)}
            </span>
          </div>

          <div className="bookmark-description-copy">
            <p className="panel-label">{item.domain}</p>
            <h3>{item.siteName}</h3>
            <span>{item.siteUrl}</span>
            <p>{item.notes}</p>
          </div>

          <div className="bookmark-description-stats">
            <div>
              <span>Downloads</span>
              <strong>{item.downloadedCount}</strong>
            </div>
            <div>
              <span>Scans</span>
              <strong>{item.scanCount}</strong>
            </div>
            <div>
              <span>Last activity</span>
              <strong>{item.lastActivityLabel}</strong>
            </div>
          </div>

          <div className="bookmark-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function BookmarkPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BookmarkFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return bookmarkItems
      .filter((item) => itemMatchesSearch(item, query))
      .filter((item) => itemMatchesFilter(item, filter));
  }, [filter, query]);

  const selectedItem = selectedId
    ? bookmarkItems.find((item) => item.id === selectedId) ?? null
    : null;

  return (
    <section className="bookmark-page" aria-label="Download bookmarks">
      {selectedItem ? (
        <BookmarkDetailView item={selectedItem} onBack={() => setSelectedId(null)} />
      ) : (
        <BookmarkOverview
          filter={filter}
          filteredItems={filteredItems}
          onFilterChange={setFilter}
          onOpen={setSelectedId}
          onQueryChange={setQuery}
          query={query}
        />
      )}
    </section>
  );
}
