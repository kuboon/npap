import { decrypt, decryptStr } from '../lib/crypto.ts'
import React, { useState, useEffect } from 'react'

export default function Secret() {
  const params = new URLSearchParams(location.hash.substring(1))
  const secret = [...params].reduce((o, [k,v])=>((o[k]=v),o), {} as any)
  const pub = secret.n
  const [name, setName] = useState('')
  const [data, setData] = useState('')
  const [plain, setPlain] = useState('')
  const sendPath = `/send/${name}#${pub}`
  async function strDecrypt(){
    setPlain(await decryptStr(secret, data))
  }
  async function fileDec (e: React.ChangeEvent) {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onload = async function() {
      const buf = reader.result as ArrayBuffer; // reader.result is ArrayBuffer
      const enc = await decrypt(secret, buf)
      const blob = new Blob([enc], {type: "application/octet-stream"});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name.split('.').slice(0,-2).join('.')
      link.click();
    };
    reader.readAsArrayBuffer(file);
  }
  return (
    <>
      <h1>send link</h1>
      name:<input type='text' value={name} onChange={e=>setName(e.target.value)}/>
      url:<input type='text' value={sendPath} readOnly/>
      <a href={sendPath} target='_blank'>開いてみる</a>
      <h1>decrypt</h1>
      <input type='file' onChange={fileDec}/>
      <textarea value={data} onChange={e=>setData(e.target.value)}></textarea>
      <button onClick={strDecrypt}>decrypt</button>
      <p>{plain}</p>
    </>
  )
}