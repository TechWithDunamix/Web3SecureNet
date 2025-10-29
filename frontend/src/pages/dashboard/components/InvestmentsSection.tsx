import { useState } from 'react';
import { Plus } from 'lucide-react';
import { type Investment, type Profile } from '../../../services/apiService';
import { NewInvestmentFlow } from './NewInvestmentFlow';

interface InvestmentsSectionProps {
  investments: Investment[];
  userProfile?: Profile;
}

export function InvestmentsSection({ investments, userProfile }: InvestmentsSectionProps) {
  const [showNewInvestment, setShowNewInvestment] = useState(false);
  
  // Default wallet address if not available in profile
  const walletAddress = userProfile?.wallet_number || '0x0000000000000000000000000000000000000000';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Investments</h2>
        <button 
          onClick={() => setShowNewInvestment(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          New Investment
        </button>
      </div>

      {showNewInvestment ? (
        <NewInvestmentFlow 
          onComplete={() => setShowNewInvestment(false)}
          walletAddress={walletAddress}
        />
      ) : (
        <div className="grid gap-6">
          {investments.length > 0 ? (
            investments.map((investment) => (
              <div key={investment.id} className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{investment.plan}</h3>
                    <p className="text-white/60">Duration: {investment.duration} days | Interest: {investment.interest}%</p>
                    <p className="text-sm text-white/60">Start: {new Date(investment.start_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${investment.amount.toLocaleString()}</p>
                    <p className={`text-sm ${investment.current_value > investment.amount ? 'text-green-400' : 'text-red-400'}`}>
                      Current: ${investment.current_value.toLocaleString()}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      investment.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {investment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Active Investments</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Get started by creating your first investment. Choose from our selection of plans to start earning.
              </p>
              <button
                onClick={() => setShowNewInvestment(true)}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                New Investment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
