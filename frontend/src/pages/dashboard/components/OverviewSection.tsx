import { useState, useEffect } from 'react';
import { TrendingUp, Wallet, LayoutDashboard, Plus, ArrowDownToLine, ArrowUpToLine, RefreshCw, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { DepositModal } from '../../../components/modals/DepositModal';
import { WithdrawModal } from '../../../components/modals/WithdrawModal';
import { type Transaction, type Wallet as WalletType } from '../../../services/apiService';
import { apiService } from '../../../services/apiService';
import { CoinCarousel } from './CoinCarousel';
import { CoinOverviewBoard } from './CoinOverviewBoard';
import { coinGeckoService, type CoinGeckoCoin } from '../../../services/coinGeckoService';

interface OverviewSectionProps {
  stats: any;
  recentTransactions: Transaction[];
}

export function OverviewSection({ stats, recentTransactions }: OverviewSectionProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold mb-4 md:mb-0">Overview</h2>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          <motion.a
            href="https://www.moonpay.com/buy"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-500/20"
          >
            <CreditCard className="w-4 h-4" />
            <span>Buy Crypto</span>
          </motion.a>
          
          <motion.button
            onClick={() => setIsDepositModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-600/90 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Deposit</span>
          </motion.button>
          
          <DepositModal 
            isOpen={isDepositModalOpen} 
            onClose={() => setIsDepositModalOpen(false)} 
          />
          
          <motion.button
            onClick={() => setIsWithdrawModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-700/90 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            <ArrowUpToLine className="w-4 h-4" />
            <span>Withdraw</span>
          </motion.button>
          
<WithdrawModal 
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            onWithdrawSuccess={() => {
              console.log('Withdrawal successful');
              // You can add any success handling here, like refreshing the dashboard data
            }}
          />
          
          
        </div>
      </div>

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
