
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from './actions';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full rounded-full bg-secondary py-6 text-lg text-white hover:bg-secondary/90"
      disabled={pending}
    >
      {pending ? 'Resetting...' : 'Reset password'}
    </Button>
  );
}

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(resetPassword, initialState);
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        router.push('/signin');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
             <Button
                variant="ghost"
                size="icon"
                className="mb-8"
                onClick={() => router.back()}
                >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center mb-12">
                <h1 className="text-xl font-extrabold text-[rgb(11,26,81)] montserrat">Set New Password</h1>
            </div>

            <form action={formAction} className="space-y-6">
                {/* This would typically come from the URL token */}
                <input type="hidden" name="email" value="user@example.com" /> 

                <div className="relative">
                    <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        required
                        className="h-auto w-full rounded-full py-4 pl-14 pr-12 text-lg placeholder-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </Button>
                </div>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        required
                        className="h-auto w-full rounded-full py-4 pl-14 pr-12 text-lg placeholder-gray-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </Button>
                </div>

                <div className="pt-8">
                    <SubmitButton />
                </div>
            </form>
        </div>
    </div>
  );
}
