'use client';

import { BrainCircuit, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-auto animate-in fade-in-50 duration-500">
      <div className="container mx-auto max-w-screen-2xl rounded-t-2xl border-t border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6 md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span className="font-semibold">FlashLearn</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Feedback
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span>Built with Next.js & Genkit</span>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground/80">
          © {new Date().getFullYear()} FlashLearn Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
