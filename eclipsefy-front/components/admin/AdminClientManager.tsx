'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardView from '@/components/dashboard/ClientDashboardView';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface User {
    id: number;
    email: string;
    company_name: string;
    role: string;
    services?: Record<string, boolean>;
}

export default function AdminClientManager() {
    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [clientMetrics, setClientMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [metricsLoading, setMetricsLoading] = useState(false);

    // Available Services
    const SERVICES = [
        { id: 'ads', label: 'Ads Manager' },
        { id: 'social', label: 'Social Media' },
        { id: 'seo', label: 'SEO' },
        { id: 'web', label: 'Web & Landing Pages' },
        { id: 'ai', label: 'AI Automations' },
        { id: 'branding', label: 'Branding' },
    ];

    // Form states
    const [metricsData, setMetricsData] = useState<any>({});
    const [selectedService, setSelectedService] = useState('ads');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        file: null as File | null,
    });

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (selectedClient) {
            fetchClientMetrics(selectedClient.id);
        }
    }, [selectedClient]);

    const fetchClients = async () => {
        try {
            const response = await api.get('/users');
            setClients(response.data);
        } catch (error) {
            console.error('Failed to fetch clients', error);
            toast.error('Falha ao carregar clientes');
        } finally {
            setLoading(false);
        }
    };

    const fetchClientMetrics = async (userId: number) => {
        setMetricsLoading(true);
        try {
            const response = await api.get(`/metrics/user/${userId}`);
            setClientMetrics(response.data);
        } catch (error) {
            console.error('Failed to fetch client metrics', error);
            toast.error('Falha ao carregar métricas do cliente');
        } finally {
            setMetricsLoading(false);
        }
    };

    const toggleService = async (serviceId: string) => {
        if (!selectedClient) return;
        const currentServices = selectedClient.services || {};
        const updatedServices = { ...currentServices, [serviceId]: !currentServices[serviceId] };

        // Optimistic update
        setSelectedClient({ ...selectedClient, services: updatedServices });

        try {
            await api.patch(`/users/${selectedClient.id}/services`, { services: updatedServices });
            toast.success('Serviços atualizados!');
            fetchClients(); // Refresh list to sync
        } catch (error) {
            console.error('Failed to update services', error);
            toast.error('Falha ao atualizar serviços');
            // Revert on error
            setSelectedClient({ ...selectedClient, services: currentServices });
        }
    };

    const handleMetricsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;

        try {
            await api.post(`/metrics/${selectedClient.id}`, {
                service_type: selectedService,
                data: metricsData,
                month,
                year
            });
            toast.success('Métricas adicionadas com sucesso!');
            setMetricsData({});
            fetchClientMetrics(selectedClient.id);
        } catch (error) {
            console.error('Failed to add metrics', error);
            toast.error('Falha ao adicionar métricas');
        }
    };

    const handleTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;

        const formData = new FormData();
        formData.append('user_id', selectedClient.id.toString());
        formData.append('title', newTask.title);
        formData.append('description', newTask.description);
        if (newTask.file) {
            formData.append('media', newTask.file);
        }

        try {
            await api.post('/tasks', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Tarefa criada com sucesso!');
            setNewTask({ title: '', description: '', file: null });
        } catch (error) {
            console.error('Failed to create task', error);
            toast.error('Falha ao criar tarefa');
        }
    };

    const renderMetricsForm = () => {
        switch (selectedService) {
            case 'ads':
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Valor Investido</Label>
                            <Input type="number" onChange={(e) => setMetricsData({ ...metricsData, investment: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Clicks</Label>
                            <Input type="number" onChange={(e) => setMetricsData({ ...metricsData, clicks: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>ROAS</Label>
                            <Input type="number" step="0.01" onChange={(e) => setMetricsData({ ...metricsData, roas: e.target.value })} />
                        </div>
                    </>
                );
            case 'seo':
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Tráfego Orgânico</Label>
                            <Input type="number" onChange={(e) => setMetricsData({ ...metricsData, organic_traffic: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ranking Médio</Label>
                            <Input type="number" step="0.1" onChange={(e) => setMetricsData({ ...metricsData, avg_rank: e.target.value })} />
                        </div>
                    </>
                );
            default:
                return <div className="text-slate-500">Formulário genérico para {selectedService}</div>;
        }
    };

    if (loading) return <div className="p-8 text-white">Carregando clientes...</div>;

    return (
        <div className="flex h-screen bg-[#030014] text-white overflow-hidden">
            {/* Sidebar - Client List */}
            <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-4 flex flex-col gap-4">
                <h2 className="text-xl font-bold tracking-tight px-2">Clientes</h2>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            onClick={() => setSelectedClient(client)}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedClient?.id === client.id
                                    ? 'bg-purple-600/20 border border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                    : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                                }`}
                        >
                            <div className="font-medium">{client.company_name || 'Empresa sem nome'}</div>
                            <div className="text-xs text-slate-500 truncate">{client.email}</div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {selectedClient ? (
                    <div className="space-y-6 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Gerenciar: <span className="text-purple-400">{selectedClient.company_name}</span>
                            </h1>
                        </div>

                        {/* Service Toggles */}
                        <Card className="bg-black/40 border-white/10 backdrop-blur-md mt-6">
                            <CardHeader>
                                <CardTitle className="text-slate-200">Serviços Ativos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {SERVICES.map((service) => (
                                        <div key={service.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={service.id}
                                                checked={selectedClient.services?.[service.id] || false}
                                                onChange={() => toggleService(service.id)}
                                                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <label htmlFor={service.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
                                                {service.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="overview" className="space-y-4 mt-6">
                            <TabsList className="bg-black/40 border border-white/10">
                                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                                <TabsTrigger value="manage">Gerenciar</TabsTrigger>
                                <TabsTrigger value="projects">Projetos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <ClientDashboardView metrics={clientMetrics} loading={metricsLoading} />
                            </TabsContent>

                            <TabsContent value="manage" className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Metrics Form */}
                                    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                                        <CardHeader>
                                            <CardTitle className="text-slate-200">Inserir Métricas</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-4">
                                                <Label>Serviço</Label>
                                                <select
                                                    className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-white"
                                                    value={selectedService}
                                                    onChange={(e) => setSelectedService(e.target.value)}
                                                >
                                                    {SERVICES.map(s => (
                                                        <option key={s.id} value={s.id}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <form onSubmit={handleMetricsSubmit} className="space-y-4">
                                                {renderMetricsForm()}
                                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                                    Salvar Métricas
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>

                                    {/* Task Form */}
                                    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                                        <CardHeader>
                                            <CardTitle className="text-slate-200">Criar Tarefa</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleTaskSubmit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">Título</Label>
                                                    <Input
                                                        id="title"
                                                        type="text"
                                                        className="bg-black/20 border-white/10 text-white"
                                                        value={newTask.title}
                                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Descrição</Label>
                                                    <Textarea
                                                        id="description"
                                                        className="bg-black/20 border-white/10 text-white min-h-[100px]"
                                                        value={newTask.description}
                                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="file">Anexo</Label>
                                                    <Input
                                                        id="file"
                                                        type="file"
                                                        className="bg-black/20 border-white/10 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-2 hover:file:bg-purple-700"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, file: e.target.files ? e.target.files[0] : null })}
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                                                    Criar Tarefa
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="projects">
                                <div className="flex h-[400px] items-center justify-center rounded-lg border border-white/10 bg-black/40 backdrop-blur-md">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-semibold text-slate-200">Projetos do Cliente</h3>
                                        <p className="text-slate-500">Funcionalidade em desenvolvimento...</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        Selecione um cliente na barra lateral para começar
                    </div>
                )}
            </main>
        </div>
    );
}
