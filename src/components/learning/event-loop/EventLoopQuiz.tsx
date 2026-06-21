"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    question: 'What will be the output of this code?\n\nconsole.log("A");\nsetTimeout(() => { console.log("B"); }, 0);\nPromise.resolve().then(() => { console.log("C"); });\nconsole.log("D");',
    options: ["A B C D", "A D B C", "A D C B", "A C D B"],
    correct: 2,
    explanation:
      "Synchronous code (A, D) executes first, then Microtask Queue (C), then Callback Queue (B). The order is A, D, C, B.",
  },
  {
    id: 2,
    question: "Which queue has higher priority?",
    options: ["Callback Queue", "Microtask Queue", "They are equal", "It depends on the browser"],
    correct: 1,
    explanation:
      "Microtask Queue has higher priority and is always processed before Callback Queue after the Call Stack is empty.",
  },
  {
    id: 3,
    question: "Where do Promise callbacks execute?",
    options: ["Call Stack", "Web APIs", "Microtask Queue", "Callback Queue"],
    correct: 2,
    explanation:
      "Promise callbacks (then/catch/finally) execute in the Microtask Queue, which is processed before the Callback Queue.",
  },
  {
    id: 4,
    question: "What happens inside an async function when you use await?",
    options: [
      "The entire program pauses",
      "The async function pauses and returns a Promise immediately",
      "The code after await never executes",
      "A new thread is created",
    ],
    correct: 1,
    explanation:
      "When await is used, the async function pauses execution and returns a Promise. The code after await is scheduled as a microtask and executes later.",
  },
  {
    id: 5,
    question: "What does the Event Loop do?",
    options: [
      "Executes all code at once",
      "Checks Call Stack, then processes queues in priority order",
      "Only handles synchronous code",
      "Prevents asynchronous code from running",
    ],
    correct: 1,
    explanation:
      "The Event Loop continuously checks the Call Stack, and when empty, processes Microtask Queue, then rendering, then Callback Queue in a loop.",
  },
];

type QuizState = {
  [key: number]: number | null;
};

export function EventLoopQuiz() {
  const [answers, setAnswers] = useState<QuizState>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    if (!showResults) {
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const correctAnswers = answers
    ? Object.entries(answers).filter(([qId, answer]) => {
        const question = questions.find((q) => q.id === parseInt(qId));
        return question && answer === question.correct;
      }).length
    : 0;

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Interactive Quiz</h2>
        <p className="mb-8 text-muted-foreground">
          Test your understanding of the Event Loop with these questions.
        </p>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-background/40 p-6 backdrop-blur-sm"
            >
              <div className="mb-4">
                <p className="mb-3 font-semibold">
                  {index + 1}. {q.question}
                </p>
              </div>

              <div className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isSelected = answers[q.id] === optIndex;
                  const isCorrect = optIndex === q.correct;
                  const showCorrect = showResults && isCorrect;
                  const showIncorrect = showResults && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={optIndex}
                      onClick={() => handleAnswer(q.id, optIndex)}
                      className={`w-full text-left rounded-lg border-2 p-3 transition-all ${
                        showCorrect
                          ? "border-green-500/50 bg-green-500/10"
                          : showIncorrect
                            ? "border-red-500/50 bg-red-500/10"
                            : isSelected
                              ? "border-primary/50 bg-primary/10"
                              : "border-white/10 bg-background/20 hover:border-white/20"
                      }`}
                      disabled={showResults}
                      whileHover={!showResults ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{option}</span>
                        {showCorrect && <Check className="h-5 w-5 text-green-400" />}
                        {showIncorrect && <X className="h-5 w-5 text-red-400" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {showResults && answers[q.id] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-lg p-3 text-sm ${
                    answers[q.id] === q.correct ? "bg-green-500/10 text-green-300" : "bg-orange-500/10 text-orange-300"
                  }`}
                >
                  <p className="font-semibold mb-1">
                    {answers[q.id] === q.correct ? "✓ Correct!" : "✗ Incorrect"}
                  </p>
                  <p>{q.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-lg border-2 border-primary/30 bg-primary/10 p-6 text-center"
          >
            <p className="mb-2 text-3xl font-bold">
              {correctAnswers} / {questions.length}
            </p>
            <p className="text-muted-foreground mb-4">
              {correctAnswers === questions.length
                ? "Perfect! You mastered the Event Loop! 🎉"
                : correctAnswers >= 4
                  ? "Great understanding! Keep practicing. 👍"
                  : "Keep learning! Review the concepts and try again. 📚"}
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-3 flex-wrap">
          {!showResults && (
            <Button onClick={handleSubmit} className="rounded-full">
              Submit Answers
            </Button>
          )}
          {showResults && (
            <Button onClick={handleReset} className="rounded-full">
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
