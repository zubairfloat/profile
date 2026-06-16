
import React from 'react';
import { Linkedin, Github, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center font-bold text-xs text-primary-foreground">
                ZR
              </div>
              <span className="font-headline font-bold text-xl tracking-tighter">Muhammad Zubair Rizwan</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Principal Consultant – Digital Commerce. Building high-performance enterprise experiences with React, Next.js, and Dynamics 365.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Muhammad Zubair Rizwan. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
              Built with Next.js 15 <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
