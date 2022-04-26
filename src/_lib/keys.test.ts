import { minifyJwk, fullifyToJwk } from './keys.ts'
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'

Deno.test({
  name: 'minifyJwk, fullifyToJwk',
  fn: async () => {
    const source = new TextEncoder().encode('hogehくぼoge')
    const hash = await generateSerializedPrivateKey()
    const params = Object.fromEntries(new URLSearchParams(hash))
    const { receive_by, ...secret } = params
    const { n } = secret
    const privKey = await deserealizePrivateKey(secret)
    const pubKey = await deserealizePublicKey(n)
    const minified = minifyJwk(privKey)
    const fullified = fullifyToJwk(minified)
    assertEquals(minified, fullified)
  }
})
