import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { FC } from 'react'
import { Providers } from './providers'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link'
import { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ['latin'] })

const Header: FC = () => (
  <header className="navbar bg-base-100 relative">
    <div className="flex-1">
      <Link href="/" className="btn btn-ghost normal-case text-xl">
        <Image src="/logo.png" height="38" width="38" alt="logo"></Image>
        NFT Faucet
      </Link>
    </div>
    <div className="flex-none">
      <ConnectButton showBalance={false} />
    </div>
  </header>
)

export const metadata = {
  title: 'NFT Faucet',
  description: 'NFT Faucet. Get Test NFT Tokens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>
            {children}
          </main>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
