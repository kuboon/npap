import { generateSerializedPrivateKey, deserealizePrivateKey, deserealizePublicKey } from './keys.ts'

async function test2 () {
  const source = new TextEncoder().encode('hogehくぼoge')
  const hash = await generateSerializedPrivateKey()
  const params = Object.fromEntries(new URLSearchParams(hash))
  const { receive_by, ...secret } = params
  const { n } = secret
  const privKey = await deserealizePrivateKey(secret)
  const pubKey = await deserealizePublicKey(n)
}
test2()
