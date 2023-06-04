import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="">
          <h1 className="text-5xl font-bold">Bootstrap your testnet development</h1>
          <p className="py-6">Fast and reliable. Deploy and Mint NFTs.</p>
          <div className="flex flex-row justify-center space-x-4">
            <Link href="contracts/new" className="btn btn-secondary">Deploy New NFT</Link>
            <Link href="contracts" className="btn btn-neutral">Show YOUR NFTs</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
