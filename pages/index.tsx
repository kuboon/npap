import React from 'react'

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

export default function Home () {
  return (
    <main id='top'>
      <p>NPAP は PPAP を今すぐ廃止できるソリューションです。</p>
      <p>
        <a href='/NPAP'>NPAP を開く</a>
      </p>
      <p>
        <a href='#'>※ 準備中 NPAP をダウンロード (htmlファイル)</a>
      </p>
      <p>
        <a href='https://github.com/kuboon/npap'>Github</a>
      </p>
      <ul>
        <li>
          パスワード不要！ 暗号鍵が埋め込まれたURLをブックマークしておくだけ
        </li>
        <li>
          ファイルサーバ不要！
          暗号化したファイルを従来通りメールで送ることができます
        </li>
        <li>自ドメイン内へ簡単導入！ html ファイルを1つ置くだけで導入完了</li>
        <li>オンラインサービスに一切依存せず、ブラウザ内ですべて処理、サービスダウン無し</li>
      </ul>
    </main>
  )
}
