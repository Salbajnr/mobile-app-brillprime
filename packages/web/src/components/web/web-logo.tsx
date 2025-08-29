
import Image from 'next/image';

export function WebLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/logo.png"
        alt="BrillPrime Logo"
        width={40}
        height={40}
        className="shrink-0 rounded-full"
        data-ai-hint="logo"
      />
      <span className="text-lg font-bold text-[hsl(var(--foreground))]">BrillPrime</span>
    </div>
  );
}
