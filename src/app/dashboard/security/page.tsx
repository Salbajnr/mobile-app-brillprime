
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
import { ShieldCheck, AlertTriangle, Fingerprint, BarChart2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

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


const securityAlerts = [
  {
    id: 'ALT-001',
    type: 'Multiple Login Failures',
    user: 'john.doe@email.com',
    severity: 'High',
    timestamp: '2024-07-30 11:45 AM',
    status: 'Pending Review',
  },
  {
    id: 'ALT-002',
    type: 'Unusual Location Login',
    user: 'jane.smith@email.com',
    severity: 'Medium',
    timestamp: '2024-07-30 10:20 AM',
    status: 'Reviewed',
  },
  {
    id: 'ALT-003',
    type: 'Large Transaction Attempt',
    user: 'michael.b@email.com',
    severity: 'High',
    timestamp: '2024-07-30 08:10 AM',
    status: 'Action Taken',
  },
  {
    id: 'ALT-004',
    type: 'KYC Document Mismatch',
    user: 'emily.w@email.com',
    severity: 'Low',
    timestamp: '2024-07-29 04:00 PM',
    status: 'Reviewed',
  },
];

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


export default function SecurityPage() {
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
                <TableHead>User</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityAlerts.map((alert) => (
                <TableRow key={alert.id} className={alert.severity === 'High' ? 'bg-red-500/5' : ''}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>{alert.user}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityBadgeVariant(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(alert.status) as any}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.timestamp}</TableCell>
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
