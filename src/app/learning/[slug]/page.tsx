import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { AsyncAwaitLesson } from "@/components/learning/AsyncAwaitLesson";
import { CallStackLesson } from "@/components/learning/CallStackLesson";
import { ClosuresLesson } from "@/components/learning/ClosuresLesson";
import { DebounceThrottleLesson } from "@/components/learning/DebounceThrottleLesson";
import { MemoryManagementLesson } from "@/components/learning/MemoryManagementLesson";
import { PromisesLesson } from "@/components/learning/PromisesLesson";
import { ReactComponentLifecycleLesson } from "@/components/learning/ReactComponentLifecycleLesson";
import { ReactContextApiLesson } from "@/components/learning/ReactContextApiLesson";
import { ReactCustomHooksLesson } from "@/components/learning/ReactCustomHooksLesson";
import { ReactHooksDeepDiveLesson } from "@/components/learning/ReactHooksDeepDiveLesson";
import { ReactPerformanceOptimizationLesson } from "@/components/learning/ReactPerformanceOptimizationLesson";
import { ReactReconciliationLesson } from "@/components/learning/ReactReconciliationLesson";
import { ReactRenderingLesson } from "@/components/learning/ReactRenderingLesson";
import { ReactStateManagementLesson } from "@/components/learning/ReactStateManagementLesson";
import { Navbar } from "@/components/Navbar";
import {
  getLearningConceptBySlug,
  learningConcepts,
} from "@/data/learning-concepts";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return learningConcepts
    .filter((concept) => concept.available)
    .map((concept) => ({
      slug: concept.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getLearningConceptBySlug(slug);

  if (!concept) {
    return {
      title: "Concept Not Found | Developer Learning Hub",
    };
  }

  return {
    title: `${concept.title} | Developer Learning Hub`,
    description: concept.description,
  };
}

export default async function LearningConceptPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = getLearningConceptBySlug(slug);

  if (!concept?.available) {
    notFound();
  }

  const lessonBySlug: Record<string, ComponentType> = {
    "debouncing-vs-throttling": DebounceThrottleLesson,
    "call-stack": CallStackLesson,
    closures: ClosuresLesson,
    promises: PromisesLesson,
    "async-await": AsyncAwaitLesson,
    "component-lifecycle": ReactComponentLifecycleLesson,
    "context-api": ReactContextApiLesson,
    "custom-hooks": ReactCustomHooksLesson,
    "memory-management": MemoryManagementLesson,
    "react-hooks-deep-dive": ReactHooksDeepDiveLesson,
    "react-performance-optimization": ReactPerformanceOptimizationLesson,
    "react-reconciliation": ReactReconciliationLesson,
    "react-rendering": ReactRenderingLesson,
    "state-management": ReactStateManagementLesson,
  };

  const Lesson = lessonBySlug[concept.slug];

  if (!Lesson) notFound();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Lesson />
      <Footer />
    </main>
  );
}
