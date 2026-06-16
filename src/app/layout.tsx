
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Muhammad Zubair Rizwan | Principal Consultant Digital Commerce',
  description: 'Building Enterprise-Scale Digital Commerce Experiences with React, Next.js, Dynamics 365, and Modern JavaScript Ecosystems.',
  openGraph: {
    title: 'Muhammad Zubair Rizwan | Digital Commerce Expert',
    description: '8+ years of experience delivering high-performance eCommerce platforms and headless solutions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Muhammad Zubair Rizwan",
              "jobTitle": "Principal Consultant - Digital Commerce",
              "url": "https://zubairrizwan.dev",
              "sameAs": [
                "https://github.com/zubairrizwan",
                "https://linkedin.com/in/zubairrizwan"
              ]
            }),
          }}
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
