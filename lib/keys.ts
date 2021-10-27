const jwkBase: JsonWebKey = {
  alg: "RSA-OAEP-256",
  e: "AQAB",
  ext: false,
  kty: "RSA",
};
const KeyEssence = ["d", "dp", "dq", "n", "p", "q", "qi"];
//const PartialJwk = {[key of KeyEssence]: string}

export function minifyJwk(jwk: JsonWebKey) {
  return Object.entries(jwk)
    .filter(([k]) => KeyEssence.includes(k))
}
export function fullifyToJwk(obj: object, ops: 'wrapKey'|'unwrapKey') {
  return {
    key_ops: [ops],
    ...jwkBase,
    ...obj,
  } as JsonWebKey
}
