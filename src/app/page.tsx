
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Stats } from "@/components/sections/Stats";
import { Contact } from "@/components/sections/Contact";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIConsultantChat } from "@/components/AIConsultantChat";
import { ProjectBanner } from "@/components/sections/ProjectBanner";
import { LearningHubPreview } from "@/components/sections/LearningHubPreview";
import { ResumeBuilderCTA } from "@/components/sections/ResumeBuilderCTA";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ScrollReveal><ProjectBanner /></ScrollReveal>
      <ScrollReveal delay={0.05}><Stats /></ScrollReveal>
      <ScrollReveal><ResumeBuilderCTA /></ScrollReveal>
      <ScrollReveal><LearningHubPreview /></ScrollReveal>
      <ScrollReveal><Experience /></ScrollReveal>
      <ScrollReveal><Projects /></ScrollReveal>
      <ScrollReveal><Skills /></ScrollReveal>
      <ScrollReveal><Contact /></ScrollReveal>
      <Footer />
      <AIConsultantChat />
    </main>
  );
}
