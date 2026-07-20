"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, ChevronDown, Database, Globe2, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AwsGlobalInfrastructureLesson } from "@/components/learning/AwsGlobalInfrastructureLesson";
import { Module5Networking } from "@/components/learning/Module5Networking/Module5Networking";
import { Module6Storage } from "@/components/learning/Module6Storage/Module6Storage";

export function AwsCloudPractitionerLesson() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="absolute left-1/2 top-24 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <Button asChild variant="outline" className="mb-8 rounded-full border-white/10">
            <Link href="/learning/certifications/aws">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AWS Certifications
            </Link>
          </Button>

          <div className="mb-12">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
                  <CalendarDays className="mr-2 h-3.5 w-3.5" />
                  Learning Roadmap
                </Badge>
                <h2 className="text-3xl font-headline font-bold">2-4 Week Certification Flow</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Follow this order before going deep into services. The path starts with
                  fundamentals, then moves into core AWS services, security, monitoring,
                  billing, and architecture.
                </p>
              </div>
              <Badge variant="secondary" className="w-fit bg-secondary/70">
                1.5-2 hours per day
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="min-h-[340px] rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
              >
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                  Module 1
                </Badge>
              </motion.div>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.05 }}
                onClick={() => setActiveModule((current) => (current === "module-4" ? null : "module-4"))}
                className={`group min-h-[340px] rounded-lg border bg-card/45 p-6 text-left backdrop-blur-xl transition-colors ${
                  activeModule === "module-4"
                    ? "border-primary/45 bg-primary/10"
                    : "border-white/10 hover:border-primary/35 hover:bg-primary/5"
                }`}
                aria-expanded={activeModule === "module-4"}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Module 4
                  </Badge>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform group-hover:text-primary ${
                      activeModule === "module-4" ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </div>
                <Globe2 className="mb-5 h-8 w-8 text-primary" />
                <h3 className="font-headline text-2xl font-bold">
                  AWS Global Infrastructure
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Region selection, high availability, elasticity, edge locations,
                  CloudFormation, and ways to interact with AWS.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/10 bg-background/60 text-muted-foreground">
                    Extended lesson
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Practice quiz
                  </Badge>
                </div>
              </motion.button>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.1 }}
                onClick={() => setActiveModule((current) => (current === "module-5" ? null : "module-5"))}
                className={`group min-h-[340px] rounded-lg border bg-card/45 p-6 text-left backdrop-blur-xl transition-colors ${
                  activeModule === "module-5"
                    ? "border-primary/45 bg-primary/10"
                    : "border-white/10 hover:border-primary/35 hover:bg-primary/5"
                }`}
                aria-expanded={activeModule === "module-5"}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Module 5
                  </Badge>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform group-hover:text-primary ${
                      activeModule === "module-5" ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </div>
                <Network className="mb-5 h-8 w-8 text-primary" />
                <h3 className="font-headline text-2xl font-bold">
                  AWS Networking and Content Delivery
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  VPCs, subnets, gateways, firewalls, DNS, CloudFront, Global Accelerator,
                  hybrid connectivity, and Cloud Practitioner practice.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/10 bg-background/60 text-muted-foreground">
                    60-90 minutes
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Beginner
                  </Badge>
                </div>
              </motion.button>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 }}
                onClick={() => setActiveModule((current) => (current === "module-6" ? null : "module-6"))}
                className={`group min-h-[340px] rounded-lg border bg-card/45 p-6 text-left backdrop-blur-xl transition-colors ${
                  activeModule === "module-6"
                    ? "border-primary/45 bg-primary/10"
                    : "border-white/10 hover:border-primary/35 hover:bg-primary/5"
                }`}
                aria-expanded={activeModule === "module-6"}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Module 6
                  </Badge>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform group-hover:text-primary ${
                      activeModule === "module-6" ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </div>
                <Database className="mb-5 h-8 w-8 text-primary" />
                <h3 className="font-headline text-2xl font-bold">
                  AWS Storage Services
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  EBS, Instance Store, S3, EFS, FSx, Storage Gateway, Elastic Disaster
                  Recovery, snapshots, and DLM automation.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/10 bg-background/60 text-muted-foreground">
                    Storage
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Exam practice
                  </Badge>
                </div>
              </motion.button>
            </div>
          </div>

          {activeModule === "module-4" ? <AwsGlobalInfrastructureLesson /> : null}
          {activeModule === "module-5" ? <Module5Networking /> : null}
          {activeModule === "module-6" ? <Module6Storage /> : null}
        </div>
      </div>
    </section>
  );
}
