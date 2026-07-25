
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Globe, ShieldCheck, ShoppingCart, Sparkles, Users, Zap } from "lucide-react";

const projectsPerPage = 3;

const projects = [
  {
    id: "mattress-firm",
    title: "Mattress Firm Headless Commerce Migration",
    role: "Lead Frontend Developer · 2024–2025",
    description: "Led the buy-side migration from Microsoft Dynamics 365 Commerce to a Next.js 14 storefront—rebuilding cart, checkout, customer information, delivery, payments, and express checkout for a production retail platform.",
    tags: ["Next.js 14", "D365 Commerce", "Headless", "Edgio", "Vercel"],
    metrics: [
      { label: "Scope", value: "End-to-end checkout", icon: Users },
      { label: "Launch", value: "Edgio → Vercel", icon: Globe }
    ],
   image: "/projects/mattress-firm.webp"
  },
  {
    id: "affirm",
    title: "Payments & Financing Modernization",
    role: "Strategic Integration Lead · 2023–2025",
    description: "Delivered a portfolio of revenue-focused payment experiences: Affirm Buy Now, Pay Later, Progressive Leasing, PayPal Express, and Apple Pay Express—making checkout faster and giving customers more ways to pay.",
    tags: ["Affirm", "Progressive Leasing", "PayPal", "Apple Pay", "Checkout"],
    metrics: [
      { label: "Affirm impact", value: "#3 by order volume", icon: Zap },
      { label: "Delivery", value: "Production launches", icon: ShieldCheck }
    ],
     image: "/projects/affirm.png"
  },
  {
    id: "dynamics",
    title: "Dynamics 365 Commerce Replatforming",
    role: "Dynamics 365 Commerce Consultant · 2021–2023",
    description: "Modernized a large retail storefront during its Salesforce-to-Dynamics 365 Commerce migration. Rebuilt PLP, PDP, home, and the complete checkout flow in React, with reusable CMS capabilities and CRT API integrations.",
    tags: ["Dynamics 365", "React", "CRT APIs", "Commerce CMS"],
    metrics: [
      { label: "Modules", value: "Browse to order confirmation", icon: Globe },
      { label: "Approach", value: "Reusable commerce UI", icon: Zap }
    ],
    image: "/projects/dynamics.png"
  },
  {
    id: "checkout-optimization",
    title: "Checkout Conversion Experience",
    role: "Principal Consultant · 2025",
    description: "Simplified the purchase path by combining customer information and delivery selection, while introducing warranty extensions and contextual cart cross-sell recommendations that keep shoppers moving toward purchase.",
    tags: ["Checkout UX", "Cross-Sell", "Warranty", "Conversion"],
    metrics: [
      { label: "Experience", value: "Fewer checkout steps", icon: ShoppingCart },
      { label: "Value", value: "Relevant add-ons", icon: Sparkles }
    ],
    image: "/projects/checkout-conversion.png"
  },
  {
    id: "commerce-reliability",
    title: "Commerce Reliability & Observability",
    role: "Principal Consultant · 2025",
    description: "Strengthened critical commerce operations with Datadog API monitoring and alerting, plus Buy Synchrony data-sharing improvements that made production behavior easier to observe and resolve proactively.",
    tags: ["Datadog", "API Monitoring", "Synchrony", "Production Support"],
    metrics: [
      { label: "Visibility", value: "API health alerts", icon: ShieldCheck },
      { label: "Focus", value: "Proactive response", icon: Zap }
    ],
    image: "/projects/dynamics.png"
  },
  {
    id: "cart-promotion",
    title: "Cart & Promotion Optimization",
    role: "Principal Consultant · 2025",
    description: "Improved cart performance and shopper confidence through fast promo-code application, prioritized cross-sell placement, and clear add-to-cart notifications—small details that create a more polished retail journey.",
    tags: ["Cart", "Promotions", "Merchandising", "UX"],
    metrics: [
      { label: "Promo flow", value: "Fast application", icon: Zap },
      { label: "Merchandising", value: "Top-of-cart cross-sell", icon: ShoppingCart }
    ],
    image: "/projects/home1.png"
  }
];

export function Projects() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(projects.length / projectsPerPage);
  const visibleProjects = projects.slice(currentPage * projectsPerPage, (currentPage + 1) * projectsPerPage);

  return (
    <section id="projects" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Selected Work</Badge>
            <h2 className="text-4xl lg:text-5xl font-headline leading-tight">Enterprise Case Study Vault</h2>
            <p className="text-muted-foreground text-lg">
              Selected enterprise engagements across commerce replatforming, checkout modernization, and payment innovation.
            </p>
          </div>
        </div>

        <div className="grid gap-8" aria-live="polite">
          {visibleProjects.map((project, idx) => (
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

        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border/60 bg-card/40 px-5 py-4 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{currentPage * projectsPerPage + 1}–{Math.min((currentPage + 1) * projectsPerPage, projects.length)}</span> of <span className="font-semibold text-foreground">{projects.length}</span> case studies
          </p>
          <nav className="flex items-center gap-2" aria-label="Case study pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              disabled={currentPage === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous case studies"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition-all ${currentPage === page ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
                aria-label={`Show case study page ${page + 1}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(page + 1, pageCount - 1))}
              disabled={currentPage === pageCount - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next case studies"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
}
