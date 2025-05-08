import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256

# Les claus són aleatories, cada cop que s'inicia el servidor aquestes es tornen a generar.
key_pair = RSA.generate(2048)
publickey_pem = key_pair.public_key().export_key()


def decrypt_message(ciphertext: str) -> str:
    decryptor = PKCS1_OAEP.new(key_pair, hashAlgo=SHA256)

    encrypted_bytes = base64.b64decode(ciphertext)
    decrypted_bytes = decryptor.decrypt(encrypted_bytes)
    plaintext = decrypted_bytes.decode("utf-8")

    return plaintext


def export_public_key() -> str:
    return publickey_pem.decode("utf-8")
