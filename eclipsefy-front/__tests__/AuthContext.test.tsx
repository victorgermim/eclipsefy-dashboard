import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

// Mock dependencies
jest.mock('js-cookie');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));
jest.mock('../lib/api');
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(() => ({ id: 1, role: 'CLIENT', exp: Date.now() / 1000 + 3600 })),
}));

const TestComponent = () => {
    const { user, login, verifyOtp, logout } = useAuth();
    return (
        <div>
            <div data-testid="user-role">{user ? user.role : 'GUEST'}</div>
            <button onClick={() => login('test@test.com', 'password')}>Login</button>
            <button onClick={() => verifyOtp('2021')}>Verify OTP</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (Cookies.get as jest.Mock).mockReturnValue(undefined);
    });

    it('should provide default guest state', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId('user-role')).toHaveTextContent('GUEST');
    });

    it('should login and redirect to OTP', async () => {
        (api.post as jest.Mock).mockResolvedValue({ data: { token: 'temp-token' } });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText('Login').click();
        });

        expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password' });
        expect(mockPush).toHaveBeenCalledWith('/otp');
    });

    it('should verify OTP and redirect to dashboard', async () => {
        // Mock session storage
        const sessionStorageMock = {
            getItem: jest.fn().mockReturnValue('temp-token'),
            removeItem: jest.fn(),
            setItem: jest.fn(),
        };
        Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText('Verify OTP').click();
        });

        expect(Cookies.set).toHaveBeenCalledWith('token', 'temp-token', { expires: 1 });
        expect(mockPush).toHaveBeenCalledWith('/');
        expect(screen.getByTestId('user-role')).toHaveTextContent('CLIENT');
    });

    it('should logout and redirect', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText('Logout').click();
        });

        expect(Cookies.remove).toHaveBeenCalledWith('token');
        expect(mockPush).toHaveBeenCalledWith('/login');
        expect(screen.getByTestId('user-role')).toHaveTextContent('GUEST');
    });
});
