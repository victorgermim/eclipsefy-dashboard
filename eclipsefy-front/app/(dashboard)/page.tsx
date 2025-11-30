'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import AdminClientManager from '@/components/admin/AdminClientManager';
import ClientDashboardView from '@/components/dashboard/ClientDashboardView';

interface Metric {
  investment_amount: number;
  leads_generated: number;
  roas: number;
  cpa: number;
}

const MOCK_METRICS: Metric[] = [
  {
    investment_amount: 12500.00,
    leads_generated: 450,
    roas: 4.5,
    cpa: 27.77
  }
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'CLIENT') {
      fetchMetrics();
    } else if (user && user.role === 'ADMIN') {
      setLoading(false);
    }
  }, [user]);

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/metrics/my-metrics');
      if (response.data && response.data.length > 0) {
        setMetrics(response.data);
      } else {
        setMetrics(MOCK_METRICS); // Fallback to mock
      }
    } catch (error) {
      console.error('Failed to fetch metrics, using mock data', error);
      setMetrics(MOCK_METRICS); // Fallback to mock
      toast.error('Usando dados de exemplo');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-8">Carregando painel...</div>;
  }

  if (user?.role === 'ADMIN') {
    return <AdminClientManager />;
  }

  // Client View
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
      </div>
      <ClientDashboardView metrics={metrics} loading={loading} />
    </div>
  );
}
