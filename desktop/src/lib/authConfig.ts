import { invoke } from "@tauri-apps/api/core";

type AuthConfig = {
  token?: string;
  serverIp?: string;
  username?: string;
};

/**
 * Carrega la configuració d'autenticació des de l'entorn Tauri.
 * Llegeix el fitxer de configuració mitjançant una comanda Tauri i retorna l'objecte AuthConfig.
 * @returns {Promise<AuthConfig | undefined>} La configuració d'autenticació o undefined si no existeix.
 */
export async function loadAuthConfig(): Promise<AuthConfig | undefined> {
  const configData = (await invoke("get_auth_config")) as string;

  if (configData) {
    console.log(configData);
    const jsonConfigData = await JSON.parse(configData);
    return jsonConfigData;
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    console.log("No auth config found or it was empty.");
    return undefined;
  }
}

/**
 * Desa la configuració d'autenticació a l'entorn Tauri.
 * Serialitza l'objecte AuthConfig i l'envia a la comanda Tauri corresponent.
 * @param data L'objecte de configuració d'autenticació a desar.
 * @returns {Promise<undefined>}
 */
export async function writeAuthConfig(data: AuthConfig): Promise<undefined> {
  const jsonData = JSON.stringify(data);
  await invoke("write_auth_config", { data: jsonData });
}

/**
 * Actualitza la configuració d'autenticació fusionant la configuració existent amb la nova.
 * Llegeix la configuració actual, la fusiona amb les noves dades i la desa.
 * @param data Noves dades d'autenticació a fusionar.
 * @returns {Promise<undefined>}
 */
export async function updateAuthConfig(data: AuthConfig): Promise<undefined> {
  const authConfig = await loadAuthConfig();
  const mergedData: AuthConfig = { ...(authConfig || {}), ...data };
  await writeAuthConfig(mergedData);
}
