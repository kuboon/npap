import Logo from '~/components/logo.tsx'
import { unwrapAndDec } from '../lib/crypto.ts'
import { deserealizePrivateKey } from '../lib/keys.ts'
import React, { useRef } from 'react'
import { decode } from 'msgpack'
import { EncData } from '../lib/types.ts'

async function decrypt (secret: any, msg: ArrayBuffer) {
  const key = await deserealizePrivateKey(secret)
  const data = decode(msg) as EncData
  return unwrapAndDec(key, data)
}
export default function Receive () {
  const downloadRef = useRef<HTMLDivElement>(null)
  const hash = typeof location === 'object' && location.hash.substring(1)
  if (!hash) return <p>no hash</p>
  const params = Object.fromEntries(new URLSearchParams(hash))
  const { receive_by, ...secret } = params
  const { n } = secret
  const sendPath = `${location.origin}${location.pathname}#send_to=${encodeURI(
    receive_by
  )}&n=${n}`
  async function fileDec (e: React.ChangeEvent) {
    const file = (e.target as HTMLInputElement).files![0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async function () {
      const buf = reader.result as ArrayBuffer
      try {
        const enc = await decrypt(secret, buf)
        const blob = new Blob([enc], { type: 'application/octet-stream' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = file.name
          .split('.')
          .slice(0, -2)
          .join('.')
        link.text = link.download
        downloadRef.current!.insertAdjacentElement('afterbegin', link)
      } catch (e) {
        let msg = file.name + ': '
        if (e instanceof RangeError) {
          msg += '暗号化ファイルではありません'
        } else {
          console.error(e)
          msg += '不明な復号エラーです'
        }
        downloadRef.current!.insertAdjacentHTML('afterbegin', `<p>${msg}</p>`)
      }
    }
    reader.readAsArrayBuffer(file)
  }
  return (
    <main id='receive'>
      <head>
        <title>{receive_by}の秘密鍵ページ:NPAP</title>
      </head>
      <h1>秘密鍵ページ</h1>
      <p>所有者: {receive_by}</p>
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
