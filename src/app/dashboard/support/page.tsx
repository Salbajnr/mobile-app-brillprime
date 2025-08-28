import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center rounded-2xl shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
            <Ticket className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">
            Support & Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is under construction. Soon you'll be able to manage all
            customer support tickets here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
