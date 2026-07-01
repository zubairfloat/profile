"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  Calendar,
  Check,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { submitContactInquiry, type ContactActionResult } from "@/app/actions/contact";
import {
  budgetOptions,
  contactSchema,
  serviceOptions,
  timelineOptions,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const draftKey = "contact-form-draft";
const contactEmail = "zubairfloat@gmail.com";
const linkedInUrl = "https://www.linkedin.com/in/muhammad-zubair-rizwan-69a355180/";
const githubUrl = "https://github.com/zubairfloat";
const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#contact";

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  budget: "$1000-5000",
  timeline: "Flexible",
  service: "Next.js",
  subject: "",
  message: "",
  honeypot: "",
  startedAt: Date.now(),
};

function trackContactEvent(event: string, metadata?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("contact_analytics", { detail: { event, metadata } }));
  console.info(`analytics.${event}`, metadata ?? {});
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive">{message}</p>;
}

function ContactOption({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group rounded-lg border border-white/10 bg-card/35 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/5"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </a>
  );
}

function SuccessConfetti({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-2 overflow-hidden">
      {Array.from({ length: 22 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ y: -18, opacity: 1, rotate: 0 }}
          animate={{ y: 120, opacity: 0, rotate: 220 }}
          transition={{ duration: 1.25, delay: index * 0.025 }}
          className={cn(
            "h-2 w-2 rounded-full",
            index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-emerald-400" : "bg-sky-300"
          )}
        />
      ))}
    </div>
  );
}

export function Contact() {
  const [isPending, startTransition] = useTransition();
  const [hasStarted, setHasStarted] = useState(false);
  const [result, setResult] = useState<ContactActionResult | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [buttonSuccess, setButtonSuccess] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = form;
  const messageRegistration = register("message");

  const message = watch("message");
  const service = watch("service");
  const budget = watch("budget");
  const timeline = watch("timeline");
  const isSending = isPending;

  useEffect(() => {
    if (!buttonSuccess) return;
    const timer = window.setTimeout(() => setButtonSuccess(false), 4500);
    return () => window.clearTimeout(timer);
  }, [buttonSuccess]);

  useEffect(() => {
    const stored = window.localStorage.getItem(draftKey);
    if (!stored) return;

    try {
      const draft = JSON.parse(stored) as Partial<ContactFormValues>;
      reset({
        ...defaultValues,
        ...draft,
        honeypot: "",
        startedAt: Date.now(),
      });
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      const { honeypot, startedAt, ...draft } = value;
      void honeypot;
      void startedAt;
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!messageRef.current) return;
    messageRef.current.style.height = "auto";
    messageRef.current.style.height = `${messageRef.current.scrollHeight}px`;
  }, [message]);

  function markStarted() {
    if (hasStarted) return;
    setHasStarted(true);
    setValue("startedAt", Date.now());
    trackContactEvent("Form Started");
  }

  function submit(values: ContactFormValues) {
    trackContactEvent("Form Submitted", {
      service: values.service,
      budget: values.budget,
      timeline: values.timeline,
    });

    startTransition(async () => {
      const response = await submitContactInquiry(values);
      setResult(response);

      if (response.errors) {
        Object.entries(response.errors).forEach(([key, value]) => {
          if (!value) return;
          setError(key as keyof ContactFormValues, { message: value });
        });
      }

      if (response.ok) {
        trackContactEvent("Form Success", {
          service: values.service,
          budget: values.budget,
          timeline: values.timeline,
        });
        setButtonSuccess(true);
        setSuccessOpen(true);
        window.localStorage.removeItem(draftKey);
        reset({ ...defaultValues, startedAt: Date.now() });
        toast({
          title: "Message sent successfully",
          description: "Thanks for reaching out. I will respond within 24 hours.",
        });
        return;
      }

      trackContactEvent("Form Failed", { saved: response.saved });
      toast({
        title: response.saved ? "Message safely saved" : "Message not sent",
        description: response.message,
        variant: response.saved ? "default" : "destructive",
      });
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void handleSubmit(submit)();
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 uppercase tracking-widest text-primary">
                    Let's Connect
                  </Badge>
                  {/* <Badge variant="outline" className="border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                    Available for Freelance
                  </Badge> */}
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                    Usually replies within 24 hours
                  </Badge>
                </div>
                <h2 className="text-4xl font-headline tracking-tighter lg:text-6xl">
                  Strategic Consultation
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Looking to scale your digital commerce operations or migrate to Dynamics 365?
                  Let's discuss how we can build high-performance experiences for your users.
                </p>
              </div>

              <div className="space-y-6">
                <a href={`mailto:${contactEmail}`} className="group flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Email</p>
                    <p className="text-lg font-bold">{contactEmail}</p>
                  </div>
                </a>

                <a href={linkedInUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-all group-hover:bg-accent group-hover:text-white">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn Message</p>
                    <p className="text-lg font-bold">Muhammad Zubair Rizwan</p>
                  </div>
                </a>

                <Button asChild variant="outline" size="lg" className="w-full rounded-full border-primary/20 hover:bg-primary/5 sm:w-auto">
                  <a href={calendlyUrl} target={calendlyUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule a Consultation
                  </a>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ContactOption icon={Mail} label="Email" value={contactEmail} href={`mailto:${contactEmail}`} />
                <ContactOption icon={Calendar} label="Book Meeting" value="Calendly" href={calendlyUrl} />
                <ContactOption icon={Linkedin} label="LinkedIn" value="Muhammad Zubair Rizwan" href={linkedInUrl} />
                <ContactOption icon={Github} label="GitHub" value="@zubairfloat" href={githubUrl} />
                <ContactOption icon={MapPin} label="Location" value="Pakistan" href="#contact" />
                <ContactOption icon={Phone} label="Response Time" value="Within 24 hours" href="#contact" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border/50 bg-card/50 shadow-2xl backdrop-blur-xl">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">Send a Message</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Your draft autosaves locally. Press Ctrl + Enter to submit.
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit(submit)} onKeyDown={handleKeyDown} onFocus={markStarted}>
                    <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("honeypot")} />
                    <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="name">Full Name</label>
                        <Input id="name" placeholder="John Doe" className="bg-background/50" {...register("name")} aria-invalid={!!errors.name} />
                        <FieldError message={errors.name?.message} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Email Address</label>
                        <Input id="email" type="email" placeholder="john@company.com" className="bg-background/50" {...register("email")} aria-invalid={!!errors.email} />
                        <FieldError message={errors.email?.message} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="company">Company</label>
                        <Input id="company" placeholder="Company name" className="bg-background/50" {...register("company")} />
                        <FieldError message={errors.company?.message} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="phone">Phone Number</label>
                        <Input id="phone" placeholder="+92..." className="bg-background/50" {...register("phone")} />
                        <FieldError message={errors.phone?.message} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground" htmlFor="country">Country</label>
                      <Input id="country" placeholder="Pakistan" className="bg-background/50" {...register("country")} />
                      <FieldError message={errors.country?.message} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Project Budget</label>
                        <Controller
                          control={control}
                          name="budget"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                trackContactEvent("Budget Selected", { value });
                              }}
                            >
                              <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Budget" />
                              </SelectTrigger>
                              <SelectContent>
                                {budgetOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.budget?.message} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Timeline</label>
                        <Controller
                          control={control}
                          name="timeline"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                trackContactEvent("Timeline Selected", { value });
                              }}
                            >
                              <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                {timelineOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.timeline?.message} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Service Interested In</label>
                        <Controller
                          control={control}
                          name="service"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                trackContactEvent("Service Selected", { value });
                              }}
                            >
                              <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Service" />
                              </SelectTrigger>
                              <SelectContent>
                                {serviceOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.service?.message} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground" htmlFor="subject">Subject</label>
                      <Input id="subject" placeholder="Strategic Project Inquiry" className="bg-background/50" {...register("subject")} aria-invalid={!!errors.subject} />
                      <FieldError message={errors.subject?.message} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="message">Message</label>
                        <span className={cn("text-xs", message?.length > 3000 ? "text-destructive" : "text-muted-foreground")}>
                          {message?.length ?? 0}/3000
                        </span>
                      </div>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project, goals, tech stack, timeline, and what success looks like..."
                        className="min-h-[150px] resize-none bg-background/50"
                        {...messageRegistration}
                        ref={(element) => {
                          messageRegistration.ref(element);
                          messageRef.current = element;
                        }}
                        aria-invalid={!!errors.message}
                      />
                      <FieldError message={errors.message?.message} />
                    </div>

                    {result && !result.ok ? (
                      <div className={cn("rounded-lg border p-4 text-sm", result.saved ? "border-primary/25 bg-primary/10" : "border-destructive/30 bg-destructive/10")}>
                        <p className="font-semibold">{result.saved ? "Message safely saved" : "Submission failed"}</p>
                        <p className="mt-1 text-muted-foreground">{result.message}</p>
                        {result.retryable ? (
                          <Button type="button" size="sm" variant="outline" className="mt-3 rounded-full border-white/10" onClick={() => void handleSubmit(submit)()}>
                            Retry
                          </Button>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="h-1 overflow-hidden rounded-full bg-background">
                      <motion.div
                        className="h-full bg-primary"
                        animate={{ width: isSending ? ["15%", "78%"] : isValid ? "100%" : "35%" }}
                        transition={{ duration: isSending ? 1.2 : 0.4, repeat: isSending ? Infinity : 0, repeatType: "reverse" }}
                      />
                    </div>

                    <Button type="submit" disabled={isSending || buttonSuccess} className={cn("h-12 w-full rounded-xl text-lg font-bold", buttonSuccess && "bg-emerald-500 text-white hover:bg-emerald-500")}>
                      {isSending ? (
                        <>
                          Sending...
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        </>
                      ) : buttonSuccess ? (
                        <>
                          Message Sent Successfully
                          <Check className="ml-2 h-5 w-5" />
                        </>
                      ) : (
                        <>
                          Send Inquiry
                          <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Selected: {service} • {budget} • {timeline}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="overflow-hidden border-border/60 bg-card/95 p-0 backdrop-blur-xl">
          <div className="relative p-8">
            <SuccessConfetti active={successOpen} />
            <DialogHeader className="items-center text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"
              >
                <Check className="h-9 w-9" />
              </motion.div>
              <DialogTitle className="text-2xl font-headline">Thanks for reaching out!</DialogTitle>
              <DialogDescription className="max-w-sm text-center leading-6">
                I've received your inquiry and will respond within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-8 gap-3 sm:justify-center">
              <Button variant="outline" className="rounded-full border-white/10" onClick={() => setSuccessOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
              <Button asChild className="rounded-full">
                <a href={calendlyUrl} target={calendlyUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book a Meeting
                </a>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
