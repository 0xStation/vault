import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/favoritpro-bold-webfont.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/favoritpro-regular-webfont.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="icon"
          href="/favicons/station-logo-favicon.ico"
          sizes="any"
        />
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
        <link
          rel="apple-touch-icon"
          href="/favicons/station-logo-favicon.ico"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
