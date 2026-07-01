import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AwsEc2Lesson } from "@/components/learning/AwsEc2Lesson";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Amazon EC2 (Elastic Compute Cloud) | Developer Learning Hub",
  description:
    "Learn Amazon EC2 through interactive visualizations covering virtual machines, AMIs, EBS, security groups, key pairs, Auto Scaling, load balancers, pricing, and monitoring.",
};

export default function AwsEc2Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AwsEc2Lesson />
      <Footer />
    </main>
  );
}
