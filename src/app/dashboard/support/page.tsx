
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const tickets = [
  {
    id: 'TKT-001',
    subject: 'Late delivery inquiry',
    customer: 'John Doe',
    priority: 'High',
    status: 'Open',
    lastUpdate: '2024-07-30 10:45 AM',
  },
  {
    id: 'TKT-002',
    subject: 'Payment issue with order #1245',
    customer: 'Jane Smith',
    priority: 'High',
    status: 'In Progress',
    lastUpdate: '2024-07-30 10:30 AM',
  },
  {
    id: 'TKT-003',
    subject: 'Wrong item received for order #1243',
    customer: 'Robert Johnson',
    priority: 'Medium',
    status: 'Open',
    lastUpdate: '2024-07-30 09:15 AM',
  },
  {
    id: 'TKT-004',
    subject: 'Question about product specifications',
    customer: 'Emily White',
    priority: 'Low',
    status: 'Closed',
    lastUpdate: '2024-07-29 05:00 PM',
  },
  {
    id: 'TKT-005',
    subject: 'Account access problem',
    customer: 'Michael Brown',
    priority: 'High',
    status: 'Open',
    lastUpdate: '2024-07-30 11:00 AM',
  },
  {
    id: 'TKT-006',
    subject: 'Refund request for order #1242',
    customer: 'Sarah Davis',
    priority: 'Medium',
    status: 'Closed',
    lastUpdate: '2024-07-28 02:20 PM',
  },
   {
    id: 'TKT-007',
    subject: 'Feature request for mobile app',
    customer: 'David Wilson',
    priority: 'Low',
    status: 'In Progress',
    lastUpdate: '2024-07-30 11:30 AM',
  },
];

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
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
    case 'Open':
      return 'success';
    case 'In Progress':
      return 'warning';
    case 'Closed':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function SupportPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center pb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Open</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>In Progress</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Closed</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <File className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="px-7">
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            Manage and respond to customer support tickets.
          </CardDescription>
          <div className="relative pt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-10 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(ticket.priority) as any}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(ticket.status) as any}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.lastUpdate}</TableCell>
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
                        <DropdownMenuItem>View Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Agent</DropdownMenuItem>
                        <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-7</strong> of <strong>15</strong> tickets
            </div>
          </CardFooter>
      </Card>
    </Tabs>
  );
}
