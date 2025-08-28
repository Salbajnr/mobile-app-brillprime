import { WebHeader } from '@/components/web/header';
import { WebFooter } from '@/components/web/footer';

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <WebHeader />
      <main className="flex-1">{children}</main>
      <WebFooter />
    </div>
  );
}
