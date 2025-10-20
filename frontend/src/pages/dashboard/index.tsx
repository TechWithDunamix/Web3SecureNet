import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  History,
  Wallet,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { apiService, type Profile, type Investment, type Transaction, type Wallet as WalletType } from '../../services/apiService';
import { OverviewSection } from './components/OverviewSection';
import { InvestmentsSection } from './components/InvestmentsSection';
import { TransactionsSection } from './components/TransactionsSection';
import { WalletsSection } from './components/WalletsSection';``
import { ProfileSection } from './components/ProfileSection';
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileData, investmentsData, transactionsData, walletsData] = await Promise.all([
          apiService.getProfile(),
          apiService.getInvestments(),
          apiService.getTransactions(),
          apiService.getWallets()
        ]);
        
        setUser(profileData);
        setInvestments(investmentsData);
        setTransactions(transactionsData);
        setWallets(walletsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate stats from real data
  const stats = {
    totalBalance: investments.reduce((sum, inv) => sum + inv.current_value, 0) + 50000, // Adding base balance
    totalInvestments: investments.reduce((sum, inv) => sum + inv.amount, 0),
    monthlyProfit: investments.filter(inv => inv.status === 'active').reduce((sum, inv) => sum + (inv.current_value - inv.amount), 0),
    activeInvestments: investments.filter(inv => inv.status === 'active').length
  };

  // Navigation items
//   const navItems = [
//     { id: 'overview', label: 'Overview', icon: LayoutDashboard },
//     { id: 'investments', label: 'Investments', icon: TrendingUp },
//     { id: 'transactions', label: 'Transactions', icon: History },
//     { id: 'wallets', label: 'Wallets', icon: Wallet },
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'settings', label: 'Settings', icon: Settings },
//   ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    switch(activeSection) {
      case 'overview':
        return <OverviewSection stats={stats} recentTransactions={transactions.slice(0, 3)} />;
      case 'investments':
        return <InvestmentsSection investments={investments} />;
      case 'transactions':
        return <TransactionsSection transactions={transactions} />;
      case 'wallets':
        return <WalletsSection wallets={wallets} />;
      case 'profile':
        return <ProfileSection user={user} />;
      default:
        return <OverviewSection stats={stats} recentTransactions={transactions.slice(0, 3)} />;
    }
  };

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

//   const renderContent = () => {
//     switch(activeSection) {
//       case 'overview':
//         return <OverviewSection stats={stats} />;
//       case 'investments':
//         return <InvestmentsSection />;
//       case 'transactions':
//         return <TransactionsSection />;
//       case 'wallets':
//         return <WalletsSection />;
//       case 'profile':
//         return <ProfileSection user={user} />;
//       default:
//         return <OverviewSection stats={stats} />;
//     }
//   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f] text-white">
      {/* Header */}
      <header className="bg-[#1a1a3e]/80 backdrop-blur-xl border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors relative">
              <Bell className="w-6 h-6" />
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a3e]/90 backdrop-blur-xl border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Web3SecureNet</span>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                        : 'hover:bg-purple-500/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors mt-auto">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}




export default Dashboard;
