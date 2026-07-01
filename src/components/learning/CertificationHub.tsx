"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { certificationProviders, type CertificationProvider } from "@/data/certifications";

function ProviderCard({ provider, index }: { provider: CertificationProvider; index: number }) {
  const Icon = provider.icon;
  const availableLessons = provider.lessons.filter((lesson) => lesson.available).length;

  return (
    <Link href={provider.href} className="block h-full">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="group flex h-full flex-col justify-between rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/5"
      >
        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              {availableLessons ? `${availableLessons} lesson` : "Coming soon"}
            </Badge>
          </div>
          <h3 className="text-2xl font-headline font-bold leading-tight">{provider.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{provider.description}</p>
        </div>
        <Button className="mt-8 w-fit rounded-full font-semibold group-hover:scale-[1.02]">
          View Path
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.article>
    </Link>
  );
}

export function CertificationHub() {
  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-white/10 bg-card/35 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold">Certifications</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Guided certification paths for AWS, Microsoft, Azure, Anthropic, and Google with lesson-by-lesson preparation.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">
            Certification tracks
          </Badge>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {certificationProviders.map((provider, index) => (
          <ProviderCard key={provider.id} provider={provider} index={index} />
        ))}
      </div>

      <Card className="border-dashed border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-semibold">Start here</p>
            </div>
            <h3 className="text-xl font-headline">AWS Cloud Practitioner</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Begin with cloud fundamentals before moving into individual AWS services.
            </p>
          </div>
          <Button asChild className="w-fit rounded-full">
            <Link href="/learning/certifications/aws/cloud-practitioner">
              <Clock className="mr-2 h-4 w-4" />
              Start Lesson
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
