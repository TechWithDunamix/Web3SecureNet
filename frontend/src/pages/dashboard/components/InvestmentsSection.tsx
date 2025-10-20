import { type Investment } from '../../../services/apiService';

interface InvestmentsSectionProps {
  investments: Investment[];
}

export function InvestmentsSection({ investments }: InvestmentsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Investments</h2>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
          New Investment
        </button>
      </div>

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
          <p className="text-white/60">No investments found</p>
        )}
      </div>
    </div>
  );
}
