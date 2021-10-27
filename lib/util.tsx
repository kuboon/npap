import { thumbprint } from './crypto.ts'
import { CryptoPackError, decryptBuffer, encryptBuffer } from './cryptoPack.ts'
import React, { useEffect, useState } from 'react'

export function Thumbprint ({ jwk }: { jwk: JsonWebKey }) {
  const [thumbp, setThumbp] = useState('')
  useEffect(() => {
    blockedThumbprint(jwk).then(setThumbp)
  })
  return (
    <>
      <p>鍵指紋:</p>
      <div className='thumbprint'>
        {thumbp}
      </div>
    </>
  )
}
export async function encryptFileAndGetResultNode (
  key: CryptoKey,
  file: File,
  filename: string
) {
  const plain = await readAsArrayBuffer(file)
  return encryptBuffer(key, plain)
    .then(encoded => {
      const a = arrayBufferToDownloadAnchor(encoded, filename)
      return P(a)
    })
    .catch((err: CryptoPackError) => {
      let msg = file.name + ': ' + err.message
      return P(msg)
    })
}
export async function decryptFileAndGetResultNode (
  key: CryptoKey,
  file: File
) {
  const encoded = await readAsArrayBuffer(file)
  return decryptBuffer(key, encoded)
    .then(plain => {
      const filename = file.name
        .split('.')
        .slice(0, -2)
        .join('.')
      const a = arrayBufferToDownloadAnchor(plain, filename)
      return P(a)
    })
    .catch((err: CryptoPackError) => {
      let msg = file.name + ': ' + err.message
      return P(msg)
    })
}
export async function blockedThumbprint (privKey: JsonWebKey) {
  const a = await thumbprint(privKey)
  let ret = [] as string[]
  for (const slice of eachSlice(a, 8)) {
    ret.push(slice.join(':'))
  }
  return ret.join(':' + String.fromCharCode(8203))
}
export function KeyIsValid ({
  cryptoKey,
  children
}: {
  cryptoKey: CryptoKey | false | undefined
  children: any
}) {
  if (cryptoKey === false)
    return (
      <p>
        URL が破損しています。保存されたURLを正しく開いているかご確認ください。
      </p>
    )
  return children
}

let pCount = 0
function P(children: any){
  return <p key={pCount++}>{children}</p>
}
const eachSlice = function *<T> (array: T[], size: number) {
  for (let i = 0, l = array.length; i < l; i += size) {
    yield array.slice(i, i + size)
  }
}
const readAsArrayBuffer = async (file: File) =>
  new Promise<ArrayBuffer>((ok, ng) => {
    const reader = new FileReader()
    reader.onload = () => ok(reader.result as ArrayBuffer)
    reader.onerror = ng
    reader.readAsArrayBuffer(file)
  })
function arrayBufferToObjectUrl (buf: ArrayBuffer) {
  const blob = new Blob([buf], { type: 'application/octet-stream' })
  return URL.createObjectURL(blob)
}
function arrayBufferToDownloadAnchor (buf: ArrayBuffer, filename: string) {
  const href = arrayBufferToObjectUrl(buf)
  const download = filename
  return (
    <a href={href} download={download} target='_blank'>
      {filename}
    </a>
  )
}
