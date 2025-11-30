'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceMetric {
    service_type: string;
    data: any;
    month: number;
    year: number;
}

interface ClientDashboardViewProps {
    metrics: ServiceMetric[];
    loading?: boolean;
}

export default function ClientDashboardView({ metrics, loading }: ClientDashboardViewProps) {
    if (loading) {
        return <div className="p-8 text-white">Carregando dados...</div>;
    }

    // Helper to get latest metric for a service
    const getLatestMetric = (serviceType: string) => {
        return metrics.find(m => m.service_type === serviceType)?.data || null;
    };

    const adsData = getLatestMetric('ads');
    const seoData = getLatestMetric('seo');

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Ads Manager Widgets */}
                {adsData && (
                    <>
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">Investimento (Ads)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">R$ {adsData.investment || '0.00'}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">ROAS (Ads)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{adsData.roas || '0'}x</div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* SEO Widgets */}
                {seoData && (
                    <>
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">Tráfego Orgânico</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{seoData.organic_traffic || '0'}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">Ranking Médio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">#{seoData.avg_rank || '-'}</div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {!adsData && !seoData && (
                    <div className="col-span-4 text-center text-slate-500 py-8">
                        Nenhum dado disponível para os serviços ativos.
                    </div>
                )}
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
