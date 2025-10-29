import { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';

interface WalletAddress {
  id: string;
  network: string;
  address: string;
  icon: string;
  protocol: string;
  minDeposit: number;
  fee: string;
}

const WALLET_ADDRESSES: WalletAddress[] = [
  {
    id: 'btc',
    network: 'Bitcoin',
    address: 'bc1qe0xhawsg8yz59cgx67s850hs0up7z5x6u7mn2g',
    icon: '₿',
    protocol: 'Native SegWit (Bech32)',
    minDeposit: 0.001,
    fee: '0.0005 BTC',
  },
  {
    id: 'eth',
    network: 'Ethereum',
    address: '0xa6cec34eC5bf9c38AC7640d40103D0c3A3B1b14a',
    icon: 'Ξ',
    protocol: 'ERC20',
    minDeposit: 0.01,
    fee: '0.003 ETH',
  },
  {
    id: 'usdt',
    network: 'Tether',
    address: '0x55d398326f99059fF775485246999027B3197955',
    icon: '₮',
    protocol: 'BEP20',
    minDeposit: 10,
    fee: '1 USDT',
  },
  {
    id: 'trx',
    network: 'Tron',
    address: 'TAj7ybsSkaFwKBoiHVjswmEkB6xP7xQfS1',
    icon: '₮',
    protocol: 'TRC20',
    minDeposit: 10,
    fee: '1 USDT',
  },
  {
    id: 'sol',
    network: 'Solana',
    address: '5y3vpJ6UsitgcQsNER8szqZKYHJHSxQqLqbczfqyjUad',
    icon: '◎',
    protocol: 'SOL',
    minDeposit: 0.1,
    fee: '0.000005 SOL',
  },
  {
    id: 'xrp',
    network: 'XRP',
    address: 'rMkfn95vYKH58L9CUoPdAULngQKF6mVL3w',
    icon: '✕',
    protocol: 'XRP',
    minDeposit: 10,
    fee: '0.25 XRP',
  },
  {
    id: 'doge',
    network: 'Dogecoin',
    address: 'DPWShLhsekQj9Pwq8vj5Hm3r4SWhsbMueN',
    icon: 'Ð',
    protocol: 'DOGE',
    minDeposit: 10,
    fee: '1 DOGE',
  },
];

type InvestmentPlan = {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  duration: string;
  roi: string;
  description: string;
};

const investmentPlans: InvestmentPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    minAmount: 100,
    maxAmount: 1000,
    duration: '30 days',
    roi: '5% - 10%',
    description: 'Perfect for beginners with low risk tolerance',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    minAmount: 1000,
    maxAmount: 10000,
    duration: '60 days',
    roi: '10% - 20%',
    description: 'For experienced investors with moderate risk tolerance',
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    minAmount: 10000,
    maxAmount: 50000,
    duration: '90 days',
    roi: '20% - 30%',
    description: 'High returns for high-stakes investors',
  },
];

interface InvestmentData {
  plan_name: string;
  amount: number;
  expected_roi: number;
  duration_days: number;
  transaction_hash?: string;
}

type NewInvestmentFlowProps = {
  onComplete: (data: InvestmentData) => Promise<void> | void;
  walletAddress: string;
};

export function NewInvestmentFlow({ onComplete, walletAddress }: NewInvestmentFlowProps) {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletAddress | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectWallet = (wallet: WalletAddress) => {
    setSelectedWallet(wallet);
    setShowWalletModal(false);
  };

  const handleConfirmInvestment = async () => {
    if (!selectedPlan || !selectedWallet) return;
    
    setIsSubmitting(true);
    try {
      // Calculate ROI percentage from the plan's ROI string (e.g., "10%" -> 10)
      const roiPercentage = parseFloat(selectedPlan.roi.replace('%', ''));
      // Calculate duration in days (e.g., "30 days" -> 30)
      const durationDays = parseInt(selectedPlan.duration.split(' ')[0]);
      
      const investmentData = {
        plan_name: selectedPlan.name,
        amount: amount || selectedPlan.minAmount, // Use input amount or minimum amount
        expected_roi: roiPercentage,
        duration_days: durationDays,
        transaction_hash: selectedWallet.id // Using wallet ID as a placeholder for transaction hash
      };
      
      await onComplete(investmentData);
    } catch (error) {
      console.error('Failed to create investment:', error);
      throw error; // Re-throw to be handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showWalletModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a3e] border border-purple-500/30 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Select Network</h2>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              {WALLET_ADDRESSES.map((wallet) => (
                <div 
                  key={wallet.id}
                  onClick={() => handleSelectWallet(wallet)}
                  className="bg-[#0f0f24] border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-xl">
                        {wallet.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{wallet.network}</h3>
                        <p className="text-sm text-white/60">{wallet.protocol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">Min: {wallet.minDeposit} {wallet.network}</p>
                      <p className="text-xs text-white/40">Fee: {wallet.fee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Choose an Investment Plan</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {investmentPlans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 cursor-pointer hover:border-purple-500/50 transition-colors"
            >
              <h3 className="text-xl font-bold text-purple-400">{plan.name}</h3>
              <p className="text-2xl font-bold my-3">${plan.minAmount} - ${plan.maxAmount}</p>
              <p className="text-sm text-white/60 mb-4">{plan.duration} • {plan.roi} ROI</p>
              <p className="text-sm">{plan.description}</p>
              <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setSelectedPlan(null)}
        className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-6"
      >
        ← Back to Plans
      </button>

      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Confirm Your Investment</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-white/60">Selected Plan:</span>
            <span className="font-medium">{selectedPlan.name}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="amount" className="text-white/60">Investment Amount (USD)</label>
              <span className="text-xs text-white/60">Min: ${selectedPlan.minAmount} - Max: ${selectedPlan.maxAmount}</span>
            </div>
            <input
              type="number"
              id="amount"
              min={selectedPlan.minAmount}
              max={selectedPlan.maxAmount}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Enter amount (${selectedPlan.minAmount} - ${selectedPlan.maxAmount})`}
              className="w-full bg-[#0f0f24] border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Duration:</span>
            <span>{selectedPlan.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Expected ROI:</span>
            <span className="text-green-400">{selectedPlan.roi}</span>
          </div>
          
          <div className="pt-4 mt-6 border-t border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/60">Send exactly {selectedPlan.minAmount} USDT to:</p>
              <button 
                onClick={() => setShowWalletModal(true)}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Change Network
              </button>
            </div>
            
            {selectedWallet ? (
              <>
                <div className="mb-3 p-3 bg-[#0f0f24] rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{selectedWallet.icon}</span>
                      <span className="font-medium">{selectedWallet.network}</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                        {selectedWallet.protocol}
                      </span>
                    </div>
                    <span className="text-xs text-green-400">Min: {selectedWallet.minDeposit} {selectedWallet.network}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-black/30 rounded">
                    <code className="text-sm truncate pr-2">{selectedWallet.address}</code>
                    <button 
                      onClick={() => handleCopyAddress(selectedWallet.address)}
                      className="text-purple-400 hover:text-purple-300 p-1 rounded hover:bg-purple-500/10"
                      title="Copy address"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs text-white/60">
                    <span>Network fee: {selectedWallet.fee}</span>
                    <span>Estimated arrival: 1-3 network confirmations</span>
                  </div>
                </div>
                
                <p className="text-xs text-yellow-400 mt-2">
                  Only send {selectedWallet.network} ({selectedWallet.protocol}) to this address. 
                  Sending other assets may result in permanent loss.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <button 
                  onClick={() => setShowWalletModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Select Network
                </button>
                <p className="text-xs text-white/60 mt-2">Choose a network to generate deposit address</p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4">
            <button
              onClick={handleConfirmInvestment}
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'I have sent the funds'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
