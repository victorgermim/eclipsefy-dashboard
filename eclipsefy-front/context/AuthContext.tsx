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
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
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
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    Cookies.remove('token');
                    setUser(null);
                } else {
                    setUser({ id: decoded.id, role: decoded.role, email: decoded.email || '' });
                }
            } catch (error) {
                Cookies.remove('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        Cookies.set('token', token, { expires: 1 });
        setUser(userData);
        if (userData.role === 'ADMIN') {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
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
