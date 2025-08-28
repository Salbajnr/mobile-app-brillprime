
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/logo';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding === 'true') {
        router.push('/web');
      } else {
        router.push('/onboarding');
      }
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Logo with effects */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
            <Image
                src="/images/logo.png"
                alt="BrillPrime Logo"
                width={192}
                height={192}
                className="object-contain animate-bounce"
                style={{ animationDuration: '2s' }}
                data-ai-hint="logo"
            />
        </div>

        {/* Loading animation */}
        <div className="mt-8 flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
