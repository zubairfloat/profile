
"use client"

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { Users, Zap, ShieldCheck, Globe } from "lucide-react";

const projects = [
  {
    id: "mattress-firm",
    title: "Mattress Firm Commerce Platform",
    role: "Lead Frontend Developer",
    description: "Architected a headless commerce solution serving millions of users, migrating from legacy architecture to a modern Next.js 14 platform.",
    tags: ["Next.js", "D365 Commerce", "Headless", "Vercel"],
    metrics: [
      { label: "Scale", value: "Millions of Users", icon: Users },
      { label: "Platform", value: "Enterprise Scale", icon: Globe }
    ],
   image: "/projects/mattress-firm.webp"
  },
  {
    id: "affirm",
    title: "Affirm Payment Integration",
    role: "Strategic Integration Lead",
    description: "Seamlessly integrated Affirm BNPL financing into checkout, becoming a top 3 payment method by order volume within months.",
    tags: ["Payments", "FinTech", "Checkout UX"],
    metrics: [
      { label: "Performance", value: "Top 3 Payment Method", icon: Zap },
      { label: "Impact", value: "High Order Volume", icon: ShieldCheck }
    ],
     image: "/projects/affirm.png"
  },
  {
    id: "dynamics",
    title: "Dynamics 365 Commerce Suite",
    role: "D365 Specialist",
    description: "Developed custom commerce modules and CRT API integrations for Fortune 500 retail chains.",
    tags: ["Dynamics 365", "ERP", "CRT API"],
    metrics: [
      { label: "Type", value: "Enterprise CRM/ERP", icon: Globe },
      { label: "Tech", value: "Modern D365", icon: Zap }
    ],
    image: "/projects/dynamics.png"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Selected Work</Badge>
            <h2 className="text-4xl lg:text-5xl font-headline leading-tight">Enterprise Case Study Vault</h2>
            <p className="text-muted-foreground text-lg">
              High-fidelity project displays showcasing strategic impact on digital commerce at scale.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/30 transition-all">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-[450px] h-64 lg:h-auto overflow-hidden">
                    <Image 
                      src={project.image || "https://picsum.photos/seed/project/800/600"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                  </div>
                  <CardContent className="flex-1 p-8 lg:p-12 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{project.role}</Badge>
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight">{project.title}</h3>
                    </div>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                      {project.metrics.map((metric, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-white/5">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <metric.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{metric.label}</p>
                            <p className="text-sm font-semibold">{metric.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-3 py-1 bg-muted rounded-full text-muted-foreground border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
