import { invoke } from "@tauri-apps/api/core";

import type { StorageItemInfo } from "../types";

export function getStorageItemInfo(path: string) {
  return invoke<StorageItemInfo>("get_storage_item_info", { path });
}

export function renameStorageItem(path: string, newName: string) {
  return invoke<string>("rename_storage_item", { path, newName });
}

export function moveStorageItem(path: string, targetFolder: string) {
  return invoke<string>("move_storage_item", { path, targetFolder });
}

export function zipStorageItem(path: string, destinationZip: string) {
  return invoke<string>("zip_storage_item", { path, destinationZip });
}

export function unzipStorageItem(zipPath: string, destinationFolder: string) {
  return invoke<string>("unzip_storage_item", { zipPath, destinationFolder });
}

export function openStorageLocation(path: string) {
  return invoke<void>("open_storage_location", { path });
}

export function deleteStorageItem(path: string) {
  return invoke<void>("delete_storage_item", { path });
}
