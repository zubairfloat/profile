
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

type NavLink = {
  name: string;
  sectionId?: string;
  href?: string;
};

const navLinks: NavLink[] = [
  { name: 'Experience', sectionId: 'experience' },
  { name: 'Projects', sectionId: 'projects' },
  { name: 'Learning', sectionId: 'learning-hub', href: '/learning' },
  { name: 'AI Resume Studio', href: '/resume-builder' },
  { name: 'Skills', sectionId: 'skills' },
  { name: 'Contact', sectionId: 'contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isHomePage) return;

      const currentSection = navLinks
        .filter((link) => link.sectionId)
        .map((link) => link.sectionId as string)
        .findLast((sectionId) => {
          const element = document.getElementById(sectionId);
          if (!element) return false;
          return element.getBoundingClientRect().top <= 140;
        });

      setActiveSection(currentSection ?? "");
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  function getHref(link: NavLink) {
    if (link.name === "Learning" && !isHomePage) return link.href ?? "/learning";
    if (!link.sectionId) return link.href ?? "/";
    return isHomePage ? `#${link.sectionId}` : `/#${link.sectionId}`;
  }

  function isActive(link: NavLink) {
    if (link.name === "Learning" && pathname.startsWith("/learning")) return true;
    if (link.name === "AI Resume Studio" && pathname.startsWith("/resume-builder")) return true;
    return isHomePage && activeSection === link.sectionId;
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.pushState(null, "", `#${sectionId}`);
    setActiveSection(sectionId);
  }

  function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>, link: NavLink) {
    setIsMobileMenuOpen(false);

    if (!isHomePage || !link.sectionId) return;

    event.preventDefault();
    scrollToSection(link.sectionId);
  }

  function handleConsultClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setIsMobileMenuOpen(false);

    if (!isHomePage) return;

    event.preventDefault();
    scrollToSection("contact");
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
      isScrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center font-bold text-primary-foreground group-hover:scale-110 transition-transform">
            ZR
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">Zubair Rizwan</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name} 
              href={getHref(link)}
              onClick={(event) => handleLinkClick(event, link)}
              aria-current={isActive(link) ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link) ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground px-6">
            <Link href={isHomePage ? "#contact" : "/#contact"} onClick={handleConsultClick}>
              Consult Now
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 space-y-4 flex flex-col items-center shadow-sm animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name} 
              href={getHref(link)}
              onClick={(event) => handleLinkClick(event, link)}
              aria-current={isActive(link) ? "page" : undefined}
              className={cn(
                "text-lg font-medium transition-colors",
                isActive(link) ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="w-full rounded-full">
            <Link href={isHomePage ? "#contact" : "/#contact"} onClick={handleConsultClick}>
              Consult Now
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
