const strtoab = (str: string) => Uint8Array.from(str, c => c.charCodeAt(0))
const atoab = (str: string) => strtoab(atob(str))
const abtostr = (arrayBuffer: ArrayBuffer) =>
  String.fromCharCode(...new Uint8Array(arrayBuffer))
const abtoa = (arrayBuffer: ArrayBuffer) => btoa(abtostr(arrayBuffer))
const pick = (obj: any, keys: string[]) =>
  keys.reduce((o, k) => Object.assign(o, { [k]: obj[k] }), {} as any)
const { subtle } = window.crypto as any

export async function generateKeyPair () {
  const key = await subtle
    .generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ['encrypt', 'decrypt'] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
    )
    .catch(function (err) {
      console.error(err)
    })
  const jwk = await subtle
    .exportKey(
      'jwk', //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      key.privateKey
    )
    .catch((e: any) => console.error(e))
  return pick(jwk, 'd dp dq n p q qi'.split(' '))
}
export async function encryptStr(n: string, str: string) {
  return encrypt(n, strtoab(str)).then(abtoa)
}
export async function encrypt (n: string, data: ArrayBuffer): Promise<ArrayBuffer>{
  const jwk = {
    alg: 'RSA-OAEP-256',
    e: 'AQAB',
    ext: true,
    key_ops: ['encrypt'],
    kty: 'RSA',
    n
  }
  const key = await subtle
    .importKey(
      'jwk',
      jwk,
      {
        //these are the algorithm options
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ['encrypt']
    )
    .catch((e: any) => console.error('import fail', e))
  return subtle
    .encrypt(
      {
        name: 'RSA-OAEP'
        //label: Uint8Array([...]) //optional
      },
      key, //from generateKey or importKey above
      data //ArrayBuffer of the data
    )
    .catch(function (err: any) {
      console.error(err)
    })
}

export async function decryptStr(n: string, str: string) {
  return decrypt(n, atoab(str)).then(abtostr)
}
export async function decrypt (privateKey: any, data: ArrayBuffer) {
  const { subtle } = window.crypto as any
  if (!subtle) return
  const jwk = Object.assign(
    {
      alg: 'RSA-OAEP-256',
      e: 'AQAB',
      ext: true,
      key_ops: ['decrypt'],
      kty: 'RSA'
    },
    privateKey
  )
  const key = await subtle.importKey(
    'jwk',
    jwk,
    {
      //these are the algorithm options
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ['decrypt']
  )
  return subtle
    .decrypt(
      {
        name: 'RSA-OAEP'
        //label: Uint8Array([...]) //optional
      },
      key, //from generateKey or importKey above
      data //ArrayBuffer of the data
    )
    .catch(function (err: any) {
      console.error(err)
    })
}
async function test () {
  const { subtle } = window.crypto as any
  if (!subtle) return
  const str = 'hogehoge'
  const key = await generateKeyPair()
  const enc = await encrypt(key.n, str)
  console.log(enc)
  console.log(await decrypt(key, enc))
}
//test()
