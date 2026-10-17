import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { coinGeckoService, type CoinGeckoCoin } from '../../../services/coinGeckoService';

interface CoinCarouselProps {
  coins: CoinGeckoCoin[];
}

export function CoinCarousel({ coins }: CoinCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || coins.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coins.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, coins.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % coins.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + coins.length) % coins.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (coins.length === 0) {
    return (
      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Live Crypto Prices</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {coins.map((coin) => {
            if (!coin || !coin.id) return null;
            const pct = Number(coin.price_change_percentage_24h) || 0;
            const price = Number(coin.current_price) || 0;
            const high = Number(coin.high_24h) || 0;
            const low = Number(coin.low_24h) || 0;
            const mcap = Number(coin.market_cap) || 0;
            const vol = Number(coin.total_volume) || 0;
            return (
            <div key={coin.id} className="w-full flex-shrink-0 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-base sm:text-lg truncate">{coin.name}</h4>
                    <p className="text-white/60 text-xs sm:text-sm uppercase">{coin.symbol}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="font-bold text-lg sm:text-xl">${price.toLocaleString()}</p>
                  <div className={`flex items-center space-x-1 ${pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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
              </div>

              {/* Additional info */}
              <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-white/60">24h High</p>
                  <p className="font-medium truncate">${high.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60">24h Low</p>
                  <p className="font-medium truncate">${low.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60">Market Cap</p>
                  <p className="font-medium truncate">${(mcap / 1e9).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="text-white/60">Volume (24h)</p>
                  <p className="font-medium truncate">${(vol / 1e9).toFixed(2)}B</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {coins.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-500' : 'bg-purple-500/30'
            }`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
      >
        {isAutoPlaying ? 'Pause' : 'Auto-play'}
      </button>
    </div>
  );
}
