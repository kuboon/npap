
const { subtle } = crypto;

const KeyEssence = ["d", "dp", "dq", "n", "p", "q", "qi"];
//const PartialJwk = {[key of KeyEssence]: string}
export async function generateSerializedPrivateKey(){
  const keyPair = await generateRsaKeyPair()
  return serializePrivateKey(keyPair.privateKey!)
}
async function serializePrivateKey(key: CryptoKey) {
  const jwk = await subtle
    .exportKey(
      "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      key,
    );
  const p = new URLSearchParams();
  Object.entries(jwk)
    .filter(([k]) => KeyEssence.includes(k))
    .forEach(([k, v]) => {
      p.append(k, v);
    });
  return p.toString();
}
export async function deserealizePrivateKey(obj: object) {
  const jwk = Object.assign(
    {
      alg: "RSA-OAEP-256",
      e: "AQAB",
      ext: false,
      key_ops: ["unwrapKey"],
      kty: "RSA",
    },
    obj,
  ) as JsonWebKey;
  return subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false,
    ["unwrapKey"],
  );
}
export async function deserealizePublicKey(n: string): Promise<CryptoKey> {
  const jwk: JsonWebKey = {
    alg: "RSA-OAEP-256",
    e: "AQAB",
    ext: false,
    key_ops: ["wrapKey"],
    kty: "RSA",
    n,
  };
  return subtle
    .importKey(
      "jwk",
      jwk,
      {
        //these are the algorithm options
        name: "RSA-OAEP",
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      false,
      ["wrapKey"],
    );
}
async function generateRsaKeyPair() {
  return subtle
    .generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["wrapKey", "unwrapKey"]
    );
}
