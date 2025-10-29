import { useState, useEffect, useCallback } from 'react';
import { getInvestments, createInvestment as createInvestmentApi } from '../services/investmentService';
import type { Investment } from '../services/investmentService';

type InvestmentStatus = 'all' | 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

interface UseInvestmentsReturn {
  investments: Investment[];
  loading: boolean;
  error: string | null;
  fetchInvestments: (status?: InvestmentStatus) => Promise<void>;
  createInvestment: (data: {
    plan_name: string;
    amount: number;
    expected_roi: number;
    duration_days: number;
    transaction_hash?: string;
  }) => Promise<Investment>;
  activeInvestments: Investment[];
  pendingInvestments: Investment[];
  completedInvestments: Investment[];
}

export const useInvestments = (): UseInvestmentsReturn => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async (status?: InvestmentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInvestments(status === 'all' ? undefined : status);
      setInvestments(data);
    } catch (err) {
      console.error('Failed to fetch investments:', err);
      setError('Failed to load investments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewInvestment = useCallback(async (data: {
    plan_name: string;
    amount: number;
    expected_roi: number;
    duration_days: number;
    transaction_hash?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const newInvestment = await createInvestmentApi(data);
      await fetchInvestments();
      return newInvestment;
    } catch (err) {
      console.error('Failed to create investment:', err);
      setError('Failed to create investment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInvestments]);

  // Filter investments by status
  const activeInvestments = investments.filter(inv => inv.status === 'ACTIVE');
  const pendingInvestments = investments.filter(inv => inv.status === 'PENDING');
  const completedInvestments = investments.filter(inv => inv.status === 'COMPLETED');

  // Initial fetch
  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return {
    investments,
    loading,
    error,
    fetchInvestments,
    createInvestment: createNewInvestment,
    activeInvestments,
    pendingInvestments,
    completedInvestments,
  };
};
