import axios from "axios";
import forge from "node-forge";

/**
 * Codifica una contrasenya en text pla utilitzant RSA-OAEP amb SHA256.
 * Primer obté la clau pública del servidor especificat, després encripta
 * la contrasenya amb aquesta clau i finalment retorna la contrasenya encriptada
 * en format Base64.
 *
 * @async
 * @param {string} plaintextPassword - La contrasenya en text pla que es vol codificar.
 * @param {string} serverIp - L'adreça IP (i port, si és necessari) del servidor
 *                            des d'on s'obtindrà la clau pública. Per exemple, "http://localhost:3000".
 * @returns {Promise<string>} Una promesa que es resol amb la contrasenya encriptada
 *                            i codificada en Base64.
 * @throws {Error} Llança un error si no es pot obtenir la clau pública del servidor
 *                 o si hi ha algun problema durant el procés d'encriptació.
 *                 Pot ser un `AxiosError` si la petició HTTP falla.
 */
export async function encodePassword(
  plaintextPassword: string,
  serverIp: string,
): Promise<string> {
  // 1. Obtenir la clau pública del servidor.
  // El servidor exposa la clau pública en format PEM a la ruta /auth/publickey.
  const response = await axios.get(`${serverIp}/auth/publickey`);

  // 2. Convertir la clau pública de format PEM a un objecte de clau pública de node-forge.
  const publicKey = forge.pki.publicKeyFromPem(response.data);

  // 3. Convertir la contrasenya en text pla a bytes utilitzant UTF-8.
  // Això és necessari perquè les operacions criptogràfiques treballen amb dades binàries.
  const passwordBytes = forge.util.encodeUtf8(plaintextPassword);

  // 4. Encriptar els bytes de la contrasenya utilitzant l'esquema RSA-OAEP.
  // S'utilitza SHA-256 com a funció hash per al farciment (MD) i per a la funció de generació de màscara (MGF1).
  const encryptedBytes = publicKey.encrypt(passwordBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(), // Algorisme de hash per al farciment OAEP
    mgf1: {
      md: forge.md.sha256.create(), // Algorisme de hash per a la funció de generació de màscara (MGF1)
    },
  });

  // 5. Codificar la cadena binària encriptada a Base64.
  // Base64 és un format comú per representar dades binàries com a text,
  // la qual cosa facilita la seva transmissió (per exemple, en cossos JSON).
  const encryptedBase64 = forge.util.encode64(encryptedBytes);

  return encryptedBase64;
}
