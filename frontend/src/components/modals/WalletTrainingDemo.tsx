import { useEffect, useState } from 'react';
import { Wallet, X } from 'lucide-react';

const DEMO_WALLETS = ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet', 'Phantom', 'Rainbow'];
const DUMMY_VALUE = 'TRAINING DEMO - NOT A REAL RECOVERY PHRASE';

interface WalletTrainingDemoProps {
  onClose: () => void;
  onConnectBrowserWallet: () => Promise<void>;
  connectingBrowserWallet: boolean;
}

export function WalletTrainingDemo({ onClose, onConnectBrowserWallet, connectingBrowserWallet }: WalletTrainingDemoProps) {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [stage, setStage] = useState<'choose' | 'connecting' | 'warning'>('choose');

  useEffect(() => {
    if (stage !== 'connecting') return;
    const timer = window.setTimeout(() => setStage('warning'), 1500);
    return () => window.clearTimeout(timer);
  }, [stage]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="wallet-title" className="bg-[#1a1a3e] border border-purple-500/30 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 id="wallet-title" className="text-xl font-bold">{stage === 'warning' ? 'Connection failed: training example' : 'Connect Wallet'}</h2>
          <button aria-label="Close wallet dialog" onClick={onClose} disabled={connectingBrowserWallet} className="p-2 rounded-lg hover:bg-purple-500/20"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-300 mb-3">Classroom training demo</p>

        {stage === 'choose' && <>
          <p className="text-white/70 text-sm mb-5">Choose a wallet to simulate a failed connection and learn how recovery-phrase scams work. These choices do not access a real wallet.</p>
          <div className="space-y-3">
            {DEMO_WALLETS.map(wallet => (
              <button key={wallet} disabled={connectingBrowserWallet} onClick={() => { setSelectedWallet(wallet); setStage('connecting'); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-500/20 border border-purple-500/20 disabled:opacity-50">
                <Wallet className="w-6 h-6 text-purple-400" />
                <span>{wallet}</span><span className="ml-auto text-xs text-white/50">Demo</span>
              </button>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-purple-500/20">
            <p className="text-white/70 text-sm mb-3">For a real connection, approve access in your browser wallet. Only its public address is saved.</p>
            <button onClick={onConnectBrowserWallet} disabled={connectingBrowserWallet} className="w-full px-4 py-2 bg-purple-600 rounded-lg disabled:opacity-50">
              {connectingBrowserWallet ? 'Waiting for wallet...' : 'Connect browser wallet'}
            </button>
          </div>
        </>}

        {stage === 'connecting' && <div role="status" className="py-8 text-center space-y-4">
          <div className="mx-auto animate-spin rounded-full h-8 w-8 border-2 border-purple-500/30 border-t-purple-400" />
          <p>Simulating connection to {selectedWallet}...</p>
          <p className="text-sm text-white/60">No real wallet permissions are requested.</p>
        </div>}

        {stage === 'warning' && <>
          <div role="alert" className="border border-amber-500/40 bg-amber-500/10 rounded-lg p-4 space-y-3">
            <p className="font-semibold text-amber-200">Never share your recovery phrase or private key</p>
            <p className="text-sm text-white/80">A failed wallet connection is never a reason to enter wallet secrets on a website. A request to “connect manually” using a recovery phrase is a phishing warning sign.</p>
            <p className="text-sm text-white/80">This failure was simulated for the lesson. Stop, verify the website, and use your wallet's own approval screen for legitimate connections.</p>
          </div>
          <label className="block text-sm text-white/70 mt-5">Dummy recovery value (example only)
            <input aria-label="Dummy recovery value" disabled value={DUMMY_VALUE} className="mt-2 w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg p-3 text-xs text-white/60" />
          </label>
          <p className="text-xs text-white/60 mt-2">This fixed example cannot accept real secrets. Nothing from this demonstration is saved or sent to a server.</p>
          <button onClick={() => { setSelectedWallet(''); setStage('choose'); }} className="mt-5 w-full px-4 py-2 bg-purple-600 rounded-lg">Try another demo wallet</button>
        </>}
      </section>
    </div>
  );
}
