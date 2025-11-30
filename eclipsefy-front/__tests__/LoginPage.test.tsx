import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { AuthProvider } from '../context/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('../lib/api');
jest.mock('sonner');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
jest.mock('js-cookie');
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(() => ({ id: 1, role: 'CLIENT' })),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('handles successful login and redirects to OTP', async () => {
        (api.post as jest.Mock).mockResolvedValue({
            data: { token: 'temp-token' },
        });

        const pushMock = jest.fn();
        (require('next/navigation').useRouter as jest.Mock).mockReturnValue({ push: pushMock });

        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password',
            });
            expect(pushMock).toHaveBeenCalledWith('/otp');
        });
    });

    it('handles login failure', async () => {
        (api.post as jest.Mock).mockRejectedValue({
            response: { data: { error: 'Invalid credentials' } },
        });

        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        });
    });
});
