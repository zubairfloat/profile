
"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, MessageSquare, Send, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest">Let's Connect</Badge>
                <h2 className="text-4xl lg:text-6xl font-headline tracking-tighter">Strategic Consultation</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Looking to scale your digital commerce operations or migrate to Dynamics 365? 
                  Let's discuss how we can build high-performance experiences for your users.
                </p>
              </div>

              <div className="space-y-6">
                <a href="mailto:contact@zubairrizwan.dev" className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Email</p>
                    <p className="text-lg font-bold">contact@zubairrizwan.dev</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn Message</p>
                    <p className="text-lg font-bold">@zubairrizwan</p>
                  </div>
                </div>

                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-primary/20 hover:bg-primary/5 group">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a Consultation (Calendly)
                </Button>
              </div>

              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold">Send a Message</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <Input placeholder="John Doe" className="bg-background/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <Input placeholder="john@company.com" className="bg-background/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Subject</label>
                      <Input placeholder="Strategic Project Inquiry" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Message</label>
                      <Textarea placeholder="Tell me about your project or goals..." className="min-h-[150px] bg-background/50" />
                    </div>
                    <Button className="w-full rounded-xl bg-primary text-primary-foreground h-12 text-lg font-bold group">
                      Send Inquiry
                      <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
