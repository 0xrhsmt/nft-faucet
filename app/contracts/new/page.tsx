'use client';

import { useCallback, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from '@/libs'
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';

type Inputs = {
  contractName: string,
  contractSymbol: string,
  metadataName: string
  metadataDescription: string
  metadataExternalLink: string
};


const ErrorMessageFieldRequired = () => (<span className='text-error'>This field is required</span>)


export default function NewPage() {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<Inputs>({
    mode: 'onBlur'
  });
  const { openConnectModal } = useConnectModal();
  const { address: walletAddress, isConnected } = useAccount()
  const { chain } = useNetwork()

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    if (!isValid || isLoading || !walletAddress || !chain?.id) return
    setIsLoading(true)

    try {
      const res = await fetch("/api/contracts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          walletAddress,
          chainId: chain.id
        })
      });

      if (res.status !== 201) {
        // TODO: handle error
        alert('Error occurred. Please retry.')
        return
      }

      push(`/contracts`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [isValid, isLoading, walletAddress, chain?.id])

  return (
    <div className="container mx-auto px-4">
      <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-secondary">New Contract</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div>
                Contract
              </div>
              <div>
                <label className="label">
                  <span className="text-base label-text">Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Name"
                  className={cn("w-full input input-bordered input-secondary", { 'input-error': !!errors.contractName })}
                  {...register("contractName", { required: true })}
                  disabled={isLoading}
                />
                {errors.contractName && <ErrorMessageFieldRequired />}
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">Symbol</span>
                </label>

                <input
                  type="text"
                  placeholder="Symbol"
                  className={cn("w-full input input-bordered input-secondary", { 'input-error': !!errors.contractSymbol })}
                  {...register("contractSymbol", { required: true })}
                  disabled={isLoading}
                />
                {errors.contractSymbol && <ErrorMessageFieldRequired />}
              </div>
            </div>

            <div>
              <div>
                Metadata
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Name"
                  className={cn("w-full input input-bordered input-secondary", { 'input-error': !!errors.metadataName })}
                  {...register("metadataName", { required: true })}
                  disabled={isLoading}
                />
                {errors.metadataName && <ErrorMessageFieldRequired />}
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">Description</span>
                </label>

                <input
                  type="text"
                  placeholder="Description"
                  className={cn("w-full input input-bordered input-secondary", { 'input-error': !!errors.metadataDescription })}
                  {...register("metadataDescription", { required: true })}
                  disabled={isLoading}
                />
                {errors.metadataDescription && <ErrorMessageFieldRequired />}
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">External Link (Optional)</span>
                </label>

                <input
                  type="text"
                  placeholder="External Link"
                  className={cn("w-full input input-bordered input-secondary", { 'input-error': !!errors.metadataExternalLink })}
                  {...register("metadataExternalLink")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              {
                isConnected ? (
                  <button className="btn btn-block btn-secondary" disabled={!isValid}>
                    {
                      isLoading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Deploy"
                      )
                    }
                  </button>
                ) : (
                  openConnectModal && (
                    <button className="btn btn-block btn-secondary" onClick={openConnectModal}>
                      Connect Wallet
                    </button>
                  )
                )
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
