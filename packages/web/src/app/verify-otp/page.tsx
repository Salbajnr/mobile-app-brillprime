
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputOTP } from '@/components/ui/input-otp';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = () => {
    // In a real app, you would verify the OTP against your backend.
    toast({
      title: 'Success!',
      description: 'Your email has been verified.',
    });
    router.push('/signin'); // or to a 'create profile' page
  };

  const handleResend = () => {
    setOtp('');
    toast({
      title: 'Code Sent',
      description: 'A new verification code has been sent to your email.',
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Verify it's you
          </h1>
        </div>

        <div className="my-12 flex justify-center">
          <InputOTP
            maxLength={5}
            value={otp}
            onChange={(value) => setOtp(value)}
          />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            A verification code has been sent to
          </p>
          <p className="font-bold text-[hsl(var(--foreground))]">
            username@email.com
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={otp.length < 5}
          className="my-8 w-full rounded-full py-6 text-lg"
        >
          Submit
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Didn't get code? </span>
          <Button variant="link" className="p-0 h-auto" onClick={handleResend}>
            Resend
          </Button>
        </div>
      </div>
    </div>
  );
}
