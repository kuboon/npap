const { subtle } = crypto;

const algorithm = {
  name: "RSA-OAEP",
  hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
};
const jwkBase: JsonWebKey = {
  alg: "RSA-OAEP-256",
  e: "AQAB",
  ext: false,
  kty: "RSA",
};

const KeyEssence = ["d", "dp", "dq", "n", "p", "q", "qi"];
//const PartialJwk = {[key of KeyEssence]: string}
export async function generateSerializedPrivateKey() {
  const keyPair = await generateRsaKeyPair();
  return serializePrivateKey(keyPair.privateKey!);
}
async function serializePrivateKey(key: CryptoKey) {
  const jwk = await subtle.exportKey("jwk", key);
  console.log(jwk.k, jwk.kty);
  const p = new URLSearchParams();
  Object.entries(jwk)
    .filter(([k]) => KeyEssence.includes(k))
    .forEach(([k, v]) => p.append(k, v));
  return p.toString();
}
export async function deserealizePrivateKey(obj: object) {
  const jwk: JsonWebKey = {
    key_ops: ["unwrapKey"],
    ...jwkBase,
    ...obj,
  };
  return subtle.importKey(
    "jwk",
    jwk,
    algorithm,
    false,
    ["unwrapKey"],
  );
}
export async function deserealizePublicKey(n: string): Promise<CryptoKey> {
  const jwk: JsonWebKey = {
    key_ops: ["wrapKey"],
    n,
    ...jwkBase,
  };
  return subtle
    .importKey(
      "jwk",
      jwk,
      algorithm,
      false,
      ["wrapKey"],
    );
}
async function generateRsaKeyPair() {
  return subtle
    .generateKey(
      {
        modulusLength: 4096, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        ...algorithm
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["wrapKey", "unwrapKey"],
    );
}
