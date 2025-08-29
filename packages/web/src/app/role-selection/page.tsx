
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WebLogo } from '@/components/web/web-logo';

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    localStorage.setItem('selectedAccountType', role);
    router.push('/signup');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <WebLogo />
        </div>
      </div>

      <div className="px-12 pb-12">
        <div className="mx-auto max-w-md space-y-5">
          <Button
            onClick={() => handleRoleSelect('consumer')}
            className="w-full rounded-full py-6 text-lg"
          >
            Consumer
          </Button>
          <Button
            onClick={() => handleRoleSelect('merchant')}
            className="w-full rounded-full py-6 text-lg"
          >
            Merchant
          </Button>
          <Button
            onClick={() => handleRoleSelect('driver')}
            className="w-full rounded-full py-6 text-lg"
          >
            Driver
          </Button>

          <div className="pt-5 text-center">
            <p className="text-sm font-light text-muted-foreground">
              Make a selection to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
