import { getDashboardStats, getRecentTransactions } from '@brillprime/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brillprime/shared/ui/card';
import { Badge } from '@brillprime/shared/ui/badge';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Shield,
  BadgeCheck,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentTransactions = await getRecentTransactions(5);

  const metrics = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      description: "Registered users",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Orders", 
      value: stats.totalOrders.toLocaleString(),
      description: "All time orders",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: `₦${Number(stats.totalRevenue).toLocaleString()}`,
      description: `${stats.transactionCount} transactions`,
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Support Tickets",
      value: stats.openTickets.toString(),
      description: "Open tickets",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const recentActions = [
    { 
      icon: ShieldAlert, 
      color: "text-red-600", 
      bgColor: "bg-red-100", 
      title: "Security Alert", 
      description: "Multiple failed login attempts detected • 5 min ago" 
    },
    { 
      icon: BadgeCheck, 
      color: "text-green-600", 
      bgColor: "bg-green-100", 
      title: "Escrow Released", 
      description: `Latest transaction processed • 12 min ago` 
    },
    { 
      icon: UserCheck, 
      color: "text-blue-600", 
      bgColor: "bg-blue-100", 
      title: "New User Registered", 
      description: "User verification pending • 25 min ago" 
    },
    { 
      icon: AlertTriangle, 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100", 
      title: "System Alert", 
      description: "Database connection optimized • 1 hour ago" 
    },
  ];

  const systemHealth = [
    { name: "Payment Gateway", status: "Online", color: "bg-green-500" },
    { name: "Database", status: "Optimal", color: "bg-green-500" },
    { name: "API Response Time", status: "245ms", color: "bg-yellow-500" },
    { name: "SMS Service", status: "Active", color: "bg-green-500" },
    { name: "Escrow Service", status: "Running", color: "bg-green-500" },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Transactions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment transactions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.user?.fullName || 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.user?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₦{Number(transaction.amount).toLocaleString()}</p>
                    <Badge variant={transaction.paymentStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                      {transaction.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Actions</CardTitle>
            <CardDescription>Latest administrative activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${action.bgColor}`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current status of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {systemHealth.map((system, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${system.color}`} />
                <div>
                  <p className="text-sm font-medium">{system.name}</p>
                  <p className="text-xs text-muted-foreground">{system.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}