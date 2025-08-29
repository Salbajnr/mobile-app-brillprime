'use client';

import Link from 'next/link';
import { Button } from '@brillprime/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@brillprime/shared/ui/card';
import { Input } from '@brillprime/shared/ui/input';
import { Label } from '@brillprime/shared/ui/label';
import { useFormState, useFormStatus } from 'react-dom';
import { adminSignIn } from './actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Mail } from 'lucide-react';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending}>
      {pending ? "Signing In..." : "Admin Login"}
    </Button>
  )
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminSignIn, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && (state.errors || state.message.startsWith('Invalid') || state.message.startsWith('An unexpected'))) {
        toast({
            variant: 'destructive',
            title: 'Admin Login Failed',
            description: state.message
        });
    }
  }, [state, toast]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-white">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-center text-slate-300">
            Secure access for administrators only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@brillprime.com"
                required
                className="rounded-xl pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Admin password"
                className="rounded-xl pl-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/forgot-password"
                className="ml-auto inline-block text-sm text-primary underline"
              >
                Forgot password?
              </Link>
            </div>
            <SubmitButton />
          </form>
          <div className="mt-6 text-center text-sm text-slate-400">
            Need help? Contact{' '}
            <Link href="mailto:support@brillprime.com" className="text-primary underline">
              system administrator
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}