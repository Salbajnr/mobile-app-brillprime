import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, isCollapsed = false }: { className?: string, isCollapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/images/logo.png"
        alt="BrillPrime Logo"
        width={40}
        height={40}
        className="shrink-0"
      />
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-[hsl(var(--foreground))]">Brill Prime</span>
          <span className="text-xs text-muted-foreground">Admin Panel</span>
        </div>
      )}
    </div>
  );
}
