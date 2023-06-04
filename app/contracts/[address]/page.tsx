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
  const [isLoading, setIsLoading] = useState(false)
  const [mintInfo, setMintInfo] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [contract, setContract] = useState<any>()
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

    const { data } = await res.json();
    setContract(data)
  }, [walletAddress])

  const handleMint = useCallback(async () => {
    if (!routeParams.address || !walletAddress || isLoading || !toAddress) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/contracts/${routeParams.address}/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress,
          toAddress,
        })
      });
      if (res.status !== 201) {
        // TODO: handle error
        alert('Error occurred. Please retry.')
        return
      }
      const { data } = await res.json();

      setMintInfo(`tx: ${data.hash}`)
      setToAddress('')
      fetchContract()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [routeParams, walletAddress, isLoading, toAddress, setMintInfo, setToAddress, fetchContract])

  const handleChange = useCallback((event: any) => setToAddress(event.target.value), [setToAddress])

  useEffect(() => {
    fetchContract()
  }, [walletAddress])


  return (
    <div>
      {
        isConnected ? (
          <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col w-[700px] max-w-full py-12">
              <Link href="/contracts" className='text-lg mb-2 w-full'>
                {"< Back"}
              </Link>

              <div className='text-3xl mb-2 w-full'>
                Contract Info
              </div>
              <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 mb-12">
                <div className='flex justify-center items-center max-w-full p-4'>
                  <img src={contract?.contractMetadata?.metadataImage ?? ''} className="max-w-full rounded-lg" />
                </div>

                <div className="card-body">
                  <div>
                    <div>
                      Contract
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Name</span>
                      </label>
                      <input type="text" value={contract?.contractMetadata?.contractName ?? ''} className="input input-bordered w-full " disabled />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Symbol</span>
                      </label>
                      <input type="text" value={contract?.contractMetadata?.contractSymbol ?? ''} className="input input-bordered w-full " disabled />
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div>
                    <div>
                      Metadata
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Name</span>
                      </label>
                      <input type="text" value={contract?.contractMetadata?.metadataName ?? ''} className="input input-bordered w-full " disabled />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Description</span>
                      </label>
                      <input type="text" value={contract?.contractMetadata?.metadataDescription ?? ''} className="input input-bordered w-full " disabled />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">External Link</span>
                      </label>
                      <input type="text" value={contract?.contractMetadata?.metadataExternalLink ?? ''} className="input input-bordered w-full " disabled />
                    </div>
                  </div>

                  <div className="divider"></div>

                  Let's Mint
                  <div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">To Address</span>
                      </label>
                      <input type="text" value={toAddress} className="input input-bordered w-full" onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-control mt-6">
                    <button className="btn btn-secondary" onClick={handleMint} disabled={!toAddress}>
                      {
                        isLoading ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          "Mint"
                        )
                      }
                    </button>
                  </div>

                  {
                    mintInfo && (
                      <div className='mt-8'>
                      {mintInfo}
                    </div>
                    )
                  }

                </div>
              </div>

              <div className='text-3xl mb-2 w-full'>
                Transfers {`(${contract?.transfers?.total ?? '?'})`}
              </div>
              <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 mb-12">
                <div className="card-body">
                  <div className='mb-12'>
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Token ID</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Contract Type</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Transaction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (contract?.transfers?.transfers ?? []).map((t: any) => {
                              return (
                                <tr key={t.transactionHash}>
                                  <td>{t.tokenId}</td>
                                  <td>{t.fromAddress}</td>
                                  <td>{t.toAddress}</td>
                                  <td>{t.contractType}</td>
                                  <td>{t.price}</td>
                                  <td>{t.quantity}</td>
                                  <td>{t.transactionHash}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className='text-3xl mb-2 w-full'>
                Owners {`(${contract?.owners?.total ?? '?'})`}
              </div>
              <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100">
                <div className="card-body">
                  <div className='mb-12'>
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Token ID</th>
                            <th>Amount</th>
                            <th>OwnerOf</th>
                            <th>Block Number Ownership Transfered</th>
                            <th>Block Number Minted</th>
                            <th>Minter Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (contract?.owners?.owners ?? []).map((o: any) => {
                              return (
                                <tr key={o.tokenHash}>
                                  <td>{o.tokenId}</td>
                                  <td>{o.amount}</td>
                                  <td>{o.ownerOf}</td>
                                  <td>{o.blockNumber}</td>
                                  <td>{o.blockNumberMinted}</td>
                                  <td>{o.minterAddress}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
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
