import { type Transaction } from '../../../services/apiService';

interface TransactionsSectionProps {
  transactions: Transaction[];
}

export function TransactionsSection({ transactions }: TransactionsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Transaction History</h2>

      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-500/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-purple-500/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium capitalize">{transaction.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold ${
                        (transaction.type === 'deposit' || transaction.type === 'investment') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(transaction.type === 'deposit' || transaction.type === 'investment') ? '+' : '-'}${transaction.amount.toLocaleString()} {transaction.currency.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/60">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60 font-mono">
                      {transaction.transaction_hash ? `${transaction.transaction_hash.slice(0, 10)}...${transaction.transaction_hash.slice(-8)}` : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/60">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
