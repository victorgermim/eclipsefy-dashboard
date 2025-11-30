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
      toast.success('Authentication successful');
    } catch (error) {
      const err = error as any;
      toast.error(err.message || 'Invalid OTP');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
          <CardDescription>Enter the code sent to your email (Use 2021)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
