// components/PWAHead.js
import Head from 'next/head';

export default function PWAHead() {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="description" content="Transform your life with Pithy Means" />
      <meta name="theme-color" content="#5bbad5" />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
      <link rel="icon" href="/icons/favicon.ico" />
      
      {/* Additional PWA meta tags for iOS */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Pithy Means" />
      
      {/* MS Tile Icon */}
      <meta name="msapplication-TileImage" content="/icons/android-chrome-192x192.png" />
      <meta name="msapplication-TileColor" content="#5bbad5" />
    </Head>
  );
}