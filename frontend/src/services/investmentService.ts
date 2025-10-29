import api from './api';

// Types
export interface Investment {
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

interface CreateInvestmentData {
  plan_name: string;
  amount: number;
  expected_roi: number;
  duration_days: number;
  transaction_hash?: string;
}

// API endpoints
const INVESTMENT_API = {
  INVESTMENTS: '/investments/',
};

// Get all investments for the current user
export const getInvestments = async (status?: string): Promise<Investment[]> => {
  try {
    const url = status 
      ? `${INVESTMENT_API.INVESTMENTS}${status}/`
      : INVESTMENT_API.INVESTMENTS;
      
    const response = await api.get<Investment[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }
};

// Create a new investment
export const createInvestment = async (data: CreateInvestmentData): Promise<Investment> => {
  try {
    const response = await api.post<Investment>(INVESTMENT_API.INVESTMENTS, data);
    return response.data;
  } catch (error) {
    console.error('Error creating investment:', error);
    throw error;
  }
};

// Get investment by ID
export const getInvestmentById = async (id: string): Promise<Investment> => {
  try {
    const response = await api.get<Investment>(`${INVESTMENT_API.INVESTMENTS}${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching investment:', error);
    throw error;
  }
};

// Get active investments
export const getActiveInvestments = async (): Promise<Investment[]> => {
  return getInvestments('ACTIVE');
};

// Get pending investments
export const getPendingInvestments = async (): Promise<Investment[]> => {
  return getInvestments('PENDING');
};

// Get completed investments
export const getCompletedInvestments = async (): Promise<Investment[]> => {
  return getInvestments('COMPLETED');
};
