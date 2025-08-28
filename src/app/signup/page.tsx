
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
import { Label } from '@/components/ui/label';
import { WebLogo } from '@/components/web/web-logo';
import { User, Mail, Lock } from 'lucide-react';
import Image from 'next/image';

const socialLogins = [
    { name: 'Google', icon: 'https://picsum.photos/24/24?random=1', hint: 'Google logo' },
    { name: 'Apple', icon: 'https://picsum.photos/24/24?random=2', hint: 'Apple logo' },
    { name: 'Facebook', icon: 'https://picsum.photos/24/24?random=3', hint: 'Facebook logo' },
]

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-2">
            <WebLogo />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-[hsl(var(--foreground))]">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Join BrillPrime to access smart services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="rounded-full pl-12 py-6"
              />
            </div>
             <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
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
                type="password" 
                required 
                placeholder="Password"
                className="rounded-full pl-12 py-6" 
                />
            </div>
            <Button type="submit" className="w-full rounded-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
              Sign Up
            </Button>
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
