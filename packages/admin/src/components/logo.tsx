
import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">BP</span>
      </div>
      <span className="font-bold text-lg">Admin</span>
    </div>
  );
}
import { Shield } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="p-2 bg-primary rounded-lg">
        <Shield className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-primary">Admin</span>
    </div>
  );
}
