import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../app/(dashboard)/page';
import { AuthProvider } from '../context/AuthContext';
import api from '../lib/api';

// Mock dependencies
jest.mock('../lib/api');
jest.mock('sonner');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
jest.mock('js-cookie', () => ({
    get: jest.fn(() => 'fake-token'),
    set: jest.fn(),
    remove: jest.fn(),
}));
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(() => ({ id: 1, role: 'CLIENT', exp: Date.now() / 1000 + 3600 })),
}));

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders dashboard and fetches metrics', async () => {
        const mockMetrics = [
            {
                investment_amount: 1000,
                leads_generated: 50,
                roas: 5.0,
                cpa: 20.0,
            },
        ];

        (api.get as jest.Mock).mockResolvedValue({ data: mockMetrics });

        render(
            <AuthProvider>
                <DashboardPage />
            </AuthProvider>
        );

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });

        expect(screen.getByText('$1000')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('5x')).toBeInTheDocument();
        expect(screen.getByText('$20')).toBeInTheDocument();
    });
});
