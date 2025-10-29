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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authAPI, apiUtils } from '../../services/api';
import { apiService, type Investment, type Transaction, type Wallet as WalletType } from '../../services/apiService';
import { OverviewSection } from './components/OverviewSection';
import { InvestmentsSection } from './components/InvestmentsSection';
import { TransactionsSection } from './components/TransactionsSection';
import { WalletsSection } from './components/WalletsSection';``
import { ProfileSection } from './components/ProfileSection';
function Dashboard() {
  // Valid tab IDs - must be defined before useState that uses it
  const validTabs = ['overview', 'investments', 'transactions', 'wallets', 'profile', 'settings'];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    // Initialize from localStorage or default to 'overview'
    const storedTab = localStorage.getItem('activeDashboardTab');
    return (storedTab && validTabs.includes(storedTab)) ? storedTab : 'overview';
  });
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletData, setWalletData] = useState<WalletType[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [manualConnectModalOpen, setManualConnectModalOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileData, investmentsData, transactionsData, walletsData] = await Promise.all([
          apiService.getProfile(),
          apiService.getInvestments(), // Using apiService for dummy data
          apiService.getTransactions(), // Using apiService for dummy data
          apiService.getWallets() // Using apiService for dummy data
        ]);

        setUser(profileData);
        setInvestments(investmentsData);
        setTransactions(transactionsData);
        setWallets(walletsData);

        // Check wallet status
        try {
          const walletStatus = await apiService.getWalletStatus();
          setWalletConnected(walletStatus.wallet_connected);
        } catch (error) {
          console.error('Failed to check wallet status:', error);
          // Fallback: check if user has wallet data
          setWalletConnected(Boolean(profileData.wallet_name && profileData.wallet_number));
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleDisconnectWallet = async () => {
    try {
      const response = await apiService.disconnectWallet();
      setUser(response.user);
      setWalletConnected(false);
      toast.success('Wallet disconnected successfully!');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet. Please try again.');
    }
  };

  const handleProfileUpdate = async (updatedUser: any) => {
    setUser(updatedUser);
    // Update wallet connection status based on updated user data
    setWalletConnected(Boolean(updatedUser.wallet_name && updatedUser.wallet_number));
  };

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
        return (
          <WalletsSection 
            onOpenConnectModal={() => setWalletModalOpen(true)}
            walletConnected={walletConnected}
            walletName={user?.wallet_name}
            walletNumber={user?.wallet_number}
            onDisconnectWallet={handleDisconnectWallet}
          />
        );
      case 'profile':
        return <ProfileSection user={user} onProfileUpdate={handleProfileUpdate} />;
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

  // Handle tab change with validation
  const handleTabChange = (tabId: string) => {
    if (validTabs.includes(tabId)) {
      setActiveSection(tabId);
      setSidebarOpen(false); // Close mobile sidebar when changing tabs
    }
  };

  // Handle logout and clear tab state
  const handleLogout = async () => {
    try {
      // Clear tab state first
      localStorage.removeItem('activeDashboardTab');

      // Call logout API
      await authAPI.logout();

      // Clear all auth tokens and user data
      apiUtils.clearTokens();

      // Show success message
      toast.success('Logged out successfully');

      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');

      // Even if API fails, clear local data and redirect
      localStorage.removeItem('activeDashboardTab');
      apiUtils.clearTokens();
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  };

//       case 'transactions':
//         return <TransactionsSection />;
//       case 'wallets':
//         return <WalletsSection />;
//       case 'profile':
//         return <ProfileSection user={user} />;
//       default:
//         return <OverviewSection stats={stats} />;
//     }
  // Wallet connection functions
  const fetchWallets = async () => {
    try {
      const response = await fetch('https://api.walletconnect.com/v1/wallets');
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      // Fallback wallet list for demo
      setWallets([
        { id: 'metamask', name: 'MetaMask', image_id: 'metamask', icon: '🦊' },
        { id: 'walletconnect', name: 'WalletConnect', image_id: 'walletconnect', icon: '🔗' },
        { id: 'coinbase', name: 'Coinbase Wallet', image_id: 'coinbase', icon: '🟦' },
        { id: 'trust', name: 'Trust Wallet', image_id: 'trust', icon: '🔒' },
        { id: 'phantom', name: 'Phantom', image_id: 'phantom', icon: '👻' },
        { id: 'rainbow', name: 'Rainbow', image_id: 'rainbow', icon: '🌈' }
      ]);
    }
  };

  const handleWalletConnect = async (walletId: string) => {
    setConnectingWallet(walletId);
    setWalletModalOpen(false);

    // Show loading toast
    const toastId = toast.loading(`Connecting to ${walletId}...`, {
      autoClose: 5000,
    });

    // Simulate connection process for 5 seconds
    setTimeout(() => {
      toast.update(toastId, {
        render: `Failed to connect to ${walletId}. Please try again.`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });

      setConnectingWallet(null);
      setManualConnectModalOpen(true);
    }, 5000);
  };

  const handleManualConnect = async () => {
    if (!walletName.trim() || !ibanNumber.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setConnectingWallet('manual');

    try {
      // Connect wallet using backend API
      const response = await apiService.connectWallet({
        wallet_name: walletName.trim(),
        wallet_number: ibanNumber.trim()
      });

      // Update user data with new wallet info
      setUser(response.user);
      setWalletConnected(true);

      toast.success(`Wallet "${walletName}" connected successfully!`);
      setManualConnectModalOpen(false);
      setWalletName('');
      setIbanNumber('');

      // Refresh profile data
      const updatedProfile = await apiService.getProfile();
      setUser(updatedProfile);

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleTryAgain = () => {
    setManualConnectModalOpen(false);
    setWalletModalOpen(true);
  };

  useEffect(() => {
    if (walletModalOpen) {
      fetchWallets();
    }
  }, [walletModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f] text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a3e]/80 backdrop-blur-xl border-b border-purple-500/20 p-4">
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
            <button
              onClick={() => {
                if (walletConnected) {
                  // Show disconnect option or wallet details
                  if (confirm(`Disconnect wallet "${user?.wallet_name}"?`)) {
                    handleDisconnectWallet();
                  }
                } else {
                  setWalletModalOpen(true);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                walletConnected
                  ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30'
                  : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:block">
                {walletConnected ? `Connected: ${user?.wallet_name}` : 'Connect Wallet'}
              </span>
            </button>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'User'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Fixed Sidebar */}
        <aside className={`fixed left-0 top-20 z-50 w-64 bg-[#1a1a3e]/90 backdrop-blur-xl border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-[calc(100vh-5rem)] p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Web3SecureNet</span>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
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

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors mt-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 min-h-[calc(100vh-5rem)] overflow-y-auto lg:ml-64">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
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

      {/* Wallet Selection Modal */}
      {walletModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a3e] border border-purple-500/30 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Connect Wallet</h2>
              <button
                onClick={() => setWalletModalOpen(false)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {wallets.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                wallets.map((wallet: any) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet.id)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                  >
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg">
                      {wallet.icon}
                    </div>
                    <span className="font-medium">{wallet.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Connection Modal */}
      {manualConnectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a3e] border border-purple-500/30 rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manual Wallet Connection</h2>
              <button
                onClick={() => setManualConnectModalOpen(false)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Wallet Name</label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="Enter wallet name"
                  className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">IBAN Number</label>
                <textarea
                  value={ibanNumber}
                  onChange={(e) => setIbanNumber(e.target.value)}
                  placeholder="Enter your IBAN number (e.g., GB29 RBOS 6016 1331 9268 19)"
                  rows={4}
                  className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Enter a valid IBAN number for your wallet connection</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleManualConnect}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Connect Manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}



export default Dashboard;
