
"use client"

import React from 'react';
import { motion } from "framer-motion";

const projectItems = [
  "Mattress Firm",
  "Affirm BNPL",
  "Progressive Leasing",
  "Dynamics 365 Commerce",
  "Next.js 15",
  "Headless Architecture",
  "Apple Pay Express",
  "PayPal Integration",
  "Salesforce Migration",
  "CRT API Integrations",
  "Synchrony Data Share",
  "Datadog Monitoring",
  "Vercel Deployment",
  "Enterprise React",
  "MERN Stack"
];

export function ProjectBanner() {
  // Duplicate the items for seamless infinite loop
  const duplicatedItems = [...projectItems, ...projectItems, ...projectItems];

  return (
    <div className="relative w-full py-10 bg-secondary/20 border-y border-white/5 overflow-hidden select-none">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div 
        className="flex whitespace-nowrap gap-16 items-center"
        animate={{
          x: [0, -2000]
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-2xl md:text-3xl font-headline font-bold uppercase tracking-tighter text-muted-foreground/40 hover:text-primary transition-colors cursor-default">
              {item}
            </span>
            <div className="h-2 w-2 rounded-full bg-primary/30" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
