
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Clock,
  ShieldAlert,
  Image as ImageIcon,
  CheckCircle2,
  Hourglass,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/db';
import { escrowTransactions, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'DISPUTED':
      return 'bg-red-100 text-red-800';
    case 'PENDING_RELEASE':
      return 'bg-yellow-100 text-yellow-800';
    case 'RELEASED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function DisputeModal() {
  return (
    <DialogContent className="max-w-2xl p-0">
      <DialogHeader className="p-6 border-b">
        <DialogTitle className="text-xl font-bold text-[hsl(var(--foreground))]">Dispute Resolution</DialogTitle>
      </DialogHeader>
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Escrow ID</p>
              <p className="text-lg font-bold">ESC-4521</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-lg font-bold">₦45,000</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer</p>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@email.com</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Merchant</p>
              <p className="font-medium">TechStore247</p>
              <p className="text-xs text-muted-foreground">tech@techstore247.com</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-[hsl(var(--foreground))]">Dispute Timeline</h3>
            <div className="space-y-4">
                {[
                  { status: 'Dispute Filed', description: 'Customer reported product not as described', time: '2 hours ago', color: 'bg-blue-500' },
                  { status: 'Merchant Response', description: 'Merchant provided tracking and proof of delivery', time: '1 hour ago', color: 'bg-yellow-500' },
                  { status: 'Escalated to Admin', description: 'Automatic escalation due to unresolved dispute', time: '30 min ago', color: 'bg-red-500' },
                ].map(item => (
                    <div key={item.status} className="flex items-start">
                        <div className={`w-3 h-3 ${item.color} rounded-full mt-1 mr-3 shrink-0`}></div>
                        <div>
                            <p className="text-sm font-medium">{item.status}</p>
                            <p className="text-xs text-muted-foreground">{item.description} • {item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-[hsl(var(--foreground))]">Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 rounded-xl">
                    <h4 className="font-medium mb-2">Customer Evidence</h4>
                    <div className="space-y-2">
                        {[
                          { name: 'product_received.jpg', icon: ImageIcon },
                          { name: 'damage_photo.jpg', icon: ImageIcon },
                        ].map(file => (
                            <div key={file.name} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <file.icon className="w-4 h-4 mr-2 text-muted-foreground"/>
                                <span className="text-xs">{file.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card className="p-4 rounded-xl">
                    <h4 className="font-medium mb-2">Merchant Evidence</h4>
                     <div className="space-y-2">
                        {[
                          { name: 'delivery_receipt.pdf', icon: FileText },
                          { name: 'packaging_photo.jpg', icon: ImageIcon },
                        ].map(file => (
                            <div key={file.name} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <file.icon className="w-4 h-4 mr-2 text-muted-foreground"/>
                                <span className="text-xs">{file.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
        
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 text-[hsl(var(--foreground))]">Resolution Actions</h3>
            <Textarea 
                className="w-full p-4 border rounded-xl mb-4 text-sm" 
                rows={4} 
                placeholder="Enter admin notes and resolution details..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="destructive" className="rounded-full">Refund Customer</Button>
                <Button className="bg-success text-success-foreground hover:bg-success/90 rounded-full">Release to Merchant</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">Partial Refund</Button>
            </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminEscrowPage() {
  const [escrowItems, setEscrowItems] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'active', 'disputed', 'pending'];
  const filterCounts = { all: 124, active: 89, disputed: 7, pending: 28 };

  useState(async () => {
    const customer = alias(users, 'customer');
    const merchant = alias(users, 'merchant');

    const result = await db
      .select({
        id: escrowTransactions.id,
        status: escrowTransactions.status,
        amount: escrowTransactions.amount,
        createdAt: escrowTransactions.createdAt,
        orderId: escrowTransactions.orderId,
        customerName: customer.fullName,
        merchantName: merchant.fullName,
      })
      .from(escrowTransactions)
      .leftJoin(customer, eq(escrowTransactions.customerId, customer.id))
      .leftJoin(merchant, eq(escrowTransactions.merchantId, merchant.id));

    setEscrowItems(result);
  });

  return (
    <Dialog>
      <div className="flex flex-col h-full">
        <div className="bg-white px-6 py-4 border-b rounded-t-2xl">
            <div className="flex flex-wrap gap-2">
                {filters.map(filter => (
                    <Button 
                        key={filter} 
                        onClick={() => setActiveFilter(filter)}
                        variant={activeFilter === filter ? 'default' : 'outline'}
                        className="rounded-full capitalize"
                    >
                        {filter.replace(/([A-Z])/g, ' $1')} ({filterCounts[filter as keyof typeof filterCounts]})
                    </Button>
                ))}
            </div>
        </div>
        <main className="flex-1 overflow-auto p-6 bg-white rounded-b-2xl">
          <div className="space-y-4">
            {escrowItems.map((item) => (
              <Card key={item.id} className={cn("rounded-2xl shadow-sm p-6", item.status === 'DISPUTED' && 'border-l-4 border-destructive')}>
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                    <div className="mb-4 sm:mb-0">
                        <div className="flex items-center mb-2 flex-wrap">
                            <h3 className="text-lg font-bold mr-3">{`ESC-${item.id}`}</h3>
                            <Badge className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusBadge(item.status || ''))}>
                                {item.status}
                            </Badge>
                            {item.status === 'DISPUTED' && (
                                <Badge className="ml-2 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                                    CRITICAL
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm mb-1 text-muted-foreground">
                            <strong>Customer:</strong> {item.customerName} → <strong>Merchant:</strong> {item.merchantName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Order #{item.orderId}
                        </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                        <p className="text-xl font-bold">₦{item.amount}</p>
                        <p className="text-xs text-muted-foreground">
                            Held since {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        {item.status === 'DISPUTED' && <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> Evidence: 4 files</span>}
                        {item.status === 'ACTIVE' && <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> Delivered successfully</span>}
                        {item.status === 'PENDING_RELEASE' && <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> 7-day period complete</span>}
                        {item.status === 'RELEASED' && <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> Transaction completed</span>}

                        <span className="flex items-center"><Hourglass className="w-3 h-3 mr-1" /> Auto-release in: 4 days</span>
                        <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> Last activity: 30 min ago</span>
                    </div>
                     <div className="flex space-x-2">
                        {item.status === 'DISPUTED' && (
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="rounded-full text-sm">Resolve Dispute</Button>
                            </DialogTrigger>
                        )}
                        {item.status === 'ACTIVE' && <>
                            <Button className="bg-success hover:bg-success/90 text-success-foreground rounded-full text-sm">Release Early</Button>
                            <Button variant="outline" className="rounded-full text-sm">View Details</Button>
                        </>}
                        {item.status === 'PENDING_RELEASE' && <>
                             <Button className="bg-success hover:bg-success/90 text-success-foreground rounded-full text-sm">Release Funds</Button>
                             <Button variant="outline" className="rounded-full text-sm">View Details</Button>
                        </>}
                         {item.status === 'RELEASED' && (
                             <Button variant="outline" className="rounded-full text-sm text-muted-foreground">View Archive</Button>
                         )}
                    </div>
                </div>
              </Card>
            ))}
            <div className="text-center mt-8">
                <Button variant="outline" className="rounded-full">Load More Transactions</Button>
            </div>
          </div>
        </main>
      </div>
      <DisputeModal />
    </Dialog>
  );
}

    