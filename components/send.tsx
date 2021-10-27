import { fullifyToJwk } from '../lib/keys.ts'
import { encryptFileAndGetResultNode, Thumbprint } from '../lib/util.tsx'
import React, { useCallback, useEffect, useState } from 'react'

export default function Send ({ sendTo, pub }: { sendTo: string; pub: any }) {
  const pubKey = fullifyToJwk(pub, 'wrapKey')
  const [messages, setMessages] = useState([] as JSX.Element[])
  const fileEnc = useCallback(
    async (e: React.ChangeEvent) => {
      const file = (e.target as any).files[0]
      if (!file) return
      const filename = file.name + `.${sendTo}.encrypt`
      const msgElem = await encryptFileAndGetResultNode(pubKey, file, filename)
      setMessages([msgElem, ...messages])
    },
    [messages]
  )
  return (
    <main id='send'>
      <head>
        <title>{sendTo}宛暗号化ページ:NPAP</title>
      </head>
      <h1>暗号化ページ</h1>
      <p>秘密鍵所有者: {sendTo}</p>
      <p>このページから暗号化したファイルは、秘密鍵所有者だけが開けます。</p>
      <Thumbprint jwk={pubKey}/>
      <h2>ファイルの暗号化</h2>
      <input type='file' onChange={fileEnc} />
      {messages}
    </main>
  )
}
