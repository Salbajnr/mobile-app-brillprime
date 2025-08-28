
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { WebLogo } from '@/components/web/web-logo';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { signIn } from './actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const socialLogins = [
    { name: 'Google', icon: 'https://picsum.photos/24/24?random=1', hint: 'Google logo' },
    { name: 'Apple', icon: 'https://picsum.photos/24/24?random=2', hint: 'Apple logo' },
    { name: 'Facebook', icon: 'https://picsum.photos/24/24?random=3', hint: 'Facebook logo' },
]

const initialState = {
  message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full rounded-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending}>
          {pending ? "Signing In..." : "Sign In"}
        </Button>
    )
}

export default function SigninPage() {
  const [state, formAction] = useFormState(signIn, initialState);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      } else {
        toast({ title: 'Success', description: state.message });
        router.push('/dashboard'); // Or wherever you want to redirect after login
      }
    }
  }, [state, toast, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm rounded-3xl shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-2">
            <WebLogo />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-[hsl(var(--foreground))]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to continue to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
             <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="rounded-full pl-12 py-6"
                />
            </div>
             <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    required 
                    placeholder="Password"
                    className="rounded-full pl-12 py-6" 
                />
            </div>
             <div className="flex items-center">
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-primary underline"
                >
                  Forgot password?
                </Link>
              </div>
            <SubmitButton />
          </form>

            <div className="my-6 flex items-center">
                <div className="flex-1 border-t"></div>
                <span className="px-2 text-sm text-muted-foreground">or continue with</span>
                <div className="flex-1 border-t"></div>
            </div>

            <div className="flex justify-center space-x-4">
                {socialLogins.map(social => (
                    <Button key={social.name} variant="outline" size="icon" className="w-14 h-14 rounded-2xl">
                         <Image src={social.icon} alt={`${social.name} logo`} width={24} height={24} data-ai-hint={social.hint} />
                    </Button>
                ))}
            </div>

           <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary font-bold">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
