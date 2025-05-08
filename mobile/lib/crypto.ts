import axios from "axios";
import forge from "node-forge";

export async function encodePassword(
  plaintextPassword: string,
  serverIp: string,
): Promise<string> {
  const response = await axios.get(`${serverIp}/auth/publickey`);

  const publicKey = forge.pki.publicKeyFromPem(response.data);

  const passwordBytes = forge.util.encodeUtf8(plaintextPassword);

  const encryptedBytes = publicKey.encrypt(passwordBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });

  // 5. Encode the encrypted binary string to Base64
  const encryptedBase64 = forge.util.encode64(encryptedBytes);

  return encryptedBase64;
}
