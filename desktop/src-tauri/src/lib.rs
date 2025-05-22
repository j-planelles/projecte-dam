use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;
use aes_gcm::{
    aead::{
        generic_array::GenericArray,
        Aead,
        AeadCore,
        KeyInit,
        Nonce as AeadNonce,
        OsRng,
    },
    Aes256Gcm,
};

// CONFIGURACIÓ DE L'APLICACIÓ
const APP_CONFIG_SUBDIR: &str = "ultra-workouts";
const AUTH_CONFIG_FILENAME: &str = "auth_config.enc";

// Clau simètrica per a l'encriptació AES-256-GCM (32 bytes)
// Genera una clau nova amb: openssl rand -hex 16
const SYMMETRIC_KEY_BYTES: &[u8; 32] = b"4bbc3dcadddda036303ca137fb233962";
const NONCE_SIZE: usize = 12;

/// Obté la ruta completa del fitxer de configuració d'autenticació.
/// Crea el directori si no existeix.
///
fn get_auth_config_file_path(
    app_handle: &AppHandle,
) -> Result<PathBuf, String> {
    let base_config_dir = app_handle
        .path()
        .config_dir()
        .map_err(|e| {
            format!(
                "Failed to resolve user config directory (underlying error): {:?}",
                e
            )
        })?;

    let app_specific_config_dir = base_config_dir.join(APP_CONFIG_SUBDIR);

    if !app_specific_config_dir.exists() {
        fs::create_dir_all(&app_specific_config_dir).map_err(|e| {
            format!(
                "Failed to create app config directory at {}: {}",
                app_specific_config_dir.display(),
                e
            )
        })?;
    }

    Ok(app_specific_config_dir.join(AUTH_CONFIG_FILENAME))
}

/// Escriu la configuració d'autenticació encriptada al disc.
/// Utilitza AES-256-GCM amb un nonce aleatori.
///
#[tauri::command]
fn write_auth_config(
    app_handle: AppHandle,
    data: &str,
) -> Result<(), String> {
    let file_path = get_auth_config_file_path(&app_handle)?;

    let key_material = GenericArray::from_slice(SYMMETRIC_KEY_BYTES);
    let cipher = Aes256Gcm::new(&key_material);

    // Genera un nonce aleatori per a cada encriptació
    let nonce: AeadNonce<Aes256Gcm> = Aes256Gcm::generate_nonce(&mut OsRng);

    // Encripta les dades
    let ciphertext = cipher
        .encrypt(&nonce, data.as_bytes())
        .map_err(|e| format!("Encryption failed: {}", e))?;

    // Guarda el nonce al principi del fitxer, seguit del ciphertext
    let mut encrypted_data_with_nonce =
        Vec::with_capacity(NONCE_SIZE + ciphertext.len());
    encrypted_data_with_nonce.extend_from_slice(nonce.as_slice());
    encrypted_data_with_nonce.extend_from_slice(&ciphertext);

    fs::write(&file_path, &encrypted_data_with_nonce).map_err(|e| {
        format!(
            "Failed to write encrypted auth config to {}: {}",
            file_path.display(),
            e
        )
    })
}

/// Llegeix i desencripta la configuració d'autenticació del disc.
/// Retorna la configuració com a String.
///
#[tauri::command]
fn get_auth_config(app_handle: AppHandle) -> Result<String, String> {
    let file_path = get_auth_config_file_path(&app_handle)?;

    if !file_path.exists() {
        return Ok(String::new());
    }

    let encrypted_data_with_nonce = fs::read(&file_path).map_err(|e| {
        format!(
            "Failed to read encrypted auth config from {}: {}",
            file_path.display(),
            e
        )
    })?;

    if encrypted_data_with_nonce.len() < NONCE_SIZE {
        return Err(format!(
            "Encrypted file at {} is too short ({} bytes) to contain a nonce (min {} bytes).",
            file_path.display(),
            encrypted_data_with_nonce.len(),
            NONCE_SIZE
        ));
    }

    // Separa el nonce i el ciphertext
    let (nonce_slice, ciphertext) =
        encrypted_data_with_nonce.split_at(NONCE_SIZE);

    let nonce = AeadNonce::<Aes256Gcm>::from_slice(nonce_slice);

    let key_material = GenericArray::from_slice(SYMMETRIC_KEY_BYTES);
    let cipher = Aes256Gcm::new(&key_material);

    // Desencripta les dades
    let decrypted_bytes = cipher.decrypt(nonce, ciphertext).map_err(|e| {
        format!(
            "Decryption failed for {}: {}. (Possible reasons: wrong key, corrupted data).",
            file_path.display(),
            e
        )
    })?;

    // Converteix a String UTF-8
    String::from_utf8(decrypted_bytes).map_err(|e| {
        format!(
            "Failed to convert decrypted data from {} to UTF-8 string: {}",
            file_path.display(),
            e
        )
    })
}

/// Punt d'entrada de l'aplicació Tauri.
/// Registra els comandos per llegir i escriure la configuració.
///
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            write_auth_config,
            get_auth_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
