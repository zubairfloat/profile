import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { EventLoopLesson } from "@/components/learning/EventLoopLesson";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "JavaScript Event Loop | Developer Learning Hub",
  description:
    "Interactive visual explanations of how JavaScript handles asynchronous operations, the Event Loop, Call Stack, Web APIs, Promises, and async/await.",
  keywords: ["JavaScript", "Event Loop", "Async", "Promise", "Async/Await", "Runtime"],
};

export default function EventLoopPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <EventLoopLesson />
      <Footer />
    </main>
  );
}
