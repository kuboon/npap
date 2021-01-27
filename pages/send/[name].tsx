import { encrypt, encryptStr } from '../../lib/crypto.ts'
import React, { useState } from 'react'
import { Head, useRouter } from 'https://deno.land/x/aleph/mod.ts'

export default function Send () {
  const { params } = useRouter()
  const name = params.name
  const pub = location.hash.substring(1)
  const [plain, setPlain] = useState('')
  const [data, setData] = useState('')
  async function strEnc () {
    setData(await encryptStr(pub, plain))
  }
  async function fileEnc (e: React.ChangeEvent) {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onload = async function() {
      const buf = reader.result as ArrayBuffer; // reader.result is ArrayBuffer
      const enc = await encrypt(pub, buf)
      const blob = new Blob([enc], {type: "application/octet-stream"});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name + `.${name}.encrypt`
      link.click();
    };
    reader.readAsArrayBuffer(file);
  }
  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <p>{name}さんだけが開ける暗号化をします</p>
      <input type='file' onChange={fileEnc}/>
      <textarea
        value={plain}
        onChange={e => setPlain(e.target.value)}
      ></textarea>
      <button onClick={strEnc}>encrypt</button>
      <textarea value={data}></textarea>
    </>
  )
}
