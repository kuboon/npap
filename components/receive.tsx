import { thumbprint } from "../lib/crypto.ts";
import { fullifyToJwk } from '../lib/keys.ts'
import { decryptFileAndGetResultNode } from '../lib/npapUtil.ts'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function Receive ({
  receiveBy,
  secrets
}: {
  receiveBy: string
  secrets: any
}) {
  const privKey = fullifyToJwk(secrets, 'unwrapKey')
  const downloadRef = useRef<HTMLDivElement>(null)
  const [thumbp, setThumbp] = useState('')
  useEffect(() => {
    thumbprint(privKey).then(setThumbp)
  })
  const sendPath = `${location.origin}${location.pathname}#send_to=${encodeURI(
    receiveBy
  )}&n=${privKey.n}`
  const fileDec = useCallback(
    async (e: React.ChangeEvent) => {
      const file = (e.target as HTMLInputElement).files![0]
      if (!file) return
      const msgElem = await decryptFileAndGetResultNode(privKey, file)
      downloadRef.current!.insertAdjacentElement('afterbegin', msgElem)
    },
    [downloadRef.current]
  )
  return (
    <main id='receive'>
      <head>
        <title>{receiveBy}の秘密鍵ページ:NPAP</title>
      </head>
      <h1>秘密鍵ページ</h1>
      <p>所有者: {receiveBy}</p>
      <p>鍵指紋: {thumbp}</p>
      <p>
        このページはあなた専用のものです。
        <br />
        再生成は出来ませんので、 URL をブックマーク等に保存しておいてください。
        <br />
        URL
        には秘密鍵が含まれています。大切に保管し、誰かにメール等で送ることはしないでください。
      </p>
      <h2>「暗号化ページ」を送る</h2>
      <p>以下のURLをメール等で送信者に送付してください。</p>
      <input
        type='text'
        value={sendPath}
        readOnly
        style={{ width: '100%' }}
        onClick={e => (e.target as HTMLInputElement).select()}
      />
      <br />
      <a href={sendPath} target='_blank'>
        開いてみる
      </a>
      <h2>ファイルの復号</h2>
      <p>
        「暗号化ページ」で暗号化されたファイルを受け取りましたら、以下から復号できます。
      </p>
      <p>処理はネットを介さず、あなたのマシン上で処理されます。</p>
      <input type='file' onChange={fileDec} />
      <div ref={downloadRef}></div>
    </main>
  )
}
