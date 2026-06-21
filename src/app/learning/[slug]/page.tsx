import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { DebounceThrottleLesson } from "@/components/learning/DebounceThrottleLesson";
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

  if (concept.slug !== "debouncing-vs-throttling") {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <DebounceThrottleLesson />
      <Footer />
    </main>
  );
}
