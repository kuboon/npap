/// <reference lib="dom" />
import Instruction from '~/components/instruction.tsx'
import Send from '~/components/send.tsx'
import Receive from '~/components/receive.tsx'
import React, { useState } from 'react'

function cryptoAvailable () {
  if (!crypto) return false
  if (!crypto.subtle) return false
  if (!crypto.subtle.generateKey) return false
  if (!crypto.subtle.encrypt) return false
  if (!crypto.subtle.decrypt) return false
  if (!crypto.subtle.wrapKey) return false
  if (!crypto.subtle.unwrapKey) return false
  return true
}
export default function Npap () {
  if (!cryptoAvailable()) {
    return (
      <p>
        お使いのブラウザはNPAPに対応しておりません。セキュリティ確保のためにも最新のブラウザをご利用ください。
      </p>
    )
  }
  const [hash, setHash] = useState(location.hash.substr(1))
  window.addEventListener(
    'hashchange',
    () => setHash(location.hash.substr(1)),
    false
  )
  const version = '1.0'

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
  if (params.send_to) return <Send sendTo={params.sendTo} n={params.n} />
  if (params.receive_by){
    const {receive_by, ...secrets} = params
    return <Receive receiveBy={receive_by} secrets={secrets} />
  } 
  return <Instruction />
}
