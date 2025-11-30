'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function OTPPage() {
  const [code, setCode] = useState('');
  const { verifyOtp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(code);
      toast.success('Autenticação realizada com sucesso');
    } catch (error) {
      const err = error as any;
      toast.error(err.message || 'Código inválido');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#030014]">
      {/* Galaxy Light Effect */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <Card className="z-10 w-full max-w-md border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 ring-1 ring-purple-500/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-purple-400"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Digite o Código</CardTitle>
          <CardDescription className="text-slate-400">Digite o código enviado para seu e-mail (Use 2021)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="0000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                required
                className="h-14 bg-black/20 border-white/10 text-white text-center text-3xl tracking-[1em] placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300 font-mono"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-white text-black hover:bg-slate-200 font-medium transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar Acesso'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
