import { ethers } from 'ethers';

// Chainlink Data Feed ABI (simplified)
const CHAINLINK_AGGREGATOR_ABI = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "internalType": "uint80", "name": "roundId", "type": "uint80" },
      { "internalType": "int256", "name": "answer", "type": "int256" },
      { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
      { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
      { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Chainlink Automation Registry ABI (simplified)
const AUTOMATION_REGISTRY_ABI = [
  {
    "inputs": [
      { "name": "name", "type": "string" },
      { "name": "encryptedEmail", "type": "bytes" },
      { "name": "upkeepContract", "type": "address" },
      { "name": "gasLimit", "type": "uint32" },
      { "name": "adminAddress", "type": "address" },
      { "name": "triggerType", "type": "uint8" },
      { "name": "checkData", "type": "bytes" },
      { "name": "triggerConfig", "type": "bytes" },
      { "name": "offchainConfig", "type": "bytes" },
      { "name": "amount", "type": "uint96" }
    ],
    "name": "registerUpkeep",
    "outputs": [{ "name": "id", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export interface ChainlinkDataFeed {
  address: string;
  description: string;
  decimals: number;
  latestPrice: number;
  updatedAt: Date;
  roundId: string;
}

export interface RWAVerification {
  assetId: string;
  isVerified: boolean;
  reserveValue: number;
  lastVerification: Date;
  proofHash: string;
  collateralRatio: number;
}

export interface AutomationUpkeep {
  id: string;
  name: string;
  target: string;
  gasLimit: number;
  balance: number;
  isActive: boolean;
}

export interface CCIPMessage {
  messageId: string;
  sourceChain: string;
  destinationChain: string;
  sender: string;
  receiver: string;
  data: string;
  tokenAmounts: Array<{ token: string; amount: string }>;
}

export class ChainlinkService {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  
  // Avalanche Mainnet Chainlink Data Feed addresses
  private readonly DATA_FEEDS = {
    'AVAX/USD': '0x0A77230d17318075983913bC2145DB16C7366156',
    'ETH/USD': '0x976B3D034E162d8bD72D6b9C989d545b839003b0',
    'BTC/USD': '0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743',
    'USDC/USD': '0xF096872672F44d6EBA71458D74fe67F9a77a23B9',
    'LINK/USD': '0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a'
  };

  // Chainlink service addresses on Avalanche
  private readonly CHAINLINK_ADDRESSES = {
    AUTOMATION_REGISTRY: '0x02777053d6764996e594c3E88AF1D58D5363a2e6',
    FUNCTIONS_ROUTER: '0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0',
    CCIP_ROUTER: '0xF4c7E640EdA248ef95972845a62bdC74237805dB'
  };

  constructor(rpcUrl: string = 'https://api.avax.network/ext/bc/C/rpc') {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async connectSigner(signer: ethers.Signer): Promise<void> {
    this.signer = signer;
  }

  // Chainlink Data Feeds Integration
  async getDataFeedPrice(feedSymbol: string): Promise<ChainlinkDataFeed> {
    try {
      const feedAddress = this.DATA_FEEDS[feedSymbol as keyof typeof this.DATA_FEEDS];
      if (!feedAddress) {
        throw new Error(`Data feed not found for ${feedSymbol}`);
      }

      const aggregator = new ethers.Contract(feedAddress, CHAINLINK_AGGREGATOR_ABI, this.provider);
      
      const [roundId, answer, startedAt, updatedAt, answeredInRound] = await aggregator.latestRoundData();
      const decimals = await aggregator.decimals();
      
      const price = Number(answer) / Math.pow(10, Number(decimals));
      
      return {
        address: feedAddress,
        description: feedSymbol,
        decimals: Number(decimals),
        latestPrice: price,
        updatedAt: new Date(Number(updatedAt) * 1000),
        roundId: roundId.toString()
      };
    } catch (error) {
      console.error(`Error fetching ${feedSymbol} price:`, error);
      // Fallback to mock data for demo
      return this.getMockDataFeed(feedSymbol);
    }
  }

  private getMockDataFeed(feedSymbol: string): ChainlinkDataFeed {
    const mockPrices: Record<string, number> = {
      'AVAX/USD': 35.50,
      'ETH/USD': 3850.00,
      'BTC/USD': 67500.00,
      'USDC/USD': 1.00,
      'LINK/USD': 14.25
    };

    return {
      address: this.DATA_FEEDS[feedSymbol as keyof typeof this.DATA_FEEDS] || '0x0000000000000000000000000000000000000000',
      description: feedSymbol,
      decimals: 8,
      latestPrice: mockPrices[feedSymbol] || 0,
      updatedAt: new Date(),
      roundId: Date.now().toString()
    };
  }

  // Chainlink Functions Integration
  async executeChainlinkFunction(
    sourceCode: string,
    args: string[],
    subscriptionId: number
  ): Promise<{ requestId: string; result?: any }> {
    try {
      if (!this.signer) {
        throw new Error('Signer not connected');
      }

      // This would integrate with actual Chainlink Functions
      // For now, we'll simulate the function execution
      console.log('Executing Chainlink Function:', { sourceCode, args, subscriptionId });
      
      // Mock function execution for RWA data fetching
      if (sourceCode.includes('fetchRWAData')) {
        const mockResult = {
          assetValue: 1250000,
          lastAppraisal: Date.now(),
          verificationStatus: 'verified',
          documents: ['deed', 'appraisal', 'insurance']
        };
        
        return {
          requestId: '0x' + Math.random().toString(16).substr(2, 40),
          result: mockResult
        };
      }

      return {
        requestId: '0x' + Math.random().toString(16).substr(2, 40)
      };
    } catch (error) {
      console.error('Error executing Chainlink Function:', error);
      throw error;
    }
  }

  // Chainlink Automation Integration
  async registerAutomation(
    name: string,
    targetContract: string,
    gasLimit: number,
    checkData: string,
    fundingAmount: string
  ): Promise<AutomationUpkeep> {
    try {
      if (!this.signer) {
        throw new Error('Signer not connected');
      }

      // This would register actual upkeep with Chainlink Automation
      console.log('Registering Chainlink Automation:', {
        name,
        targetContract,
        gasLimit,
        checkData,
        fundingAmount
      });

      // Mock registration for demo
      const upkeepId = Date.now().toString();
      
      return {
        id: upkeepId,
        name,
        target: targetContract,
        gasLimit,
        balance: parseFloat(fundingAmount),
        isActive: true
      };
    } catch (error) {
      console.error('Error registering automation:', error);
      throw error;
    }
  }

  // Chainlink Proof of Reserves Integration
  async verifyRWAReserves(assetId: string): Promise<RWAVerification> {
    try {
      // This would connect to actual Chainlink PoR feeds
      console.log('Verifying RWA reserves for asset:', assetId);

      // Mock verification for demo
      const mockVerification: RWAVerification = {
        assetId,
        isVerified: true,
        reserveValue: 1000000 + Math.random() * 500000,
        lastVerification: new Date(),
        proofHash: '0x' + Math.random().toString(16).substr(2, 64),
        collateralRatio: 1.2 + Math.random() * 0.3
      };

      return mockVerification;
    } catch (error) {
      console.error('Error verifying RWA reserves:', error);
      throw error;
    }
  }

  // Chainlink CCIP Integration
  async initiateCCIPTransfer(
    destinationChainSelector: string,
    receiver: string,
    tokenAddress: string,
    amount: string,
    data: string = '0x'
  ): Promise<CCIPMessage> {
    try {
      if (!this.signer) {
        throw new Error('Signer not connected');
      }

      console.log('Initiating CCIP transfer:', {
        destinationChainSelector,
        receiver,
        tokenAddress,
        amount,
        data
      });

      // Mock CCIP transfer for demo
      const messageId = '0x' + Math.random().toString(16).substr(2, 64);
      
      return {
        messageId,
        sourceChain: 'avalanche',
        destinationChain: destinationChainSelector,
        sender: await this.signer.getAddress(),
        receiver,
        data,
        tokenAmounts: [{ token: tokenAddress, amount }]
      };
    } catch (error) {
      console.error('Error initiating CCIP transfer:', error);
      throw error;
    }
  }

  // Get multiple price feeds at once
  async getMultiplePrices(symbols: string[]): Promise<Record<string, ChainlinkDataFeed>> {
    const prices: Record<string, ChainlinkDataFeed> = {};
    
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          prices[symbol] = await this.getDataFeedPrice(symbol);
        } catch (error) {
          console.error(`Failed to fetch price for ${symbol}:`, error);
        }
      })
    );
    
    return prices;
  }

  // Monitor price feeds for significant changes
  async monitorPriceFeeds(
    symbols: string[],
    thresholdPercent: number,
    callback: (symbol: string, oldPrice: number, newPrice: number) => void
  ): Promise<void> {
    const initialPrices: Record<string, number> = {};
    
    // Get initial prices
    for (const symbol of symbols) {
      const feed = await this.getDataFeedPrice(symbol);
      initialPrices[symbol] = feed.latestPrice;
    }

    // Set up monitoring interval
    setInterval(async () => {
      for (const symbol of symbols) {
        try {
          const feed = await this.getDataFeedPrice(symbol);
          const oldPrice = initialPrices[symbol];
          const newPrice = feed.latestPrice;
          
          const changePercent = Math.abs((newPrice - oldPrice) / oldPrice) * 100;
          
          if (changePercent >= thresholdPercent) {
            callback(symbol, oldPrice, newPrice);
            initialPrices[symbol] = newPrice; // Update baseline
          }
        } catch (error) {
          console.error(`Error monitoring ${symbol}:`, error);
        }
      }
    }, 30000); // Check every 30 seconds
  }
}

export const chainlinkService = new ChainlinkService();