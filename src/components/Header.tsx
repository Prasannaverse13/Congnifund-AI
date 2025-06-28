import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Wallet, Settings, Bell, User, LogOut, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const Header: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    chainId, 
    disconnectWallet, 
    switchToAvalanche,
    refreshBalance 
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isAvalanche = chainId === 43114;

  return (
    <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <Brain className="h-8 w-8 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CogniFund AI</h1>
              <p className="text-xs text-blue-300">Conversational DeFi</p>
            </div>
          </motion.div>

          {/* Navigation & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-4"
          >
            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full"></div>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* Network Status */}
            {isConnected && (
              <div className="flex items-center space-x-2">
                {!isAvalanche && (
                  <button
                    onClick={switchToAvalanche}
                    className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs hover:bg-orange-500/30 transition-all"
                  >
                    Switch to Avalanche
                  </button>
                )}
                <div className={`px-3 py-1 rounded-lg text-xs border ${
                  isAvalanche 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {isAvalanche ? 'Avalanche' : `Chain ${chainId}`}
                </div>
              </div>
            )}

            {/* Wallet Info */}
            {isConnected && address && (
              <div className="flex items-center space-x-3 bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-green-400" />
                  <div className="text-sm">
                    <div className="text-white font-medium">{formatAddress(address)}</div>
                    <div className="text-slate-400 text-xs">{balance} AVAX</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={refreshBalance}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Refresh balance"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => window.open(`https://snowtrace.io/address/${address}`, '_blank')}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="View on Snowtrace"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={disconnectWallet}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Disconnect wallet"
                  >
                    <LogOut className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Profile */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;