"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificationHub } from "@/components/learning/CertificationHub";
import {
  getConceptsByCategory,
  learningCategories,
  type LearningConcept,
} from "@/data/learning-concepts";
import { cn } from "@/lib/utils";

function ConceptCard({ concept, index }: { concept: LearningConcept; index: number }) {
  const awsNestedRoutes: Partial<Record<string, string>> = {
    "aws-ec2": "/learning/aws/ec2",
    "aws-iam": "/learning/aws/iam",
  };
  const href = awsNestedRoutes[concept.id] ?? `/learning/${concept.slug}`;
  const card = (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group flex h-full flex-col justify-between rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl transition-all",
        concept.available
          ? "hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/5"
          : "opacity-75"
      )}
    >
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary"
          >
            {concept.difficulty}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {concept.readTime}
          </span>
        </div>
        <h3 className="text-2xl font-headline font-bold leading-tight">
          {concept.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {concept.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {concept.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-background/60 px-3 py-1 font-code text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {concept.available ? (
          <Button className="rounded-full font-semibold group-hover:scale-[1.02]">
            Learn Concept
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-secondary/70">
              Coming Soon
            </Badge>
            <Button disabled variant="outline" className="rounded-full border-white/10 font-semibold">
              Coming Soon
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  );

  if (!concept.available) return card;

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}

export function LearningHub() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <div className="absolute left-1/2 top-24 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-4xl text-center"
        >
          <Badge
            variant="outline"
            className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Interactive Learning Platform
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
            Developer <span className="gradient-text">Learning Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Interactive visual explanations of JavaScript, React, Next.js, System Design, AI, Enterprise Commerce, and certification paths.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            A growing collection of technical concepts, visual demonstrations, and real-world engineering patterns learned through enterprise software development.
          </p>
        </motion.div>

        <Tabs defaultValue="javascript" className="space-y-8">
          <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
            {learningCategories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="min-h-12 rounded-md px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {category.title}
                </TabsTrigger>
              );
            })}
            <TabsTrigger
              value="certifications"
              className="min-h-12 rounded-md px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Award className="mr-2 h-4 w-4" />
              Certifications
            </TabsTrigger>
          </TabsList>

          {learningCategories.map((category) => {
            const concepts = getConceptsByCategory(category.id);
            const Icon = category.icon;

            return (
              <TabsContent key={category.id} value={category.id} className="space-y-8">
                <div className="rounded-lg border border-white/10 bg-card/35 p-6 backdrop-blur-xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-headline font-bold">
                          {category.title}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">
                      {concepts.length ? `${concepts.length} concepts` : "Coming Soon"}
                    </Badge>
                  </div>
                </div>

                {concepts.length ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {concepts.map((concept, index) => (
                      <ConceptCard key={concept.id} concept={concept} index={index} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-white/10 bg-card/35 backdrop-blur-xl">
                    <CardContent className="p-12 text-center">
                      <p className="text-sm uppercase tracking-widest text-muted-foreground">
                        Coming Soon
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}

          <TabsContent value="certifications" className="space-y-8">
            <CertificationHub />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
