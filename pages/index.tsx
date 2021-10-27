import React from 'react'

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

export default function Home() {
  return (
    <main id='top'>
      <head>
        <meta property="og:image" content='https://og.kbn.one/%23%20NPAP%0ANo%20Password%0AAll%20Protected%0A%0Aパスワード不要！%0A%0A暗号鍵が埋め込まれたURLをブックマーク.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg' />
      </head>
      <p>NPAP は PPAP を今すぐ廃止できるソリューションです。</p>
      <p>
        <a href='/NPAP'>NPAP を開く</a>
      </p>
      <p>
        <a href='/NPAP.html' download="NPAP.html" target='_blank'>NPAP をダウンロード (htmlファイル)</a>
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
