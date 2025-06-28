import { useState, useEffect, useCallback } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  chainId: number | null;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0',
    chainId: null,
    isLoading: false,
    error: null
  });

  const getProvider = () => {
    if (typeof window === 'undefined') return null;
    
    // Check for Core Wallet first
    if ((window as any).avalanche) {
      return (window as any).avalanche;
    }
    
    // Check for MetaMask or other injected wallets
    if ((window as any).ethereum) {
      return (window as any).ethereum;
    }
    
    return null;
  };

  const checkConnection = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      const accounts = await provider.request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts.length > 0) {
        const chainId = await provider.request({ 
          method: 'eth_chainId' 
        });
        
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });

        setWalletState({
          isConnected: true,
          address: accounts[0],
          balance: (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4),
          chainId: parseInt(chainId, 16),
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletState(prev => ({ ...prev, error: 'Failed to check wallet connection' }));
    }
  }, []);

  const connectWallet = async () => {
    const provider = getProvider();
    
    if (!provider) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'Core Wallet not detected. Please install Core Wallet extension from https://core.app/' 
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      const chainId = await provider.request({ 
        method: 'eth_chainId' 
      });

      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      setWalletState({
        isConnected: true,
        address: accounts[0],
        balance: (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4),
        chainId: parseInt(chainId, 16),
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending. Please check your wallet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setWalletState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: '0',
      chainId: null,
      isLoading: false,
      error: null
    });
  };

  const switchToAvalanche = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA86A' }], // Avalanche C-Chain
      });
    } catch (switchError: any) {
      // If the chain hasn't been added to the wallet
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xA86A',
              chainName: 'Avalanche Network',
              nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX',
                decimals: 18,
              },
              rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://snowtrace.io/'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Avalanche network:', addError);
          setWalletState(prev => ({ 
            ...prev, 
            error: 'Failed to add Avalanche network to wallet' 
          }));
        }
      } else {
        console.error('Failed to switch to Avalanche:', switchError);
        setWalletState(prev => ({ 
          ...prev, 
          error: 'Failed to switch to Avalanche network' 
        }));
      }
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection();

    const provider = getProvider();
    if (provider) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      const handleConnect = () => {
        checkConnection();
      };

      const handleDisconnect = () => {
        disconnectWallet();
      };

      // Add event listeners
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('connect', handleConnect);
      provider.on('disconnect', handleDisconnect);

      return () => {
        // Remove event listeners
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('connect', handleConnect);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [checkConnection]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchToAvalanche,
    refreshBalance: checkConnection
  };
};