import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('js-cookie');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(() => ({ id: 1, role: 'CLIENT', exp: Date.now() / 1000 + 3600 })),
}));

const TestComponent = () => {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="user-role">{user ? user.role : 'GUEST'}</div>
            <button onClick={() => login('fake-token', { id: 1, email: 'test@test.com', role: 'CLIENT' })}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
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

    it('should login and redirect', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });

        expect(Cookies.set).toHaveBeenCalledWith('token', 'fake-token', { expires: 1 });
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
        expect(screen.getByTestId('user-role')).toHaveTextContent('CLIENT');
    });

    it('should logout and redirect', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Login first
        act(() => {
            screen.getByText('Login').click();
        });

        // Then logout
        act(() => {
            screen.getByText('Logout').click();
        });

        expect(Cookies.remove).toHaveBeenCalledWith('token');
        expect(mockPush).toHaveBeenCalledWith('/login');
        expect(screen.getByTestId('user-role')).toHaveTextContent('GUEST');
    });
});
