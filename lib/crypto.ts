import { EncData } from "./types.ts";

export function missingFeature() {
  if (typeof Deno != 'undefined') return null;
  if (typeof crypto == "undefined") return "crypto";
  const { subtle } = crypto;
  if (!subtle) return "crypto.subtle";
  if (!subtle.generateKey) return "crypto.subtle.generateKey";
  if (!subtle.encrypt) return "crypto.subtle.encrypt";
  if (!subtle.decrypt) return "crypto.subtle.decrypt";
  if (!subtle.wrapKey) return "crypto.subtle.wrapKey";
  if (!subtle.unwrapKey) return "crypto.subtle.unwrapKey";
  if (!subtle.importKey) return "crypto.subtle.importKey";
  if (!subtle.exportKey) return "crypto.subtle.exportKey";
  if (!crypto.getRandomValues) return "crypto.getRandomValues";
  return null;
}
const subtle = window.crypto?.subtle;

const RSAalgorithm = {
  name: "RSA-OAEP",
  hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
};
export async function generateJwkPair() {
  const keyPair = await subtle
    .generateKey(
      {
        modulusLength: 4096, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        ...RSAalgorithm,
      },
      true,
      ["wrapKey", "unwrapKey"],
    );
  const publicKey = await subtle.exportKey("jwk", keyPair.publicKey!);
  const privateKey = await subtle.exportKey("jwk", keyPair.privateKey!);
  return { publicKey, privateKey };
}

export async function encryptByPublicJwk(
  jwk: JsonWebKey,
  plain: ArrayBuffer,
): Promise<EncData> {
  const wrapperKey = await subtle
    .importKey(
      "jwk",
      jwk,
      RSAalgorithm,
      false,
      ["wrapKey"],
    );
  const aeskey = await subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  ) as CryptoKey;
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
  const encrypted = await aesEncrypt(aeskey, iv, plain);
  const key = await subtle.wrapKey(
    "raw",
    aeskey,
    wrapperKey,
    "RSA-OAEP",
  );
  return { key: new Uint8Array(key), iv, encrypted };
}

export class UnwrapKeyError extends Error {}
export async function decryptByPrivateJwk(privKey: JsonWebKey, data: EncData) {
  const unwrapperKey = await subtle.importKey(
    "jwk",
    privKey,
    RSAalgorithm,
    false,
    ["unwrapKey"],
  );
  const { key, iv, encrypted } = data;
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

  return aesDecrypt(aeskey, iv, encrypted);
}
export async function thumbprint(jwk: JsonWebKey) {
  const { e, kty, n } = jwk;
  const json = JSON.stringify({ e, kty, n });
  const ab = new TextEncoder().encode(json).buffer;
  const hash = await subtle.digest("SHA-256", ab);
  const hexArray = [...new Uint8Array(hash)].map((x) =>
    ("0" + x.toString(16)).slice(-2)
  );
  return hexArray;
}

async function aesEncrypt(key: CryptoKey, iv: Uint8Array, plain: ArrayBuffer) {
  return subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    plain,
  );
}

async function aesDecrypt(
  key: CryptoKey,
  iv: Uint8Array,
  encrypted: ArrayBuffer,
) {
  return await subtle.decrypt(
    {
      name: "AES-CBC",
      iv,
    },
    key,
    encrypted,
  ) as ArrayBuffer;
}
