import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AwsCloudPractitionerLesson } from "@/components/learning/AwsCloudPractitionerLesson";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AWS Cloud Practitioner Roadmap | Developer Learning Hub",
  description:
    "AWS Cloud Practitioner certification roadmap for the Developer Learning Hub.",
};

export default function AwsCloudPractitionerPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AwsCloudPractitionerLesson />
      <Footer />
    </main>
  );
}
