'use client';
import { useEffect, useState } from 'react';
import {
  getTicketDetails,
  addTicketResponse,
  updateTicketStatus,
} from '../actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Paperclip,
  Send,
  User,
  Shield,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TicketDetails = NonNullable<Awaited<ReturnType<typeof getTicketDetails>>>;

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

export default function TicketDetailsPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const [details, setDetails] = useState<TicketDetails | { error: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const ticketId = Number(params.ticketId);

  async function fetchDetails() {
    const result = await getTicketDetails(ticketId);
    setDetails(result);
  }

  useEffect(() => {
    fetchDetails();
  }, [ticketId]);

  const handleAddResponse = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append('ticketId', String(ticketId));
    const result = await addTicketResponse(formData);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      await fetchDetails(); // Refresh details
      // Reset the form manually
      const form = document.getElementById('response-form') as HTMLFormElement;
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };
  
  const handleStatusChange = async (newStatus: string) => {
    const formData = new FormData();
    formData.append('ticketId', String(ticketId));
    formData.append('status', newStatus);
    const result = await updateTicketStatus(formData);
    if(result.success) {
      toast({ title: 'Success', description: result.message });
      await fetchDetails();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  }

  if (!details) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if ('error' in details) {
    return (
      <div className="text-center text-red-500">
        <p>{details.error}</p>
        <Button asChild variant="link">
          <Link href="/admin/support">Go back</Link>
        </Button>
      </div>
    );
  }

  const { ticket, responses } = details;

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="icon">
                <Link href="/admin/support"><ArrowLeft /></Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                <p className="text-muted-foreground">Ticket #{ticket.ticketNumber}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 flex-1">
            <div className="md:col-span-2 flex flex-col gap-6">
                <Card className="rounded-2xl flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Conversation History</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-6 p-6">
                        {/* Initial ticket message */}
                         <div className="flex items-start gap-4">
                             <Avatar>
                                <AvatarImage src={ticket.user?.profilePicture || undefined} />
                                <AvatarFallback>{ticket.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="p-4 bg-muted rounded-r-xl rounded-bl-xl">
                                    <p className="text-sm font-bold">{ticket.name} <span className="text-xs text-muted-foreground font-normal">• {new Date(ticket.createdAt!).toLocaleString()}</span></p>
                                    <p className="text-sm">{ticket.message}</p>
                                </div>
                            </div>
                        </div>

                        {/* Responses */}
                        {responses.map(response => (
                             <div key={response.id} className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={response.responder?.profilePicture || undefined} />
                                    <AvatarFallback>{response.responder?.fullName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                     <div className={`p-4 rounded-r-xl rounded-bl-xl ${response.responderType === 'ADMIN' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm font-bold">{response.responder?.fullName} <span className={`text-xs ${response.responderType === 'ADMIN' ? 'text-primary-foreground/80' : 'text-muted-foreground'} font-normal`}>• {new Date(response.createdAt).toLocaleString()}</span></p>
                                        <p className="text-sm">{response.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="border-t p-4">
                        <form id="response-form" action={handleAddResponse} className="flex items-center gap-2 w-full">
                            <Textarea name="message" placeholder="Type your response here..." className="flex-1 rounded-full" required />
                             <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Ticket Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">Status</span>
                             <Select value={ticket.status!} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-[180px] rounded-full">
                                    <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">Priority</span>
                            <Badge variant={getPriorityBadgeVariant(ticket.priority || 'NORMAL') as any}>
                                {ticket.priority}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">Created</span>
                            <span className="font-medium text-sm">{new Date(ticket.createdAt!).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">Last Update</span>
                            <span className="font-medium text-sm">{new Date(ticket.updatedAt!).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Customer Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={ticket.user?.profilePicture || undefined} />
                                <AvatarFallback>{ticket.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{ticket.name}</p>
                                <p className="text-sm text-muted-foreground">{ticket.email}</p>
                            </div>
                        </div>
                         <Button variant="outline" className="w-full rounded-full">View User Profile</Button>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle>Assigned Agent</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {ticket.assignedToUser ? (
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={ticket.assignedToUser.profilePicture || undefined} />
                                    <AvatarFallback>{ticket.assignedToUser.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{ticket.assignedToUser.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{ticket.assignedToUser.email}</p>
                                </div>
                            </div>
                         ) : <p className="text-sm text-muted-foreground">Not assigned</p>}
                         <Button variant="secondary" className="w-full rounded-full mt-4">
                           {ticket.assignedToUser ? 'Re-assign' : 'Assign to Agent'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
