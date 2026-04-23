use std::{
    fs,
    fs::File,
    io,
    path::{Path, PathBuf},
};

use zip::{write::SimpleFileOptions, ZipArchive, ZipWriter};

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
struct AppInfo {
    name: &'static str,
    version: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
struct StorageItemInfo {
    path: String,
    name: String,
    exists: bool,
    is_directory: bool,
    size_bytes: u64,
}

fn storage_error(error: impl std::fmt::Display) -> String {
    error.to_string()
}

fn path_name(path: &Path) -> Result<String, String> {
    path.file_name()
        .and_then(|name| name.to_str())
        .map(ToOwned::to_owned)
        .ok_or_else(|| "Path has no valid file name".to_string())
}

fn validate_file_name(file_name: &str) -> Result<(), String> {
    if file_name.trim().is_empty() {
        return Err("Name cannot be empty".to_string());
    }

    let has_separator = file_name.contains('/')
        || file_name.contains('\\')
        || Path::new(file_name).components().count() != 1;

    if has_separator {
        return Err("Name must not contain path separators".to_string());
    }

    Ok(())
}

fn directory_size(path: &Path) -> Result<u64, String> {
    if path.is_file() {
        return fs::metadata(path)
            .map(|metadata| metadata.len())
            .map_err(storage_error);
    }

    let mut total = 0;
    for entry in fs::read_dir(path).map_err(storage_error)? {
        let entry = entry.map_err(storage_error)?;
        let child_path = entry.path();

        if child_path.is_dir() {
            total += directory_size(&child_path)?;
        } else {
            total += fs::metadata(&child_path)
                .map(|metadata| metadata.len())
                .map_err(storage_error)?;
        }
    }

    Ok(total)
}

fn read_storage_item_info(path: impl Into<PathBuf>) -> Result<StorageItemInfo, String> {
    let path = path.into();
    let exists = path.exists();
    let is_directory = exists && path.is_dir();
    let size_bytes = if exists { directory_size(&path)? } else { 0 };
    let name = path_name(&path).unwrap_or_else(|_| path.display().to_string());

    Ok(StorageItemInfo {
        path: path.display().to_string(),
        name,
        exists,
        is_directory,
        size_bytes,
    })
}

fn add_path_to_zip(
    writer: &mut ZipWriter<File>,
    path: &Path,
    base_path: &Path,
    options: SimpleFileOptions,
) -> Result<(), String> {
    if path.is_dir() {
        let relative = path.strip_prefix(base_path).map_err(storage_error)?;
        let relative_name = relative.to_string_lossy().replace('\\', "/");

        if !relative_name.is_empty() {
            writer
                .add_directory(format!("{}/", relative_name.trim_end_matches('/')), options)
                .map_err(storage_error)?;
        }

        for entry in fs::read_dir(path).map_err(storage_error)? {
            let entry = entry.map_err(storage_error)?;
            add_path_to_zip(writer, &entry.path(), base_path, options)?;
        }

        return Ok(());
    }

    let relative = path.strip_prefix(base_path).map_err(storage_error)?;
    let relative_name = if relative.as_os_str().is_empty() {
        path_name(path)?
    } else {
        relative.to_string_lossy().replace('\\', "/")
    };

    writer
        .start_file(relative_name, options)
        .map_err(storage_error)?;
    let mut source = File::open(path).map_err(storage_error)?;
    io::copy(&mut source, writer).map_err(storage_error)?;

    Ok(())
}

fn zip_path(source_path: &Path, destination_zip: &Path) -> Result<(), String> {
    if !source_path.exists() {
        return Err("Source path does not exist".to_string());
    }

    if destination_zip.exists() {
        return Err("Destination zip already exists".to_string());
    }

    if let Some(parent) = destination_zip.parent() {
        fs::create_dir_all(parent).map_err(storage_error)?;
    }

    let zip_file = File::create(destination_zip).map_err(storage_error)?;
    let mut writer = ZipWriter::new(zip_file);
    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o644);

    if source_path.is_dir() {
        add_path_to_zip(&mut writer, source_path, source_path, options)?;
    } else {
        let base_path = source_path
            .parent()
            .ok_or_else(|| "Source path has no parent folder".to_string())?;
        add_path_to_zip(&mut writer, source_path, base_path, options)?;
    }

    writer.finish().map_err(storage_error)?;
    Ok(())
}

fn unzip_path(zip_path: &Path, destination_folder: &Path) -> Result<(), String> {
    if !zip_path.exists() {
        return Err("Zip path does not exist".to_string());
    }

    fs::create_dir_all(destination_folder).map_err(storage_error)?;

    let zip_file = File::open(zip_path).map_err(storage_error)?;
    let mut archive = ZipArchive::new(zip_file).map_err(storage_error)?;

    for index in 0..archive.len() {
        let mut file = archive.by_index(index).map_err(storage_error)?;
        let enclosed_name = file
            .enclosed_name()
            .ok_or_else(|| "Archive contains an unsafe path".to_string())?;
        let output_path = destination_folder.join(enclosed_name);

        if file.is_dir() {
            fs::create_dir_all(&output_path).map_err(storage_error)?;
            continue;
        }

        if let Some(parent) = output_path.parent() {
            fs::create_dir_all(parent).map_err(storage_error)?;
        }

        if output_path.exists() {
            return Err(format!(
                "Destination file already exists: {}",
                output_path.display()
            ));
        }

        let mut output_file = File::create(&output_path).map_err(storage_error)?;
        io::copy(&mut file, &mut output_file).map_err(storage_error)?;
    }

    Ok(())
}

#[tauri::command]
fn get_app_info() -> AppInfo {
    AppInfo {
        name: "FluxDL",
        version: env!("CARGO_PKG_VERSION"),
    }
}

#[tauri::command]
fn get_storage_item_info(path: String) -> Result<StorageItemInfo, String> {
    read_storage_item_info(path)
}

#[tauri::command]
fn rename_storage_item(path: String, new_name: String) -> Result<String, String> {
    validate_file_name(&new_name)?;

    let source_path = PathBuf::from(path);
    if !source_path.exists() {
        return Err("Source path does not exist".to_string());
    }

    let parent = source_path
        .parent()
        .ok_or_else(|| "Source path has no parent folder".to_string())?;
    let destination_path = parent.join(new_name);

    if destination_path.exists() {
        return Err("Destination already exists".to_string());
    }

    fs::rename(&source_path, &destination_path).map_err(storage_error)?;
    Ok(destination_path.display().to_string())
}

#[tauri::command]
fn move_storage_item(path: String, target_folder: String) -> Result<String, String> {
    let source_path = PathBuf::from(path);
    if !source_path.exists() {
        return Err("Source path does not exist".to_string());
    }

    let target_folder = PathBuf::from(target_folder);
    fs::create_dir_all(&target_folder).map_err(storage_error)?;

    let destination_path = target_folder.join(path_name(&source_path)?);
    if destination_path.exists() {
        return Err("Destination already exists".to_string());
    }

    fs::rename(&source_path, &destination_path).map_err(storage_error)?;
    Ok(destination_path.display().to_string())
}

#[tauri::command]
fn zip_storage_item(path: String, destination_zip: String) -> Result<String, String> {
    let source_path = PathBuf::from(path);
    let destination_zip = PathBuf::from(destination_zip);

    zip_path(&source_path, &destination_zip)?;
    Ok(destination_zip.display().to_string())
}

#[tauri::command]
fn unzip_storage_item(zip_path: String, destination_folder: String) -> Result<String, String> {
    let zip_path = PathBuf::from(zip_path);
    let destination_folder = PathBuf::from(destination_folder);

    unzip_path(&zip_path, &destination_folder)?;
    Ok(destination_folder.display().to_string())
}

#[tauri::command]
fn delete_storage_item(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);

    if !path.exists() {
        return Err("Path does not exist".to_string());
    }

    if path.is_dir() {
        fs::remove_dir_all(path).map_err(storage_error)?;
    } else {
        fs::remove_file(path).map_err(storage_error)?;
    }

    Ok(())
}

#[tauri::command]
fn open_storage_location(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    let folder = if path.is_dir() {
        path
    } else {
        path.parent()
            .ok_or_else(|| "Path has no parent folder".to_string())?
            .to_path_buf()
    };

    if !folder.exists() {
        return Err("Folder does not exist".to_string());
    }

    tauri_plugin_opener::open_path(folder, None::<&str>).map_err(storage_error)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            get_storage_item_info,
            rename_storage_item,
            move_storage_item,
            zip_storage_item,
            unzip_storage_item,
            delete_storage_item,
            open_storage_location
        ])
        .run(tauri::generate_context!())
        .expect("error while running FluxDL");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn app_info_uses_fluxdl_identity() {
        let info = get_app_info();

        assert_eq!(info.name, "FluxDL");
        assert_eq!(info.version, env!("CARGO_PKG_VERSION"));
    }

    fn test_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("fluxdl-{}-{}", name, std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn rename_storage_item_renames_file() {
        let dir = test_dir("rename");
        let source = dir.join("source.txt");
        fs::write(&source, "hello").unwrap();

        let renamed =
            rename_storage_item(source.display().to_string(), "renamed.txt".to_string()).unwrap();

        assert!(!source.exists());
        assert!(PathBuf::from(renamed).exists());

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn move_storage_item_moves_file() {
        let dir = test_dir("move");
        let source = dir.join("source.txt");
        let target_dir = dir.join("target");
        fs::write(&source, "hello").unwrap();

        let moved = move_storage_item(
            source.display().to_string(),
            target_dir.display().to_string(),
        )
        .unwrap();

        assert!(!source.exists());
        assert_eq!(PathBuf::from(moved), target_dir.join("source.txt"));

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn zip_and_unzip_storage_item_round_trips_file() {
        let dir = test_dir("zip");
        let source_dir = dir.join("source");
        let nested_dir = source_dir.join("nested");
        fs::create_dir_all(&nested_dir).unwrap();
        fs::write(source_dir.join("root.txt"), "root").unwrap();
        fs::write(nested_dir.join("child.txt"), "child").unwrap();

        let archive = dir.join("archive.zip");
        zip_storage_item(
            source_dir.display().to_string(),
            archive.display().to_string(),
        )
        .unwrap();
        assert!(archive.exists());

        let output_dir = dir.join("output");
        unzip_storage_item(
            archive.display().to_string(),
            output_dir.display().to_string(),
        )
        .unwrap();

        assert_eq!(
            fs::read_to_string(output_dir.join("root.txt")).unwrap(),
            "root"
        );
        assert_eq!(
            fs::read_to_string(output_dir.join("nested").join("child.txt")).unwrap(),
            "child"
        );

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn rename_storage_item_rejects_path_separator() {
        let dir = test_dir("bad-name");
        let source = dir.join("source.txt");
        fs::write(&source, "hello").unwrap();

        let error = rename_storage_item(source.display().to_string(), "bad/name.txt".to_string())
            .unwrap_err();

        assert_eq!(error, "Name must not contain path separators");

        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn delete_storage_item_deletes_file() {
        let dir = test_dir("delete");
        let source = dir.join("source.txt");
        fs::write(&source, "hello").unwrap();

        delete_storage_item(source.display().to_string()).unwrap();

        assert!(!source.exists());

        let _ = fs::remove_dir_all(dir);
    }
}
