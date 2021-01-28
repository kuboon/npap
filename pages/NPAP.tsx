import React, { useState, useEffect } from 'react'
import Instruction from '~/components/instruction.tsx'
import Send from '~/components/send.tsx'
import Receive from '~/components/receive.tsx'

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

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
    <>
      <head>
        <link rel='stylesheet' href='../style/index.css' />
      </head>
      <div className='page'>
        <Pages cmd={hash} />
      </div>
      <footer>
        <a href='#' target='_blank'>鍵生成ページ</a>
        <a href='https://npap.kbn.one' target='_blank'>NPAP Top</a>
      </footer>
    </>
  )
}

function Pages ({ cmd }: { cmd: string }) {
  if (cmd.startsWith('#send_to')) return <Send />
  else if (cmd.startsWith('#receive_by')) return <Receive />
  else return <Instruction />
}
