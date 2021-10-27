/// <reference lib="dom" />
import { missingFeature } from "../lib/crypto.ts";
import Instruction from '~/components/instruction.tsx'
import Send from '~/components/send.tsx'
import Receive from '~/components/receive.tsx'
import React, { useState } from 'react'

const missing = missingFeature()
export default function Npap () {
  if (missing) {
    return (
      <p>
        お使いのブラウザはNPAPに対応しておりません。 セキュリティ確保のためにも最新のブラウザをご利用ください。<br />
        不足機能: {missing}
      </p>
    )
  }
  const [hash, setHash] = useState(location.hash.substr(1))
  window.addEventListener(
    'hashchange',
    () => setHash(location.hash.substr(1)),
    false
  )
  const version = '1.1'

  return (
    <div id='npap'>
      <Pages urlString={hash} />
      <footer>
        <a href='#' target='_blank'>
          鍵生成ページ
        </a>
        <a href='https://npap.kbn.one' target='_blank'>
          NPAP Top
        </a>
        <span>Version {version}</span>
      </footer>
    </div>
  )
}

function Pages ({ urlString }: { urlString: string }) {
  const params = Object.fromEntries(new URLSearchParams(urlString))
  if (params.send_to) {
    const { send_to, ...pub } = params
    return <Send sendTo={send_to} pub={pub} />
  }
  if (params.receive_by) {
    const { receive_by, ...secrets } = params
    return <Receive receiveBy={receive_by} secrets={secrets} />
  }
  return <Instruction />
}
