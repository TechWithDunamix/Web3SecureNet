import { useState, useEffect } from 'react';
import { TrendingUp, Wallet, LayoutDashboard, Plus, ArrowDownToLine, ArrowUpToLine, RefreshCw, CreditCard, Clock, BarChart2, DollarSign, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { DepositModal } from '../../../components/modals/DepositModal';
import { WithdrawModal } from '../../../components/modals/WithdrawModal';
import { type Transaction, type Wallet as WalletType } from '../../../services/apiService';
import { apiService } from '../../../services/apiService';
import { CoinCarousel } from './CoinCarousel';
import { CoinOverviewBoard } from './CoinOverviewBoard';
import { coinGeckoService, type CoinGeckoCoin } from '../../../services/coinGeckoService';
import { toast } from 'react-toastify';

interface OverviewSectionProps {
  recentTransactions: Transaction[];
}

interface StatsData {
  balance: number;
  total_invested: number;
  active_investments: number;
  today_earnings: number;
  total_earnings: number;
  potential_earnings: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'purple',
  loading = false
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'purple' | 'green' | 'blue' | 'orange';
  loading?: boolean;
}) => {
  const colorClasses = {
    purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500',
    orange: 'bg-orange-500/10 text-orange-500',
  };

  const formatValue = (val: number) => {
    const n = Number(val) || 0;
    if (title === 'Active Investments') {
      return n.toLocaleString();
    }
    return `$${n.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between h-full">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="animate-pulse h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
          ) : (
            <p className="text-2xl font-bold mt-1">
              {formatValue(value)}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]} flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export function OverviewSection({ recentTransactions }: OverviewSectionProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [coins, setCoins] = useState<CoinGeckoCoin[]>([]);
  const [stats, setStats] = useState<StatsData>({
    balance: 0,
    total_invested: 0,
    active_investments: 0,
    today_earnings: 0,
    total_earnings: 0,
    potential_earnings: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const statsData = await apiService.getUserStats();
      setStats({
        balance: Number(statsData.balance) || 0,
        total_invested: Number(statsData.total_invested) || 0,
        active_investments: Number(statsData.active_investments) || 0,
        today_earnings: Number(statsData.today_earnings) || 0,
        total_earnings: Number(statsData.total_earnings) || 0,
        potential_earnings: Number(statsData.potential_earnings) || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          (async () => {
            try {
              const coinData = await coinGeckoService.getTopCoins(20);
              setCoins(coinData);
            } catch (error) {
              console.error('Failed to load coin data:', error);
            }
          })()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back! Here's your financial summary</p>
        </div>
        
        <div className="flex w-full md:w-auto mt-4 md:mt-0 gap-3 flex-col md:flex-row">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Balance"
          value={stats.balance}
          icon={DollarSign}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Active Investments"
          value={stats.active_investments}
          icon={PieChart}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Today's Earnings"
          value={stats.today_earnings}
          icon={BarChart2}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Potential Earnings"
          value={stats.potential_earnings}
          icon={Clock}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">${stats.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Invested</p>
              <p className="text-2xl font-bold">${(Number(stats.total_invested) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Today's Earnings</p>
              <p className={`text-2xl font-bold ${stats.today_earnings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.today_earnings >= 0 ? '+' : ''}${Math.abs(stats.today_earnings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/20 backdrop-blur-xl border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Investments</p>
              <p className="text-2xl font-bold">{stats.active_investments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-orange-400" />
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
