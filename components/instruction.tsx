import Logo from '~/components/logo.tsx'
import React, { useRef } from 'react'
import { generateSerializedPrivateKey } from '../lib/keys.ts'

export default function Instruction () {
  const inputRef = useRef<HTMLInputElement>(null)
  const generate = () => {
    const name = inputRef.current!.value
    if(name.length==0)return
    generateSerializedPrivateKey().then(key => {
      location.hash = `receive_by=${name}&${key}`
    })
  }
  return (
    <>
      <head>
        <title>NPAP 鍵生成ページ</title>
      </head>
      <h1 className='logo'>
          <Logo />
          NPAP
      </h1>

      <div id='instruction'>
        <p>
          受信者のお名前
          <input type='text' ref={inputRef} />
          <button onClick={generate}>「秘密鍵ページ」を作成</button>
        </p>
        <h2>使い方</h2>
        <p>
          ファイルの受信者は、あらかじめ自分専用の「秘密鍵ページ」を作成し、お手元にブックマークを保存していつでも開けるようにしておきます。
        </p>
        <p>
          「秘密鍵ページ」から「暗号化ページ」のURLが取得できるので、それをメールで相手に送ります。
        </p>
        <p>
          ファイルの送信者は、「暗号化ページ」を開き、送りたいファイルを指定します。ファイルはどこへも送信されることなく、ブラウザ内で暗号化され、ダウンロードできます。
        </p>
        <p>
          ファイルの送信者は、暗号化されたファイルをメールに添付して送ります。
        </p>
        <p>
          ファイルの受信者は、暗号化されたファイルを受け取ったら「秘密鍵ページ」から元のファイルへ復号できます。
        </p>
        <h2>なぜ安全なの？</h2>
        <p>
          公開鍵方式という暗号を使っています。「暗号化ページ」で暗号化されたファイルは、「秘密鍵ページ」のブックマークを知っている人のみが復号できます。
        </p>
        <p>
          「秘密鍵ページ」は受信者の手元にあればよく、送信者には必要ありません。つまり、復号に必要な情報は一切ネットに流出しません。
        </p>
        <p>
          NPAP
          の秘密鍵はURLの「#」以降のハッシュ文字列と呼ばれる部分に格納してあります。ブラウザはこの情報をどこにも送りませんので、NPAP
          のサーバーにさえ秘密鍵は送信されません。
        </p>
      </div>
    </>
  )
}
