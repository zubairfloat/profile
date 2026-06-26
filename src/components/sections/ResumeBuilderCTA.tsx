"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ResumeBuilderCTA() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-white/10 bg-card/45 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Free Career Tool
              </Badge>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold lg:text-4xl">AI Career Resume Studio</h2>
              </div>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Generate a professional ATS-ready resume for your dream job in under 60 seconds.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 font-semibold">
              <Link href="/resume-builder">
                Generate My Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
