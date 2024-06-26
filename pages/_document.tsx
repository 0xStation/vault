import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicons/terminal-logo.ico" sizes="any" />
        <meta
          name="description"
          content="Doing work with people who share your mission."
        />
        <meta name="twitter:site" content="@0xStation" />
        <meta name="twitter:title" content="STATION" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="twitter:description"
          content="Toolkit for digital orgs to curate and reward the best people and projects."
        />
        <link rel="apple-touch-icon" href="/favicons/terminal-logo.ico" />
      </Head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MGWXHVV"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
