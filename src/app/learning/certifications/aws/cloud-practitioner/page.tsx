import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AwsCloudPractitionerLesson } from "@/components/learning/AwsCloudPractitionerLesson";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AWS Cloud Practitioner: Cloud Fundamentals | Developer Learning Hub",
  description:
    "Week 1 AWS Cloud Practitioner lesson covering cloud fundamentals, service models, high availability, scalability, elasticity, fault tolerance, disaster recovery, and shared responsibility.",
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
