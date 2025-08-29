import React, { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Layout } from '../components/Layout';
import { MarketsView } from '../components/Markets/MarketsView';
import { ProposeMarketView } from '../components/Markets/ProposeMarketView';
import { TradingView } from '../components/Trading/TradingView';
import { PortfolioView } from '../components/Portfolio/PortfolioView';
import { GovernanceView } from '../components/Governance/GovernanceView';
import { FaucetView } from '../components/Faucet/FaucetView';
import { useWallet, ConnectButton } from "@suiet/wallet-kit";

const Index = () => {
  const { currentView } = useAppStore();
  const { account } = useWallet();
  const walletAddress = account?.address;

  // Load persisted state for this wallet on address change
  useEffect(() => {
    if (!walletAddress) return;
    try {
      const raw = localStorage.getItem(walletAddress);
      if (raw) {
        const parsed = JSON.parse(raw);
        useAppStore.setState((prev) => ({
          ...prev,
          usdcBalance: typeof parsed.usdcBalance === 'number' ? parsed.usdcBalance : 0,
          positions: Array.isArray(parsed.positions) ? parsed.positions : [],
          hasClaimedToday: !!parsed.hasClaimedToday,
          lastClaimTimestamp: typeof parsed.lastClaimTimestamp === 'number' ? parsed.lastClaimTimestamp : null,
        }));
      } else {
        // Ensure defaults for a fresh wallet
        useAppStore.setState((prev) => ({
          ...prev,
          usdcBalance: 0,
          positions: [],
          hasClaimedToday: false,
          lastClaimTimestamp: null,
        }));
      }
    } catch (e) {
      console.error('Failed to load persisted state', e);
    }
  }, [walletAddress]);

  // Persist subset of state whenever it changes (and we have a wallet address)
  useEffect(() => {
    if (!walletAddress) return;
    const unsubscribe = useAppStore.subscribe((state) => {
      const toPersist = {
        usdcBalance: state.usdcBalance,
        positions: state.positions,
        hasClaimedToday: state.hasClaimedToday,
        lastClaimTimestamp: state.lastClaimTimestamp,
      };
      try {
        localStorage.setItem(walletAddress, JSON.stringify(toPersist));
      } catch (e) {
        console.error('Failed to persist state', e);
      }
    });
    return () => unsubscribe();
  }, [walletAddress]);

  // Global market price ticker: update all markets regularly
  useEffect(() => {
    const interval = setInterval(() => {
      useAppStore.setState((state) => {
        const updatedMarkets = state.markets.map((m) => {
          const volatility = 0.005;
          const randomChange = (Math.random() - 0.5) * volatility;
          let newYes = m.yesPrice + randomChange;
          newYes = Math.max(0.01, Math.min(0.99, newYes));
          const newNo = 1 - newYes;

          const newHistory = [...m.priceHistory, { time: Date.now(), value: Number(newYes.toFixed(4)) }];
          const trimmedHistory = newHistory.slice(-120);
          return {
            ...m,
            yesPrice: Number(newYes.toFixed(2)),
            noPrice: Number(newNo.toFixed(2)),
            priceHistory: trimmedHistory,
          };
        });

        const updatedCurrent = state.currentMarket
          ? updatedMarkets.find((mm) => mm.id === state.currentMarket?.id) || state.currentMarket
          : state.currentMarket;

        return { markets: updatedMarkets, currentMarket: updatedCurrent };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  
  console.log('Index rendering, currentView:', currentView);

  const renderView = () => {
    switch (currentView) {
      case 'markets':
        return <MarketsView />;
      case 'propose-market':
        return <ProposeMarketView />;
      case 'trading':
        return <TradingView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'governance':
        return <GovernanceView />;
      case 'faucet':
        return <FaucetView />;
      default:
        return <MarketsView />;
    }
  };

  return (
    <Layout>
      {!walletAddress ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SuiLFG</h1>
          <p className="text-lg text-muted-foreground mb-8">Connect your wallet to begin.</p>
          <ConnectButton>Connect Wallet</ConnectButton>
        </div>
      ) : (
        renderView()
      )}
    </Layout>
  );
};

export default Index;
