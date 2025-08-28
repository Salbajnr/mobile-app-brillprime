import { cn } from '@/lib/utils';

export function Logo({ className, isCollapsed = false }: { className?: string, isCollapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--foreground))]">
        <span className="text-lg font-bold text-background">BP</span>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-[hsl(var(--foreground))]">Brill Prime</span>
          <span className="text-xs text-muted-foreground">Admin Panel</span>
        </div>
      )}
    </div>
  );
}
