'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { toast } from 'sonner';


// Mock UI components if Shadcn is not fully set up, or assume standard HTML for now
// In a real scenario, I would import { Button } from '@/components/ui/button', etc.

interface User {
    id: number;
    email: string;
    company_name: string;
    role: string;
}

export default function AdminClientManager() {

    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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

    const fetchClients = async () => {
        try {
            const response = await api.get('/users');
            setClients(response.data);
        } catch (error) {
            console.error('Failed to fetch clients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMetricsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;

        try {
            await api.post(`/metrics/${selectedClient.id}`, metrics);
            toast.success('Métricas adicionadas com sucesso!');
            // Reset form
            setMetrics({ ...metrics, investment_amount: '', leads_generated: '', roas: '', cpa: '' });
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

    if (loading) return <div>Carregando clientes...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Painel Administrativo - Controle da Missão</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Client List */}
                <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Clientes</h2>
                    <ul className="space-y-2">
                        {clients.map((client) => (
                            <li
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`p-3 cursor-pointer rounded-md transition-colors ${selectedClient?.id === client.id
                                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                <div className="font-medium">{client.company_name || 'Empresa sem nome'}</div>
                                <div className="text-sm text-muted-foreground">{client.email}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Details Panel */}
                <div className="md:col-span-2 bg-card text-card-foreground p-4 rounded-lg border shadow-sm">
                    {selectedClient ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">
                                Gerenciar: {selectedClient.company_name}
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Metrics Form */}
                                <div className="border rounded-lg p-4 bg-background/50">
                                    <h3 className="font-medium mb-3">Inserir Métricas</h3>
                                    <form onSubmit={handleMetricsSubmit} className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Valor Investido</label>
                                            <input
                                                type="number"
                                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={metrics.investment_amount}
                                                onChange={(e) => setMetrics({ ...metrics, investment_amount: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Leads Gerados</label>
                                            <input
                                                type="number"
                                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={metrics.leads_generated}
                                                onChange={(e) => setMetrics({ ...metrics, leads_generated: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">ROAS</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    value={metrics.roas}
                                                    onChange={(e) => setMetrics({ ...metrics, roas: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">CPA</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    value={metrics.cpa}
                                                    onChange={(e) => setMetrics({ ...metrics, cpa: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
                                            Salvar Métricas
                                        </button>
                                    </form>
                                </div>

                                {/* Task Form */}
                                <div className="border rounded-lg p-4 bg-background/50">
                                    <h3 className="font-medium mb-3">Criar Tarefa</h3>
                                    <form onSubmit={handleTaskSubmit} className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Título</label>
                                            <input
                                                type="text"
                                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={newTask.title}
                                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Descrição</label>
                                            <textarea
                                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                                                value={newTask.description}
                                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Anexo</label>
                                            <input
                                                type="file"
                                                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                                onChange={(e) => setNewTask({ ...newTask, file: e.target.files ? e.target.files[0] : null })}
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors">
                                            Criar Tarefa
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground text-center py-10">Selecione um cliente para gerenciar detalhes</div>
                    )}
                </div>
            </div>
        </div>
    );
}
