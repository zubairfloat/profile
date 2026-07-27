"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RefreshCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessons, quizQuestions, serviceRows, type Lesson, type QuizQuestion } from "@/components/learning/Module8AiMlDataAnalytics/Module8AiMlDataAnalytics";

function Diagram({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-primary/15 bg-primary/5 p-5">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-2">
          <span className="rounded-lg border border-primary/20 bg-background/60 px-3 py-2 text-center text-xs font-semibold text-primary">{item}</span>
          {index < items.length - 1 ? <ArrowRight className="h-4 w-4 text-primary/60" /> : null}
        </span>
      ))}
    </div>
  );
}

function TopicCard({ topic }: { topic: Lesson }) {
  const Icon = topic.icon;
  return (
    <Card id={topic.id} className="scroll-mt-8 border-white/10 bg-card/70 backdrop-blur-xl">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{topic.category}</Badge>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Exam concept</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
          <CardTitle className="font-headline text-2xl">{topic.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-foreground/90">{topic.summary}</p>
        {topic.diagram ? <Diagram items={topic.diagram} /> : null}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Key ideas</h4>
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              {topic.bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span className="text-primary">•</span><span>{bullet}</span></li>)}
            </ul>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-primary/15 bg-primary/5 p-4"><p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Real-world example: </span>{topic.example}</p></div>
            <p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-primary">Exam tip: </span>{topic.tip}</p>
            <p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-primary">Memory trick: </span>{topic.memory}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonTable() {
  return (
    <Card className="overflow-hidden border-white/10 bg-card/70 backdrop-blur-xl">
      <CardHeader><CardTitle className="font-headline text-2xl">Service Comparison and Exam Review</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-primary/10"><tr>{["AWS Service", "Category", "Main Purpose", "Exam Keyword"].map((column) => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead>
          <tbody>{serviceRows.map((row) => <tr key={row[0]} className="border-t border-white/10"><td className="px-4 py-3 font-semibold">{row[0]}</td><td className="px-4 py-3 text-muted-foreground">{row[1]}</td><td className="px-4 py-3 text-muted-foreground">{row[2]}</td><td className="px-4 py-3 text-primary">{row[3]}</td></tr>)}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function QuizOption({ question, optionIndex, selected, onSelect }: { question: QuizQuestion; optionIndex: number; selected: number[]; onSelect: () => void }) {
  const isSelected = selected.includes(optionIndex);
  const isCorrect = question.answer.includes(optionIndex);
  return (
    <button type="button" onClick={onSelect} className={`rounded-lg border p-3 text-left text-sm transition-colors ${isSelected ? (isCorrect ? "border-success/50 bg-success/10" : "border-destructive/50 bg-destructive/10") : "border-white/10 bg-background/30 hover:border-primary/30"}`}>
      <span className="mr-2 font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>{question.options[optionIndex]}
      {isSelected ? <span className="mt-2 block border-t border-white/10 pt-2 text-xs leading-5 text-muted-foreground">{isCorrect ? question.explanation : "This option does not match the AWS Cloud Practitioner service definition in the question."}</span> : null}
    </button>
  );
}

function DatabaseStyleQuiz() {
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const correct = useMemo(() => quizQuestions.reduce((score, question) => {
    const selected = answers[question.id] ?? [];
    return score + (selected.length === question.answer.length && selected.every((choice) => question.answer.includes(choice)) ? 1 : 0);
  }, 0), [answers]);

  const selectAnswer = (question: QuizQuestion, optionIndex: number) => {
    setAnswers((current) => {
      const selected = current[question.id] ?? [];
      if (question.multi) return { ...current, [question.id]: selected.includes(optionIndex) ? selected.filter((item) => item !== optionIndex) : [...selected, optionIndex] };
      return { ...current, [question.id]: [optionIndex] };
    });
  };

  return (
    <section className="space-y-5">
      <div><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Practice quiz</Badge><h3 className="mt-3 font-headline text-2xl font-bold">Module 8 Knowledge Check</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Select an answer to see why each option is right or wrong. Multi-select questions are labeled.</p></div>
      {quizQuestions.map((question, questionIndex) => {
        const selected = answers[question.id] ?? [];
        return <Card key={question.id} className="border-white/10 bg-card/70"><CardContent className="space-y-4 p-5"><div className="flex items-start justify-between gap-3"><p className="font-semibold leading-6">{questionIndex + 1}. {question.question}</p><Badge variant="secondary" className="shrink-0">{question.multi ? "Select all" : question.topic}</Badge></div><div className="grid gap-2">{question.options.map((option, optionIndex) => <QuizOption key={option} question={question} optionIndex={optionIndex} selected={selected} onSelect={() => selectAnswer(question, optionIndex)} />)}</div></CardContent></Card>;
      })}
      <Card className="border-primary/20 bg-primary/5"><CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"><p className="font-semibold">Score: {correct} / {quizQuestions.length}</p><Button variant="outline" className="rounded-full border-white/10" onClick={() => setAnswers({})}><RefreshCcw className="mr-2 h-4 w-4" />Reset Quiz</Button></CardContent></Card>
    </section>
  );
}

export function Module8AiMlDataAnalyticsNative() {
  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-card/60 backdrop-blur-xl"><CardContent className="space-y-4 p-6"><div className="flex flex-wrap gap-2"><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">AWS Certified Cloud Practitioner</Badge><Badge variant="secondary">Module 8</Badge></div><h2 className="font-headline text-3xl font-bold md:text-4xl">AI, Machine Learning, Generative AI, and Data Analytics</h2><p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">Learn AI and ML foundations, AWS pre-built AI services, SageMaker AI, Bedrock, Amazon Q, ETL, data pipelines, analytics services, and exam-ready service selection.</p></CardContent></Card>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,820px)] lg:justify-center">
        <aside className="lg:self-start"><Card className="border-white/10 bg-card/80 backdrop-blur-xl"><CardHeader><CardTitle className="text-lg">AI and Data Topics</CardTitle></CardHeader><CardContent className="space-y-2">{lessons.map((topic, index) => <button key={topic.id} type="button" onClick={() => document.getElementById(topic.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex w-full items-start gap-3 rounded-lg border border-white/10 bg-background/40 p-3 text-left text-sm leading-5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><span className="mt-0.5 text-xs font-semibold">{index + 1}</span><span>{topic.title}</span></button>)}<button type="button" onClick={() => document.getElementById("module-8-quiz")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex w-full items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-left text-sm leading-5 text-primary"><span className="mt-0.5 text-xs font-semibold">24</span><span>Complete Practice Quiz</span></button></CardContent></Card></aside>
        <div id="module-8-quiz" className="w-full max-w-[820px] space-y-10">{lessons.map((topic) => <TopicCard key={topic.id} topic={topic} />)}<ComparisonTable /><Card className="border-success/20 bg-success/10"><CardContent className="space-y-4 p-6"><div className="flex items-center gap-2 text-success"><ShieldCheck className="h-5 w-5" /><h3 className="font-headline text-2xl font-bold">AI and Data Exam Memory Map</h3></div><div className="grid gap-3 md:grid-cols-2">{["Polly = text to speech", "Transcribe = speech to text", "Comprehend = understand text", "Textract = extract documents", "SageMaker AI = custom ML lifecycle", "Bedrock = GenAI apps with foundation models", "Q Business = employee assistant", "Q Developer = coding assistant", "Kinesis = real-time streams", "Firehose = managed delivery", "S3 = data lake", "Redshift = data warehouse", "Glue = ETL", "Athena = SQL on S3", "QuickSight = dashboards"].map((item) => <div key={item} className="rounded-lg border border-white/10 bg-background/40 p-4 text-sm leading-6 text-muted-foreground">{item}</div>)}</div></CardContent></Card><DatabaseStyleQuiz /></div>
      </div>
    </div>
  );
}
