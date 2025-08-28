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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const transactions = [
    {
      id: "TRX001",
      customer: "John Doe",
      type: "E-Market",
      status: "Paid",
      date: "2024-05-21",
      amount: "$150.00",
      email: "john.doe@email.com",
    },
    {
      id: "TRX002",
      customer: "Jane Smith",
      type: "Fuel",
      status: "Paid",
      date: "2024-05-20",
      amount: "$45.50",
      email: "jane.smith@email.com",
    },
    {
      id: "TRX003",
      customer: "Robert Johnson",
      type: "Toll",
      status: "Paid",
      date: "2024-05-19",
      amount: "$12.75",
      email: "robert.j@email.com",
    },
    {
      id: "TRX004",
      customer: "Emily White",
      type: "E-Market",
      status: "Pending",
      date: "2024-05-21",
      amount: "$250.00",
      email: "emily.w@email.com",
    },
    {
      id: "TRX005",
      customer: "Michael Brown",
      type: "Fuel",
      status: "Failed",
      date: "2024-05-18",
      amount: "$60.00",
      email: "michael.b@email.com",
    },
];

const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'outline';
    }
}

export default function TransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          A list of all recent transactions.
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.customer}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.email}
                  </div>
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="text-right">{transaction.amount}</TableCell>
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
