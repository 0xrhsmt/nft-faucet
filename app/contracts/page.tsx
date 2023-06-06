'use client';

import { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from '@/libs'
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

type Contract = {
  chainId: number
  contractAddress: string
  contractName: string
  contractSymbol: string
  metadataName: string
  metadataDescription: string
  metadataImage: string
  metadataExternalLink: string
}



const ChainBadge: React.FC<{ chainId: number }> = ({ chainId }) => {
  switch (chainId) {
    case 5:
      return <div className="badge badge-third">GOERLI</div>
    case 80001:
      return <div className="badge badge-secondary">MUMBAI</div>
    default:
      return <div className="badge badge-outline">UNKNOWN</div>
  }
}

export default function IndexPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const { openConnectModal } = useConnectModal();
  const { address: walletAddress, isConnected } = useAccount()

  const fetchContracts = useCallback(async () => {
    if (!walletAddress) return;

    const params = { walletAddress }
    const query = new URLSearchParams(params)

    const res = await fetch(`/api/contracts?${query}`, {
      method: 'GET',
    });
    if (res.status !== 200) {
      // TODO: handle error
      alert('Error occurred. Please reload.')
      return
    }

    const { data } = await res.json()
    setContracts(data)
  }, [walletAddress])

  useEffect(() => {
    fetchContracts()
  }, [walletAddress])


  return (
    <div>
      {
        isConnected ? (
          <div className='p-8'>
            <div className='flex justify-between items-center mb-8'>
              <div className='text-3xl'>
                Contracts
              </div>
              <Link className="btn btn-secondary" href="/contracts/new">DEPLOY NEW CONTRACT</Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {contracts.map((c) => (
                <div key={c.contractAddress} className="card w-96 bg-base-100 shadow-xl m-auto">
                  <figure><img src={c.metadataImage} alt="contract-image" /></figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {c.metadataName}
                      <ChainBadge chainId={c.chainId} />
                    </h2>
                    <p>{c.metadataDescription}</p>
                    <div className="card-actions justify-end">
                      <Link href={`/contracts/${c.contractAddress}`} className="btn btn-secondary">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          openConnectModal && (
            <button className="btn btn-block btn-secondary" onClick={openConnectModal}>
              Connect Wallet
            </button>
          )
        )
      }
    </div>
  )
}
