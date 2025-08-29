
import { getAllUsers } from '@brillprime/shared';
import { Badge } from '@brillprime/shared/ui/badge';
import { Button } from '@brillprime/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@brillprime/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@brillprime/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brillprime/shared/ui/tabs';
import { MoreHorizontal, PlusCircle, Eye, UserCheck, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@brillprime/shared/ui/dropdown-menu';

interface PageProps {
  searchParams: Promise<{ page?: string; role?: string }>;
}

export default async function UserManagement({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const roleFilter = params.role;

  const { users, totalCount, totalPages } = await getAllUsers(page, 20);

  // Filter users by role if specified
  const filteredUsers = roleFilter 
    ? users.filter(user => user.role === roleFilter)
    : users;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'MERCHANT': return 'default';
      case 'DRIVER': return 'secondary';
      case 'CONSUMER': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'destructive';
    if (isVerified) return 'default';
    return 'secondary';
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'Inactive';
    if (isVerified) return 'Verified';
    return 'Pending';
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage and monitor all platform users</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users ({totalCount})</TabsTrigger>
          <TabsTrigger value="CONSUMER">Consumers</TabsTrigger>
          <TabsTrigger value="MERCHANT">Merchants</TabsTrigger>
          <TabsTrigger value="DRIVER">Drivers</TabsTrigger>
          <TabsTrigger value="ADMIN">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Complete list of registered users across all roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role || 'CONSUMER')}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.isActive || false, user.isVerified || false)}>
                          {getStatusText(user.isActive || false, user.isVerified || false)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="mr-2 h-4 w-4" />
                              {user.isVerified ? 'Unverify' : 'Verify'} User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4" />
                              {user.isActive ? 'Deactivate' : 'Activate'} User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages} ({totalCount} total users)
                  </p>
                  <div className="flex space-x-2">
                    {page > 1 && (
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                    )}
                    {page < totalPages && (
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for other tabs */}
        {['CONSUMER', 'MERCHANT', 'DRIVER', 'ADMIN'].map(role => (
          <TabsContent key={role} value={role} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{role.charAt(0) + role.slice(1).toLowerCase()}s</CardTitle>
                <CardDescription>
                  Users with {role.toLowerCase()} role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(user => user.role === role).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.isActive || false, user.isVerified || false)}>
                            {getStatusText(user.isActive || false, user.isVerified || false)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLoginAt 
                            ? new Date(user.lastLoginAt).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt!).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                {user.isVerified ? 'Unverify' : 'Verify'} User
                              </DropdownMenuItem>
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
        ))}
      </Tabs>
    </div>
  );
}
