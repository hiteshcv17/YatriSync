import axios from 'axios';
import { Train, BusRoute, PoolGroup, Booking, WalletTransaction } from '../types';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('run.app')) {
    return ''; // Live integrated full-stack backend
  }
  return import.meta.env.VITE_API_BASE_URL || '';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkBackendHealth = async (customUrl?: string): Promise<{ online: boolean; message?: string; details?: any; activeUrl?: string }> => {
  try {
    const targetUrl = customUrl !== undefined ? customUrl : getBaseUrl();
    const endpoint = targetUrl ? `${targetUrl.replace(/\/$/, '')}/health` : '/health';
    const res = await axios.get(endpoint, { timeout: 4000 });
    return { online: true, details: res.data, activeUrl: targetUrl || 'Integrated Server (Same Origin)' };
  } catch (err: any) {
    return { online: false, message: err?.message || 'Backend server not reachable' };
  }
};

export const api = {
  // Trains & Routes
  getTrains: async (): Promise<Train[]> => {
    const res = await apiClient.get('/api/trains');
    return res.data;
  },
  getRoutes: async (): Promise<BusRoute[]> => {
    const res = await apiClient.get('/api/routes');
    return res.data;
  },

  // Smart Pooling
  getPools: async (): Promise<PoolGroup[]> => {
    const res = await apiClient.get('/api/pools');
    return res.data;
  },
  joinPool: async (params: {
    train_number: string;
    route_id: string;
    destination: string;
    seat_count: number;
    passenger_name: string;
    phone: string;
    pnr: string;
    is_women_safety_priority?: boolean;
  }) => {
    const res = await apiClient.post('/api/pools/join', params);
    return res.data;
  },

  // Operator Allocation
  approveAllocation: async (params: {
    pool_id: string;
    bus_id: string;
    departure_time: string;
    pickup_gate: string;
  }) => {
    const res = await apiClient.post('/api/operator/allocate', params);
    return res.data;
  },

  // Conductor QR Scanner
  verifyTicketQR: async (ticket_code: string) => {
    const res = await apiClient.post('/api/conductor/verify-qr', { ticket_code });
    return res.data;
  },

  // Wallet
  getWallet: async (): Promise<{ balance: number; reserved_amount: number; transactions: WalletTransaction[] }> => {
    const res = await apiClient.get('/api/wallet');
    return res.data;
  },
  topupWallet: async (amount: number) => {
    const res = await apiClient.post('/api/wallet/topup', { amount });
    return res.data;
  },
};
