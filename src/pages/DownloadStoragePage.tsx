import { Fragment, useMemo, useState } from "react";

import {
  deleteStorageItem,
  getStorageItemInfo,
  moveStorageItem,
  openStorageLocation,
  renameStorageItem,
  unzipStorageItem,
  zipStorageItem,
} from "../services/storageActions";
import type {
  ArchiveState,
  StorageDownloadItem,
  StorageFileType,
  StorageItemStatus,
} from "../types";

type StorageFilter = "all" | "mono" | "multiple" | "zip" | "extracted" | "issues";
type StorageSort = "name" | "size" | "modified";

const initialStorageItems: StorageDownloadItem[] = [
  {
    id: "wow-wrath-storage",
    name: "WoW: Wrath Of The Lich King",
    kind: "mono",
    fileType: "video",
    path: "/home/Sriel/Downloads/FluxDL/WoW-Wrath/Wrath intro.mkv",
    folder: "/home/Sriel/Downloads/FluxDL/WoW-Wrath",
    sizeLabel: "18.70 Gb",
    fileCount: 1,
    archiveState: "extracted",
    downloadedAtLabel: "Today 14:22",
    lastModifiedLabel: "Today 14:24",
    status: "ready",
  },
  {
    id: "avengers-storage",
    name: "Avengers Infinity War 1080p.zip",
    kind: "mono",
    fileType: "zip",
    path: "/home/Sriel/Downloads/FluxDL/Avengers-Infinity-War.zip",
    folder: "/home/Sriel/Downloads/FluxDL",
    sizeLabel: "12.10 Gb",
    fileCount: 1,
    archiveState: "zip",
    downloadedAtLabel: "Yesterday 21:04",
    lastModifiedLabel: "Yesterday 21:08",
    status: "ready",
  },
  {
    id: "mnist-preview-storage",
    name: "MNIST preview sample.png",
    kind: "mono",
    fileType: "image",
    path: "/home/Sriel/Downloads/FluxDL/MNIST/preview.png",
    folder: "/home/Sriel/Downloads/FluxDL/MNIST",
    sizeLabel: "150.70 Mb",
    fileCount: 1,
    archiveState: "none",
    downloadedAtLabel: "Apr 20 10:05",
    lastModifiedLabel: "Apr 20 10:05",
    status: "ready",
  },
  {
    id: "harry-potter-storage",
    name: "Harry Potter Collection",
    kind: "multiple",
    fileType: "folder",
    path: "/home/Sriel/Downloads/FluxDL/Harry-Potter-Collection",
    folder: "/home/Sriel/Downloads/FluxDL",
    sizeLabel: "42.10 Gb",
    fileCount: 15,
    archiveState: "extracted",
    downloadedAtLabel: "Monday 09:42",
    lastModifiedLabel: "Monday 10:12",
    status: "ready",
    children: [
      {
        id: "hp-storage-01",
        name: "Harry Potter 01.mkv",
        relativePath: "Harry-Potter-Collection/Harry Potter 01.mkv",
        fileType: "video",
        sizeLabel: "3.90 Gb",
        status: "ready",
      },
      {
        id: "hp-storage-02",
        name: "Harry Potter 02.mkv",
        relativePath: "Harry-Potter-Collection/Harry Potter 02.mkv",
        fileType: "video",
        sizeLabel: "4.10 Gb",
        status: "ready",
      },
      {
        id: "hp-storage-bonus",
        name: "Deleted scenes.mkv",
        relativePath: "Harry-Potter-Collection/Bonus/Deleted scenes.mkv",
        fileType: "video",
        sizeLabel: "820 Mb",
        status: "issue",
      },
    ],
  },
  {
    id: "course-storage",
    name: "Course video bundle",
    kind: "multiple",
    fileType: "folder",
    path: "/home/Sriel/Downloads/FluxDL/Course-video-bundle",
    folder: "/home/Sriel/Downloads/FluxDL",
    sizeLabel: "30.80 Gb",
    fileCount: 24,
    archiveState: "none",
    downloadedAtLabel: "Apr 18 18:31",
    lastModifiedLabel: "Apr 18 19:02",
    status: "issue",
    children: [
      {
        id: "course-storage-01",
        name: "Module 01.mp4",
        relativePath: "Course-video-bundle/Module 01.mp4",
        fileType: "video",
        sizeLabel: "1.40 Gb",
        status: "ready",
      },
      {
        id: "course-storage-19",
        name: "Module 19.mp4",
        relativePath: "Course-video-bundle/Module 19.mp4",
        fileType: "video",
        sizeLabel: "1.30 Gb",
        status: "missing",
      },
      {
        id: "course-storage-20",
        name: "Module 20.mp4",
        relativePath: "Course-video-bundle/Module 20.mp4",
        fileType: "video",
        sizeLabel: "1.45 Gb",
        status: "missing",
      },
    ],
  },
  {
    id: "linux-storage",
    name: "Linux ISO mirror pack.zip",
    kind: "multiple",
    fileType: "zip",
    path: "/home/Sriel/Downloads/FluxDL/Linux-ISO-mirror-pack.zip",
    folder: "/home/Sriel/Downloads/FluxDL",
    sizeLabel: "18.40 Gb",
    fileCount: 6,
    archiveState: "zip",
    downloadedAtLabel: "Apr 16 11:15",
    lastModifiedLabel: "Apr 16 11:20",
    status: "ready",
    children: [
      {
        id: "linux-storage-ubuntu",
        name: "Ubuntu desktop ISO",
        relativePath: "Linux-ISO-mirror-pack/ubuntu.iso",
        fileType: "document",
        sizeLabel: "5.80 Gb",
        status: "ready",
      },
      {
        id: "linux-storage-mint",
        name: "Linux Mint ISO",
        relativePath: "Linux-ISO-mirror-pack/mint.iso",
        fileType: "document",
        sizeLabel: "3.20 Gb",
        status: "ready",
      },
    ],
  },
];

const filterLabels: Record<StorageFilter, string> = {
  all: "All",
  mono: "Mono",
  multiple: "Multiple",
  zip: "Zip",
  extracted: "Extracted",
  issues: "Issues",
};

function ZipIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l3 3v15H7V3Z" />
      <path d="M14 3v4h4" />
      <path d="M10 7h2" />
      <path d="M10 11h2" />
      <path d="M10 15h2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h6l2 2h8v10H4V6Z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h12v12H4V6Z" />
      <path d="m16 10 4-2v8l-4-2" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16v14H4V5Z" />
      <path d="m7 16 4-5 3 3 2-2 3 4" />
      <path d="M8.5 8.5h.01" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l4 4v14H7V3Z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M8 10v9" />
      <path d="M16 10v9" />
      <path d="M6 7l1 14h10l1-14" />
    </svg>
  );
}

function RenameIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17v3h3L18 9l-3-3L4 17Z" />
      <path d="m14 7 3 3" />
      <path d="M11 20h9" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h6l2 2h8v9H4V7Z" />
      <path d="m13 13 3 3 3-3" />
      <path d="M16 10v6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14-4l-2 2" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8 8 0 0 0 14 4l2-2" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
}

function ItemIcon({ type }: { type: StorageFileType }) {
  if (type === "zip") {
    return <ZipIcon />;
  }

  if (type === "folder") {
    return <FolderIcon />;
  }

  if (type === "video") {
    return <VideoIcon />;
  }

  if (type === "image") {
    return <ImageIcon />;
  }

  return <FileIcon />;
}

function statusLabel(status: StorageItemStatus) {
  if (status === "ready") {
    return "Ready";
  }

  if (status === "missing") {
    return "Missing";
  }

  return "Issue";
}

function archiveLabel(state: ArchiveState) {
  if (state === "zip") {
    return "Zip";
  }

  if (state === "extracted") {
    return "Extracted";
  }

  return "Folder";
}

function fileTypeLabel(type: StorageFileType) {
  if (type === "zip") {
    return "Zip archive";
  }

  if (type === "folder") {
    return "Folder";
  }

  if (type === "video") {
    return "Video";
  }

  if (type === "image") {
    return "Image";
  }

  return "Document";
}

function parseSize(sizeLabel: string) {
  const value = Number.parseFloat(sizeLabel);
  if (!Number.isFinite(value)) {
    return 0;
  }

  return sizeLabel.toLowerCase().includes("mb") ? value / 1024 : value;
}

function itemMatchesSearch(item: StorageDownloadItem, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const childMatch = item.children?.some((child) =>
    [child.name, child.relativePath, child.sizeLabel, fileTypeLabel(child.fileType)].some(
      (value) => value.toLowerCase().includes(normalized),
    ),
  );

  return (
    [
      item.name,
      item.folder,
      item.path,
      item.sizeLabel,
      archiveLabel(item.archiveState),
      fileTypeLabel(item.fileType),
    ].some((value) => value.toLowerCase().includes(normalized)) || Boolean(childMatch)
  );
}

function itemMatchesFilter(item: StorageDownloadItem, filter: StorageFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "mono" || filter === "multiple") {
    return item.kind === filter;
  }

  if (filter === "zip" || filter === "extracted") {
    return item.archiveState === filter;
  }

  return item.status !== "ready" || Boolean(item.children?.some((child) => child.status !== "ready"));
}

function defaultZipPath(item: StorageDownloadItem) {
  return item.archiveState === "zip" ? item.path : `${item.path}.zip`;
}

function defaultExtractPath(item: StorageDownloadItem) {
  return item.archiveState === "zip"
    ? item.path.replace(/\.zip$/i, "")
    : `${item.path}-extracted`;
}

function previewItems(item: StorageDownloadItem) {
  return item.children?.slice(0, 4) ?? [item];
}

export function DownloadStoragePage() {
  const [items, setItems] = useState<StorageDownloadItem[]>(initialStorageItems);
  const [selectedId, setSelectedId] = useState(initialStorageItems[0]?.id ?? "");
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StorageFilter>("all");
  const [sort, setSort] = useState<StorageSort>("name");
  const [actionMessage, setActionMessage] = useState("Ready");
  const [isWorking, setIsWorking] = useState(false);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => itemMatchesSearch(item, query))
      .filter((item) => itemMatchesFilter(item, filter))
      .sort((left, right) => {
        if (sort === "size") {
          return parseSize(right.sizeLabel) - parseSize(left.sizeLabel);
        }

        if (sort === "modified") {
          return right.downloadedAtLabel.localeCompare(left.downloadedAtLabel);
        }

        return left.name.localeCompare(right.name);
      });
  }, [filter, items, query, sort]);

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? filteredItems[0] ?? items[0];
  const monoCount = items.filter((item) => item.kind === "mono").length;
  const multipleCount = items.filter((item) => item.kind === "multiple").length;
  const zipCount = items.filter((item) => item.archiveState === "zip").length;
  const issueCount = items.filter((item) => itemMatchesFilter(item, "issues")).length;
  const totalSize = `${items.reduce((total, item) => total + parseSize(item.sizeLabel), 0).toFixed(1)} Gb`;

  function selectItem(item: StorageDownloadItem) {
    setSelectedId(item.id);
    setOpenInfoId((currentId) => (currentId === item.id ? null : item.id));
    setActionMessage("Ready");
  }

  function patchSelectedItem(patch: Partial<StorageDownloadItem>) {
    if (!selectedItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === selectedItem.id ? { ...item, ...patch } : item,
      ),
    );
  }

  async function runAction(label: string, action: () => Promise<string | void>) {
    if (!selectedItem) {
      return;
    }

    setIsWorking(true);
    setActionMessage(`${label}...`);

    try {
      const result = await action();
      setActionMessage(result ? `${label}: ${result}` : `${label}: done`);
    } catch (error) {
      setActionMessage(`${label} failed: ${String(error)}`);
    } finally {
      setIsWorking(false);
    }
  }

  async function handleRename() {
    if (!selectedItem) {
      return;
    }

    const newName = window.prompt("Rename item", selectedItem.name)?.trim();
    if (!newName) {
      return;
    }

    await runAction("Rename", async () => {
      const nextPath = await renameStorageItem(selectedItem.path, newName);
      patchSelectedItem({
        name: newName,
        path: nextPath,
      });
      return nextPath;
    });
  }

  async function handleMove() {
    if (!selectedItem) {
      return;
    }

    const targetFolder = window.prompt("Move to folder", selectedItem.folder)?.trim();
    if (!targetFolder) {
      return;
    }

    await runAction("Move", async () => {
      const nextPath = await moveStorageItem(selectedItem.path, targetFolder);
      patchSelectedItem({
        path: nextPath,
        folder: targetFolder,
      });
      return nextPath;
    });
  }

  async function handleZip() {
    if (!selectedItem) {
      return;
    }

    await runAction("Zip", async () => {
      const zipPath = await zipStorageItem(selectedItem.path, defaultZipPath(selectedItem));
      patchSelectedItem({
        archiveState: "zip",
        fileType: "zip",
        path: zipPath,
        name: zipPath.split(/[\\/]/).pop() ?? selectedItem.name,
      });
      return zipPath;
    });
  }

  async function handleUnzip() {
    if (!selectedItem) {
      return;
    }

    await runAction("Unzip", async () => {
      const outputPath = await unzipStorageItem(selectedItem.path, defaultExtractPath(selectedItem));
      patchSelectedItem({
        archiveState: "extracted",
        fileType: "folder",
        path: outputPath,
        name: outputPath.split(/[\\/]/).pop() ?? selectedItem.name,
      });
      return outputPath;
    });
  }

  async function handleRefreshInfo() {
    if (!selectedItem) {
      return;
    }

    await runAction("Refresh", async () => {
      const info = await getStorageItemInfo(selectedItem.path);
      patchSelectedItem({
        name: info.name,
        status: info.exists ? "ready" : "missing",
      });
      return info.exists ? `${info.size_bytes} bytes` : "missing";
    });
  }

  async function handleDelete() {
    if (!selectedItem) {
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedItem.name}?`);
    if (!confirmed) {
      return;
    }

    await runAction("Delete", async () => {
      await deleteStorageItem(selectedItem.path);
      setItems((currentItems) => currentItems.filter((item) => item.id !== selectedItem.id));
      setSelectedId("");
      setOpenInfoId(null);
    });
  }

  return (
    <section className="storage-page" aria-label="Download storage">
      <div className="storage-summary-bar">
        <div>
          <span>Total</span>
          <strong>{totalSize}</strong>
        </div>
        <div>
          <span>Mono</span>
          <strong>{monoCount}</strong>
        </div>
        <div>
          <span>Multiple</span>
          <strong>{multipleCount}</strong>
        </div>
        <div>
          <span>Zip</span>
          <strong>{zipCount}</strong>
        </div>
        <div>
          <span>Issues</span>
          <strong>{issueCount}</strong>
        </div>
      </div>

      <div className="storage-toolbar">
        <label className="storage-search">
          <span>Search</span>
          <input
            type="search"
            value={query}
            placeholder="Name, folder, extension"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="storage-filter-group" aria-label="Storage filters">
          {(Object.keys(filterLabels) as StorageFilter[]).map((filterId) => (
            <button
              className="storage-filter"
              data-active={filter === filterId || undefined}
              key={filterId}
              type="button"
              onClick={() => setFilter(filterId)}
            >
              {filterLabels[filterId]}
            </button>
          ))}
        </div>

        <label className="storage-sort">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as StorageSort)}>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="modified">Downloaded</option>
          </select>
        </label>
      </div>

      <div className="storage-action-bar" aria-label="Storage actions">
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleZip}>
          <ZipIcon />
          <span>Zip</span>
        </button>
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleUnzip}>
          <FolderIcon />
          <span>Unzip</span>
        </button>
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleRefreshInfo}>
          <CheckIcon />
          <span>Check</span>
        </button>
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleDelete}>
          <TrashIcon />
          <span>Delete</span>
        </button>
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleRename}>
          <RenameIcon />
          <span>Rename</span>
        </button>
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleMove}>
          <MoveIcon />
          <span>Move</span>
        </button>
        <button
          type="button"
          disabled={!selectedItem || isWorking}
          onClick={() =>
            selectedItem
              ? runAction("Open folder", () => openStorageLocation(selectedItem.path))
              : undefined
          }
        >
          <FolderIcon />
          <span>Open folder</span>
        </button>
        <button type="button" disabled={!selectedItem || isWorking} onClick={handleRefreshInfo}>
          <RefreshIcon />
          <span>Refresh infos</span>
        </button>
      </div>

      <div className="storage-list storage-list-full" aria-label="Managed downloads">
        <div className="storage-list-head" aria-hidden="true">
          <span />
          <span>Name</span>
          <span>Badge</span>
          <span>Weight</span>
          <span>Files</span>
          <span>Downloaded</span>
        </div>

        {filteredItems.map((item) => (
          <Fragment key={item.id}>
            <button
              className="storage-row"
              data-selected={item.id === selectedItem?.id || undefined}
              data-status={item.status}
              type="button"
              onClick={() => selectItem(item)}
            >
              <span className="storage-row-icon" data-file-type={item.fileType}>
                <ItemIcon type={item.fileType} />
              </span>
              <span className="storage-row-main">
                <strong>{item.name}</strong>
                <span>{item.folder}</span>
              </span>
              <span className="storage-pill">{item.kind}</span>
              <span>{item.sizeLabel}</span>
              <span>{item.fileCount}</span>
              <span>{item.downloadedAtLabel}</span>
            </button>

            {openInfoId === item.id ? (
              <div className="storage-popover" role="tooltip">
                <div className="storage-popover-info">
                  <div>
                    <span>Name</span>
                    <strong>{item.name}</strong>
                  </div>
                  <div>
                    <span>Badge</span>
                    <strong>{item.kind}</strong>
                  </div>
                  <div>
                    <span>Path</span>
                    <strong>{item.path}</strong>
                  </div>
                  <div>
                    <span>Type</span>
                    <strong>{fileTypeLabel(item.fileType)}</strong>
                  </div>
                  <div>
                    <span>Files</span>
                    <strong>{item.fileCount}</strong>
                  </div>
                </div>

                <div className="storage-preview-strip">
                  {previewItems(item).map((previewItem) => (
                    <div
                      className="storage-preview-card"
                      data-file-type={previewItem.fileType}
                      key={previewItem.id}
                    >
                      <span className="storage-preview-frame">
                        <ItemIcon type={previewItem.fileType} />
                      </span>
                      <strong>{previewItem.name}</strong>
                      <span>
                        {"relativePath" in previewItem
                          ? previewItem.relativePath
                          : fileTypeLabel(previewItem.fileType)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      <p className="storage-action-message">{actionMessage}</p>
    </section>
  );
}
