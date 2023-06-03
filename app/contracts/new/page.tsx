'use client';

import { useCallback } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from '@/libs'

type Inputs = {
  name: string,
  symbol: string,
  contractURI: string
};

const ErrorMessageFieldRequired = () => (<span className='text-error'>This field is required</span>)


export default function NewPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    const response = await fetch("/api/contracts", {
      method: 'POST', // メソッドとして POST を選択
      headers: {
        'Content-Type': 'application/json' // コンテンツタイプとして JSON を指定
      },
      body: JSON.stringify(data) // データを JSON 形式の文字列に変換
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
              <label className="label">
                <span className="text-base label-text">Name</span>
              </label>

              <input
                type="text"
                placeholder="Name"
                className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.name })}
                {...register("name", { required: true })}
              />
              {errors.name && <ErrorMessageFieldRequired />}
            </div>

            <div>
              <label className="label">
                <span className="text-base label-text">Symbol</span>
              </label>

              <input
                type="text"
                placeholder="Symbol"
                className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.symbol })}
                {...register("symbol", { required: true })}
              />
              {errors.symbol && <ErrorMessageFieldRequired />}
            </div>

            <div>
              <label className="label">
                <span className="text-base label-text">Contract URI</span>
              </label>

              <input
                type="text"
                placeholder="Contract URI"
                className={cn("w-full input input-bordered input-primary", { 'input-error': !!errors.contractURI })}
                {...register("contractURI", { required: true })}
              />
              {errors.contractURI && <ErrorMessageFieldRequired />}
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
