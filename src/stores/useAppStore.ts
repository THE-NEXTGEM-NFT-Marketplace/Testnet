import { create } from 'zustand';
import { addDays, addHours } from 'date-fns';

export type MarketStatus = 'PROPOSED' | 'OPEN' | 'RESOLVING' | 'RESOLVED';
export type MarketCategory = 'All' | 'Crypto' | 'Politics' | 'Sports' | 'Community';
export type Outcome = 'YES' | 'NO';

export interface PricePoint {
  time: number;
  value: number;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  resolutionDate: Date;
  yesPrice: number;
  noPrice: number;
  totalVolume: number;
  priceHistory: PricePoint[];
}

export interface Position {
  marketId: string;
  outcome: Outcome;
  shares: number;
  avgPrice: number;
}

export interface ProposeMarketData {
  title: string;
  description: string;
  category: Exclude<MarketCategory, 'All'>;
  resolutionDate: Date;
  initialYesPrice: number;
}

export interface AppState {
  // User state
  usdcBalance: number;
  positions: Position[];
  hasClaimedToday: boolean;
  lastClaimTimestamp: number | null;
  
  // Wallet state
  isSuiConnected: boolean;
  isEvmConnected: boolean;
  isAnyWalletConnected: boolean;
  
  // Markets
  markets: Market[];
  currentMarket: Market | null;
  
  // UI state
  currentView: 'markets' | 'trading' | 'portfolio' | 'governance' | 'propose-market' | 'faucet';
  selectedCategory: MarketCategory;
  
  // Actions
  setCurrentView: (view: 'markets' | 'trading' | 'portfolio' | 'governance' | 'propose-market' | 'faucet') => void;
  setSelectedCategory: (category: MarketCategory) => void;
  setCurrentMarket: (market: Market | null) => void;
  setUsdcBalance: (balance: number) => void;
  setHasClaimedToday: (claimed: boolean) => void;
  setLastClaimTimestamp: (ts: number | null) => void;
  connectSuiWallet: () => void;
  disconnectSuiWallet: () => void;
  connectEvmWallet: () => void;
  disconnectEvmWallet: () => void;
  buyShares: (marketId: string, outcome: Outcome, amount: number) => void;
  sellShares: (marketId: string, outcome: Outcome, shares: number) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  proposeMarket: (data: ProposeMarketData) => Promise<void>;
}

// Demo market data - Updated for 2025/2026
const createDemoMarkets = (): Market[] => {
  const now = Date.now();
  
  return [
    {
      id: 'bitcoin-200k',
      title: 'Bitcoin > $200k by EOY 2025',
      description: 'Will Bitcoin price exceed $200,000 by December 31, 2025?',
      category: 'Crypto',
      status: 'OPEN',
      resolutionDate: new Date('2025-12-31'),
      yesPrice: 0.65,
      noPrice: 0.35,
      totalVolume: 3456789,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.62 },
        { time: now - 86400000 * 6, value: 0.64 },
        { time: now - 86400000 * 5, value: 0.66 },
        { time: now - 86400000 * 4, value: 0.65 },
        { time: now - 86400000 * 3, value: 0.63 },
        { time: now - 86400000 * 2, value: 0.65 },
        { time: now - 86400000 * 1, value: 0.66 },
        { time: now, value: 0.65 }
      ]
    },
    {
      id: 'sui-price-10',
      title: 'SUI > $10.00 by Sept 2025',
      description: 'Will SUI price be greater than $10.00 on September 1, 2025?',
      category: 'Crypto',
      status: 'OPEN',
      resolutionDate: new Date('2025-09-01'),
      yesPrice: 0.42,
      noPrice: 0.58,
      totalVolume: 1234567,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.38 },
        { time: now - 86400000 * 6, value: 0.40 },
        { time: now - 86400000 * 5, value: 0.43 },
        { time: now - 86400000 * 4, value: 0.41 },
        { time: now - 86400000 * 3, value: 0.42 },
        { time: now - 86400000 * 2, value: 0.43 },
        { time: now - 86400000 * 1, value: 0.42 },
        { time: now, value: 0.42 }
      ]
    },
    {
      id: 'ai-agi-2026',
      title: 'AGI achieved by 2026',
      description: 'Will Artificial General Intelligence be demonstrated by a major AI company by December 31, 2026?',
      category: 'Politics',
      status: 'OPEN',
      resolutionDate: new Date('2026-12-31'),
      yesPrice: 0.28,
      noPrice: 0.72,
      totalVolume: 2876543,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.25 },
        { time: now - 86400000 * 6, value: 0.27 },
        { time: now - 86400000 * 5, value: 0.29 },
        { time: now - 86400000 * 4, value: 0.28 },
        { time: now - 86400000 * 3, value: 0.27 },
        { time: now - 86400000 * 2, value: 0.28 },
        { time: now - 86400000 * 1, value: 0.29 },
        { time: now, value: 0.28 }
      ]
    },
    {
      id: 'us-recession-2025',
      title: 'US Recession in 2025',
      description: 'Will the United States enter an official recession during 2025?',
      category: 'Politics',
      status: 'OPEN',
      resolutionDate: new Date('2025-12-31'),
      yesPrice: 0.32,
      noPrice: 0.68,
      totalVolume: 1876543,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.30 },
        { time: now - 86400000 * 6, value: 0.31 },
        { time: now - 86400000 * 5, value: 0.33 },
        { time: now - 86400000 * 4, value: 0.32 },
        { time: now - 86400000 * 3, value: 0.31 },
        { time: now - 86400000 * 2, value: 0.32 },
        { time: now - 86400000 * 1, value: 0.33 },
        { time: now, value: 0.32 }
      ]
    },
    {
      id: 'world-cup-2026',
      title: 'Brazil wins 2026 World Cup',
      description: 'Will Brazil win the 2026 FIFA World Cup?',
      category: 'Sports',
      status: 'OPEN',
      resolutionDate: new Date('2026-07-19'),
      yesPrice: 0.18,
      noPrice: 0.82,
      totalVolume: 987654,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.20 },
        { time: now - 86400000 * 6, value: 0.19 },
        { time: now - 86400000 * 5, value: 0.17 },
        { time: now - 86400000 * 4, value: 0.18 },
        { time: now - 86400000 * 3, value: 0.19 },
        { time: now - 86400000 * 2, value: 0.18 },
        { time: now - 86400000 * 1, value: 0.17 },
        { time: now, value: 0.18 }
      ]
    },
    {
      id: 'tesla-500-2025',
      title: 'Tesla stock hits $500 by 2025',
      description: 'Will Tesla (TSLA) stock price reach $500 per share by December 31, 2025?',
      category: 'Community',
      status: 'OPEN',
      resolutionDate: new Date('2025-12-31'),
      yesPrice: 0.45,
      noPrice: 0.55,
      totalVolume: 654321,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.43 },
        { time: now - 86400000 * 6, value: 0.44 },
        { time: now - 86400000 * 5, value: 0.46 },
        { time: now - 86400000 * 4, value: 0.45 },
        { time: now - 86400000 * 3, value: 0.44 },
        { time: now - 86400000 * 2, value: 0.45 },
        { time: now - 86400000 * 1, value: 0.46 },
        { time: now, value: 0.45 }
      ]
    },
    {
      id: 'ethereum-etf-2025',
      title: 'Ethereum ETF approved in 2025',
      description: 'Will a spot Ethereum ETF be approved in the United States by December 31, 2025?',
      category: 'Crypto',
      status: 'RESOLVING',
      resolutionDate: new Date('2025-12-31'),
      yesPrice: 0.78,
      noPrice: 0.22,
      totalVolume: 2345678,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.75 },
        { time: now - 86400000 * 6, value: 0.77 },
        { time: now - 86400000 * 5, value: 0.79 },
        { time: now - 86400000 * 4, value: 0.78 },
        { time: now - 86400000 * 3, value: 0.76 },
        { time: now - 86400000 * 2, value: 0.78 },
        { time: now - 86400000 * 1, value: 0.79 },
        { time: now, value: 0.78 }
      ]
    },
    {
      id: 'solana-price-1000',
      title: 'Solana > $1000 by EOY 2025',
      description: 'Will Solana (SOL) price exceed $1000 by December 31, 2025?',
      category: 'Crypto',
      status: 'OPEN',
      resolutionDate: new Date('2025-12-31'),
      yesPrice: 0.12,
      noPrice: 0.88,
      totalVolume: 1567890,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.10 },
        { time: now - 86400000 * 6, value: 0.11 },
        { time: now - 86400000 * 5, value: 0.13 },
        { time: now - 86400000 * 4, value: 0.12 },
        { time: now - 86400000 * 3, value: 0.11 },
        { time: now - 86400000 * 2, value: 0.12 },
        { time: now - 86400000 * 1, value: 0.13 },
        { time: now, value: 0.12 }
      ]
    },
    {
      id: 'trump-2028',
      title: 'Trump runs for President in 2028',
      description: 'Will Donald Trump announce a presidential campaign for the 2028 election?',
      category: 'Politics',
      status: 'OPEN',
      resolutionDate: new Date('2027-12-31'),
      yesPrice: 0.34,
      noPrice: 0.66,
      totalVolume: 3456789,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.32 },
        { time: now - 86400000 * 6, value: 0.33 },
        { time: now - 86400000 * 5, value: 0.35 },
        { time: now - 86400000 * 4, value: 0.34 },
        { time: now - 86400000 * 3, value: 0.33 },
        { time: now - 86400000 * 2, value: 0.34 },
        { time: now - 86400000 * 1, value: 0.35 },
        { time: now, value: 0.34 }
      ]
    },
    {
      id: 'climate-target-2030',
      title: 'Global CO2 emissions peak by 2030',
      description: 'Will global CO2 emissions reach their peak and begin declining by 2030?',
      category: 'Politics',
      status: 'RESOLVING',
      resolutionDate: new Date('2030-12-31'),
      yesPrice: 0.23,
      noPrice: 0.77,
      totalVolume: 987654,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.25 },
        { time: now - 86400000 * 6, value: 0.24 },
        { time: now - 86400000 * 5, value: 0.22 },
        { time: now - 86400000 * 4, value: 0.23 },
        { time: now - 86400000 * 3, value: 0.24 },
        { time: now - 86400000 * 2, value: 0.23 },
        { time: now - 86400000 * 1, value: 0.22 },
        { time: now, value: 0.23 }
      ]
    },
    {
      id: 'superbowl-2026',
      title: 'Chiefs win Super Bowl 2026',
      description: 'Will the Kansas City Chiefs win Super Bowl LX in 2026?',
      category: 'Sports',
      status: 'OPEN',
      resolutionDate: new Date('2026-02-08'),
      yesPrice: 0.14,
      noPrice: 0.86,
      totalVolume: 1234567,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.16 },
        { time: now - 86400000 * 6, value: 0.15 },
        { time: now - 86400000 * 5, value: 0.13 },
        { time: now - 86400000 * 4, value: 0.14 },
        { time: now - 86400000 * 3, value: 0.15 },
        { time: now - 86400000 * 2, value: 0.14 },
        { time: now - 86400000 * 1, value: 0.13 },
        { time: now, value: 0.14 }
      ]
    },
    {
      id: 'olympics-2028',
      title: 'USA tops Olympics medal count 2028',
      description: 'Will the United States finish with the most total medals at the 2028 Los Angeles Olympics?',
      category: 'Sports',
      status: 'OPEN',
      resolutionDate: new Date('2028-08-12'),
      yesPrice: 0.67,
      noPrice: 0.33,
      totalVolume: 876543,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.65 },
        { time: now - 86400000 * 6, value: 0.66 },
        { time: now - 86400000 * 5, value: 0.68 },
        { time: now - 86400000 * 4, value: 0.67 },
        { time: now - 86400000 * 3, value: 0.66 },
        { time: now - 86400000 * 2, value: 0.67 },
        { time: now - 86400000 * 1, value: 0.68 },
        { time: now, value: 0.67 }
      ]
    },
    {
      id: 'apple-3-trillion',
      title: 'Apple hits $3T market cap in 2025',
      description: 'Will Apple Inc. reach a $3 trillion market capitalization during 2025?',
      category: 'Community',
      status: 'RESOLVED',
      resolutionDate: new Date('2025-01-15'),
      yesPrice: 0.89,
      noPrice: 0.11,
      totalVolume: 5432109,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.87 },
        { time: now - 86400000 * 6, value: 0.88 },
        { time: now - 86400000 * 5, value: 0.90 },
        { time: now - 86400000 * 4, value: 0.89 },
        { time: now - 86400000 * 3, value: 0.88 },
        { time: now - 86400000 * 2, value: 0.89 },
        { time: now - 86400000 * 1, value: 0.90 },
        { time: now, value: 0.89 }
      ]
    },
    {
      id: 'mars-mission-2026',
      title: 'SpaceX Mars mission launches 2026',
      description: 'Will SpaceX successfully launch a crewed mission to Mars in 2026?',
      category: 'Community',
      status: 'OPEN',
      resolutionDate: new Date('2026-12-31'),
      yesPrice: 0.31,
      noPrice: 0.69,
      totalVolume: 2109876,
      priceHistory: [
        { time: now - 86400000 * 7, value: 0.29 },
        { time: now - 86400000 * 6, value: 0.30 },
        { time: now - 86400000 * 5, value: 0.32 },
        { time: now - 86400000 * 4, value: 0.31 },
        { time: now - 86400000 * 3, value: 0.30 },
        { time: now - 86400000 * 2, value: 0.31 },
        { time: now - 86400000 * 1, value: 0.32 },
        { time: now, value: 0.31 }
      ]
    }
  ];
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  usdcBalance: 0,
  positions: [],
  hasClaimedToday: false,
  lastClaimTimestamp: null,
  
  // Wallet state
  isSuiConnected: false,
  isEvmConnected: false,
  isAnyWalletConnected: false,
  
  markets: createDemoMarkets(),
  currentMarket: null,
  currentView: 'markets',
  selectedCategory: 'All',
  
  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCurrentMarket: (market) => set({ currentMarket: market, currentView: market ? 'trading' : 'markets' }),
  setUsdcBalance: (balance) => set({ usdcBalance: balance }),
  setHasClaimedToday: (claimed) => set({ hasClaimedToday: claimed }),
  setLastClaimTimestamp: (ts) => set({ lastClaimTimestamp: ts }),
  
  // Wallet actions
  connectSuiWallet: () => set({ isSuiConnected: true, isAnyWalletConnected: true }),
  disconnectSuiWallet: () => {
    const state = get();
    set({ 
      isSuiConnected: false, 
      isAnyWalletConnected: state.isEvmConnected 
    });
  },
  connectEvmWallet: () => set({ isEvmConnected: true, isAnyWalletConnected: true }),
  disconnectEvmWallet: () => {
    const state = get();
    set({ 
      isEvmConnected: false, 
      isAnyWalletConnected: state.isSuiConnected 
    });
  },
  
  buyShares: (marketId, outcome, amount) => {
    const state = get();
    if (amount > state.usdcBalance) return;
    
    const market = state.markets.find(m => m.id === marketId);
    if (!market) return;
    
    // Simple price impact calculation
    const currentPrice = outcome === 'YES' ? market.yesPrice : market.noPrice;
    const shares = amount / currentPrice;
    const priceImpact = amount / 50000; // Demo liquidity constant
    
    // Update market prices
    const updatedMarkets = state.markets.map(m => {
      if (m.id === marketId) {
        const newYesPrice = outcome === 'YES' 
          ? Math.min(0.99, m.yesPrice + priceImpact)
          : Math.max(0.01, m.yesPrice - priceImpact);
        const newNoPrice = 1 - newYesPrice;
        
        // Add new price point to history
        const newPriceHistory = [...m.priceHistory, {
          time: Date.now(),
          value: newYesPrice
        }];
        
        return {
          ...m,
          yesPrice: Number(newYesPrice.toFixed(2)),
          noPrice: Number(newNoPrice.toFixed(2)),
          totalVolume: m.totalVolume + amount,
          priceHistory: newPriceHistory
        };
      }
      return m;
    });
    
    // Update user position
    const existingPosition = state.positions.find(p => p.marketId === marketId && p.outcome === outcome);
    let updatedPositions;
    
    if (existingPosition) {
      const totalShares = existingPosition.shares + shares;
      const newAvgPrice = (existingPosition.avgPrice * existingPosition.shares + currentPrice * shares) / totalShares;
      
      updatedPositions = state.positions.map(p => 
        p.marketId === marketId && p.outcome === outcome
          ? { ...p, shares: totalShares, avgPrice: Number(newAvgPrice.toFixed(2)) }
          : p
      );
    } else {
      updatedPositions = [...state.positions, {
        marketId,
        outcome,
        shares,
        avgPrice: currentPrice
      }];
    }
    
    set({
      usdcBalance: Number((state.usdcBalance - amount).toFixed(2)),
      markets: updatedMarkets,
      positions: updatedPositions,
      currentMarket: updatedMarkets.find(m => m.id === marketId) || null
    });
  },
  
  sellShares: (marketId, outcome, sharesToSell) => {
    const state = get();
    const position = state.positions.find(p => p.marketId === marketId && p.outcome === outcome);
    if (!position || sharesToSell > position.shares) return;
    
    const market = state.markets.find(m => m.id === marketId);
    if (!market) return;
    
    const currentPrice = outcome === 'YES' ? market.yesPrice : market.noPrice;
    const saleAmount = sharesToSell * currentPrice;
    
    // Update positions
    const updatedPositions = state.positions.map(p => {
      if (p.marketId === marketId && p.outcome === outcome) {
        const remainingShares = p.shares - sharesToSell;
        return remainingShares > 0 
          ? { ...p, shares: remainingShares }
          : null;
      }
      return p;
    }).filter(Boolean) as Position[];
    
    set({
      usdcBalance: Number((state.usdcBalance + saleAmount).toFixed(2)),
      positions: updatedPositions
    });
  },
  
  deposit: (amount) => {
    const state = get();
    set({ usdcBalance: Number((state.usdcBalance + amount).toFixed(2)) });
  },
  
  withdraw: (amount) => {
    const state = get();
    if (amount <= state.usdcBalance) {
      set({ usdcBalance: Number((state.usdcBalance - amount).toFixed(2)) });
    }
  },
  
  proposeMarket: async (data: ProposeMarketData) => {
    const state = get();
    
    // Generate a unique ID for the market
    const marketId = `market-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the new market with PROPOSED status
    const newMarket: Market = {
      id: marketId,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'PROPOSED',
      resolutionDate: data.resolutionDate,
      yesPrice: data.initialYesPrice,
      noPrice: 1 - data.initialYesPrice,
      totalVolume: 0,
      priceHistory: [{
        time: Date.now(),
        value: data.initialYesPrice
      }]
    };
    
    // Add to markets
    const updatedMarkets = [newMarket, ...state.markets];
    
    set({ 
      markets: updatedMarkets,
      currentView: 'governance'
    });

    // Auto-approve after 60 seconds
    setTimeout(() => {
      const currentState = get();
      const updatedMarketsAfterApproval = currentState.markets.map(m => 
        m.id === marketId ? { ...m, status: 'OPEN' as MarketStatus } : m
      );
      set({ markets: updatedMarketsAfterApproval });
    }, 60000);
  }
}));