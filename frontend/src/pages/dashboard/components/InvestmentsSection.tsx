import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createInvestment as createInvestmentApi, getInvestments } from '../../../services/investmentService';
import { NewInvestmentFlow } from './NewInvestmentFlow';

interface Investment {
  id: string;
  plan_name: string;
  amount: number;
  expected_roi: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  total_earned: number;
  next_payout: string | null;
  transaction: {
    id: string;
    amount: string;
    status: string;
    created: string;
  };
  days_remaining?: number;
}

interface Profile {
  wallet_number?: string;
}

interface InvestmentsSectionProps {
  userProfile?: Profile;
}

export function InvestmentsSection({ userProfile }: InvestmentsSectionProps) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewInvestment, setShowNewInvestment] = useState(false);
  
  const walletAddress = userProfile?.wallet_number || '0x0000000000000000000000000000000000000000';

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await getInvestments();
      setInvestments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch investments:', err);
      setError('Failed to load investments');
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const createInvestment = async (data: {
    plan_name: string;
    amount: number;
    expected_roi: number;
    duration_days: number;
    transaction_hash?: string;
  }) => {
    try {
      await createInvestmentApi(data);
      toast.success('Investment created successfully!');
      await fetchInvestments();
      setShowNewInvestment(false);
    } catch (error) {
      console.error('Failed to create investment:', error);
      toast.error('Failed to create investment');
      throw error;
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Filter investments by status
  const activeInvestments = investments.filter(inv => inv.status === 'ACTIVE');
  const pendingInvestments = investments.filter(inv => inv.status === 'PENDING');
  const completedInvestments = investments.filter(inv => inv.status === 'COMPLETED');

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
        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <NewInvestmentFlow 
            onComplete={async (data) => {
              try {
                await createInvestment(data);
                setShowNewInvestment(false);
              } catch (error) {
                // Error is already handled in createInvestment
              }
            }}
            walletAddress={walletAddress}
          />
          <div className="mt-4">
            <button
              onClick={() => setShowNewInvestment(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {loading ? (
            // Loading state
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#1a1a3e]/80 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            // Success state
            <>
              {activeInvestments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Active Investments</h3>
                  <div className="space-y-4">
                    {activeInvestments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                </div>
              )}

              {pendingInvestments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Pending Investments</h3>
                  <div className="space-y-4">
                    {pendingInvestments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                </div>
              )}

              {completedInvestments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Completed Investments</h3>
                  <div className="space-y-4">
                    {completedInvestments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                </div>
              )}

              {investments.length === 0 && (
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Investment Card Component
function InvestmentCard({ investment }: { investment: Investment }) {
  const statusColors = {
    ACTIVE: 'bg-green-500/20 text-green-400',
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    COMPLETED: 'bg-blue-500/20 text-blue-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{investment.plan_name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
            <div>ROI: <span className="text-white">{investment.expected_roi}%</span></div>
            <div>Duration: <span className="text-white">{investment.duration_days} days</span></div>
            <div>Started: <span className="text-white">{format(new Date(investment.start_date), 'MMM d, yyyy')}</span></div>
            {investment.days_remaining !== undefined && (
              <div>Days Left: <span className="text-white">{investment.days_remaining}</span></div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl font-bold">${investment.amount.toLocaleString()}</div>
          {investment.total_earned > 0 && (
            <div className="text-sm text-green-400">
              Earned: ${investment.total_earned.toFixed(2)}
            </div>
          )}
          <span className={`px-3 py-1 rounded-full text-xs ${statusColors[investment.status] || 'bg-gray-500/20 text-gray-400'}`}>
            {investment.status.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
