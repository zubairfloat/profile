"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ArrowRight,
  Github,
  Linkedin,
  ExternalLink,
  GraduationCap,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

const heroContentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 sm:pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl -z-10"
        animate={{ x: [0, 35, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10"
        animate={{ x: [0, -30, 0], y: [0, 18, 0], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <div className="absolute left-1/2 top-24 h-px w-[82vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={heroContentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={heroItemVariants} className="space-y-4">
            <Badge
              variant="outline"
              className="px-4 py-1 text-primary border-primary/20 bg-primary/5 rounded-full font-medium"
            >
              Senior Full Stack JavaScript Developer
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-headline tracking-normal leading-tight">
              Muhammad <span className="gradient-text">Zubair Rizwan</span>
            </h1>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                Principal Consultant · Technical Educator · Architecture Enthusiast
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold leading-relaxed">
                Building Enterprise Applications & Teaching Software Engineering Through Interactive Learning Experiences.
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              9+ years of professional engineering experience delivering high-performance
              commerce platforms, modern web applications, and visual learning systems
              with JavaScript, React, Next.js, TypeScript, and Dynamics 365.
            </p>
          </motion.div>

          <motion.div variants={heroItemVariants} className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground font-semibold px-8 hover:scale-105 transition-transform group"
            >
              <Link href="/learning">
                Explore Learning Hub
                <GraduationCap className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-primary/20 hover:bg-primary/5 px-8 font-semibold"
            >
              <a href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/10 hover:bg-secondary/60 px-8 font-semibold"
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
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/10 hover:bg-secondary/60 px-8 font-semibold"
            >
              <a href="#contact">
                Contact Me
                <Mail className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div variants={heroItemVariants} className="flex items-center gap-6 pt-4">
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
          </motion.div>
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
                  Concepts Explained
                </p>
                <p className="font-bold text-lg">25+</p>
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
                <p className="font-bold text-lg">9+ Years</p>
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
