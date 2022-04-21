import { importKey } from '../../_lib/crypto.ts'
import { fullifyToJwk } from '../../_lib/keys.ts'
import { decryptFileAndGetResultNode, KeyIsValid, Thumbprint } from '../../_lib/util.tsx'
import { React } from "../../_lib/deps.ts";
const { useCallback, useEffect, useState } = React;

export default function Receive ({
  receiveBy,
  secrets
}: {
  receiveBy: string
  secrets: any
}) {
  const privJwk = fullifyToJwk(secrets, 'unwrapKey')
  const sendPath = `${location.origin}${location.pathname}#send_to=${encodeURI(
    receiveBy
  )}&n=${privJwk.n}`
  const [messages, setMessages] = useState([] as JSX.Element[])
  const [privKey, setPrivKey] = useState<CryptoKey | false>()
  useEffect(() => {
    importKey(privJwk)
      .then(x => setPrivKey(x))
      .catch(() => setPrivKey(false))
  }, [secrets])
  const fileDec = useCallback(
    async (e: React.ChangeEvent) => {
      if (!(privKey instanceof CryptoKey)) return
      const file = (e.target as HTMLInputElement).files![0]
      if (!file) return
      const msgElem = await decryptFileAndGetResultNode(privKey, file)
      setMessages([msgElem, ...messages])
    },
    [privKey, messages]
  )
  return (
    <main id='receive'>
      <head>
        <title>{receiveBy}の秘密鍵ページ:NPAP</title>
      </head>
      <h1>秘密鍵ページ</h1>
      <KeyIsValid cryptoKey={privKey}>
        <p>所有者: {receiveBy}</p>
        <Thumbprint jwk={privJwk} />
        <p>
          このページはあなた専用のものです。
          <br />
          再生成は出来ませんので、 URL
          をブックマーク等に保存しておいてください。
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
        {messages}
      </KeyIsValid>
    </main>
  )
}
