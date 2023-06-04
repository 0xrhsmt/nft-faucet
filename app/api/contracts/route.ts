import { NextResponse } from 'next/server';
import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';

const SUPPORTED_NETWORKS = [
    5, // Goerli
    80001, // Mumbai
] as const


export async function POST(request: Request) {
    const {
        chainId,
        contractName,
        contractSymbol,
        metadataName,
        metadataDescription,
        metadataExternalLink
    } = await request.json();

    if (!chainId || !contractName || !contractSymbol || !metadataName || !metadataDescription) {
        throw new Error('Missing required fields');
    }
    if (!SUPPORTED_NETWORKS.indexOf(chainId)) {
        throw new Error('Unsupported network');
    }

    const auth = new Auth({
        projectId: process.env.INFURA_API_KEY,
        secretId: process.env.INFURA_API_KEY_SECRET,
        privateKey: process.env.WALLET_PRIVATE_KEY,
        chainId: 80001,
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
            metadata: 'https://dummyimage.com/600x400/000/fff',
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

    // kv
    // walletaddress
    // contractaddress
    // contractname
    // image
    // chainId
    // accounts:accountAddress:contracts:contractAddress
    // accounts:accountAddress:contracts
    // contractAddress


    return NextResponse.json({ data: {
        contractAddress
    } });
}