'use client';

import { useCallback } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from '@/libs'

type Inputs = {
  contractName: string,
  contractSymbol: string,
  metadataName: string
  metadataDescription: string
  metadataExternalLink: string
};


const ErrorMessageFieldRequired = () => (<span className='text-error'>This field is required</span>)


export default function NewPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    const response = await fetch("/api/contracts", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        chainId: 80001
      })
    });
    console.log(await response.json())
  }, [])


  return (
    <div className="container mx-auto px-4">
      <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-purple-700">New Contract</h1>
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
                  className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.contractName })}
                  {...register("contractName", { required: true })}
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
                  className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.contractSymbol })}
                  {...register("contractSymbol", { required: true })}
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
                  className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.metadataName })}
                  {...register("metadataName", { required: true })}
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
                  className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.metadataDescription })}
                  {...register("metadataDescription")}
                />
                {errors.metadataDescription && <ErrorMessageFieldRequired />}
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">External Link</span>
                </label>
                
                <input
                  type="text"
                  placeholder="External Link"
                  className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.metadataExternalLink })}
                  {...register("metadataExternalLink")}
                />
              </div>
            </div>

            <div>
              <button className="btn btn-block btn-primary">Deploy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
