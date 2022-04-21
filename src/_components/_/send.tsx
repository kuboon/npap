import { fullifyToJwk } from '../../_lib/keys.ts'
import { importKey } from '../../_lib/crypto.ts'
import { encryptFileAndGetResultNode, KeyIsValid, Thumbprint } from '../../_lib/util.tsx'
import { React } from "../../_lib/deps.ts";
const { useCallback, useEffect, useState } = React;

export default function Send ({ sendTo, pub }: { sendTo: string; pub: any }) {
  const jwk = fullifyToJwk(pub, 'wrapKey')
  const [messages, setMessages] = useState([] as JSX.Element[])
  const [ckey, setKey] = useState<CryptoKey | false>()
  useEffect(() => {
    importKey(jwk)
      .then(setKey)
      .catch(() => setKey(false))
  }, [pub])
  const fileEnc = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!(ckey instanceof CryptoKey)) return
      const file = e.target.files?.[0]
      if (!file) return
      const filename = file.name + `.${sendTo}.encrypt`
      const msgElem = await encryptFileAndGetResultNode(ckey, file, filename)
      setMessages([msgElem, ...messages])
    },
    [ckey, messages]
  )
  return (
    <main id='send'>
      <head>
        <title>{sendTo}宛暗号化ページ:NPAP</title>
      </head>
      <h1>暗号化ページ</h1>
      <KeyIsValid cryptoKey={ckey}>
        <p>秘密鍵所有者: {sendTo}</p>
        <p>このページから暗号化したファイルは、秘密鍵所有者だけが開けます。</p>
        <Thumbprint jwk={jwk} />
        <h2>ファイルの暗号化</h2>
        <input type='file' onChange={fileEnc} />
        {messages}
      </KeyIsValid>
    </main>
  )
}
