import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { CertificationProviderPage } from "@/components/learning/CertificationProviderPage";
import { Navbar } from "@/components/Navbar";
import {
  certificationProviders,
  getCertificationProvider,
} from "@/data/certifications";

type PageProps = {
  params: Promise<{
    provider: string;
  }>;
};

export function generateStaticParams() {
  return certificationProviders.map((provider) => ({
    provider: provider.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provider: providerId } = await params;
  const provider = getCertificationProvider(providerId);

  if (!provider) {
    return {
      title: "Certification Provider Not Found | Developer Learning Hub",
    };
  }

  return {
    title: `${provider.title} Certifications | Developer Learning Hub`,
    description: provider.description,
  };
}

export default async function CertificationProviderRoute({ params }: PageProps) {
  const { provider: providerId } = await params;
  const provider = getCertificationProvider(providerId);

  if (!provider) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <CertificationProviderPage providerId={provider.id} />
      <Footer />
    </main>
  );
}
