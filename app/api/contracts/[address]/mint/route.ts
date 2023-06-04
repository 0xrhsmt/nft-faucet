import { NextRequest, NextResponse } from 'next/server';
import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';
import { kv } from '@vercel/kv';

const contractKey = (walletAddress: string, contractAddress: string) => `accounts:${walletAddress.toLowerCase()}:contracts:${contractAddress.toLowerCase()}`


const nftImage = 'https://github.com/0xrhsmt/nft-faucet/assets/54972320/cc8ce256-b359-46aa-8bbf-3676ce03b684'

export async function POST(request: NextRequest) {
    const match = request.nextUrl.pathname.match(/\/api\/contracts\/(.*)\/mint/);
    const contractAddress = match && match[1]
    const {walletAddress, toAddress } = await request.json()
    if (!contractAddress || !walletAddress) {
        throw new Error('Invalid request');
    }
    const chainId = await kv.hget(
        contractKey(walletAddress, contractAddress),
        'chainId',
    ) as number

    const auth = new Auth({
        projectId: process.env.INFURA_API_KEY,
        secretId: process.env.INFURA_API_KEY_SECRET,
        privateKey: process.env.WALLET_PRIVATE_KEY,
        chainId,
        ipfs: {
            projectId: process.env.INFURA_IPFS_PROJECT_ID,
            apiKeySecret: process.env.INFURA_IPFS_PROJECT_SECRET,
        },
    });
    const sdk = new SDK(auth);

    const contract = await sdk.loadContract({
        template: TEMPLATES.ERC721Mintable,
        contractAddress: contractAddress,
    });
    const tx = await contract.mint({
        publicAddress: toAddress,
        tokenURI: 'https://ipfs.io/ipfs/QmajL9pQBCMhvkwJdVYSBkMXaQnDdsMcEvKYSxmyUc5WYy',
    });
    await tx.wait();


    return NextResponse.json({
        data: {
            hash: tx.hash
        }
    }, {
        status: 201
    })
}