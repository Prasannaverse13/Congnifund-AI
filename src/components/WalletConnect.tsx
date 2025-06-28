import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertCircle, Download, Shield } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect: React.FC = () => {
  const { connectWallet, isLoading, error } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CogniFund AI</h1>
                <p className="text-sm text-blue-300">Conversational DeFi</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">
              Connect Your Core Wallet
            </h2>
            <p className="text-slate-400 text-sm">
              Connect your Core Wallet to access your portfolio and start conversing with AI-powered DeFi strategies.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Connect Button */}
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all flex items-center justify-center space-x-3 mb-6"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Connect Core Wallet</span>
              </>
            )}
          </button>

          {/* Download Core Wallet */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-3">Don't have Core Wallet?</p>
            <a
              href="https://core.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download Core Wallet</span>
            </a>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">Secure & Non-custodial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-slate-300">Real-time portfolio tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-slate-300">AI-powered yield optimization</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletConnect;