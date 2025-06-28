import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart, Activity, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

interface TokenBalance {
  symbol: string;
  balance: string;
  value: number;
  change24h: number;
  apy: number;
}

interface PortfolioData {
  totalValue: number;
  totalChange: number;
  apy: number;
  tokens: TokenBalance[];
  lastUpdated: Date;
}

const PortfolioOverview: React.FC = () => {
  const { address, balance, isConnected, chainId } = useWallet();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRealPortfolioData = async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get AVAX balance (already have this from wallet)
      const avaxBalance = parseFloat(balance);
      const avaxPrice = 35.50; // This would come from Chainlink price feed in production
      const avaxValue = avaxBalance * avaxPrice;

      // In production, you would fetch token balances using:
      // 1. Avalanche API or RPC calls
      // 2. Token contract calls for ERC-20 balances
      // 3. DeFi protocol APIs for staked/LP positions
      
      // For now, showing real AVAX balance and indicating other tokens need to be fetched
      const tokens: TokenBalance[] = [
        {
          symbol: 'AVAX',
          balance: balance,
          value: avaxValue,
          change24h: 2.3,
          apy: 8.5
        }
      ];

      // If balance is 0, show empty state
      if (avaxBalance === 0) {
        setPortfolioData({
          totalValue: 0,
          totalChange: 0,
          apy: 0,
          tokens: [],
          lastUpdated: new Date()
        });
      } else {
        setPortfolioData({
          totalValue: avaxValue,
          totalChange: 2.3, // Would be calculated from historical data
          apy: 8.5, // Would be calculated from staking/DeFi positions
          tokens,
          lastUpdated: new Date()
        });
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to fetch portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchRealPortfolioData();
    }
  }, [isConnected, address, balance]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="h-8 bg-slate-700 rounded mb-2"></div>
          <div className="h-4 bg-slate-700 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-center space-x-3 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  // Empty portfolio state
  if (portfolioData && portfolioData.totalValue === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <PieChart className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">No Assets Found</h4>
          <p className="text-slate-400 text-sm mb-4">
            Your wallet appears to be empty. Add some AVAX or other tokens to get started.
          </p>
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <p className="text-blue-300 text-sm">
              💡 Get AVAX from the{' '}
              <a 
                href="https://faucet.avax.network/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-200"
              >
                Avalanche Faucet
              </a>
              {' '}to start exploring DeFi opportunities
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!portfolioData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <PieChart className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Portfolio Overview</h3>
        </div>
        
        <button
          onClick={fetchRealPortfolioData}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Total Value Card */}
      <div className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(portfolioData.totalValue)}
          </span>
          <div className={`flex items-center space-x-1 ${
            portfolioData.totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {portfolioData.totalChange >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {portfolioData.totalChange >= 0 ? '+' : ''}{portfolioData.totalChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-400">Total Portfolio Value</p>
        <p className="text-xs text-slate-500 mt-1">
          Last updated: {formatTime(portfolioData.lastUpdated)}
        </p>
      </div>

      {/* APY Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 mb-6 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Potential APY</p>
            <p className="text-2xl font-bold text-emerald-400">
              {portfolioData.apy.toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Activity className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Token Holdings */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-300 mb-4">Token Holdings</h4>
        <div className="space-y-4">
          {portfolioData.tokens.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{token.symbol}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{token.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{formatCurrency(token.value)}</p>
                  <p className="text-xs text-slate-400">{token.balance} {token.symbol}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  token.change24h >= 0 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                </span>
                <p className="text-xs text-slate-400">
                  Staking APY: {token.apy.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DeFi Opportunities */}
      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">DeFi Opportunities</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Maximize your AVAX potential with verified protocols
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/50 rounded p-2">
            <p className="text-xs text-slate-300">Avalanche Staking</p>
            <p className="text-xs text-emerald-400 font-medium">9.5% APY</p>
          </div>
          <div className="bg-slate-800/50 rounded p-2">
            <p className="text-xs text-slate-300">Aave Lending</p>
            <p className="text-xs text-emerald-400 font-medium">7.2% APY</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioOverview;