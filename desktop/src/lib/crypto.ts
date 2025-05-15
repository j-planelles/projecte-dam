import axios from "axios";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function pemToBinary(pem: string) {
  // Remove PEM header and footer
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s+/g, ""); // Remove all whitespace, including newlines
  try {
    return window.atob(pemContents); // Base64 decode
  } catch (e) {
    console.error("Base64 decoding failed:", e);
    throw new Error("Failed to decode PEM string (is it valid Base64?)");
  }
}

function binaryStringToArrayBuffer(binaryString: string) {
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

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

async function importRsaPublicKey(pemKey: string) {
  try {
    const binaryDer = pemToBinary(pemKey);
    const arrayBufferDer = binaryStringToArrayBuffer(binaryDer);

    return await window.crypto.subtle.importKey(
      "spki", // SubjectPublicKeyInfo format (standard for PEM public keys)
      arrayBufferDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256", // Make sure this matches server-side if it decrypts
      },
      true, // whether the key is extractable (true for public keys is fine)
      ["encrypt"], // key usages
    );
  } catch (e) {
    console.error("Error importing public key:", e);
    throw e; // Re-throw to be caught by caller
  }
}

export async function encodePassword(
  plaintext: string,
  serverIp: string,
): Promise<string> {
  const response = await axios.get(`${serverIp}/auth/publickey`);
  const key = await importRsaPublicKey(response.data);

  const cipherText = await encryptMessage(plaintext, key);
  if (!cipherText) {
    throw new Error("Failed to encode password.");
  }

  return cipherText;
}
