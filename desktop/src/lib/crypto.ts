import axios from "axios";

/**
 * Converteix un ArrayBuffer a una cadena Base64.
 * @param buffer ArrayBuffer a convertir.
 * @returns {string} Cadena codificada en Base64.
 */
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Converteix una clau pública en format PEM a una cadena binària.
 * Elimina la capçalera i el peu PEM i decodifica el contingut Base64.
 * @param pem Clau pública en format PEM.
 * @returns {string} Cadena binària de la clau.
 */
function pemToBinary(pem: string) {
  // Elimina la capçalera i el peu PEM
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s+/g, ""); // Elimina tots els espais i salts de línia
  try {
    return window.atob(pemContents); // Decodifica Base64
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    throw new Error("Failed to decode PEM string (is it valid Base64?)");
  }
}

/**
 * Converteix una cadena binària a ArrayBuffer.
 * @param binaryString Cadena binària a convertir.
 * @returns {ArrayBuffer} ArrayBuffer resultant.
 */
function binaryStringToArrayBuffer(binaryString: string) {
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encripta un missatge utilitzant una clau pública RSA.
 * @param message Missatge en text pla a encriptar.
 * @param key Clau pública RSA (CryptoKey).
 * @returns {Promise<string | undefined>} Missatge encriptat en Base64.
 */
async function encryptMessage(
  message: string,
  key: CryptoKey,
): Promise<string | undefined> {
  try {
    const encoder = new TextEncoder();
    const dataToEncrypt = encoder.encode(message);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      key,
      dataToEncrypt,
    );

    const encryptedBase64 = arrayBufferToBase64(encryptedBuffer);
    return encryptedBase64;
  } catch (error) {
    console.error("Encryption failed:", error);
  }
}

/**
 * Importa una clau pública RSA en format PEM i la converteix a CryptoKey.
 * @param pemKey Clau pública en format PEM.
 * @returns {Promise<CryptoKey>} Clau pública importada.
 */
async function importRsaPublicKey(pemKey: string) {
  try {
    const binaryDer = pemToBinary(pemKey);
    const arrayBufferDer = binaryStringToArrayBuffer(binaryDer);

    return await window.crypto.subtle.importKey(
      "spki", // Format SubjectPublicKeyInfo (estàndard per claus públiques PEM)
      arrayBufferDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256", // Ha de coincidir amb el servidor
      },
      true, // La clau és extreïble (true per claus públiques)
      ["encrypt"], // Ús de la clau
    );
  } catch (e) {
    console.error("Error importing public key:", e);
    throw e; // Torna a llençar l'error per ser capturat pel caller
  }
}

/**
 * Encripta una contrasenya utilitzant la clau pública RSA del servidor.
 * Obté la clau pública del servidor, la importa i encripta la contrasenya.
 * @param plaintext Contrasenya en text pla.
 * @param serverIp IP o URL del servidor.
 * @returns {Promise<string>} Contrasenya encriptada en Base64.
 */
export async function encodePassword(
  plaintext: string,
  serverIp: string,
): Promise<string> {
  // Obté la clau pública del servidor
  const response = await axios.get(`${serverIp}/auth/publickey`);
  const key = await importRsaPublicKey(response.data);

  // Encripta la contrasenya
  const cipherText = await encryptMessage(plaintext, key);
  if (!cipherText) {
    throw new Error("Failed to encode password.");
  }

  return cipherText;
}
