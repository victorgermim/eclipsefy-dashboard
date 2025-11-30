'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Metric {
    investment_amount: number;
    leads_generated: number;
    roas: number;
    cpa: number;
}

interface ClientDashboardViewProps {
    metrics: Metric[];
    loading?: boolean;
}

export default function ClientDashboardView({ metrics, loading }: ClientDashboardViewProps) {
    if (loading) {
        return <div className="p-8">Carregando dados...</div>;
    }

    const latestMetric = metrics.length > 0 ? metrics[0] : null;

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Investimento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {latestMetric ? `R$ ${latestMetric.investment_amount}` : 'R$ 0.00'}
                        </div>
                        <p className="text-xs text-slate-400">
                            +20.1% em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">Leads Gerados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {latestMetric ? latestMetric.leads_generated : '0'}
                        </div>
                        <p className="text-xs text-slate-400">
                            +180.1% em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">ROAS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {latestMetric ? `${latestMetric.roas}x` : '0x'}
                        </div>
                        <p className="text-xs text-slate-400">
                            +19% em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">CPA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {latestMetric ? `R$ ${latestMetric.cpa}` : 'R$ 0.00'}
                        </div>
                        <p className="text-xs text-slate-400">
                            +201 desde a última hora
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-black/40 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Visão Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-slate-500">
                            Gráfico (Conectar ao Recharts)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-black/40 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-slate-500">
                            Placeholder de Atividade
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
