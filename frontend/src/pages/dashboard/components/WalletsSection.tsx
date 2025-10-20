import { Wallet } from 'lucide-react';
import { type Wallet as WalletType } from '../../../services/apiService';

interface WalletsSectionProps {
  wallets: WalletType[];
}

export function WalletsSection({ wallets }: WalletsSectionProps) {
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{wallet.wallet_name}</h3>
                  <p className="text-white/60 font-mono">Wallet connected</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">Connected</p>
                  <p className="text-white/60">Ready to use</p>
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
    </div>
  );
}
