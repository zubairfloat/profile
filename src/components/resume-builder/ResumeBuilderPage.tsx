"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, EyeOff, FileText, Printer, Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { ResumeStepper } from "./ResumeStepper";
import { ResumeStudioControls } from "./ResumeStudioControls";
import { ResumeStudioOnboarding } from "./ResumeStudioOnboarding";
import { exportResumeToPdf } from "@/lib/pdf-export";
import { useResumeBuilderStore } from "@/store/resume-builder-store";

function getCompletionScore(store: ReturnType<typeof useResumeBuilderStore>) {
  const checks = [
    Boolean(store.personalInfo.fullName && store.personalInfo.jobTitle && store.personalInfo.email),
    Boolean(store.summary.trim()),
    store.experience.length > 0,
    store.skills.some((category) => category.skills.length > 0),
    store.projects.length > 0,
    store.education.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function ResumeBuilderPage() {
  const store = useResumeBuilderStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "preparing" | "ready">("idle");
  const completionScore = useMemo(() => getCompletionScore(store), [store]);

  function handleDownload() {
    setExportStatus("preparing");
    window.setTimeout(() => {
      exportResumeToPdf(store, previewRef.current);
      setExportStatus("ready");
      window.setTimeout(() => setExportStatus("idle"), 2200);
    }, 500);
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      await navigator.share({
        title: "AI Career Resume Studio",
        text: "Generate a professional ATS-ready resume in under 60 seconds.",
        url: window.location.href,
      });
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden pb-20 pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(133,118,237,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(92,140,240,0.16),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.1),transparent_34%)]" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
                <FileText className="mr-2 h-3.5 w-3.5" />
                Premium AI Career Tool
              </Badge>
              <h1 className="max-w-4xl text-5xl font-headline leading-tight tracking-tight lg:text-7xl">
                AI Career Resume <span className="gradient-text">Studio</span>
              </h1>
              <p className="mt-5 max-w-3xl text-2xl font-semibold">
                Generate a professional ATS-ready resume for your dream job in under 60 seconds.
              </p>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                Choose your role, experience, target company, and resume style. The studio generates a complete resume with enterprise projects, quantified achievements, ATS keywords, and interview prep.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setShowPreview((value) => !value)} className="rounded-full border-white/10">
                {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button onClick={handleDownload} className="rounded-full">
                <Download className="mr-2 h-4 w-4" />
                Download Resume PDF
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="rounded-full border-white/10">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleShare} className="rounded-full border-white/10">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </motion.div>

          {exportStatus !== "idle" && (
            <div className="mb-6 rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm font-semibold text-primary">
              {exportStatus === "preparing" ? "Preparing your professional resume..." : "Your resume is ready."}
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-card/45 p-4 text-sm text-muted-foreground backdrop-blur-xl">
            <Save className="h-4 w-4 text-primary" />
            Progress saves automatically in your browser.
            <span className="rounded-full border border-white/10 bg-background/50 px-3 py-1 text-xs font-semibold text-primary">
              Resume Completion: {completionScore}%
            </span>
          </div>

          <div className="mb-6">
            <ResumeStudioOnboarding store={store} onDownload={handleDownload} onOpenEditor={() => setShowEditor(true)} />
          </div>

          <div className="mt-6 grid gap-6 2xl:grid-cols-[320px_minmax(0,0.92fr)_minmax(420px,0.78fr)] 2xl:items-start">
            <aside className="2xl:sticky 2xl:top-24">
              <ResumeStudioControls store={store} />
            </aside>
            <div>
              {showEditor ? (
                <div>
                  <ResumeStepper currentStep={store.currentStep} completionScore={completionScore} onStepChange={store.setCurrentStep} />
                  <div className="mt-6">
                    <ResumeForm store={store} />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-card/45 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                  <h2 className="text-2xl font-bold">Edit only if needed</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    The AI Studio generates professional content first. Open the editor when you want to adjust personal details, rewrite sections, add certifications, or fine-tune skills.
                  </p>
                  <Button onClick={() => setShowEditor(true)} className="mt-5 rounded-full">
                    Open Advanced Editor
                  </Button>
                </div>
              )}
            </div>
            {showPreview && (
              <aside className="xl:sticky xl:top-24">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">Live Resume Preview</h2>
                    <p className="text-sm text-muted-foreground">White background, clean hierarchy, ATS-friendly sections.</p>
                  </div>
                </div>
                <div className="max-h-[calc(100vh-140px)] overflow-auto rounded-lg border border-white/10 bg-card/45 p-3 backdrop-blur-xl">
                  <ResumePreview ref={previewRef} resume={store} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
