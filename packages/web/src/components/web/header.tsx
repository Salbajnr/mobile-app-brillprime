
import { WebLogo } from './web-logo';

export function WebHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <WebLogo />
      </div>
    </header>
  );
}
