export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface CoinGeckoMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

class CoinGeckoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  async getTopCoins(limit: number = 10): Promise<CoinGeckoCoin[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid coin market response');
      return data.filter((coin): coin is CoinGeckoCoin =>
        coin !== null && typeof coin === 'object' &&
        typeof coin.id === 'string' && typeof coin.symbol === 'string' && typeof coin.name === 'string'
      );
    } catch (error) {
      console.error('Error fetching top coins:', error);
      // Return empty array as fallback instead of throwing
      return [];
    }
  }

  async getCoinById(coinId: string): Promise<CoinGeckoCoin | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      return data[0] || null;
    } catch (error) {
      console.error(`Error fetching coin ${coinId}:`, error);
      return null;
    }
  }

  async getCoinChartData(coinId: string, days: number = 7): Promise<CoinGeckoMarketChart | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching chart data for ${coinId}:`, error);
      return null;
    }
  }

  async getTrendingCoins(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/trending`);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      return data.coins || [];
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
