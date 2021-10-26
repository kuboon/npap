/// <reference lib="dom" />
import Instruction from '~/components/instruction.tsx'
import Send from '~/components/send.tsx'
import Receive from '~/components/receive.tsx'
import React, { useState } from 'react'

export default function App () {
  const [hash, setHash] = useState(location.hash)
  window.addEventListener(
    'hashchange',
    function () {
      setHash(location.hash)
    },
    false
  )

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
      </footer>
    </div>
  )
}

function Pages ({ cmd }: { cmd: string }) {
  if (cmd.startsWith('#send_to')) return <Send />
  else if (cmd.startsWith('#receive_by')) return <Receive />
  else return <Instruction />
}
