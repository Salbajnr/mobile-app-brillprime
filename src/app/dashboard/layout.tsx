'use client';

import Link from 'next/link';
import {
  Bell,
  BarChart,
  Home,
  Package,
  ShieldCheck,
  Ticket,
  Users,
  MessageSquare,
  PanelLeft,
  Search,
  Settings,
  ArrowRightLeft,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/user-management', icon: Users, label: 'User Management', badge: 23 },
  { href: '/dashboard/escrow', icon: Package, label: 'Escrow Management', badge: 7 },
  { href: '/dashboard/transactions', icon: ArrowRightLeft, label: 'Transactions', badge: 3 },
  { href: '#', icon: Ticket, label: 'Support & Tickets', badge: 15 },
  { href: '/dashboard/demand-planning', icon: BarChart, label: 'Demand Planning' },
  { href: '#', icon: ShieldCheck, label: 'Security & Fraud', pulse: true },
];

function NavLink({ item, isCollapsed }: { item: typeof navItems[0], isCollapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
            isActive
              ? 'bg-blue-100 text-primary'
              : 'text-muted-foreground hover:bg-gray-50 hover:text-primary'
          )}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">{item.label}</span>}
          {!isCollapsed && item.badge && (
            <span className={cn(
                "ml-auto text-xs px-2 py-1 rounded-full text-white",
                item.label.includes('User') ? 'bg-red-500' :
                item.label.includes('Escrow') ? 'bg-yellow-500' :
                item.label.includes('Transactions') ? 'bg-orange-500' :
                'bg-green-500'
            )}>{item.badge}</span>
          )}
          {!isCollapsed && item.pulse && (
            <span className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </Link>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
    </Tooltip>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pathname = usePathname();
  const breadcrumbTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';

  const getBreadcrumbDescription = (title: string) => {
    switch (title) {
        case 'dashboard':
            return 'Platform overview and system monitoring';
        case 'transactions':
            return 'Review and manage all transactions';
        case 'demand planning':
            return 'AI-powered demand forecasting';
        case 'escrow':
            return 'Monitor and manage payment escrow transactions';
        case 'user management':
            return 'Manage all users on the platform';
        default:
            return 'Welcome to your dashboard';
    }
  }


  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col">
        <aside className={cn(
          "hidden md:flex flex-col border-r bg-white transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}>
          <div className="flex h-16 items-center border-b px-6">
            <Logo isCollapsed={isCollapsed} />
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => <NavLink key={item.label} item={item} isCollapsed={isCollapsed} />)}
          </nav>
          <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3">
                <Image
                    src="https://picsum.photos/36/36"
                    width={40}
                    height={40}
                    alt="Avatar"
                    data-ai-hint="Admin avatar"
                    className="rounded-full"
                />
                {!isCollapsed && (
                    <div>
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                )}
              </div>
          </div>
        </aside>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
            <Button variant="outline" size="icon" className="h-8 w-8 hidden md:flex" onClick={() => setIsCollapsed(!isCollapsed)}>
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs w-64 p-0">
                <div className="flex h-16 items-center border-b px-6">
                    <Logo />
                </div>
                <nav className="space-y-2 p-4">
                  {navItems.map((item) => <NavLink key={item.label} item={item} isCollapsed={false} />)}
                </nav>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground capitalize">
                {breadcrumbTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {getBreadcrumbDescription(breadcrumbTitle)}
              </p>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <div className="hidden md:flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-success">System Online</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                  <span>{currentTime}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Image
                      src="https://picsum.photos/36/36"
                      width={36}
                      height={36}
                      alt="Avatar"
                      data-ai-hint="profile picture"
                      className="overflow-hidden rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
