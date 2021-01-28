import { encAndWrap, unwrapAndDec } from './crypto.ts'
import { generateKeyPair, importDecryptKey, importEncryptKey } from './keys.ts'

const {subtle} = crypto
async function test(message: string){
  const rsa = await subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096, //can be 1024, 2048, or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ['wrapKey', 'unwrapKey'] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
  )
  const encoded = new TextEncoder().encode(message)
  const data = await encAndWrap(rsa.publicKey!, encoded)
  const decrypted = await unwrapAndDec(rsa.privateKey!, data)
  const msg = new TextDecoder().decode(decrypted);
  console.log(msg)
}
//test('hogeやまhogeひこhoge').catch(e=>console.error(e))

async function test2 () {
  const source = new TextEncoder().encode('hogehくぼoge')
  const key = await generateKeyPair()
  const pubKeyStr: string = key.n!
  console.log(pubKeyStr)
  const pubKey = await importEncryptKey(pubKeyStr)
  const enc = await encAndWrap(pubKey, source)
  console.log(enc)
  const priKey = await importDecryptKey(key)
  const decrypted = await unwrapAndDec(priKey, enc)
  console.log(new TextDecoder().decode(decrypted))
}
test2()
