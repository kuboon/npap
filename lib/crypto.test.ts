import { encAndWrap, thumbprint, unwrapAndDec } from "./crypto.ts";

const { subtle } = crypto;
async function test(message: string) {
  const rsa = await subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096, //can be 1024, 2048, or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["wrapKey", "unwrapKey"], //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
  );
  const encoded = new TextEncoder().encode(message);
  const data = await encAndWrap(rsa.publicKey!, encoded);
  const decrypted = await unwrapAndDec(rsa.privateKey!, data);
  const msg = new TextDecoder().decode(decrypted);
  console.log(msg);
}
//test('hogeやまhogeひこhoge').catch(e=>console.error(e))

async function testthumb() {
  const jwk = {
    "e": "AQAB",
    "kty": "RSA",
    "n":
      "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw",
  };
  console.log(thumbprint(jwk))
}
testthumb()
