// src/app/admin/transactions/page.tsx
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/db';
import { transactions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
}

export default async function AdminTransactionsPage() {
  const transactionList = await db.select({
      id: transactions.id,
      amount: transactions.amount,
      currency: transactions.currency,
      paymentMethod: transactions.paymentMethod,
      paymentStatus: transactions.paymentStatus,
      createdAt: transactions.createdAt,
      user: {
        fullName: users.fullName,
        email: users.email
      }
  }).from(transactions).leftJoin(users, eq(transactions.userId, users.id));

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>
          A detailed list of all recent transactions across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
               <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionList.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.user?.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.user?.email}
                  </div>
                </TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(transaction.paymentStatus || 'PENDING') as any}>
                    {transaction.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : ''}</TableCell>
                <TableCell className="text-right">{transaction.currency} {transaction.amount}</TableCell>
                <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Refund</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
