import { Wallet, ArrowUpRight } from 'lucide-react';
import { type Wallet as WalletType } from '../../../services/apiService';
import { useState } from 'react';
import { WithdrawModal } from '../../../components/modals/WithdrawModal';

interface WalletsSectionProps {
  wallets: WalletType[];
}

export function WalletsSection({ wallets }: WalletsSectionProps) {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  const handleWithdrawClick = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setIsWithdrawModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Connected Wallets</h2>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
          Connect Wallet
        </button>
      </div>

      <div className="grid gap-6">
        {wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div key={wallet.id} className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{wallet.wallet_name}</h3>
                  <p className="text-white/60 font-mono text-sm mt-1">{wallet.address}</p>
                  <p className="text-white/60 text-sm mt-2">Network: {wallet.network || 'Ethereum'}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-green-400 text-sm font-medium bg-green-900/30 px-2 py-1 rounded">
                    Connected
                  </div>
                  <button
                    onClick={() => handleWithdrawClick(wallet)}
                    className="flex items-center gap-1 text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ArrowUpRight size={14} /> Withdraw
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 text-center">
            <Wallet className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No wallets connected</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors mt-4">
              Connect Your First Wallet
            </button>
          </div>
        )}
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        wallets={wallets}
        onWithdrawSuccess={() => {
          // You can add any success handling here, like refreshing the wallet data
          console.log('Withdrawal successful');
        }}
      />
    </div>
  );
}
