import { useState, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

export interface Transaction {
  id: string;
  transaction_id: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'SWAP' | 'FEE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  asset_type: string;
  from_address?: string;
  to_address?: string;
  fee?: number;
  network_fee?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  deposit?: {
    deposit_address: string;
    tx_hash?: string;
  };
}

export function TransactionsSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const {data} = await apiService.transaction.getTransactions();
        console.log("Data",data)
        setTransactions(data.results || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions. Please try again later.');
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Pending' },
      COMPLETED: { color: 'bg-green-500/20 text-green-400', text: 'Completed' },
      FAILED: { color: 'bg-red-500/20 text-red-400', text: 'Failed' },
      CANCELLED: { color: 'bg-gray-500/20 text-gray-400', text: 'Cancelled' },
    };
    return statusMap[status] || { color: 'bg-gray-500/20 text-gray-400', text: status };
  };

  const formatTransactionType = (type: string) => {
    const typeMap: Record<string, string> = {
      DEPOSIT: 'Deposit',
      WITHDRAWAL: 'Withdrawal',
      TRANSFER: 'Transfer',
      SWAP: 'Swap',
      FEE: 'Fee',
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <div className="flex items-center justify-center h-64 bg-[#1a1a3e]/80 rounded-xl">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Transaction History</h2>
      </div>

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
                transactions.map((transaction) => {
                  const status = formatStatus(transaction.status);
                  const isCredit = ['DEPOSIT', 'TRANSFER'].includes(transaction.transaction_type);
                  const txHash = transaction.deposit?.tx_hash || '';
                  
                  return (
                    <tr key={transaction.transaction_id} className="hover:bg-purple-500/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">
                          {formatTransactionType(transaction.transaction_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                        {isCredit ? '+' : '-'}
                        {Number(transaction.amount)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                          })} {transaction.asset_type}
                      </span>


                        {transaction.fee && transaction.fee > 0 && (
                          <div className="text-xs text-gray-400">
                            Fee: {transaction.fee} {transaction.asset_type}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/60" title={new Date(transaction.created_at).toLocaleString()}>
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {txHash ? (
                          <a 
                            href={`https://etherscan.io/tx/${txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm font-mono"
                            title={txHash}
                          >
                            {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
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
