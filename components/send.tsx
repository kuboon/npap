import { thumbprint } from '../lib/crypto.ts'
import { fullifyToJwk } from '../lib/keys.ts'
import { encryptFileAndGetResultNode } from '../lib/npapUtil.ts'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function Send ({ sendTo, n }: { sendTo: string; n: string }) {
  const pubKey = fullifyToJwk({ n }, 'wrapKey')
  const downloadRef = useRef<HTMLDivElement>(null)
  const [thumbp, setThumbp] = useState('')
  useEffect(() => {
    thumbprint(pubKey).then(setThumbp)
  })
  const fileEnc = useCallback(
    async (e: React.ChangeEvent) => {
      const file = (e.target as any).files[0]
      if (!file) return
      const filename = file.name + `.${sendTo}.encrypt`
      const msgElem = await encryptFileAndGetResultNode(pubKey, file, filename)
      downloadRef.current!.insertAdjacentElement('afterbegin', msgElem)
    },
    [downloadRef.current]
  )
  return (
    <main id='send'>
      <head>
        <title>{sendTo}宛暗号化ページ:NPAP</title>
      </head>
      <h1>暗号化ページ</h1>
      <p>鍵指紋: {thumbp}</p>
      <p>このページから暗号化したファイルは、{name}さんだけが開けます。</p>
      <h2>ファイルの暗号化</h2>
      <input type='file' onChange={fileEnc} />
      <div ref={downloadRef}></div>
    </main>
  )
}
