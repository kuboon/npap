const jwkBase: JsonWebKey = {
  alg: "RSA-OAEP-256",
  e: "AQAB",
  ext: false,
  kty: "RSA",
};
const KeyEssence = ["d", "dp", "dq", "n", "p", "q", "qi"] as const;

const pick = <T extends keyof JsonWebKey>(jwk: JsonWebKey ,fields : readonly T[] ) => {
  const ret = {} as JsonWebKey
  for(const k of fields){
    if(jwk[k]) ret[k] = jwk[k]
  }
  return ret as Pick<JsonWebKey, T>
}
export function minifyJwk(jwk: JsonWebKey) {
  return pick(jwk, KeyEssence)
}

export function fullifyToJwk(obj: object, ops: 'wrapKey'|'unwrapKey') {
  return {
    key_ops: [ops],
    ...jwkBase,
    ...obj,
  } as JsonWebKey
}
