import { encAndWrap } from '../lib/crypto.ts'
import { deserealizePublicKey } from '../lib/keys.ts'
import React, { useRef } from 'react'
import { encode } from 'msgpack'

async function encrypt (n: string, plain: ArrayBuffer) {
  const pKey = await deserealizePublicKey(n)
  const {iv, key, ciphered } = await encAndWrap(pKey, plain)
  const msg = encode({iv, key: new Uint8Array(key), ciphered: new Uint8Array(ciphered)})
  console.log(msg)
  return msg
}
const blobs: Blob[] = []
export default function Send () {
  const downloadRef = useRef<HTMLDivElement>(null)
  const hash = typeof location === 'object' && location.hash.substring(1)
  if (!hash) return <p>no hash</p>
  const params = new URLSearchParams(hash)
  const name = params.get('send_to')
  const pub = params.get('n')!
  async function fileEnc (e: React.ChangeEvent) {
    const file = (e.target as any).files[0]
    if(!file)return
    const reader = new FileReader()
    reader.onload = async function () {
      const buf = reader.result
      if (!buf || typeof buf == 'string') return
      const enc = await encrypt(pub, buf)
      if (!enc) return
      const blob = new Blob([enc], { type: 'application/octet-stream' })
      blobs.push(blob)
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blobs[0])
      link.download = file.name + `.${name}.encrypt`
      link.style.display = 'inline'
      link.text = link.download
      downloadRef.current!.insertAdjacentHTML('afterbegin', '<br />')
      downloadRef.current!.insertAdjacentElement('afterbegin', link)
    }
    reader.readAsArrayBuffer(file)
  }
  return (
    <>
      <head>
        <title>{name}宛暗号化ページ:NPAP</title>
      </head>
      <h1>暗号化ページ</h1>
      <p>このページから暗号化したファイルは、{name}さんだけが開けます。</p>
      <h2>ファイルの暗号化</h2>
      <input type='file' onChange={fileEnc} />
      <div ref={downloadRef}></div>
    </>
  )
}
