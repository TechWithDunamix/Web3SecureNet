import { Wallet, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WalletsSectionProps {
  onOpenConnectModal: () => void;
  walletConnected: boolean;
  walletName?: string;
  walletNumber?: string;
  onDisconnectWallet: () => Promise<void>;
}

export function WalletsSection({ 
  onOpenConnectModal, 
  walletConnected, 
  walletName = '', 
  walletNumber = '',
  onDisconnectWallet 
}: WalletsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    // Initial load
    setLoading(false);
  }, []);

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      setIsDisconnecting(true);
      try {
        await onDisconnectWallet();
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      } finally {
        setIsDisconnecting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Wallet</h2>
        {walletConnected ? (
          <button 
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
            disabled={isDisconnecting}
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect Wallet'}
          </button>
        ) : (
          <button
            onClick={onOpenConnectModal}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Connect Wallet
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {walletConnected ? (
          <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{walletName}</h3>
                <p className="text-white/60 font-mono text-sm mt-2 break-all">{walletNumber}</p>
                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Connected
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <Wallet className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Wallet Connected</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Connect your wallet to start using all the features of Web3SecureNet.
            </p>
            <button
              onClick={onOpenConnectModal}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
