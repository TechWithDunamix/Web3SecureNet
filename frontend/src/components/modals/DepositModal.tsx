import { useState, useEffect } from 'react';
import { X, Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coinGeckoService } from '../../services/coinGeckoService';
import { apiService } from '../../services/apiService';
import { toast } from 'sonner';

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

const assetTypeMap: Record<string, string> = {
  btc: 'BTC',
  eth: 'ETH',
  trx: 'TRX',
  sol: 'SOL',
  xrp: 'XRP',
  doge: 'DOGE',
};

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<DepositAddress | null>(null);
  const [amount, setAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

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
      const coinIdMap: Record<string, string> = {
        btc: 'bitcoin',
        eth: 'ethereum',
        trx: 'tron',
        sol: 'solana',
        xrp: 'ripple',
        doge: 'dogecoin',
      };

      const coinId = coinIdMap[selectedAsset.id];
      if (!coinId) return;

      const price = await coinGeckoService.getCoinPrice(coinId, 'usd');
      const usdValue = parseFloat(usdAmount);
      const cryptoValue = usdValue / price[coinId].usd;
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
    if (selectedAsset) await updateCryptoAmount(amountStr);
  };

  useEffect(() => {
    if (selectedAsset && amount) updateCryptoAmount(amount);
  }, [selectedAsset?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !amount) return;

    try {
      setIsSubmitting(true);
      setError('');

      const depositData = {
        asset_type: assetTypeMap[selectedAsset.id] || 'OTHER',
        amount: parseFloat(amount),
        tx_hash: transactionHash || undefined,
        deposit_address: selectedAsset?.address
      };

      await apiService.deposit.createDeposit(depositData);

      toast.success('Deposit request submitted successfully!', {
        description:
          "Your deposit is being processed. You'll be notified once it's confirmed.",
      });

      resetForm();
      onClose();
    } catch (err: any) {
      console.error('Error submitting deposit:', err);
      const errorMessage =
        err.response?.data?.detail || 'Failed to submit deposit. Please try again.';
      setError(errorMessage);
      toast.error('Deposit failed', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAsset(null);
    setAmount('');
    setTransactionHash('');
    setStep(1);
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {isSubmitting && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Processing your deposit...
              </p>
            </div>
          </div>
        )}

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
                <h3 className="text-xl font-bold text-center mb-2">
                  Select Asset to Deposit
                </h3>
                <p className="text-sm text-white/60 text-center mb-6">
                  Choose the cryptocurrency you want to deposit
                </p>

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
                          <div className="text-xs text-white/60">
                            {asset.protocol}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-white/60">
                          Minimum deposit
                        </span>
                        <span className="font-medium">
                          {asset.minDeposit} {asset.id.toUpperCase()}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-center mb-2">
                  Deposit {selectedAsset?.network}
                </h3>
                <p className="text-sm text-white/60 text-center mb-6">
                  Enter amount and confirm deposit
                </p>

                <div className="space-y-4">
                  <label className="block text-sm font-medium mb-1">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    step="0.01"
                    min={0}
                    className="w-full bg-[#252550] border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-24"
                    required
                  />

                  {isLoadingPrice ? (
                    <div className="mt-2 text-sm text-white/60 flex items-center">
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      <span>Fetching price...</span>
                    </div>
                  ) : (
                    cryptoAmount && (
                      <p className="mt-2 text-sm text-white/70">
                        ≈ {cryptoAmount} {selectedAsset?.id.toUpperCase()}
                      </p>
                    )
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deposit Address</label>
                  <div className="relative">
                    <div className="bg-[#252550] border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-sm font-mono overflow-x-auto">
                      {selectedAsset?.address}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        selectedAsset && handleCopy(selectedAsset.address)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-yellow-400">
                    ⚠️ Only send {selectedAsset?.network} to this address.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Transaction Hash (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="Paste your transaction hash here"
                    className="w-full bg-[#252550] border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-[#252550] hover:bg-[#2d2d6d] text-white py-3 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm Deposit'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
