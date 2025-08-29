
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
import { User, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { signUp } from './actions';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const socialLogins = [
    { name: 'Google', icon: 'https://picsum.photos/24/24?random=1', hint: 'Google logo' },
    { name: 'Apple', icon: 'https://picsum.photos/24/24?random=2', hint: 'Apple logo' },
    { name: 'Facebook', icon: 'https://picsum.photos/24/24?random=3', hint: 'Facebook logo' },
];

const initialState = {
  message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full rounded-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending}>
          {pending ? "Creating Account..." : "Sign Up"}
        </Button>
    )
}

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(signUp, initialState);
  const [role, setRole] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Client-side check for the selected role
    const selectedRole = localStorage.getItem('selectedAccountType');
    if(selectedRole) {
      setRole(selectedRole);
    } else {
      // Default to consumer or redirect if no role is selected
      setRole('CONSUMER');
    }
  }, []);

  useEffect(() => {
    if (state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-2">
            <WebLogo />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-[hsl(var(--foreground))]">
            Create a <span className='capitalize'>{role?.toLowerCase()}</span> Account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Join BrillPrime to access smart services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="role" value={role || 'CONSUMER'} />
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="rounded-full pl-12 py-6"
              />
              {state?.errors?.fullName && <p className="text-sm text-destructive mt-1 pl-4">{state.errors.fullName[0]}</p>}
            </div>
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
               {state?.errors?.email && <p className="text-sm text-destructive mt-1 pl-4">{state.errors.email[0]}</p>}
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
              {state?.errors?.password && <p className="text-sm text-destructive mt-1 pl-4">{state.errors.password[0]}</p>}
            </div>
            <SubmitButton />
          </form>

           <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>
                    By clicking the button above you agree to the BrillPrime{' '}
                    <Link href="/terms" className="font-bold underline">Terms of Service</Link>
                    {' '}and{' '} 
                    <Link href="/privacy" className="font-bold underline">Privacy Policy</Link>
                </p>
            </div>

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
            Already have an account?{' '}
            <Link href="/signin" className="underline text-primary font-bold">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
