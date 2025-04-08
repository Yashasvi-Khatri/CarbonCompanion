
import React from 'react';
import { Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <span className="flex items-center justify-center md:justify-start gap-1">
            <Leaf className="h-3 w-3 text-green-500" />
            Built with 💚 for a greener future
          </span>
        </p>
        <p className="text-center text-xs text-muted-foreground md:text-right">
          2025 Carbon Companion • <a href="#" className="underline underline-offset-4 hover:text-primary">ByteBois</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
