
'use client';

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
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { useEffect, useState } from 'react';
import type { SelectUser } from '@/lib/db/schema';
import { UserForm } from './user-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const getStatusBadgeVariant = (status: boolean) => {
  switch (status) {
    case true:
      return 'success';
    case false:
      return 'secondary';
    default:
      return 'outline';
  }
};

const getKycBadgeVariant = (status: boolean) => {
  switch (status) {
    case true:
      return 'success';
    case false:
      return 'warning';
    default:
      return 'outline';
  }
};

export default function AdminUserManagementPage() {
  const [userList, setUserList] = useState<SelectUser[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null);

  async function fetchUsers() {
    const result = await db.select().from(users);
    setUserList(result);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
    fetchUsers(); // Refetch users after submission
  };

  const handleEdit = (user: SelectUser) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  
  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
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
                {userList.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.profilePicture || `https://picsum.photos/40/40?random=${user.id}`}
                          alt={user.fullName || 'User avatar'}
                          width={40}
                          height={40}
                          className="rounded-full"
                          data-ai-hint="user avatar"
                        />
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.isActive) as any}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getKycBadgeVariant(user.emailVerified) as any}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleEdit(user)}>Edit User</DropdownMenuItem>
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
    <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        <UserForm currentUser={selectedUser} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
