import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ConversationalInterface from './components/ConversationalInterface';
import PortfolioOverview from './components/PortfolioOverview';
import ActivityLog from './components/ActivityLog';
import WalletConnect from './components/WalletConnect';
import { useWallet } from './hooks/useWallet';

function App() {
  const { isConnected } = useWallet();

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Conversational Interface */}
            <div className="lg:col-span-2">
              <ConversationalInterface />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <PortfolioOverview />
              <ActivityLog />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;