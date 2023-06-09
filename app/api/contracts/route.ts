import { NextResponse } from 'next/server';
import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';
import { kv } from '@vercel/kv';


const SUPPORTED_NETWORKS = [
    5, // Goerli
    80001, // Mumbai
] as const


// TODO: Add a real image
const metadataImage = 'https://github.com/0xrhsmt/nft-faucet/assets/54972320/cc8ce256-b359-46aa-8bbf-3676ce03b684'

const contractsKey = (walletAddress: string) => `accounts:${walletAddress.toLowerCase()}:contracts`
const contractKey = (walletAddress: string, contractAddress: string) => `accounts:${walletAddress.toLowerCase()}:contracts:${contractAddress.toLowerCase()}`

export async function POST(request: Request) {
    const {
        chainId,
        walletAddress,
        contractName,
        contractSymbol,
        metadataName,
        metadataDescription,
        metadataExternalLink
    } = await request.json();

    if (!chainId || !walletAddress || !contractName || !contractSymbol || !metadataName || !metadataDescription) {
        throw new Error('Missing required fields');
    }
    if (!SUPPORTED_NETWORKS.indexOf(chainId)) {
        throw new Error('Unsupported network');
    }

    const auth = new Auth({
        projectId: process.env.INFURA_API_KEY,
        secretId: process.env.INFURA_API_KEY_SECRET,
        privateKey: process.env.WALLET_PRIVATE_KEY,
        chainId: chainId,
        ipfs: {
            projectId: process.env.INFURA_IPFS_PROJECT_ID,
            apiKeySecret: process.env.INFURA_IPFS_PROJECT_SECRET,
        },
    });

    const sdk = new SDK(auth);
    const collectionMetadata = Metadata.openSeaCollectionLevelStandard({
        name: metadataName,
        description: metadataDescription,
        image: await sdk.storeFile({
            // TODO
            metadata: metadataImage,
        }),
        external_link: metadataExternalLink,
    });

    console.log('collectionMetadata ----', collectionMetadata);
    const storeMetadata = await sdk.storeMetadata({ metadata: collectionMetadata });
    console.log('storeMetadata', storeMetadata);

    const newContract = await sdk.deploy({
        template: TEMPLATES.ERC721Mintable,
        params: {
            name: contractName,
            symbol: contractSymbol,
            contractURI: storeMetadata,
        },
    });
    const contractAddress = newContract.contractAddress

    // add admin
    const contract = await sdk.loadContract({
        template: TEMPLATES.ERC721Mintable,
        contractAddress: contractAddress,
    });
    await contract.accessControl.addAdmin({
        publicAddress: walletAddress
    });

    // save to KV
    await kv.sadd(contractsKey(walletAddress), contractAddress);
    await kv.hmset(contractKey(walletAddress, contractAddress), {
        chainId,
        contractAddress,
        contractName,
        contractSymbol,
        metadataName,
        metadataDescription,
        metadataImage,
        metadataExternalLink,
    });

    return NextResponse.json({
        data: {
            contractAddress
        }
    }, { status: 201 });
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const walletAddress = url.searchParams.get('walletAddress') as string

    const contractAddresses = await kv.smembers(contractsKey(walletAddress));

    const pipeline = kv.pipeline();

    contractAddresses.forEach((contractAddress) => pipeline.hgetall(contractKey(walletAddress, contractAddress)));

    const data = await pipeline.exec();

    return NextResponse.json({ data });
}