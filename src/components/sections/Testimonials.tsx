
"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Engineering Manager",
    company: "Fortune 500 Retailer",
    content: "Zubair's expertise in headless commerce and Next.js was pivotal in our platform's success. He has a rare ability to bridge high-level architecture with deep technical implementation."
  },
  {
    name: "Sarah Chen",
    role: "Product Owner",
    company: "Systems Limited",
    content: "As a Principal Consultant, Rizwan brings immense strategic value. His leadership during the Mattress Firm migration saved us months of development time and ensured a flawless launch."
  },
  {
    name: "James Wilson",
    role: "Commerce Architect",
    company: "Global Tech Solutions",
    content: "The integration of complex payment systems like Affirm was handled with surgical precision. Rizwan understands the nuances of enterprise digital commerce better than anyone I've worked with."
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest">Endorsements</Badge>
          <h2 className="text-4xl lg:text-5xl font-headline tracking-tighter">Strategic Impact & Leadership</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            What industry leaders say about my technical delivery and strategic contributions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full bg-card/40 border-border/50 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="h-24 w-24" />
                </div>
                <CardContent className="p-8 space-y-6 relative">
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-lg text-muted-foreground italic leading-relaxed">
                    "{t.content}"
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="font-bold text-lg">{t.name}</p>
                    <p className="text-sm text-primary font-medium">{t.role}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
