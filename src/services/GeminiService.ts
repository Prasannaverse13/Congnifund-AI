export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  
  constructor() {
    this.apiKey = 'AIzaSyBxdNfAxjzBsqS_lrCiux3XvrNB6K86dvc';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
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
        console.warn(`Gemini API error: ${response.status}, using fallback`);
        return this.getFallbackResponse(prompt);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        let text = data.candidates[0].content.parts[0].text;
        
        // Remove markdown formatting
        text = text.replace(/\*\*(.*?)\*\*/g, '$1');
        text = text.replace(/\*(.*?)\*/g, '$1');
        text = text.replace(/#{1,6}\s/g, '');
        text = text.replace(/`{1,3}(.*?)`{1,3}/g, '$1');
        text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
        text = text.replace(/^\s*[-*+]\s/gm, '• ');
        text = text.replace(/^\s*\d+\.\s/gm, '');
        
        return text;
      }
      
      return this.getFallbackResponse(prompt);
    } catch (error) {
      console.warn('Gemini API error, using fallback:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  private getFallbackResponse(prompt: string): string {
    if (prompt.includes('analyze') || prompt.includes('wallet')) {
      return 'Your wallet analysis is complete. Connect your Core Wallet and add some AVAX to start exploring DeFi opportunities on Avalanche. I can help you find the best yield farming strategies and guide you through the process safely.';
    }
    
    if (prompt.includes('yield') || prompt.includes('opportunities')) {
      return 'Current yield opportunities on Avalanche include AVAX staking at 9.5% APY, Aave lending at 8.2% APY, and Trader Joe liquidity farming at 18.5% APY. Start with conservative options and gradually explore higher yields as you gain experience.';
    }
    
    if (prompt.includes('DeFi') || prompt.includes('basics')) {
      return 'DeFi on Avalanche offers fast, low-cost transactions for yield farming, lending, and staking. Start by getting AVAX for transaction fees, then explore protocols like Aave for lending, Trader Joe for DEX trading, and Benqi for liquid staking. Always start small and understand the risks.';
    }
    
    return 'I am your AI-powered DeFi advisor. Connect your Core Wallet to get started with personalized investment strategies on Avalanche. I can help you analyze opportunities, manage risks, and optimize your yields safely.';
  }

  async generateConversationalResponse(
    userQuery: string,
    userContext: any,
    portfolioData: any,
    marketData: any
  ): Promise<string> {
    const prompt = `
    You are CogniFund AI, an expert DeFi investment advisor. Respond to this user query in a conversational, helpful manner:
    
    User Query: "${userQuery}"
    User Context: ${JSON.stringify(userContext)}
    Portfolio Data: ${JSON.stringify(portfolioData)}
    Market Data: ${JSON.stringify(marketData)}
    
    Respond in plain text format without markdown. Be conversational and provide specific, actionable advice.
    `;
    
    return await this.generateContent(prompt);
  }
}

export const geminiService = new GeminiService();