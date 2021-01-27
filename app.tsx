import React, { ComponentType } from 'react'
import { Head, Import } from 'https://deno.land/x/aleph/mod.ts'
import Nav from './nav.tsx'

export default function App ({
  Page,
  pageProps
}: {
  Page: ComponentType<any>
  pageProps: any
}) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>web-rsa</title>
      </Head>
      <Import from='../style/picnic.css' />
      <Import from='../style/index.less' />
      <Nav />
      <div id='main'>
        <Page {...pageProps} />
      </div>
    </>
  )
}
