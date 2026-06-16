"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ArrowRight,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 sm:pt-0 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse [animation-delay:2s]" />

      <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="px-4 py-1 text-primary border-primary/20 bg-primary/5 rounded-full font-medium"
            >
              Available for Strategic Consulting
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-headline tracking-tighter leading-tight">
              Muhammad <span className="gradient-text">Zubair Rizwan</span>
            </h1>
            <div className="space-y-2">
              <p className="text-xl font-medium text-muted-foreground uppercase tracking-widest text-sm">
                Principal Consultant – Digital Commerce
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold leading-relaxed">
                Building Enterprise-Scale Digital Commerce Experiences.
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              8+ years of expertise delivering high-performance eCommerce
              platforms, headless commerce solutions, and enterprise-grade
              customer experiences with React, Next.js, and Dynamics 365.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground font-semibold px-8 hover:scale-105 transition-transform group"
            >
              <a
                href="/resume/zubair.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
                <FileText className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-primary/20 hover:bg-primary/5 px-8 font-semibold"
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <a
              href="https://www.linkedin.com/in/muhammad-zubair-rizwan-69a355180/"
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/zubairfloat"
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-secondary/50">
                Next.js 15
              </Badge>
              <Badge variant="secondary" className="bg-secondary/50">
                Dynamics 365
              </Badge>
              <Badge variant="secondary" className="bg-secondary/50">
                TypeScript
              </Badge>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-72 lg:w-[450px] lg:h-[450px]">
            {/* Animated badges around image */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 z-20 glass p-4 rounded-2xl flex items-center gap-3 shadow-xl"
            >
              <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Projects Delivered
                </p>
                <p className="font-bold text-lg">50+</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-10 -right-6 z-20 glass p-4 rounded-2xl flex items-center gap-3 shadow-xl"
            >
              <div className="h-10 w-10 bg-accent/20 rounded-xl flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="border-accent/40 text-accent font-bold"
                >
                  D365
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enterprise Exp.</p>
                <p className="font-bold text-lg">8+ Years</p>
              </div>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl -rotate-6 scale-95" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl rotate-3 scale-100 border border-white/10" />

            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/zubair.jpeg"
                alt="Muhammad Zubair Rizwan"
                fill
                className="object-cover hover:grayscale-0 transition-all duration-700"
                data-ai-hint="professional headshot"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
