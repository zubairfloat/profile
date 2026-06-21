import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LearningHub } from "@/components/learning/LearningHub";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Developer Learning Hub | Muhammad Zubair Rizwan",
  description:
    "Interactive visual explanations of JavaScript, React, Next.js, System Design, AI, and Enterprise Commerce concepts.",
};

export default function LearningPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <LearningHub />
      <Footer />
    </main>
  );
}
