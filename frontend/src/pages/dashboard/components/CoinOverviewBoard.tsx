import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { type CoinGeckoCoin } from '../../../services/coinGeckoService';

interface CoinOverviewBoardProps {
  coins: CoinGeckoCoin[];
}

export function CoinOverviewBoard({ coins }: CoinOverviewBoardProps) {
  if (coins.length === 0) {
    return (
      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Get top 6 coins for the overview board
  const topCoins = coins.slice(0, 6);

  return (
    <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Market Overview</h3>
        <div className="flex items-center space-x-2 text-sm text-white/60">
          <Activity className="w-4 h-4" />
          <span>Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {topCoins.map((coin) => {
          if (!coin || !coin.id) return null;
          const pct = Number(coin.price_change_percentage_24h) || 0;
          const price = Number(coin.current_price) || 0;
          const mcap = Number(coin.market_cap) || 0;
          const vol = Number(coin.total_volume) || 0;
          const low = Number(coin.low_24h) || 0;
          const high = Number(coin.high_24h) || 0;
          const supply = Number(coin.circulating_supply) || 0;
          return (
          <div key={coin.id} className="bg-[#0a0a1f]/50 border border-purple-500/10 rounded-lg p-3 sm:p-4 hover:border-purple-500/30 transition-colors">
            {/* Header with coin info */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm sm:text-base truncate">{coin.name}</h4>
                  <p className="text-white/60 text-xs uppercase">{coin.symbol}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 flex-shrink-0 ${pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pct >= 0 ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="text-xs sm:text-sm font-medium">
                  {pct >= 0 ? '+' : ''}
                  {pct.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Price and market cap */}
            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs sm:text-sm">Current Price</span>
                <span className="font-bold text-sm sm:text-lg truncate ml-2">${price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs sm:text-sm">Market Cap</span>
                <span className="font-medium text-xs sm:text-sm truncate ml-2">${(mcap / 1e9).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs sm:text-sm">24h Volume</span>
                <span className="font-medium text-xs sm:text-sm truncate ml-2">${(vol / 1e9).toFixed(2)}B</span>
              </div>
            </div>

            {/* Price range */}
            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-white/60">24h Range</span>
                <span className="font-medium truncate ml-2">
                  ${low.toLocaleString()} - ${high.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Supply info */}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Circulating Supply</span>
                <span className="font-medium truncate ml-2">{(supply / 1e6).toFixed(2)}M</span>
              </div>
              {coin.max_supply && (
                <div className="flex justify-between">
                  <span className="text-white/60">Max Supply</span>
                  <span className="font-medium truncate ml-2">{(coin.max_supply / 1e6).toFixed(2)}M</span>
                </div>
              )}
            </div>

            {/* Mini sparkline placeholder */}
            <div className="mt-2 sm:mt-3 h-6 sm:h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded flex items-center justify-center">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            </div>
          </div>
          );
        })}
      </div>

      {/* Market Summary */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-500/20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-1">Total Market Cap</p>
            <p className="font-bold text-sm sm:text-lg">
              ${(coins.reduce((sum, coin) => sum + (Number(coin?.market_cap) || 0), 0) / 1e12).toFixed(2)}T
            </p>
          </div>
          <div className="p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-1">24h Volume</p>
            <p className="font-bold text-sm sm:text-lg">
              ${(coins.reduce((sum, coin) => sum + (Number(coin?.total_volume) || 0), 0) / 1e12).toFixed(2)}T
            </p>
          </div>
          <div className="p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-1">Active Coins</p>
            <p className="font-bold text-sm sm:text-lg">{coins.length}</p>
          </div>
          <div className="p-2 sm:p-3">
            <p className="text-white/60 text-xs sm:text-sm mb-1">BTC Dominance</p>
            <p className="font-bold text-sm sm:text-lg">
              {coins.find(c => c.symbol === 'btc') ?
                ((coins.find(c => c.symbol === 'btc')!.market_cap / coins.reduce((sum, c) => sum + c.market_cap, 0)) * 100).toFixed(1)
                : '0.0'
              }%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
