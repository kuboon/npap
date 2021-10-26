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
  const [hash, setHash] = useState(location.hash)
  window.addEventListener(
    'hashchange',
    function () {
      setHash(location.hash)
    },
    false
  )
  const version = '1.0'

  return (
    <div id='npap'>
      <Pages cmd={hash} />
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

function Pages ({ cmd }: { cmd: string }) {
  if (cmd.startsWith('#send_to')) return <Send />
  else if (cmd.startsWith('#receive_by')) return <Receive />
  else return <Instruction />
}
