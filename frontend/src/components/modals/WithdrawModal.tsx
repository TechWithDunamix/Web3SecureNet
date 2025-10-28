import { useState } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { apiService } from '../../services/apiService';

const NETWORKS = [
  { id: 'ethereum', name: 'Ethereum (ERC20)', symbol: 'ETH' },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'tron', name: 'Tron (TRC20)', symbol: 'TRX' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'binance', name: 'Binance Smart Chain (BEP20)', symbol: 'BSC' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
];

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawSuccess?: () => void;
}

export function WithdrawModal({ isOpen, onClose, onWithdrawSuccess }: WithdrawModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!withdrawAddress) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.withdraw({
        amount: Number(amount),
        address: withdrawAddress,
        network: selectedNetwork.id,
        symbol: selectedNetwork.symbol,
      });
      
      setIsSuccess(true);
      onWithdrawSuccess?.();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedNetwork(NETWORKS[0]);
      setWithdrawAddress('');
      setAmount('');
      setIsSubmitting(false);
      setIsSuccess(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0f0f1a] border border-purple-900/50 rounded-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {isSuccess ? 'Withdrawal Successful' : 'Withdraw Funds'}
                </h2>
                <button 
                  onClick={handleClose}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Network</label>
                    <select
                      value={selectedNetwork.id}
                      onChange={(e) => {
                        const network = NETWORKS.find(n => n.id === e.target.value) || NETWORKS[0];
                        setSelectedNetwork(network);
                      }}
                      className="w-full p-3 rounded-lg bg-[#1a1a3e] border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-colors appearance-none"
                    >
                      {NETWORKS.map((network) => (
                        <option key={network.id} value={network.id}>
                          {network.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">
                      Your {selectedNetwork.name} Address
                    </label>
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder={`Enter ${selectedNetwork.name} address`}
                      className="w-full p-3 rounded-lg bg-[#1a1a3e] border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-colors font-mono"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-2">
                      Amount to Withdraw ({selectedNetwork.symbol})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.00000001"
                        min="0"
                        className="w-full p-4 pr-24 rounded-lg bg-[#1a1a3e] border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-colors text-2xl font-medium"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-white/60">
                      <span>Available: 0.00 {selectedNetwork.symbol}</span>
                      <button 
                        type="button"
                        onClick={() => setAmount('100')}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#1a1a3e] p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Network Fee</span>
                      <span>0.001 {selectedNetwork.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">You'll Receive</span>
                      <span className="font-medium">
                        {amount && !isNaN(Number(amount))
                          ? (Number(amount) - 0.001).toFixed(8)
                          : '0.00000000'}{' '}
                        {selectedNetwork.symbol}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !amount || !withdrawAddress}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      'Confirm Withdrawal'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Withdrawal Requested!</h3>
                  <p className="text-white/70 mb-6">
                    Your withdrawal of {amount} {selectedNetwork.symbol} is being processed.
                  </p>
                  <div className="bg-[#1a1a3e] p-4 rounded-lg border border-green-500/20 text-left mb-6">
                    <div className="text-sm text-white/60 mb-1">Withdrawal Address</div>
                    <div className="font-mono text-sm break-all">{withdrawAddress}</div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
