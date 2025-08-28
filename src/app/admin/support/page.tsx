'use client';

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
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { supportTickets } from '@/lib/db/schema';
import Link from 'next/link';
import { eq, or, ilike, and } from 'drizzle-orm';

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case 'HIGH':
    case 'URGENT':
      return 'destructive';
    case 'NORMAL':
      return 'warning';
    case 'LOW':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'success';
    case 'IN_PROGRESS':
      return 'warning';
    case 'CLOSED':
    case 'RESOLVED':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchTickets() {
      const statusFilter = activeTab !== 'all' ? eq(supportTickets.status, activeTab.toUpperCase() as any) : undefined;
      
      const searchFilter = searchTerm ? or(
        ilike(supportTickets.ticketNumber, `%${searchTerm}%`),
        ilike(supportTickets.subject, `%${searchTerm}%`),
        ilike(supportTickets.name, `%${searchTerm}%`),
        ilike(supportTickets.email, `%${searchTerm}%`),
      ) : undefined;
      
      let whereCondition;
      if (statusFilter && searchFilter) {
        whereCondition = and(statusFilter, searchFilter);
      } else {
        whereCondition = statusFilter || searchFilter;
      }
      
      const query = db.select().from(supportTickets);
      if(whereCondition) {
        query.where(whereCondition);
      }

      const result = await query;
      setTickets(result);
    }
    fetchTickets();
  }, [activeTab, searchTerm]);

  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab}>
      <div className="flex items-center pb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
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
            <Input 
              placeholder="Search by ticket #, subject, name, or email..." 
              className="pl-10 rounded-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              {tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    {ticket.ticketNumber}
                  </TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getPriorityBadgeVariant(
                          ticket.priority || 'NORMAL'
                        ) as any
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(ticket.status || 'OPEN') as any}
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updatedAt || '').toLocaleString()}
                  </TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/support/${ticket.id}`}>
                            View Ticket
                          </Link>
                        </DropdownMenuItem>
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
            Showing <strong>1-{tickets.length}</strong> of{' '}
            <strong>{tickets.length}</strong> tickets
          </div>
        </CardFooter>
      </Card>
    </Tabs>
  );
}
