
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { db } from '@/lib/db';
import { fraudAlerts as fraudAlertsTable } from '@/lib/db/schema';
import { useEffect, useState } from 'react';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'High Risk',
    color: 'hsl(var(--destructive))',
  },
  mobile: {
    label: 'Medium Risk',
    color: 'hsl(var(--warning))',
  },
} satisfies ChartConfig;

const getSeverityBadgeVariant = (severity: string) => {
  switch (severity) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Pending Review':
      return 'destructive';
    case 'Reviewed':
      return 'secondary';
    case 'Action Taken':
      return 'success';
    default:
      return 'outline';
  }
};

type FraudAlert = typeof fraudAlertsTable.$inferSelect;

export default function AdminSecurityPage() {
    const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);

    useEffect(() => {
        async function fetchFraudAlerts() {
            const result = await db.select().from(fraudAlertsTable);
            setFraudAlerts(result);
        }
        fetchFraudAlerts();
    }, []);

  return (
    <div className="grid gap-6">
       <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Security Events Overview</CardTitle>
          <CardDescription>A chart showing security event trends over the past 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
          <CardDescription>
            Review and take action on recent security alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fraudAlerts.map((alert) => (
                <TableRow key={alert.id} className={alert.severity === 'High' ? 'bg-red-500/5' : ''}>
                  <TableCell className="font-medium">{`ALT-${alert.id}`}</TableCell>
                  <TableCell>{alert.alertType}</TableCell>
                  <TableCell>{alert.userId}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityBadgeVariant(alert.severity || 'Low') as any}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(alert.status || 'Pending Review') as any}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(alert.createdAt || '').toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="rounded-full">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
