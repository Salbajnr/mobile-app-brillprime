
'use client';

import {
  Users,
  Package,
  ArrowRightLeft,
  Ticket,
  AlertTriangle,
  Info,
  ShieldAlert,
  BadgeCheck,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const kpiCards = [
  {
    title: 'Total Active Users',
    value: '24,847',
    change: '+12.5%',
    breakdown: 'Consumers: 18,250 • Merchants: 4,100 • Drivers: 2,497',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-primary',
    badge: null,
  },
  {
    title: 'Total Escrow Balance',
    value: '₦12.4M',
    change: '7 Pending',
    breakdown: 'Active: ₦8.2M • Disputed: ₦4.2M',
    icon: Package,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    badge: 'warning',
  },
  {
    title: 'Daily Transaction Volume',
    value: '₦156.8M',
    change: 'Real-time',
    breakdown: '2,847 transactions today',
    icon: ArrowRightLeft,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    badge: 'info',
  },
  {
    title: 'Support Tickets Today',
    value: '48',
    change: '15 Open',
    breakdown: 'Avg response: 2.4 hours',
    icon: Ticket,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badge: 'destructive',
  },
];

const recentActions = [
    { icon: ShieldAlert, color: "text-red-600", bgColor: "bg-red-100", title: "Merchant Account Suspended", description: "TechStore247 - Violation of terms • 5 min ago" },
    { icon: BadgeCheck, color: "text-green-600", bgColor: "bg-green-100", title: "Escrow Released", description: "Order #4521 - ₦12,500 released to merchant • 12 min ago" },
    { icon: UserCheck, color: "text-blue-600", bgColor: "bg-blue-100", title: "Driver Account Approved", description: "John Driver - Lagos Zone • 25 min ago" },
    { icon: AlertTriangle, color: "text-yellow-600", bgColor: "bg-yellow-100", title: "Fraud Alert Triggered", description: "Multiple failed login attempts detected • 1 hour ago" },
]

const systemHealth = [
    { name: "Payment Gateway", status: "Online", color: "bg-green-500" },
    { name: "Database", status: "Optimal", color: "bg-green-500" },
    { name: "API Response Time", status: "245ms", color: "bg-yellow-500" },
    { name: "SMS Service", status: "Active", color: "bg-green-500" },
    { name: "Escrow Service", status: "Running", color: "bg-green-500" },
]

const quickActions = [
    { href: "/admin/escrow", icon: Package, label: "Manage Escrow", color: "text-yellow-600" },
    { href: "/admin/user-management", icon: Users, label: "Approve Users", color: "text-primary" },
    { href: "/admin/transactions", icon: ArrowRightLeft, label: "Review Transactions", color: "text-orange-600" },
    { href: "/admin/support", icon: Ticket, label: "Handle Support", color: "text-red-600" },
];


export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Alerts */}
      <div className="grid gap-4">
        <Card className="rounded-2xl border-l-4 border-destructive bg-red-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <AlertTriangle className="mr-3 h-6 w-6 text-destructive" />
              <div>
                <CardTitle className="text-sm font-bold text-destructive">
                  Critical: Fraudulent Transaction Detected
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Transaction ID: TXN-4521 flagged for review - ₦45,000
                </p>
              </div>
            </div>
            <Button asChild className="rounded-full" variant="destructive" size="sm">
              <Link href="/admin/security">Review Now</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-l-4 border-yellow-500 bg-yellow-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Info className="mr-3 h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="text-sm font-bold text-yellow-700">
                  Escrow Dispute Escalated
                </h3>
                <p className="text-xs text-muted-foreground">
                  Order #1245 - Customer vs Merchant dispute requires admin
                  intervention
                </p>
              </div>
            </div>
            <Button asChild className="rounded-full bg-yellow-500 text-white hover:bg-yellow-500/90" size="sm">
              <Link href="/admin/escrow">Handle Dispute</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title} className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.iconBg}`}
                >
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                {card.change &&
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      card.badge === 'destructive'
                        ? 'bg-red-100 text-red-800'
                        : card.badge === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : card.badge === 'info'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {card.change}
                  </span>
                }
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{card.breakdown}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities & System Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Recent Admin Actions</CardTitle>
                    <Button variant="link" asChild className="text-primary">
                      <Link href="/admin">View All</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {recentActions.map((action, index) => (
                    <div key={index} className="flex items-center rounded-lg bg-gray-50 p-3">
                        <div className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${action.bgColor}`}>
                            <action.icon className={`h-4 w-4 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{action.title}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">System Health</CardTitle>
                     <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm text-success">All Systems Operational</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {systemHealth.map((system) => (
                        <div key={system.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`mr-3 h-3 w-3 rounded-full ${system.color}`}></div>
                                <span className="text-sm font-medium">{system.name}</span>
                            </div>
                            <span className={`text-sm ${system.color.includes('green') ? 'text-success' : 'text-yellow-600'}`}>{system.status}</span>
                        </div>
                    ))}
                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-lg font-bold">99.9%</p>
                                <p className="text-xs text-muted-foreground">Uptime</p>
                            </div>
                             <div>
                                <p className="text-lg font-bold">2.1s</p>
                                <p className="text-xs text-muted-foreground">Avg Response</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

       {/* Quick Actions */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {quickActions.map((action) => (
                  <Button asChild key={action.label} variant="outline" className="h-auto flex-col gap-2 rounded-2xl border-gray-200 p-4 hover:shadow-md">
                      <Link href={action.href}>
                         <action.icon className={`h-8 w-8 ${action.color}`} />
                         <p className="text-sm font-medium text-foreground">{action.label}</p>
                      </Link>
                    </Button>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
