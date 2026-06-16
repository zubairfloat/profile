
"use client"

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code2, 
  Layers, 
  Database, 
  ShoppingCart, 
  CreditCard, 
  Cloud 
} from "lucide-react";
import { motion } from "framer-motion";

const skills = [
  {
    category: "Frontend Excellence",
    icon: Code2,
    items: ["React.js", "Next.js", "TypeScript", "JavaScript ES6+", "Redux", "React Query", "Tailwind CSS", "Ant Design", "Framer Motion"]
  },
  {
    category: "Backend & APIs",
    icon: Layers,
    items: ["Node.js", "Express.js", "REST APIs", "GraphQL", "CRT API", "Microservices"]
  },
  {
    category: "Data Strategy",
    icon: Database,
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Database Optimization"]
  },
  {
    category: "Digital Commerce",
    icon: ShoppingCart,
    items: ["Dynamics 365 Commerce", "Headless Commerce", "Salesforce Migration", "Adobe Commerce", "Checkout Optimization"]
  },
  {
    category: "Payment Systems",
    icon: CreditCard,
    items: ["Affirm Integration", "PayPal Express", "Apple Pay", "Progressive Leasing", "Synchrony", "Security Compliance"]
  },
  {
    category: "Cloud & DevSecOps",
    icon: Cloud,
    items: ["Vercel", "Datadog Monitoring", "GitHub Actions", "CI/CD Pipelines", "Azure DevOps", "Performance Auditing"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest">Tech Stack Matrix</Badge>
          <h2 className="text-4xl lg:text-5xl font-headline tracking-tighter">Strategic Tech Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A specialized toolkit optimized for delivering enterprise-grade digital experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-full bg-card/40 border-border/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <skill.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{skill.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map(item => (
                      <Badge 
                        key={item} 
                        variant="secondary" 
                        className="bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                      >
                        {item}
                      </Badge>
                    ))}
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
