import { useState, useEffect } from 'react';
import { X, Copy, ArrowRight, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coinGeckoService } from '../../services/coinGeckoService';

interface DepositAddress {
  id: string;
  network: string;
  address: string;
  icon: string;
  protocol: string;
  minDeposit: number;
  fee: string;
}

const depositAddresses: DepositAddress[] = [
  {
    id: 'btc',
    network: 'Bitcoin',
    address: 'bc1qe0xhawsg8yz59cgx67s850hs0up7z5x6u7mn2g',
    icon: '₿',
    protocol: 'Native SegWit (Bech32)',
    minDeposit: 0.001,
    fee: '0.0005 BTC'
  },
  {
    id: 'eth',
    network: 'Ethereum',
    address: '0xa6cec34eC5bf9c38AC7640d40103D0c3A3B1b14a',
    icon: 'Ξ',
    protocol: 'ERC20',
    minDeposit: 0.01,
    fee: '0.003 ETH'
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

const predefinedAmounts = [100, 500, 1000, 2000, 5000];

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<DepositAddress | null>(null);
  const [amount, setAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [step, setStep] = useState(1);

  const handleCopy = (text: string, type: 'address' | 'hash' = 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const updateCryptoAmount = async (usdAmount: string) => {
    if (!selectedAsset || !usdAmount) {
      setCryptoAmount('');
      return;
    }

    try {
      setIsLoadingPrice(true);
      // Map our internal asset IDs to CoinGecko IDs
      const coinIdMap: Record<string, string> = {
        btc: 'bitcoin',
        eth: 'ethereum',
        trx: 'tron',
        sol: 'solana',
        xrp: 'ripple',
        doge: 'dogecoin'
      };

      const coinId = coinIdMap[selectedAsset.id];
      if (!coinId) return;

      const price = await coinGeckoService.getCoinPrice(coinId, 'usd');
      const usdValue = parseFloat(usdAmount);
      const cryptoValue = usdValue / price[coinId].usd;
      
      // Format based on the cryptocurrency (more decimals for smaller units)
      const decimals = ['btc', 'eth'].includes(selectedAsset.id) ? 8 : 4;
      setCryptoAmount(cryptoValue.toFixed(decimals));
    } catch (error) {
      console.error('Error fetching price:', error);
      setCryptoAmount('');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value && selectedAsset) {
      updateCryptoAmount(value);
    } else {
      setCryptoAmount('');
    }
  };

  const handleAmountSelect = async (selectedAmount: number) => {
    const amountStr = selectedAmount.toString();
    setAmount(amountStr);
    if (selectedAsset) {
      await updateCryptoAmount(amountStr);
    }
  };

  // Update crypto amount when asset changes and amount exists
  useEffect(() => {
    if (selectedAsset && amount) {
      updateCryptoAmount(amount);
    }
  }, [selectedAsset?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle deposit submission
    console.log('Deposit submitted:', { 
      asset: selectedAsset, 
      amount,
      transactionHash: transactionHash || 'Not provided'
    });
    // Here you would typically make an API call
  };

  const resetForm = () => {
    setSelectedAsset(null);
    setAmount('');
    setTransactionHash('');
    setStep(1);
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#1a1a3e] border border-purple-500/30 rounded-xl p-6 mx-4 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-center mb-2">Select Asset to Deposit</h3>
              <p className="text-sm text-white/60 text-center mb-6">Choose the cryptocurrency you want to deposit</p>
              
              <div className="space-y-3">
                {depositAddresses.map((asset) => (
                  <motion.button
                    key={asset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setStep(2);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-[#252550] hover:bg-[#2d2d6d] rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xl">
                        {asset.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{asset.network}</div>
                        <div className="text-xs text-white/60">{asset.protocol}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/60" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">Deposit {selectedAsset?.network}</h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    ← Back
                  </button>
                </div>
                <p className="text-sm text-white/60 mb-6">Send only {selectedAsset?.network} to this deposit address</p>
                
                <div className="bg-[#252550] rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/60">Network</span>
                    <span className="font-medium">{selectedAsset?.network} ({selectedAsset?.protocol})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Minimum deposit</span>
                    <span className="font-medium">{selectedAsset?.minDeposit} {selectedAsset?.id.toUpperCase()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="amount">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        className="w-full bg-[#252550] border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-24"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-white/60 text-sm">USD</span>
                      </div>
                    </div>
                    
                    {(amount && cryptoAmount && !isLoadingPrice) && (
                      <div className="mt-2 text-sm text-white/70 flex items-center">
                        <span>≈ {cryptoAmount} {selectedAsset?.id.toUpperCase()}</span>
                        <span className="mx-2 text-white/40">•</span>
                        <span className="text-xs text-white/50">
                          1 {selectedAsset?.id.toUpperCase()} = ${(parseFloat(amount) / parseFloat(cryptoAmount)).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {isLoadingPrice && (
                      <div className="mt-2 text-sm text-white/60 flex items-center">
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        <span>Fetching price...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {predefinedAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          amount === amt.toString()
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#252550] hover:bg-[#2d2d6d] text-white/80'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Deposit Address</label>
                    <span className="text-xs text-white/60">Fee: {selectedAsset?.fee}</span>
                  </div>
                  <div className="relative">
                    <div className="bg-[#252550] border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-sm font-mono overflow-x-auto">
                      {selectedAsset?.address}
                    </div>
                    <button
                      type="button"
                      onClick={() => selectedAsset && handleCopy(selectedAsset.address)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-yellow-400">
                    ⚠️ Only send {selectedAsset?.network} to this address. Sending other assets may result in permanent loss.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" htmlFor="txHash">
                    Transaction Hash (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="txHash"
                      type="text"
                      value={transactionHash}
                      onChange={(e) => setTransactionHash(e.target.value)}
                      placeholder="Paste your transaction hash here"
                      className="w-full bg-[#252550] border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {transactionHash && (
                      <button
                        type="button"
                        onClick={() => handleCopy(transactionHash, 'hash')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                        title="Copy hash"
                      >
                        {copiedHash ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-white/60">
                    Adding a transaction hash helps us track your deposit faster.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Confirm Deposit
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
