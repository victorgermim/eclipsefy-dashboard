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
            toast.success('Metrics added successfully!');
            // Reset form
            setMetrics({ ...metrics, investment_amount: '', leads_generated: '', roas: '', cpa: '' });
        } catch (error) {
            console.error('Failed to add metrics', error);
            toast.error('Failed to add metrics');
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
            toast.success('Task created successfully!');
            setNewTask({ title: '', description: '', file: null });
        } catch (error) {
            console.error('Failed to create task', error);
            toast.error('Failed to create task');
        }
    };

    if (loading) return <div>Loading clients...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Mission Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Client List */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Clients</h2>
                    <ul>
                        {clients.map((client) => (
                            <li
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div className="font-medium">{client.company_name || 'Unnamed Company'}</div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Details Panel */}
                <div className="md:col-span-2 bg-white p-4 rounded shadow">
                    {selectedClient ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">
                                Manage: {selectedClient.company_name}
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Metrics Form */}
                                <div className="border p-4 rounded">
                                    <h3 className="font-medium mb-3">Inject Metrics</h3>
                                    <form onSubmit={handleMetricsSubmit} className="space-y-3">
                                        <div>
                                            <label className="block text-sm">Investment Amount</label>
                                            <input
                                                type="number"
                                                className="w-full border p-2 rounded"
                                                value={metrics.investment_amount}
                                                onChange={(e) => setMetrics({ ...metrics, investment_amount: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm">Leads Generated</label>
                                            <input
                                                type="number"
                                                className="w-full border p-2 rounded"
                                                value={metrics.leads_generated}
                                                onChange={(e) => setMetrics({ ...metrics, leads_generated: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-sm">ROAS</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full border p-2 rounded"
                                                    value={metrics.roas}
                                                    onChange={(e) => setMetrics({ ...metrics, roas: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm">CPA</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full border p-2 rounded"
                                                    value={metrics.cpa}
                                                    onChange={(e) => setMetrics({ ...metrics, cpa: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                            Save Metrics
                                        </button>
                                    </form>
                                </div>

                                {/* Task Form */}
                                <div className="border p-4 rounded">
                                    <h3 className="font-medium mb-3">Create Task</h3>
                                    <form onSubmit={handleTaskSubmit} className="space-y-3">
                                        <div>
                                            <label className="block text-sm">Title</label>
                                            <input
                                                type="text"
                                                className="w-full border p-2 rounded"
                                                value={newTask.title}
                                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm">Description</label>
                                            <textarea
                                                className="w-full border p-2 rounded"
                                                value={newTask.description}
                                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm">Attachment (Image/Video)</label>
                                            <input
                                                type="file"
                                                className="w-full"
                                                onChange={(e) => setNewTask({ ...newTask, file: e.target.files ? e.target.files[0] : null })}
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                                            Create Task
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 text-center py-10">Select a client to manage details</div>
                    )}
                </div>
            </div>
        </div>
    );
}
