import { useState, useEffect } from 'react';
import { TrendingUp, Wallet, LayoutDashboard } from 'lucide-react';
import { type Transaction } from '../../../services/apiService';
import { CoinCarousel } from './CoinCarousel';
import { CoinOverviewBoard } from './CoinOverviewBoard';
import { coinGeckoService, type CoinGeckoCoin } from '../../../services/coinGeckoService';

interface OverviewSectionProps {
  stats: any;
  recentTransactions: Transaction[];
}

export function OverviewSection({ stats, recentTransactions }: OverviewSectionProps) {
  const [coins, setCoins] = useState<CoinGeckoCoin[]>([]);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinData = await coinGeckoService.getTopCoins(20);
        setCoins(coinData);
      } catch (error) {
        console.error('Failed to load coin data:', error);
      }
    };

    loadCoins();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-8">Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">${stats.totalBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Investments</p>
              <p className="text-2xl font-bold">${stats.totalInvestments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Monthly Profit</p>
              <p className={`text-2xl font-bold ${stats.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.monthlyProfit >= 0 ? '+' : ''}${stats.monthlyProfit.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Investments</p>
              <p className="text-2xl font-bold">{stats.activeInvestments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Coin Price Carousel */}
      <CoinCarousel coins={coins} />

      {/* Coin Overview Board */}
      <CoinOverviewBoard coins={coins} />

      {/* Recent Activity */}
      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-purple-500/10 last:border-b-0">
                <div>
                  <p className="font-medium">{transaction.description || `${transaction.type} - ${transaction.currency}`}</p>
                  <p className="text-sm text-white/60">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${
                  (transaction.type === 'deposit' || transaction.type === 'investment') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(transaction.type === 'deposit' || transaction.type === 'investment') ? '+' : '-'}${transaction.amount.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-white/60">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}
