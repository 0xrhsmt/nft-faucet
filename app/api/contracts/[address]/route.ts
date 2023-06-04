import { NextRequest, NextResponse } from 'next/server';
import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';
import { kv } from '@vercel/kv';

const contractKey = (walletAddress: string, contractAddress: string) => `accounts:${walletAddress.toLowerCase()}:contracts:${contractAddress.toLowerCase()}`

export async function GET(request: NextRequest) {
    const match = request.nextUrl.pathname.match(/\/api\/contracts\/(.*)/);
    const contractAddress = match && match[1]
    const walletAddress = request.nextUrl.searchParams.get('walletAddress')
    if (!contractAddress || !walletAddress) {
        throw new Error('Invalid request');
    }

    const contractMetadata = await kv.hmget(
        contractKey(walletAddress, contractAddress),
        'chainId',
        'contractAddress',
        'contractName',
        'contractSymbol',
        'metadataName',
        'metadataDescription',
        'metadataImage',
        'metadataExternalLink'
    ) as any

    const auth = new Auth({
        projectId: process.env.INFURA_API_KEY,
        secretId: process.env.INFURA_API_KEY_SECRET,
        privateKey: process.env.WALLET_PRIVATE_KEY,
        chainId: contractMetadata.chainId,
        ipfs: {
            projectId: process.env.INFURA_IPFS_PROJECT_ID,
            apiKeySecret: process.env.INFURA_IPFS_PROJECT_SECRET,
        },
    });
    const sdk = new SDK(auth);

    console.log(contractAddress)

    const [nfts, transfers, owners] = await Promise.all([
        // NOTE: getContractMetadata not working.
        // sdk.api.getNFTsForCollection({
        //     contractAddress,
        // }).catch(() => undefined),

        sdk.api.getNFTsForCollection({
            contractAddress,
        }).catch(() => undefined),
        sdk.api.getTransfersByContractAddress({
            contractAddress,
        }).catch(() => undefined),
        sdk.api.getOwnersbyContractAddress({
            contractAddress,
        }).catch(() => undefined),
    ])

    return NextResponse.json({
        data: {
            contractMetadata,
            nfts,
            transfers,
            owners
        }
    })
}