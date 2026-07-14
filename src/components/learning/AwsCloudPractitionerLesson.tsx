"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AwsCloudPractitionerLesson() {
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
