import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256

# Generar parella de claus RSA.
# Les claus són aleatories, cada cop que s'inicia el servidor aquestes es tornen a generar.
key_pair = RSA.generate(2048)
publickey_pem = key_pair.public_key().export_key() # Exportar la clau pública com a format PEM.


def decrypt_message(ciphertext: str) -> str:
    """
    Desencripta un missatge que ha estat encriptat amb la clau pública RSA corresponent.

    El missatge xifrat (ciphertext) s'espera que estigui codificat en Base64.

    Args:
        ciphertext: El missatge xifrat, codificat en Base64.

    Returns:
        El missatge original en text pla (UTF-8).
    """
    # Crea un objecte desencriptador utilitzant la clau privada (continguda a key_pair)
    # i especificant SHA256 com a algorisme de hash.
    decryptor = PKCS1_OAEP.new(key_pair, hashAlgo=SHA256)

    # Descodifica el text xifrat de Base64 a bytes.
    encrypted_bytes = base64.b64decode(ciphertext)
    # Desencripta els bytes utilitzant l'objecte desencriptador.
    decrypted_bytes = decryptor.decrypt(encrypted_bytes)
    # Descodifica els bytes desencriptats a una cadena de text utilitzant UTF-8.
    plaintext = decrypted_bytes.decode("utf-8")

    return plaintext


def export_public_key() -> str:
    """
    Retorna la clau pública RSA generada en format PEM com una cadena de text.

    Returns:
        La clau pública en format PEM, com una cadena de text (UTF-8).
    """
    # La variable `publickey_pem` ja conté la clau pública exportada en format PEM (com a bytes).
    # Aquesta funció simplement la descodifica a una cadena UTF-8.
    return publickey_pem.decode("utf-8")