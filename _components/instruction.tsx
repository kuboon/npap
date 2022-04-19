import { minifyJwk } from "../_lib/keys.ts";
import { generateJwkPair } from "../_lib/crypto.ts";
import { React } from "../_lib/deps.ts";
const { useRef } = React;

export default function Instruction() {
  const inputRef = useRef<HTMLInputElement>(null);
  const generate = () => {
    const name = inputRef.current!.value;
    if (name.length == 0) return;
    generateJwkPair().then((keyPair) => {
      const obj = { receive_by: name, ...minifyJwk(keyPair.privateKey) };
      const urlParam = new URLSearchParams(obj);
      location.hash = urlParam.toString();
    });
  };
  return (
    <main id="instruction">
      <head>
        <title>NPAP 鍵生成ページ</title>
      </head>
      <h1>鍵生成ページ</h1>

      <p>
        受信者のお名前
        <br />
        <input type="text" ref={inputRef} required={true} />
        <br />
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
        NPAP の秘密鍵はURLの「#」以降のハッシュ文字列と呼ばれる部分に格納してあります。 ブラウザはこの情報をどこにも送りませんので、NPAP
        のサーバーにさえ秘密鍵は送信されません。
      </p>
      <h2>鍵指紋とは</h2>
      <p>
        「秘密鍵ページ」から取得できる「暗号化ページ」には、同じ鍵指紋が表示されます。
        両者の鍵指紋を検証することで、対応しているペアかどうかを確認できます。
      </p>
    </main>
  );
}
