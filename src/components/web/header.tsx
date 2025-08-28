import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WebLogo } from './web-logo';

export function WebHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/web">
          <WebLogo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/services" className="transition-colors hover:text-primary">
            Services
          </Link>
          <Link href="/about" className="transition-colors hover:text-primary">
            About Us
          </Link>
          <Link href="/contact" className="transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/signin">Login</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
