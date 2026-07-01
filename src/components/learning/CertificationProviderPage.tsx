"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  type CertificationProviderId,
  getCertificationProvider,
} from "@/data/certifications";

export function CertificationProviderPage({
  providerId,
}: {
  providerId: CertificationProviderId;
}) {
  const provider = getCertificationProvider(providerId);

  if (!provider) return null;

  const Icon = provider.icon;

  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <Button asChild variant="outline" className="mb-8 rounded-full border-white/10">
            <Link href="/learning">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning Hub
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 rounded-lg border border-white/10 bg-card/35 p-8 backdrop-blur-xl"
          >
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
              <Award className="mr-2 h-3.5 w-3.5" />
              Certification Provider
            </Badge>
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-5xl font-headline leading-tight tracking-normal">
                  {provider.title} <span className="gradient-text">Certifications</span>
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                  {provider.description}
                </p>
              </div>
            </div>
          </motion.div>

          {provider.lessons.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {provider.lessons.map((lesson, index) => (
                <motion.article
                  key={lesson.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                      {lesson.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-headline font-bold">{lesson.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{lesson.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {lesson.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-background/60 px-3 py-1 font-code text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button asChild className="mt-8 rounded-full">
                    <Link href={lesson.href}>
                      Start Lesson
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.article>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-white/10 bg-card/35 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Coming Soon</p>
                <h2 className="mt-3 text-2xl font-headline">Lessons are being prepared</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                  This provider is ready in the certification hub. Lessons can be added here as the certification track grows.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
