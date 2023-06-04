'use client';

import { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from '@/libs'
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';


export default function DetailsPage() {
  const routeParams = useParams();
  const [contract, setContract] = useState()
  const { openConnectModal } = useConnectModal();
  const { address: walletAddress, isConnected } = useAccount()

  const fetchContract = useCallback(async () => {
    if (!routeParams.address || !walletAddress) return;

    const params = { walletAddress }
    const query = new URLSearchParams(params)

    const res = await fetch(`/api/contracts/${routeParams.address}?${query}`, {
      method: 'GET',
    });
    if (res.status !== 200) {
      // TODO: handle error
      alert('Error occurred. Please reload.')
      return
    }

    console.log(await res.json())
  }, [walletAddress])

  useEffect(() => {
    fetchContract()
  }, [walletAddress])


  return (
    <div>
      {
        isConnected ? (<div>
          hello
        </div>) : (
          openConnectModal && (
            <button className="btn btn-block btn-primary" onClick={openConnectModal}>
              Connect Wallet
            </button>
          )
        )
      }
    </div>
  )
}
