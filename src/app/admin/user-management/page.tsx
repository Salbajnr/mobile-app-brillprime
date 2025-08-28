
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Image from 'next/image';

const users = [
  {
    name: 'John Doe',
    email: 'john.doe@email.com',
    avatar: 'https://picsum.photos/40/40?random=1',
    role: 'Consumer',
    status: 'Active',
    lastLogin: '2024-07-29 10:30 AM',
    kycStatus: 'Verified',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    avatar: 'https://picsum.photos/40/40?random=2',
    role: 'Merchant',
    status: 'Active',
    lastLogin: '2024-07-29 09:45 AM',
    kycStatus: 'Verified',
  },
  {
    name: 'Robert Johnson',
    email: 'robert.j@email.com',
    avatar: 'https://picsum.photos/40/40?random=3',
    role: 'Driver',
    status: 'Inactive',
    lastLogin: '2024-07-25 03:15 PM',
    kycStatus: 'Verified',
  },
  {
    name: 'Emily White',
    email: 'emily.w@email.com',
    avatar: 'https://picsum.photos/40/40?random=4',
    role: 'Consumer',
    status: 'Active',
    lastLogin: '2024-07-29 11:00 AM',
    kycStatus: 'Pending',
  },
  {
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    avatar: 'https://picsum.photos/40/40?random=5',
    role: 'Merchant',
    status: 'Suspended',
    lastLogin: '2024-07-20 08:00 AM',
    kycStatus: 'Rejected',
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'secondary';
    case 'Suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getKycBadgeVariant = (status: string) => {
  switch (status) {
    case 'Verified':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function AdminUserManagementPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="consumer">Consumers</TabsTrigger>
          <TabsTrigger value="merchant">Merchants</TabsTrigger>
          <TabsTrigger value="driver">Drivers</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          data-ai-hint="user avatar"
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status) as any}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getKycBadgeVariant(user.kycStatus) as any}>
                        {user.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Suspend User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
