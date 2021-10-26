import { EncData } from "./types.ts";

const { subtle } = crypto;
async function aesEncrypt(key: CryptoKey, iv: Uint8Array, plain: ArrayBuffer) {
  const ciphertext = await subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    plain,
  );
  return ciphertext;
}

/*
Fetch the ciphertext and decrypt it.
Write the decrypted message into the "Decrypted" box.
*/
async function aesDecrypt(
  key: CryptoKey,
  iv: Uint8Array,
  encrypted: ArrayBuffer,
) {
  return subtle.decrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    encrypted,
  ) as Promise<ArrayBuffer>;
}

export async function encAndWrap(
  wrapperKey: CryptoKey,
  plain: ArrayBuffer,
): Promise<EncData> {
  const aeskey: CryptoKey = await subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  ) as CryptoKey;
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
  const ciphered = await aesEncrypt(aeskey, iv, plain);
  const key = await subtle.wrapKey(
    "raw",
    aeskey,
    wrapperKey,
    "RSA-OAEP",
  );
  return { key, iv, ciphered };
}
export class UnwrapKeyError extends Error {}
export async function unwrapAndDec(unwrapperKey: CryptoKey, data: EncData) {
  const { key, iv, ciphered } = data;
  const aeskey = await subtle.unwrapKey(
    "raw",
    key,
    unwrapperKey,
    "RSA-OAEP",
    "AES-CBC",
    false,
    ["decrypt"],
  ).catch((e: DOMException) => {
    throw new UnwrapKeyError();
  });

  return aesDecrypt(aeskey, iv, ciphered);
}
export async function thumbprint(n: string) {
  const json = JSON.stringify({ e: 'AQAB', kty: 'RSA',n});
  const ab = new TextEncoder().encode(json).buffer;
  const hash = await subtle.digest("SHA-256", ab);
  const str = [...new Uint8Array(hash)].map((x) =>
    ("0" + x.toString(16)).slice(-2)
  ).join(":");
  return str;
}
