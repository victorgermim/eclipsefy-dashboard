'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import AdminClientManager from '@/components/admin/AdminClientManager';

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
  const latestMetric = metrics.length > 0 ? metrics[0] : null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? `R$ ${latestMetric.investment_amount}` : 'R$ 0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? latestMetric.leads_generated : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? `${latestMetric.roas}x` : '0x'}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? `R$ ${latestMetric.cpa}` : 'R$ 0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +201 desde a última hora
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico (Conectar ao Recharts)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Placeholder de Atividade
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
