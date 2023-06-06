'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    connectorsForWallets,
    lightTheme
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        polygonMumbai,
        goerli
    ],
    [publicProvider()]
);

const projectId = 'NFT_FAUCET';
const appName = 'NFT Faucet'

const { wallets } = getDefaultWallets({
    appName,
    projectId,
    chains,
});

const demoAppInfo = {
    appName,
};

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} appInfo={demoAppInfo} theme={lightTheme(
                {
                    ...lightTheme.accentColors.orange
                }
            )}>
                {mounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
