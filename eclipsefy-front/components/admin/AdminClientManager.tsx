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
}

interface Metric {
    investment_amount: number;
    leads_generated: number;
    roas: number;
    cpa: number;
}

export default function AdminClientManager() {
    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [clientMetrics, setClientMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [metricsLoading, setMetricsLoading] = useState(false);

    // Form states
    const [metrics, setMetrics] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        investment_amount: '',
        leads_generated: '',
        roas: '',
        cpa: '',
    });

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

    const handleMetricsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;

        try {
            await api.post(`/metrics/${selectedClient.id}`, metrics);
            toast.success('Métricas adicionadas com sucesso!');
            setMetrics({ ...metrics, investment_amount: '', leads_generated: '', roas: '', cpa: '' });
            fetchClientMetrics(selectedClient.id); // Refresh metrics
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

                        <Tabs defaultValue="overview" className="space-y-4">
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
                                            <form onSubmit={handleMetricsSubmit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="investment">Valor Investido</Label>
                                                    <Input
                                                        id="investment"
                                                        type="number"
                                                        className="bg-black/20 border-white/10 text-white"
                                                        value={metrics.investment_amount}
                                                        onChange={(e) => setMetrics({ ...metrics, investment_amount: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="leads">Leads Gerados</Label>
                                                    <Input
                                                        id="leads"
                                                        type="number"
                                                        className="bg-black/20 border-white/10 text-white"
                                                        value={metrics.leads_generated}
                                                        onChange={(e) => setMetrics({ ...metrics, leads_generated: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="roas">ROAS</Label>
                                                        <Input
                                                            id="roas"
                                                            type="number"
                                                            step="0.01"
                                                            className="bg-black/20 border-white/10 text-white"
                                                            value={metrics.roas}
                                                            onChange={(e) => setMetrics({ ...metrics, roas: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="cpa">CPA</Label>
                                                        <Input
                                                            id="cpa"
                                                            type="number"
                                                            step="0.01"
                                                            className="bg-black/20 border-white/10 text-white"
                                                            value={metrics.cpa}
                                                            onChange={(e) => setMetrics({ ...metrics, cpa: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
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
