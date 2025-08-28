
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

export default function SigninPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm rounded-3xl shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4">
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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-primary underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
