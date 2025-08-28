
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, X } from 'lucide-react';
import { requestPasswordReset } from './actions';
import Image from 'next/image';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full rounded-full bg-secondary py-6 text-lg text-white hover:bg-secondary/90"
      disabled={pending}
    >
      {pending ? 'Sending...' : 'Send Reset Link'}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setIsModalOpen(true);
      } else {
        // You could use a toast notification here for errors
        console.error(state.message);
      }
    }
  }, [state]);

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/signin');
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

        <div className="text-center mb-12">
          <h1 className="text-xl font-extrabold text-[rgb(11,26,81)]">
            Reset Password
          </h1>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="h-auto w-full rounded-full py-4 pl-16 pr-4 text-lg placeholder-gray-400"
            />
          </div>

          <div className="pt-4 text-center text-xs font-light">
            <p>A link would be sent to your email</p>
          </div>

          <SubmitButton />
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src="https://picsum.photos/80/80"
                alt="Mailbox"
                width={80}
                height={80}
                className="mb-6 object-contain"
                data-ai-hint="mailbox icon"
              />
              <h2 className="mb-4 text-xl font-extrabold text-[rgb(11,26,81)]">
                Check Your Email
              </h2>
              <p className="mb-6 text-xs font-light leading-relaxed">
                We&apos;ve sent a password reset link to your email.
                <br />
                It&apos;s valid for 24 hours.
              </p>
              <Button
                onClick={() => (window.location.href = 'mailto:')}
                className="rounded-full bg-secondary px-8 py-2 text-sm text-white hover:bg-secondary/90"
              >
                Check email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
