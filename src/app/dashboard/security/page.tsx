import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center rounded-2xl shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-red-100 rounded-full p-4 w-fit">
            <ShieldCheck className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">
            Security & Fraud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is under construction. The security and fraud management
            dashboard will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
