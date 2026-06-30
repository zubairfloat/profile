import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AwsIamLesson } from "@/components/learning/AwsIamLesson";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "IAM (Identity and Access Management) | Developer Learning Hub",
  description:
    "Learn AWS IAM through interactive visualizations covering users, groups, roles, policies, MFA, temporary credentials, and permission evaluation.",
};

export default function AwsIamPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AwsIamLesson />
      <Footer />
    </main>
  );
}
