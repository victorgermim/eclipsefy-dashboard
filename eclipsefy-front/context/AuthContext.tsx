'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    email: string;
    role: 'ADMIN' | 'CLIENT';
    company_name?: string;
    avatar_url?: string;
    permissions?: any;
    services?: Record<string, boolean>;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    verifyOtp: (code: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    Cookies.remove('token');
                    setUser(null);
                } else {
                    setUser({ id: decoded.id, role: decoded.role, email: decoded.email || '', services: decoded.services });
                }
            } catch (error) {
                Cookies.remove('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            // Store temp token for OTP step
            sessionStorage.setItem('temp_token', response.data.token);
            router.push('/otp');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const verifyOtp = async (code: string) => {
        if (code === '2021') {
            const tempToken = sessionStorage.getItem('temp_token');
            if (tempToken) {
                const decoded: any = jwtDecode(tempToken);
                setUser({ id: decoded.id, role: decoded.role, email: decoded.email || '', services: decoded.services });
                Cookies.set('token', tempToken, { expires: 1 });
                sessionStorage.removeItem('temp_token');
                router.push('/');
            } else {
                throw new Error('No session found');
            }
        } else {
            throw new Error('Invalid OTP code');
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, verifyOtp, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
