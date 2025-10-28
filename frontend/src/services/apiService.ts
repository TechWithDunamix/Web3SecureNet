import api from './api';

// API Base URL - Update this to match your backend server
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers (keeping for backward compatibility)
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export interface User {
  id: number;
  email: string;
  full_name: string;
  country?: string;
}

export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  verified: boolean;
  wallet_name?: string;
  wallet_number?: string;
  date_joined: string;
  last_login: string | null;
}

export interface Asset {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  value_usd: number;
  change_24h: number;
}

export interface Investment {
  id: number;
  plan: string;
  duration: number;
  amount: number;
  interest: number;
  status: 'active' | 'completed' | 'pending';
  start_date: string;
  end_date: string;
  current_value: number;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  user: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'swap' | 'investment';
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  amount: number;
  asset_type: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'SOL' | 'XRP' | 'DOGE' | 'TRX' | 'OTHER';
  from_address?: string;
  to_address?: string;
  fee?: number;
  created_at: string;
  updated_at: string;
  deposit?: Deposit;
}

export interface Deposit {
  id: number;
  transaction: string;
  deposit_address: string;
  tx_hash?: string;
  required_confirmations: number;
  confirmed_blocks: number;
  is_approved: boolean;
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: number;
  user: number;
  wallet_name: string;
  wallet_phrase_or_private_key: string;
}

export interface PaymentMethod {
  id: number;
  currency: string;
  address: string;
  method: 'Deposit' | 'Withdrawal';
  network: string;
  picture?: string;
  amount: number;
  transaction_hash?: string;
}

export interface Swap {
  id: number;
  from_currency: string;
  to_currency: string;
  from_amount: number;
  to_amount: number;
}

// Dummy data constants
export const DUMMY_USER: User = {
  id: 1,
  email: "john.doe@example.com",
  full_name: "John Doe",
  country: "United States"
};

export const DUMMY_PROFILE: Profile = {
  id: 1,
  email: "john.doe@example.com",
  first_name: "John",
  last_name: "Doe",
  address: "123 Main St, New York, NY 10001",
  verified: true,
  wallet_name: "MetaMask",
  wallet_number: "0x742d35Cc6634C0532925a3b8D5A4e4f4E1B7f8D8",
  date_joined: "2024-01-01T00:00:00Z",
  last_login: "2024-01-15T10:30:00Z"
};

export const DUMMY_ASSETS: Asset[] = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    balance: 0.5,
    value_usd: 25000,
    change_24h: 2.5
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    balance: 2.5,
    value_usd: 5000,
    change_24h: -1.2
  },
  {
    id: 3,
    name: "Binance Coin",
    symbol: "BNB",
    balance: 10,
    value_usd: 3000,
    change_24h: 3.8
  }
];

export const DUMMY_INVESTMENTS: Investment[] = [
  {
    id: 1,
    plan: "Bitcoin Growth Plan",
    duration: 30,
    amount: 10000,
    interest: 12,
    status: 'active',
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    current_value: 11200
  },
  {
    id: 2,
    plan: "Ethereum Staking",
    duration: 60,
    amount: 5000,
    interest: 8,
    status: 'active',
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    current_value: 5400
  },
  {
    id: 3,
    plan: "DeFi Yield Farming",
    duration: 90,
    amount: 15000,
    interest: 15,
    status: 'completed',
    start_date: "2023-11-01",
    end_date: "2024-01-30",
    current_value: 17250
  }
];

export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: 'deposit',
    amount: 5000,
    currency: 'USD',
    status: 'completed',
    created_at: "2024-01-15T10:30:00Z",
    transaction_hash: "0x1234567890abcdef1234567890abcdef12345678",
    description: "Bank transfer deposit"
  },
  {
    id: 2,
    type: 'investment',
    amount: 2500,
    currency: 'BTC',
    status: 'completed',
    created_at: "2024-01-14T14:20:00Z",
    transaction_hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    description: "Bitcoin investment purchase"
  },
  {
    id: 3,
    type: 'swap',
    amount: 1000,
    currency: 'ETH',
    status: 'pending',
    created_at: "2024-01-13T09:15:00Z",
    transaction_hash: "0x567890abcdef1234567890abcdef1234567890ab",
    description: "ETH to BTC swap"
  },
  {
    id: 4,
    type: 'withdrawal',
    amount: 500,
    currency: 'USD',
    status: 'completed',
    created_at: "2024-01-12T16:45:00Z",
    transaction_hash: "0xcdef1234567890abcdef1234567890abcdef1234",
    description: "USD withdrawal to bank"
  }
];

export const DUMMY_WALLETS: Wallet[] = [
  {
    id: 1,
    user: 1,
    wallet_name: "MetaMask Main",
    wallet_phrase_or_private_key: "witch collapse practice feed shame open despair creek road again ice least"
  },
  {
    id: 2,
    user: 1,
    wallet_name: "Trust Wallet",
    wallet_phrase_or_private_key: "trust wallet seed phrase here"
  }
];

export const DUMMY_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    currency: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    method: "Deposit",
    network: "Bitcoin",
    amount: 0.5,
    transaction_hash: "0x1234567890abcdef1234567890abcdef12345678"
  },
  {
    id: 2,
    currency: "ETH",
    address: "0x742d35Cc6634C0532925a3b8D5A4e4f4E1B7f8D8",
    method: "Withdrawal",
    network: "Ethereum",
    amount: 1.0,
    transaction_hash: "0xabcdef1234567890abcdef1234567890abcdef12"
  }
];

export const DUMMY_SWAPS: Swap[] = [
  {
    id: 1,
    from_currency: "ETH",
    to_currency: "BTC",
    from_amount: 1.0,
    to_amount: 0.05
  },
  {
    id: 2,
    from_currency: "BTC",
    to_currency: "ETH",
    from_amount: 0.1,
    to_amount: 2.0
  }
];

// API service functions using axios
export const apiService = {
  // Authentication
  async login(credentials: { username: string; password: string }) {
    try {
      const response = await api.post('/auth/login/', {
        email: credentials.username,
        password: credentials.password
      });

      // Store tokens in localStorage
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }

      return {
        token: response.data.tokens?.access,
        user: response.data.user
      };
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout/');

      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      return { success: true };
    } catch (error) {
      console.error('Failed to logout:', error);
      return { success: false };
    }
  },

  // Profile endpoints
  async getProfile() {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile from backend, using dummy data:', error);
      // Fallback to dummy data if backend is not available
      return DUMMY_PROFILE;
    }
  },

  async updateProfile(data: { first_name?: string; last_name?: string; address?: string; wallet_name?: string; wallet_number?: string }) {
    try {
      const response = await api.put('/profile/edit/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Wallet endpoints
  async getWalletStatus() {
    try {
      const response = await api.get('/wallet/status/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet status from backend, using fallback:', error);
      // Fallback to check if user has wallet data
      const profile = await this.getProfile();
      return {
        wallet_connected: Boolean(profile.wallet_name && profile.wallet_number),
        wallet: {
          id: profile.id,
          wallet_name: profile.wallet_name,
          wallet_number: profile.wallet_number
        }
      };
    }
  },

  async connectWallet(data: { wallet_name: string; wallet_number: string }) {
    try {
      const response = await api.post('/wallet/connect/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  },

  async disconnectWallet() {
    try {
      const response = await api.delete('/wallet/disconnect/');
      return response.data;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  },

  // Assets endpoints
  async getAssets() {
    await new Promise(resolve => setTimeout(resolve, 600));
    return DUMMY_ASSETS;
  },

  // Investments endpoints
  async getInvestments() {
    await new Promise(resolve => setTimeout(resolve, 700));
    return DUMMY_INVESTMENTS;
  },

  async createInvestment(data: Omit<Investment, 'id' | 'current_value'>) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newInvestment: Investment = {
      id: Math.max(...DUMMY_INVESTMENTS.map(i => i.id)) + 1,
      current_value: data.amount,
      ...data
    };
    return newInvestment;
  },

  // Transactions endpoints
  async getTransactions() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_TRANSACTIONS;
  },

  // Wallets endpoints
  async getWallets() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return DUMMY_WALLETS;
  },

  async createDummyWallet(data: Omit<Wallet, 'id' | 'user'>) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newWallet: Wallet = {
      id: Math.max(...DUMMY_WALLETS.map(w => w.id)) + 1,
      user: 1,
      ...data
    };
    return newWallet;
  },

  // Payment methods endpoints
  async getPaymentMethods() {
    await new Promise(resolve => setTimeout(resolve, 600));
    return DUMMY_PAYMENT_METHODS;
  },

  async createPaymentMethod(data: Omit<PaymentMethod, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPaymentMethod: PaymentMethod = {
      id: Math.max(...DUMMY_PAYMENT_METHODS.map(p => p.id)) + 1,
      ...data
    };
    return newPaymentMethod;
  },

  // Swaps endpoints
  async createSwap(data: Omit<Swap, 'id'>) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newSwap: Swap = {
      id: Math.max(...DUMMY_SWAPS.map(s => s.id)) + 1,
      ...data
    };
    return newSwap;
  },

  // Password change
  async changePassword(data: { old_password: string; new_password: string }) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (data.old_password === "current_password") {
      return { success: true };
    }
    throw new Error("Current password is incorrect");
  },

  // OTP endpoints
  async sendOTP(data: { email?: string; phone?: string }) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { otp_sent: true };
  },

  async verifyOTP(data: { otp: string }) {
    return api.post('/auth/verify-otp/', data);
  },

  // Deposit endpoints
  deposit: {
    createDeposit: async (data: {
      asset_type: string;
      amount: number;
      tx_hash?: string;
      from_address?: string;
    }) => {
      return api.post('/deposits/', data);
    },

    getDeposits: async () => {
      return api.get('/deposits/lists/');
    },

    getDeposit: async (depositId: string) => {
      return api.get(`/transactions/deposits/${depositId}/`);
    },

    updateDepositHash: async (depositId: string, txHash: string) => {
      return api.patch(`/transactions/deposits/${depositId}/`, { tx_hash: txHash });
    },

    updateDepositConfirmations: async (depositId: string, confirmedBlocks: number) => {
      return api.post(`/transactions/deposits/${depositId}/confirmations/`, { confirmed_blocks: confirmedBlocks });
    },
  },

  // Transaction endpoints
  transaction: {
    getTransactions: async () => {
      return api.get('/transactions/');
    },

    getTransaction: async (txId: string) => {
      return api.get(`/transactions/${txId}/`);
    },
  },
};
