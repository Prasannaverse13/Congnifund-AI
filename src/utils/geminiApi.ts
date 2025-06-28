const GEMINI_API_KEY = 'AIzaSyBxdNfAxjzBsqS_lrCiux3XvrNB6K86dvc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiApiService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('No response from Gemini API');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async analyzePortfolio(portfolioData: any): Promise<string> {
    const prompt = `
    As a DeFi investment advisor powered by real-time blockchain data, analyze this portfolio:
    
    Portfolio Data: ${JSON.stringify(portfolioData)}
    
    Provide insights on:
    1. Risk assessment
    2. Yield optimization opportunities
    3. Asset allocation recommendations
    4. Market trends affecting these assets
    
    Keep the response conversational and actionable, as if speaking directly to the investor.
    `;
    
    return this.generateContent(prompt);
  }

  async findYieldOpportunities(riskProfile: 'low' | 'medium' | 'high', amount: number): Promise<string> {
    const prompt = `
    Find the best DeFi yield opportunities for a ${riskProfile} risk profile with $${amount} to invest.
    
    Consider:
    - Current APY rates across major protocols (Aave, Compound, Uniswap, etc.)
    - Real World Asset (RWA) tokenization opportunities
    - Cross-chain opportunities on Avalanche, Ethereum, Polygon
    - Risk factors and smart contract security
    
    Provide specific, actionable recommendations with current yield estimates.
    `;
    
    return this.generateContent(prompt);
  }

  async explainRWATokenization(assetType: string): Promise<string> {
    const prompt = `
    Explain how ${assetType} tokenization works in the context of DeFi and RWAs (Real World Assets).
    
    Cover:
    1. The tokenization process
    2. How Chainlink oracles verify the underlying assets
    3. Yield generation mechanisms
    4. Risks and benefits
    5. Current market opportunities
    
    Make it accessible but comprehensive, suitable for both beginners and experienced DeFi users.
    `;
    
    return this.generateContent(prompt);
  }
}

export const geminiApi = new GeminiApiService();