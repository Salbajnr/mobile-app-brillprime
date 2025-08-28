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
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm rounded-3xl shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-[hsl(var(--foreground))]">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
            <Button asChild className="w-full rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/dashboard">Login</Link>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Not an admin?{' '}
            <Link href="#" className="underline text-primary">
              Go to main site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
