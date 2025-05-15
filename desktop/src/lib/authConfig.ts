import { invoke } from "@tauri-apps/api/core";

type AuthConfig = {
  token?: string;
  serverIp?: string;
  username?: string;
};

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

export async function writeAuthConfig(data: AuthConfig): Promise<undefined> {
  const jsonData = JSON.stringify(data);
  await invoke("write_auth_config", { data: jsonData });
}

export async function updateAuthConfig(data: AuthConfig): Promise<undefined> {
  const authConfig = await loadAuthConfig();
  const mergedData: AuthConfig = { ...(authConfig || {}), ...data };
  await writeAuthConfig(mergedData);
}
