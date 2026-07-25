
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const experiences = [
  {
    company: "Systems Limited",
    period: "2021 – Present",
    roles: [
      {
        title: "Principal Consultant",
        time: "Jan 2025 – Present",
        achievements: [
          "Launched Affirm Buy Now, Pay Later in May 2025; it became the third-highest payment method by order volume.",
          "Shipped warranty extensions, cart cross-sell, and streamlined customer and delivery selection to improve the purchase journey.",
          "Improved Buy Synchrony data sharing and optimized promo-code application for more reliable, low-friction checkout flows.",
          "Introduced Datadog API monitoring and alerting, enabling proactive production issue detection.",
          "Drive peer reviews, front-end architecture decisions, developer onboarding, and technical interviews."
        ]
      },
      {
        title: "Senior Consultant",
        time: "2023 – 2025",
        achievements: [
          "Launched PayPal Express and Apple Pay Express using customized iframe payment modules and order-attribute handling.",
          "Integrated Progressive Leasing from cart messaging through the payment flow, expanding financing options for shoppers.",
          "Led the Mattress Firm buy-side migration to Next.js 14, covering cart, checkout, customer information, delivery, payments, and express checkout.",
          "Completed the headless rollout in early 2025 via Edgio, then led the production deployment migration to Vercel."
        ]
      },
      {
        title: "Consultant Dynamics Commerce",
        time: "2021 – 2023",
        achievements: [
          "Supported the Mattress Firm Salesforce-to-Dynamics 365 Commerce migration, moving the storefront front end to React.",
          "Rebuilt PLP, PDP, and home experiences by extending Dynamics views, overriding data actions, and improving CMS reusability.",
          "Implemented cart through order confirmation, integrating customer, delivery, and payment experiences with CRT APIs.",
          "Delivered complex front-end customizations using business rules, BPFs, and workflows while mentoring junior developers."
        ]
      }
    ]
  },
  {
    company: "OneClout",
    period: "2019 – 2021",
    roles: [
      {
        title: "MERN Stack Developer",
        time: "2019 – 2021",
        achievements: [
          "Built and maintained responsive React and Next.js applications with a focus on reliable user experiences.",
          "Used Redux for predictable state management and optimized MySQL and PostgreSQL queries for application performance.",
          "Integrated external APIs and payment gateways, and connected Node.js services with MongoDB and MySQL data stores.",
          "Partnered with cross-functional teams, reviewed code, and contributed to mentoring and front-end architecture decisions."
        ]
      }
    ]
  },
  {
    company: "Hashlogics",
    period: "2018 – 2019",
    roles: [
      {
        title: "MERN Stack Developer",
        time: "2018 – 2019",
        achievements: [
          "Developed full-stack MERN applications for startups, including attendance, land-record, and e-commerce products.",
          "Created intuitive React interfaces and built the APIs and database foundations needed to support them.",
          "Applied practical UI/UX principles to deliver responsive, user-friendly product experiences."
        ]
      }
    ]
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Career Journey</Badge>
          <h2 className="text-4xl lg:text-5xl font-headline">Professional Experience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Nine years of hands-on leadership across enterprise commerce, payments, platform modernization, and high-performing customer journeys.
          </p>
        </div>

        <div className="relative space-y-12">
          {/* Vertical line for desktop */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border hidden lg:block" />

          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col lg:flex-row items-center gap-8 ${idx % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Timeline marker */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 hidden lg:block" />

              <div className="w-full lg:w-1/2">
                <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-primary/5 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="font-mono text-[10px]">{exp.period}</Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold">{exp.company}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {exp.roles.map((role, rIdx) => (
                      <div key={rIdx} className="space-y-4 relative">
                        {rIdx > 0 && <div className="border-t border-border pt-6" />}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-primary">{role.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Calendar className="h-3 w-3" />
                            {role.time}
                          </div>
                        </div>
                        <ul className="space-y-3">
                          {role.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className="flex gap-3 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="w-full lg:w-1/2 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
