import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  History,
  Wallet,
  User,
  Settings,
  Search,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { toast } from 'react-toastify';
import { authAPI, apiUtils } from '../../services/api';
import { apiService, type Transaction, type Profile } from '../../services/apiService';
import { connectBrowserWallet } from '../../services/browserWallet';
import { OverviewSection } from './components/OverviewSection';
import { InvestmentsSection } from './components/InvestmentsSection';
import { TransactionsSection } from './components/TransactionsSection';
import { WalletsSection } from './components/WalletsSection';
import { ProfileSection } from './components/ProfileSection';
function Dashboard() {
  // Valid tab IDs - must be defined before useState that uses it
  const validTabs = ['overview', 'investments', 'transactions', 'wallets', 'profile'];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    // Initialize from localStorage or default to 'overview'
    const storedTab = localStorage.getItem('activeDashboardTab');
    return (storedTab && validTabs.includes(storedTab)) ? storedTab : 'overview';
  });
  const [user, setUser] = useState<Profile & { profilePicture?: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileData, transactionsData] = await Promise.all([
          apiService.getProfile(),
          apiService.getTransactions()
        ]);

        setUser(profileData);
        setTransactions(transactionsData);

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
      await apiService.disconnectWallet();
      setUser((current) => current ? { ...current, wallet_name: '', wallet_number: '' } : null);
      setWalletConnected(false);
      toast.success('Wallet disconnected successfully!');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet. Please try again.');
    }
  };

  const handleProfileUpdate = async (updatedUser: Profile) => {
    setUser(updatedUser);
    // Update wallet connection status based on updated user data
    setWalletConnected(Boolean(updatedUser.wallet_name && updatedUser.wallet_number));
  };

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
        return <OverviewSection recentTransactions={transactions.slice(0, 3)} />;
      case 'investments':
        return <InvestmentsSection userProfile={user} />;
      case 'transactions':
        return <TransactionsSection />;
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
        return <OverviewSection recentTransactions={transactions.slice(0, 3)} />;
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

  const handleWalletConnect = async () => {
    setConnectingWallet(true);
    try {
      // The browser wallet prompts for permission; only its public address is sent.
      const wallet = await connectBrowserWallet();
      const response = await apiService.connectWallet(wallet);
      setUser(response.user);
      setWalletConnected(true);
      setWalletModalOpen(false);
      toast.success('Wallet address saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to connect wallet');
    } finally {
      setConnectingWallet(false);
    }
  };

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
            {/* <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors relative">
              <Bell className="w-6 h-6" />
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button> */}
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

      {walletModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="wallet-title" className="bg-[#1a1a3e] border border-purple-500/30 rounded-lg p-6 w-full max-w-md">
            <h2 id="wallet-title" className="text-xl font-bold mb-4">Connect browser wallet</h2>
            <p className="text-white/70 mb-6">
              Approve access in your Ethereum-compatible wallet. Only your public address is saved.
              Never enter a recovery phrase or private key on this website.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setWalletModalOpen(false)} disabled={connectingWallet} className="px-4 py-2 border border-purple-500/30 rounded-lg">Cancel</button>
              <button onClick={handleWalletConnect} disabled={connectingWallet} className="px-4 py-2 bg-purple-600 rounded-lg disabled:opacity-50">
                {connectingWallet ? 'Waiting for wallet...' : 'Connect browser wallet'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



export default Dashboard;
