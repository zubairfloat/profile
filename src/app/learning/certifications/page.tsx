import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CertificationHub } from "@/components/learning/CertificationHub";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Certification Learning Paths | Developer Learning Hub",
  description:
    "Certification learning paths for AWS, Microsoft, Azure, Anthropic, and Google.",
};

export default function CertificationsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 hero-gradient -z-10" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <CertificationHub />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
