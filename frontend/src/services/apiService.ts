// Dummy data service that mimics the API responses
// This simulates the API endpoints without making actual HTTP requests

export interface User {
  id: number;
  email: string;
  full_name: string;
  country?: string;
}

export interface Profile {
  id: number;
  user: User;
  id_card_front_url?: string;
  id_card_back_url?: string;
  full_name: string;
  email: string;
  address?: string;
  verified: boolean;
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
  id: number;
  type: 'deposit' | 'withdrawal' | 'investment' | 'swap' | 'transfer';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  transaction_hash?: string;
  description?: string;
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
  user: DUMMY_USER,
  full_name: "John Doe",
  email: "john.doe@example.com",
  address: "123 Main St, New York, NY 10001",
  verified: true
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

// API simulation functions
export const apiService = {
  // Authentication
  async login(credentials: { username: string; password: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.username === "demo@example.com" && credentials.password === "password") {
      return {
        token: "dummy_jwt_token_here",
        user: DUMMY_USER
      };
    }
    throw new Error("Invalid credentials");
  },

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // Profile endpoints
  async getProfile() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return DUMMY_PROFILE;
  },

  async updateProfile(data: Partial<Profile>) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...DUMMY_PROFILE, ...data };
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

  async connectWallet(data: Omit<Wallet, 'id' | 'user'>) {
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
    await new Promise(resolve => setTimeout(resolve, 800));
    if (data.otp === "123456") {
      return { verified: true };
    }
    throw new Error("Invalid OTP");
  }
};


