import React, { FC } from 'react'
import Logo from './components/logo.tsx'

export default function App ({
  Page,
  pageProps
}: {
  Page: FC
  pageProps: Record<string, unknown>
}) {
  return (
    <>
      <head>
        <link rel='stylesheet' href='/style/index.css' />
        <meta name='viewport' content='width=device-width' />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <header>
        <span>
          NPAP
          <Logo />
        </span>
        <small>No&nbsp;Password All&nbsp;Protected</small>
      </header>
      <Page {...pageProps} />
    </>
  )
}
