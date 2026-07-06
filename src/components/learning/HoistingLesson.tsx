"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  Boxes,
  Check,
  CheckCircle2,
  Clipboard,
  Clock,
  Code2,
  FileCode2,
  Gauge,
  Layers3,
  MemoryStick,
  Play,
  RefreshCcw,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  SquareFunction,
  SquareStack,
  Terminal,
  Timer,
  X,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PlaygroundExample = {
  title: string;
  code: string;
  output: string[];
  memory: string[];
  explanation: string;
  activeLines: number[];
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  whyWrong: Record<string, string>;
};

const objectives = [
  "What Hoisting is",
  "Memory Creation Phase",
  "Execution Phase",
  "Variable Hoisting",
  "Function Hoisting",
  "Temporal Dead Zone",
  "var vs let vs const",
  "Function Declaration vs Function Expression",
  "Common Interview Questions",
];

const executionFlow = [
  {
    title: "Source Code",
    text: "JavaScript receives the file exactly as you wrote it.",
    icon: FileCode2,
  },
  {
    title: "Memory Creation Phase",
    text: "JavaScript reserves names for variables and functions before running code.",
    icon: MemoryStick,
  },
  {
    title: "Execution Phase",
    text: "JavaScript runs line by line and updates values.",
    icon: Play,
  },
  {
    title: "Output",
    text: "Console logs, returned values, and errors appear from executed lines.",
    icon: Terminal,
  },
];

const visualizerCode = `console.log(a);

var a = 10;

console.log(a);`;

const visualizerSteps = [
  {
    label: "Memory Creation",
    activeLine: 0,
    memory: [{ name: "a", value: "undefined", tone: "yellow" }],
    stack: ["Global Execution Context"],
    console: [] as string[],
    execution:
      "Before any line runs, JavaScript sees var a and stores a with the value undefined.",
  },
  {
    label: "Execution: console.log(a)",
    activeLine: 1,
    memory: [{ name: "a", value: "undefined", tone: "yellow" }],
    stack: ["console.log(a)", "Global Execution Context"],
    console: ["undefined"],
    execution:
      "The first console.log reads a from memory. The value exists, but it is still undefined.",
  },
  {
    label: "Assignment: a = 10",
    activeLine: 3,
    memory: [{ name: "a", value: "10", tone: "green" }],
    stack: ["Global Execution Context"],
    console: ["undefined"],
    execution:
      "Now the assignment runs. JavaScript replaces undefined with the real value 10.",
  },
  {
    label: "Execution: console.log(a)",
    activeLine: 5,
    memory: [{ name: "a", value: "10", tone: "green" }],
    stack: ["console.log(a)", "Global Execution Context"],
    console: ["undefined", "10"],
    execution:
      "The second console.log reads the updated value from memory, so the console shows 10.",
  },
];

const comparisonCards = [
  {
    name: "var",
    tone: "green",
    memory: "undefined",
    access: "Can access before declaration",
    output: "undefined",
  },
  {
    name: "let",
    tone: "yellow",
    memory: "Memory reserved",
    access: "Cannot access before declaration",
    output: "ReferenceError",
  },
  {
    name: "const",
    tone: "red",
    memory: "Memory reserved",
    access: "Cannot access before declaration",
    output: "ReferenceError",
  },
];

const functionExamples = [
  {
    title: "Function Declaration",
    kind: "Works before declaration",
    code: `sayHello();

function sayHello() {
  console.log("Hello");
}`,
    memory: ["sayHello: Function()"],
    output: "Hello",
    explanation:
      "Function declarations are stored in memory as complete functions during the memory creation phase.",
  },
  {
    title: "Function Expression",
    kind: "Not callable before initialization",
    code: `sayHello();

const sayHello = function() {
  console.log("Hello");
};`,
    memory: ["sayHello: TDZ"],
    output: "ReferenceError",
    explanation:
      "The const name exists in memory but stays inside the Temporal Dead Zone until the assignment line runs.",
  },
];

const functionTypeCards = [
  ["Function Declaration", "Hoisted", "Works before declaration"],
  ["Function Expression", "Not callable before initialization", "Acts like the variable used to store it"],
  ["Arrow Function", "Behaves like let or const", "Cannot run before initialization"],
  ["Class Declaration", "Temporal Dead Zone", "Name exists, but cannot be used early"],
];

const memoryItems = [
  { name: "a", value: "undefined", detail: "var declaration", tone: "yellow" },
  { name: "b", value: "TDZ", detail: "let declaration", tone: "red" },
  { name: "c", value: "TDZ", detail: "const declaration", tone: "red" },
  { name: "sayHello()", value: "Function()", detail: "function declaration", tone: "green" },
];

const playgroundExamples: PlaygroundExample[] = [
  {
    title: "var",
    code: `console.log(score);
var score = 42;
console.log(score);`,
    output: ["undefined", "42"],
    memory: ["score: undefined", "score: 42"],
    explanation:
      "var is hoisted and initialized with undefined, then updated when the assignment runs.",
    activeLines: [1, 2, 3],
  },
  {
    title: "let",
    code: `console.log(score);
let score = 42;`,
    output: ["ReferenceError"],
    memory: ["score: TDZ", "score: 42 after declaration"],
    explanation:
      "let is hoisted into memory, but you cannot read it before the declaration line.",
    activeLines: [1, 2],
  },
  {
    title: "const",
    code: `console.log(apiUrl);
const apiUrl = "/api/products";`,
    output: ["ReferenceError"],
    memory: ["apiUrl: TDZ", "apiUrl: initialized once"],
    explanation:
      "const is also in the Temporal Dead Zone before initialization and must receive a value when declared.",
    activeLines: [1, 2],
  },
  {
    title: "Function Declaration",
    code: `calculateTotal();

function calculateTotal() {
  console.log("Total ready");
}`,
    output: ["Total ready"],
    memory: ["calculateTotal: Function()"],
    explanation:
      "A function declaration is fully available during memory creation, so it can run before its source line.",
    activeLines: [1, 3, 4],
  },
  {
    title: "Function Expression",
    code: `calculateTotal();

const calculateTotal = function() {
  console.log("Total ready");
};`,
    output: ["ReferenceError"],
    memory: ["calculateTotal: TDZ"],
    explanation:
      "The variable is hoisted, but the function value is assigned only when execution reaches that line.",
    activeLines: [1, 3],
  },
  {
    title: "Arrow Function",
    code: `calculateTotal();

const calculateTotal = () => {
  console.log("Total ready");
};`,
    output: ["ReferenceError"],
    memory: ["calculateTotal: TDZ"],
    explanation:
      "Arrow functions stored in const behave like const variables during hoisting.",
    activeLines: [1, 3],
  },
];

const commonMistakes = [
  "Using let before declaration and expecting undefined.",
  "Using const before declaration and expecting undefined.",
  "Thinking variables physically move to the top of the file.",
  "Confusing undefined with ReferenceError.",
  "Calling function expressions before initialization.",
];

const realWorldExamples = [
  {
    title: "Configuration Variables",
    icon: Gauge,
    text: "Declare config before use so startup code never depends on accidental hoisting behavior.",
  },
  {
    title: "Environment Variables",
    icon: Terminal,
    text: "Read environment values into const variables before passing them into services.",
  },
  {
    title: "Initialization",
    icon: Timer,
    text: "Initialize application state before functions begin consuming it.",
  },
  {
    title: "Module Imports",
    icon: Boxes,
    text: "Imports are prepared before module code runs, which is why they appear available at the top level.",
  },
  {
    title: "React Components",
    icon: SquareStack,
    text: "Function declarations make reusable components and helpers easier to call from nearby code.",
  },
  {
    title: "Utility Functions",
    icon: SquareFunction,
    text: "Function declarations are useful when you want helpers to be readable below the main flow.",
  },
];

const reactExamples = [
  {
    title: "Function Components",
    text:
      "React components are often function declarations because they are named, reusable, and easy to read in stack traces.",
  },
  {
    title: "Hooks Order",
    text:
      "Hooks cannot be called conditionally because React depends on the same call order during every render.",
  },
  {
    title: "Imports",
    text:
      "Import declarations are processed before module execution, so imported values are available throughout the module.",
  },
];

const interviewQuestions = [
  {
    question: "What is Hoisting?",
    simple:
      "Hoisting is JavaScript preparing variable and function names before code starts running.",
    detailed:
      "During memory creation, JavaScript scans the code and creates memory slots for declarations. var starts as undefined, function declarations become full functions, and let, const, and class declarations stay unavailable until initialized.",
    interview:
      "Hoisting is JavaScript's creation-phase behavior where declarations are registered before execution. The behavior differs for var, let, const, functions, and classes.",
    example: "console.log(a); var a = 10; logs undefined first.",
    trick: "JavaScript prepares names first, then runs lines.",
    mistake: "Saying declarations physically move to the top.",
  },
  {
    question: "What is Memory Creation Phase?",
    simple:
      "It is the setup step before JavaScript runs your lines.",
    detailed:
      "JavaScript creates a global execution context, reserves memory for variables and functions, and prepares the environment needed for execution.",
    interview:
      "The memory creation phase is the first phase of an execution context where declarations are stored before line-by-line execution.",
    example: "var a becomes undefined before console.log(a) runs.",
    trick: "Memory first, execution second.",
    mistake: "Thinking assignment also happens during memory creation.",
  },
  {
    question: "Why does var return undefined?",
    simple:
      "Because JavaScript creates var in memory with the starting value undefined.",
    detailed:
      "var declarations are hoisted and initialized to undefined during memory creation. The real value is assigned only when execution reaches the assignment line.",
    interview:
      "var is hoisted and initialized with undefined, so reading it before assignment returns undefined instead of throwing a ReferenceError.",
    example: "console.log(a); var a = 10;",
    trick: "var gets a placeholder value.",
    mistake: "Thinking undefined means the variable does not exist.",
  },
  {
    question: "Why does let throw ReferenceError?",
    simple:
      "The name exists, but JavaScript blocks access until the declaration line.",
    detailed:
      "let declarations are hoisted but not initialized. The time between scope start and declaration is the Temporal Dead Zone.",
    interview:
      "let is hoisted into the lexical environment but remains uninitialized until execution reaches the declaration, so early access throws ReferenceError.",
    example: "console.log(a); let a = 10;",
    trick: "let is locked until the declaration.",
    mistake: "Saying let is not hoisted.",
  },
  {
    question: "What is Temporal Dead Zone?",
    simple:
      "It is the unsafe area before let or const can be used.",
    detailed:
      "The Temporal Dead Zone starts at the beginning of the scope and ends when the declaration is executed. Access inside this zone throws ReferenceError.",
    interview:
      "TDZ is the period where a lexical declaration exists but is uninitialized and cannot be accessed.",
    example: "A const apiUrl cannot be read before const apiUrl = '/api'.",
    trick: "TDZ means the name exists but is locked.",
    mistake: "Thinking TDZ is only for const.",
  },
  {
    question: "Difference between undefined and ReferenceError?",
    simple:
      "undefined means the variable exists with no value. ReferenceError means you cannot access it.",
    detailed:
      "undefined is a real value. ReferenceError is an error thrown when a binding is not accessible, not declared, or still in TDZ.",
    interview:
      "undefined is a value assigned to initialized variables without a concrete value. ReferenceError means the identifier cannot be resolved or accessed.",
    example: "var a logs undefined. let a before declaration throws ReferenceError.",
    trick: "undefined is a value. ReferenceError is a stop sign.",
    mistake: "Treating both as the same result.",
  },
  {
    question: "Difference between Function Declaration and Function Expression?",
    simple:
      "Function declarations are ready early. Function expressions wait for assignment.",
    detailed:
      "Function declarations are hoisted as full functions. Function expressions are values assigned to variables, so they follow var, let, or const behavior.",
    interview:
      "A function declaration can be called before it appears in the file. A function expression cannot be called before the variable storing it has been initialized.",
    example: "sayHi(); function sayHi() {} works. sayHi(); const sayHi = function() {} fails.",
    trick: "Declaration is ready. Expression is assigned later.",
    mistake: "Calling const arrow functions before initialization.",
  },
  {
    question: "Can classes be hoisted?",
    simple:
      "Class names are prepared, but you cannot use them early.",
    detailed:
      "Class declarations are hoisted into the lexical environment, but they stay in the Temporal Dead Zone until the class declaration executes.",
    interview:
      "Classes are hoisted but not initialized, similar to let and const, so accessing a class before declaration throws ReferenceError.",
    example: "new User(); class User {} throws ReferenceError.",
    trick: "Classes are names with TDZ.",
    mistake: "Thinking classes behave like function declarations.",
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "What is hoisting in JavaScript?",
    options: [
      "JavaScript preparing declarations before execution",
      "JavaScript physically moving code to another file",
      "A browser repaint optimization",
      "A TypeScript-only feature",
    ],
    correct: "JavaScript preparing declarations before execution",
    explanation:
      "Hoisting is the setup behavior during memory creation where declarations are registered before line-by-line execution.",
    whyWrong: {
      "JavaScript physically moving code to another file": "Declarations are not physically moved. JavaScript prepares memory.",
      "A browser repaint optimization": "Hoisting is a language execution behavior, not rendering.",
      "A TypeScript-only feature": "Hoisting is part of JavaScript behavior.",
    },
  },
  {
    question: "What does this output first: console.log(a); var a = 10;",
    options: ["undefined", "10", "ReferenceError", "TypeError"],
    correct: "undefined",
    explanation:
      "var a is created with undefined during memory creation, then assigned 10 later.",
    whyWrong: {
      "10": "The assignment has not executed yet.",
      ReferenceError: "var is accessible before declaration because it starts as undefined.",
      TypeError: "No invalid operation on a type happens here.",
    },
  },
  {
    question: "Why does let throw a ReferenceError before declaration?",
    options: [
      "It is in the Temporal Dead Zone",
      "let is never hoisted",
      "let always creates global variables",
      "let is converted to var",
    ],
    correct: "It is in the Temporal Dead Zone",
    explanation:
      "let is hoisted but remains uninitialized until execution reaches the declaration.",
    whyWrong: {
      "let is never hoisted": "let is hoisted, but it is not accessible early.",
      "let always creates global variables": "let is block-scoped.",
      "let is converted to var": "JavaScript does not treat let as var.",
    },
  },
  {
    question: "Which declaration is initialized with undefined during memory creation?",
    options: ["var", "let", "const", "class"],
    correct: "var",
    explanation:
      "var declarations are hoisted and initialized to undefined.",
    whyWrong: {
      let: "let is hoisted but uninitialized.",
      const: "const is hoisted but uninitialized and must be assigned during declaration.",
      class: "class declarations are in TDZ before initialization.",
    },
  },
  {
    question: "Which can usually be called before it appears in the file?",
    options: [
      "Function declaration",
      "Function expression stored in const",
      "Arrow function stored in const",
      "Class declaration",
    ],
    correct: "Function declaration",
    explanation:
      "Function declarations are stored as complete functions during memory creation.",
    whyWrong: {
      "Function expression stored in const": "The const binding is not initialized yet.",
      "Arrow function stored in const": "The const binding is in TDZ before declaration.",
      "Class declaration": "Classes are not usable before initialization.",
    },
  },
  {
    question: "What is the Temporal Dead Zone?",
    options: [
      "The period before let or const is initialized",
      "The time before a Promise resolves",
      "The delay before a setTimeout callback",
      "The browser paint phase",
    ],
    correct: "The period before let or const is initialized",
    explanation:
      "TDZ is the time from scope start until a lexical declaration is initialized.",
    whyWrong: {
      "The time before a Promise resolves": "That is async pending time, not TDZ.",
      "The delay before a setTimeout callback": "That is timer scheduling.",
      "The browser paint phase": "TDZ is language-level variable access behavior.",
    },
  },
  {
    question: "What is undefined?",
    options: [
      "A real JavaScript value",
      "The same thing as ReferenceError",
      "A syntax error",
      "A class-only behavior",
    ],
    correct: "A real JavaScript value",
    explanation:
      "undefined is a value. ReferenceError is an error.",
    whyWrong: {
      "The same thing as ReferenceError": "ReferenceError stops execution for inaccessible identifiers.",
      "A syntax error": "undefined is not a syntax error.",
      "A class-only behavior": "undefined can appear with variables, properties, returns, and more.",
    },
  },
  {
    question: "What happens when you call a const arrow function before initialization?",
    options: ["ReferenceError", "undefined", "It runs normally", "It becomes a function declaration"],
    correct: "ReferenceError",
    explanation:
      "The function value is stored in a const binding that is in TDZ before initialization.",
    whyWrong: {
      undefined: "const does not initialize to undefined like var.",
      "It runs normally": "The function has not been assigned yet.",
      "It becomes a function declaration": "Arrow functions assigned to variables are not function declarations.",
    },
  },
  {
    question: "What happens during execution phase?",
    options: [
      "JavaScript runs code line by line",
      "JavaScript only reserves memory",
      "JavaScript ignores assignments",
      "JavaScript compiles CSS",
    ],
    correct: "JavaScript runs code line by line",
    explanation:
      "Execution phase runs statements, performs assignments, calls functions, and produces output.",
    whyWrong: {
      "JavaScript only reserves memory": "That describes memory creation, not execution.",
      "JavaScript ignores assignments": "Assignments happen during execution.",
      "JavaScript compiles CSS": "CSS is unrelated to hoisting.",
    },
  },
  {
    question: "Which statement about hoisting is most accurate?",
    options: [
      "Declarations are prepared, but assignments still run in place",
      "All values move to the top",
      "let and const are not known to JavaScript early",
      "Hoisting only affects loops",
    ],
    correct: "Declarations are prepared, but assignments still run in place",
    explanation:
      "Hoisting prepares declarations. Assignments happen when their line executes.",
    whyWrong: {
      "All values move to the top": "Values are not assigned early.",
      "let and const are not known to JavaScript early": "They are hoisted but not initialized.",
      "Hoisting only affects loops": "Hoisting affects declarations across scopes.",
    },
  },
  {
    question: "How do class declarations behave before initialization?",
    options: ["They are in TDZ", "They act like var", "They run as functions", "They become undefined"],
    correct: "They are in TDZ",
    explanation:
      "Class declarations are hoisted but cannot be used before the declaration executes.",
    whyWrong: {
      "They act like var": "Classes do not initialize to undefined.",
      "They run as functions": "Classes require initialization before use.",
      "They become undefined": "Early access throws ReferenceError.",
    },
  },
  {
    question: "Which is a best practice?",
    options: [
      "Declare variables before using them",
      "Use var everywhere",
      "Call const functions before they exist",
      "Rely on ReferenceError for control flow",
    ],
    correct: "Declare variables before using them",
    explanation:
      "Clear declaration order avoids hoisting confusion and makes code easier to maintain.",
    whyWrong: {
      "Use var everywhere": "Modern JavaScript usually prefers const and let.",
      "Call const functions before they exist": "That creates TDZ errors.",
      "Rely on ReferenceError for control flow": "Errors should not be normal application flow.",
    },
  },
  {
    question: "Why do imports feel hoisted?",
    options: [
      "Module imports are processed before module code executes",
      "Imports are variables created with var",
      "Imports run after all console logs",
      "Imports are React-only syntax",
    ],
    correct: "Module imports are processed before module code executes",
    explanation:
      "ES modules link and prepare imports before the module body runs.",
    whyWrong: {
      "Imports are variables created with var": "Imports have module semantics, not var behavior.",
      "Imports run after all console logs": "Imports are handled before module execution.",
      "Imports are React-only syntax": "Imports are JavaScript module syntax.",
    },
  },
  {
    question: "What should you prefer for a variable that never changes?",
    options: ["const", "var", "An undeclared global", "A class"],
    correct: "const",
    explanation:
      "const communicates that the binding should not be reassigned.",
    whyWrong: {
      var: "var has function scope and hoisting behavior that is usually less clear.",
      "An undeclared global": "Implicit globals are unsafe and should be avoided.",
      "A class": "A class is not a variable declaration for ordinary values.",
    },
  },
  {
    question: "What is the main interview trap about hoisting?",
    options: [
      "Saying variables physically move to the top",
      "Knowing var starts as undefined",
      "Knowing let has TDZ",
      "Knowing functions can be declarations",
    ],
    correct: "Saying variables physically move to the top",
    explanation:
      "The better explanation is memory preparation, not physical movement of source code.",
    whyWrong: {
      "Knowing var starts as undefined": "That is correct.",
      "Knowing let has TDZ": "That is correct.",
      "Knowing functions can be declarations": "That is correct.",
    },
  },
];

const cheatsheetRows = [
  ["Hoisted", "Yes", "Yes", "Yes"],
  ["Initialization", "undefined", "Uninitialized", "Uninitialized"],
  ["TDZ", "No", "Yes", "Yes"],
  ["Can Access Before Declaration", "Yes", "No", "No"],
  ["Can Reassign", "Yes", "Yes", "No"],
  ["Can Redeclare", "Yes in same scope", "No", "No"],
  ["Scope", "Function", "Block", "Block"],
];

const bestPractices = [
  "Always declare variables before using them.",
  "Prefer const by default.",
  "Use let only when reassignment is required.",
  "Avoid var in modern JavaScript.",
  "Prefer function declarations for reusable utilities that benefit from being callable early.",
];

const copyReadyExamples = [
  {
    title: "Safe Configuration",
    code: `const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function createApiUrl(path: string) {
  return \`\${apiBaseUrl}\${path}\`;
}`,
    explanation:
      "Configuration is declared before helpers use it, so readers do not need to reason about hoisting.",
  },
  {
    title: "Reusable Utility Declaration",
    code: `const total = calculateCartTotal(items);

function calculateCartTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}`,
    explanation:
      "A function declaration can be called before it appears, which can keep the high-level flow readable.",
  },
  {
    title: "Avoid TDZ Bugs",
    code: `const featureFlags = loadFeatureFlags();

if (featureFlags.enableCheckout) {
  initializeCheckout();
}`,
    explanation:
      "Declare and initialize values before branching on them.",
  },
  {
    title: "Modern Function Expression",
    code: `const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

console.log(formatPrice(49));`,
    explanation:
      "Function expressions and arrow functions are excellent after initialization.",
  },
];

function SectionHeader({
  badge,
  title,
  description,
  icon: Icon,
}: {
  badge: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5 text-primary">
        {Icon ? <Icon className="mr-2 h-3.5 w-3.5" /> : null}
        {badge}
      </Badge>
      <h2 className="text-4xl font-headline tracking-normal">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function CodePanel({ code, activeLine }: { code: string; activeLine?: number }) {
  return (
    <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
      {code.split("\n").map((line, index) => {
        const lineNumber = index + 1;
        return (
          <div
            key={`${lineNumber}-${line}`}
            className={cn(
              "-mx-2 grid grid-cols-[2rem_1fr] rounded px-2",
              lineNumber === activeLine && "bg-primary/15 text-foreground"
            )}
          >
            <span className="select-none text-muted-foreground/70">{lineNumber}</span>
            <code>{line || " "}</code>
          </div>
        );
      })}
    </pre>
  );
}

function ToneDot({ tone }: { tone: string }) {
  return (
    <span
      className={cn(
        "h-2.5 w-2.5 rounded-full",
        tone === "green" && "bg-emerald-400",
        tone === "yellow" && "bg-yellow-400",
        tone === "red" && "bg-red-400"
      )}
    />
  );
}

function ConceptOverview() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-headline font-bold">What is Hoisting?</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Imagine JavaScript reads your entire file before running it. During
              this first pass, it reserves memory for variables and functions.
              That preparation process is called Hoisting.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">
              The important part: JavaScript prepares declarations first, but it
              still executes your code line by line. Assignments do not jump to
              the top.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {objectives.map((objective, index) => (
            <motion.div
              key={objective}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl"
            >
              <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">{objective}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExecutionFlowTimeline() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="JavaScript Execution Flow"
        icon={Layers3}
        title="How JavaScript Runs Your File"
        description="Hoisting makes more sense when you separate setup from execution."
      />
      <div className="grid gap-5 lg:grid-cols-4">
        {executionFlow.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="border-white/10 bg-background/60">
                  {index + 1}
                </Badge>
              </div>
              <h3 className="text-xl font-headline font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              {index < executionFlow.length - 1 ? (
                <ArrowRight className="absolute -right-4 top-1/2 hidden h-7 w-7 -translate-y-1/2 text-primary lg:block" />
              ) : null}
              {index < executionFlow.length - 1 ? (
                <ArrowDown className="mx-auto mt-5 h-6 w-6 text-primary lg:hidden" />
              ) : null}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function HoistingVisualizer() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const current = visualizerSteps[step];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = window.setInterval(() => {
      setStep((value) => {
        if (value >= visualizerSteps.length - 1) {
          setAutoPlay(false);
          return value;
        }

        return value + 1;
      });
    }, 1300);

    return () => window.clearInterval(timer);
  }, [autoPlay]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interactive Visualizer"
        icon={MemoryStick}
        title="Watch var Hoisting Happen"
        description="Step through source code, memory, call stack, console output, and execution notes."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Code2 className="h-5 w-5 text-primary" />
              Source Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <CodePanel code={visualizerCode} activeLine={current.activeLine} />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setStep(0)} className="rounded-full">
                Start
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                className="rounded-full border-white/10"
              >
                <SkipBack className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep((value) => Math.min(visualizerSteps.length - 1, value + 1))}
                className="rounded-full border-white/10"
              >
                Next Step
                <SkipForward className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAutoPlay((value) => !value);
                  if (step >= visualizerSteps.length - 1) setStep(0);
                }}
                className="rounded-full border-white/10"
              >
                <Play className="mr-2 h-4 w-4" />
                {autoPlay ? "Pause" : "Auto Play"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setAutoPlay(false);
                }}
                className="rounded-full border-white/10"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            <Progress value={((step + 1) / visualizerSteps.length) * 100} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Memory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {current.memory.map((item) => (
                <motion.div
                  key={`${step}-${item.name}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg border border-white/10 bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-code text-sm">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <ToneDot tone={item.tone} />
                      <span className="font-code text-sm text-muted-foreground">{item.value}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Call Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {current.stack.map((frame) => (
                <motion.div
                  key={`${step}-${frame}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 font-code text-xs"
                >
                  {frame}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Console</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-32 rounded-lg border border-white/10 bg-background/80 p-4 font-code text-sm">
                {current.console.length ? (
                  current.console.map((line, index) => (
                    <motion.div
                      key={`${line}-${index}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-primary"
                    >
                      {line}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-muted-foreground">(empty)</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
                {current.label}
              </Badge>
              <p className="text-sm leading-7 text-muted-foreground">{current.execution}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function HoistingComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Hoisting Comparison"
        icon={SquareStack}
        title="var vs let vs const"
        description="All three declarations are prepared, but they are not prepared in the same way."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {comparisonCards.map((card, index) => (
          <motion.article
            key={card.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className={cn(
              "rounded-lg border p-6 backdrop-blur-xl",
              card.tone === "green" && "border-emerald-400/30 bg-emerald-400/10",
              card.tone === "yellow" && "border-yellow-400/30 bg-yellow-400/10",
              card.tone === "red" && "border-red-400/30 bg-red-400/10"
            )}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3 className="text-3xl font-headline font-bold">{card.name}</h3>
              <ToneDot tone={card.tone} />
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Memory</p>
                <p className="mt-2 font-code text-sm">{card.memory}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Access</p>
                <p className="mt-2 text-sm">{card.access}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Output</p>
                <p className="mt-2 font-code text-sm">{card.output}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function TemporalDeadZone() {
  const [phase, setPhase] = useState(1);
  const phases = ["Memory Created", "Temporal Dead Zone", "Declaration", "Initialized", "Accessible"];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Temporal Dead Zone"
        icon={AlertTriangle}
        title="The Unsafe Zone Before let and const"
        description="The variable name exists, but JavaScript blocks access until the declaration executes."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-5">
            {phases.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => setPhase(index)}
                className={cn(
                  "rounded-lg border p-4 text-left transition-all",
                  phase === index
                    ? "border-primary/50 bg-primary/10"
                    : "border-white/10 bg-background/50 hover:border-primary/30"
                )}
              >
                <p className="font-semibold">{item}</p>
                <div
                  className={cn(
                    "mt-4 h-2 rounded-full",
                    index === 1 ? "bg-red-400" : index >= 3 ? "bg-emerald-400" : "bg-yellow-400"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-white/10 bg-background/60 p-5">
              <CodePanel
                code={`console.log(userName);

let userName = "Zubair";

console.log(userName);`}
                activeLine={phase < 2 ? 1 : phase === 2 ? 3 : 5}
              />
            </div>
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-lg border p-6",
                phase <= 1 && "border-red-400/40 bg-red-400/10",
                phase === 2 && "border-yellow-400/40 bg-yellow-400/10",
                phase >= 3 && "border-emerald-400/40 bg-emerald-400/10"
              )}
            >
              <p className="text-sm uppercase tracking-widest text-muted-foreground">Current phase</p>
              <h3 className="mt-2 text-3xl font-headline font-bold">{phases[phase]}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {phase <= 1
                  ? "Access here throws ReferenceError because userName is still inside the Temporal Dead Zone."
                  : phase === 2
                    ? "The declaration line is being reached. JavaScript is about to initialize the binding."
                    : "Now userName has a value and can be safely accessed."}
              </p>
              <div className="mt-6 rounded-lg border border-white/10 bg-background/60 p-4 font-code text-sm">
                {phase <= 1 ? "ReferenceError" : phase === 2 ? "let userName = ..." : "Zubair"}
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FunctionHoistingPlayground() {
  const [selected, setSelected] = useState(0);
  const example = functionExamples[selected];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Function Hoisting"
        icon={SquareFunction}
        title="Declarations Work Early. Expressions Do Not."
        description="The word function is not enough. The declaration style decides what JavaScript stores in memory."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-3 p-6">
            {functionExamples.map((item, index) => (
              <Button
                key={item.title}
                variant="outline"
                onClick={() => setSelected(index)}
                className={cn(
                  "h-auto w-full justify-start rounded-lg border-white/10 p-4 text-left",
                  selected === index && "border-primary/40 bg-primary/10"
                )}
              >
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.kind}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_0.8fr]">
            <CodePanel code={example.code} activeLine={1} />
            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Memory</p>
                {example.memory.map((item) => (
                  <p key={item} className="mt-2 font-code text-sm text-primary">{item}</p>
                ))}
              </div>
              <div className="rounded-lg border border-white/10 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Output</p>
                <p className="mt-2 font-code text-sm">{example.output}</p>
              </div>
              <p className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">
                {example.explanation}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {functionTypeCards.map(([title, status, detail]) => (
          <div key={title} className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-primary">{status}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MemoryVisualization() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Memory Visualization"
        icon={MemoryStick}
        title="Memory Before Execution"
        description="This is the mental picture to keep during interviews."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {memoryItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="font-code text-sm">{item.name}</p>
              <ToneDot tone={item.tone} />
            </div>
            <p className="text-3xl font-headline font-bold">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CodePlayground() {
  const [active, setActive] = useState(0);
  const [lineStep, setLineStep] = useState(0);
  const [ran, setRan] = useState(false);
  const example = playgroundExamples[active];
  const activeLine = example.activeLines[Math.min(lineStep, example.activeLines.length - 1)];

  function reset(nextActive = active) {
    setActive(nextActive);
    setLineStep(0);
    setRan(false);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Code Playground"
        icon={Code2}
        title="Run Hoisting Examples"
        description="Switch between examples, step through execution, and inspect memory and console output."
      />
      <Tabs value={example.title} className="space-y-6">
        <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-3 xl:grid-cols-6">
          {playgroundExamples.map((item, index) => (
            <TabsTrigger
              key={item.title}
              value={item.title}
              onClick={() => reset(index)}
              className="rounded-md"
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {playgroundExamples.map((item) => (
          <TabsContent key={item.title} value={item.title}>
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
                <CardContent className="space-y-5 p-6">
                  <CodePanel code={item.code} activeLine={activeLine} />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setRan(true)} className="rounded-full">
                      <Play className="mr-2 h-4 w-4" />
                      Run
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setLineStep((value) => Math.min(value + 1, item.activeLines.length - 1))}
                      className="rounded-full border-white/10"
                    >
                      Step Execution
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => reset()} className="rounded-full border-white/10">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Console</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {ran ? (
                      item.output.map((line) => (
                        <div key={line} className="rounded-lg border border-white/10 bg-background/70 p-3 font-code text-sm">
                          {line}
                        </div>
                      ))
                    ) : (
                      <p className="rounded-lg border border-white/10 bg-background/70 p-3 text-sm text-muted-foreground">
                        Click Run to see output.
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Memory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {item.memory.map((line) => (
                      <div key={line} className="rounded-lg border border-white/10 bg-background/70 p-3 font-code text-sm">
                        {line}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/45 backdrop-blur-xl md:col-span-2">
                  <CardContent className="p-5">
                    <p className="text-sm leading-7 text-muted-foreground">{item.explanation}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function CommonMistakes() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Common Mistakes"
        icon={AlertTriangle}
        title="Hoisting Traps to Avoid"
        description="Most hoisting bugs come from mixing up prepared memory with real assigned values."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {commonMistakes.map((mistake, index) => (
          <motion.div
            key={mistake}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="rounded-lg border border-red-400/25 bg-red-400/10 p-5 backdrop-blur-xl"
          >
            <X className="mb-4 h-5 w-5 text-red-300" />
            <p className="text-sm leading-6 text-muted-foreground">{mistake}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function RealWorldAndReact() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Real World Examples"
        icon={Zap}
        title="Where Hoisting Shows Up"
        description="Hoisting is not just an interview topic. It affects startup order, modules, utilities, and React files."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {realWorldExamples.map((example, index) => {
          const Icon = example.icon;
          return (
            <motion.article
              key={example.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{example.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{example.text}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {reactExamples.map((example) => (
          <Card key={example.title} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-6">
              <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
                React
              </Badge>
              <h3 className="text-xl font-headline font-bold">{example.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{example.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InterviewQuestions() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Common Interview Questions"
        icon={BookOpenCheck}
        title="Hoisting Interview Prep"
        description="Each answer includes a simple explanation, detailed explanation, interview answer, example, memory trick, and common mistake."
      />
      <Accordion type="single" collapsible defaultValue="question-0" className="rounded-lg border border-white/10 bg-card/35 px-5 backdrop-blur-xl">
        {interviewQuestions.map((item, index) => (
          <AccordionItem key={item.question} value={`question-${index}`} className="border-white/10">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  Q{index + 1}
                </span>
                {item.question}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pb-3 md:grid-cols-2">
                {[
                  ["Simple explanation", item.simple],
                  ["Detailed explanation", item.detailed],
                  ["Interview answer", item.interview],
                  ["Real example", item.example],
                  ["Memory trick", item.trick],
                  ["Common mistake", item.mistake],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-widest text-primary">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Quiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const answered = Object.keys(answers).length;
  const correct = quizQuestions.filter((question, index) => answers[index] === question.correct).length;

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interactive Quiz"
        icon={BookOpenCheck}
        title="Check Your Hoisting Model"
        description="Fifteen interview-style questions with explanations and why each wrong option fails."
      />
      <Card className="mb-6 border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="mt-1 text-2xl font-headline font-bold">
                {answered}/{quizQuestions.length} answered
              </p>
            </div>
            <Badge variant="outline" className="w-fit border-primary/20 bg-background/60 text-primary">
              Score: {correct}/{answered || quizQuestions.length}
            </Badge>
          </div>
          <Progress value={(answered / quizQuestions.length) * 100} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {quizQuestions.map((quiz, index) => {
          const selected = answers[index];
          return (
            <Card key={quiz.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">
                  <span className="font-code text-primary">{index + 1}.</span>{" "}
                  {quiz.question}
                </h3>
                <div className="mt-5 grid gap-2">
                  {quiz.options.map((option) => {
                    const chosen = selected === option;
                    const isCorrect = option === quiz.correct;
                    return (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                        className={cn(
                          "h-auto justify-start whitespace-normal rounded-lg border-white/10 px-4 py-3 text-left",
                          selected && isCorrect && "border-emerald-400/45 bg-emerald-400/10 text-emerald-100",
                          chosen && !isCorrect && "border-red-400/45 bg-red-400/10 text-red-100"
                        )}
                      >
                        {selected ? (
                          isCorrect ? (
                            <Check className="mr-2 h-4 w-4 shrink-0" />
                          ) : chosen ? (
                            <X className="mr-2 h-4 w-4 shrink-0" />
                          ) : null
                        ) : null}
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {selected ? (
                  <div className="mt-5 space-y-3">
                    <p className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">
                      {quiz.explanation}
                    </p>
                    {quiz.options
                      .filter((option) => option !== quiz.correct)
                      .map((option) => (
                        <p key={option} className="text-xs leading-5 text-muted-foreground">
                          <span className="font-semibold text-red-200">{option}:</span>{" "}
                          {quiz.whyWrong[option]}
                        </p>
                      ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function CheatsheetAndBestPractices() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Visual Cheatsheet"
        icon={Clipboard}
        title="Hoisting Summary"
        description="A final comparison table for quick revision before interviews."
      />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-card/45 backdrop-blur-xl">
        <div className="grid grid-cols-4 border-b border-white/10 bg-background/70 p-4 text-sm font-semibold">
          <div>Feature</div>
          <div>var</div>
          <div>let</div>
          <div>const</div>
        </div>
        {cheatsheetRows.map(([feature, varValue, letValue, constValue]) => (
          <div key={feature} className="grid grid-cols-4 border-b border-white/10 p-4 text-sm last:border-b-0">
            <div className="font-semibold">{feature}</div>
            <div className="text-muted-foreground">{varValue}</div>
            <div className="text-muted-foreground">{letValue}</div>
            <div className="text-muted-foreground">{constValue}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {bestPractices.map((practice) => (
          <div key={practice} className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 p-5 backdrop-blur-xl">
            <CheckCircle2 className="mb-4 h-5 w-5 text-emerald-300" />
            <p className="text-sm leading-6 text-muted-foreground">{practice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CopyCodeBlock({
  title,
  code,
  explanation,
}: {
  title: string;
  code: string;
  explanation: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Card className="overflow-hidden border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0 border-white/10">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <CodePanel code={code} />
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{explanation}</p>
      </CardContent>
    </Card>
  );
}

function CopyReadyCodeExamples() {
  return (
    <section className="container mx-auto px-4 pb-24 pt-10">
      <SectionHeader
        badge="Copy-ready Code Examples"
        icon={Clipboard}
        title="Production-Friendly Hoisting Patterns"
        description="Use clear declaration order and deliberate function styles in real projects."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {copyReadyExamples.map((example) => (
          <CopyCodeBlock
            key={example.title}
            title={example.title}
            code={example.code}
            explanation={example.explanation}
          />
        ))}
      </div>
    </section>
  );
}

export function HoistingLesson() {
  const estimatedProgress = useMemo(() => 0, []);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            JavaScript Runtime
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            <span className="gradient-text">Hoisting</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand how JavaScript prepares variables and functions before your code starts executing.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Learn what actually happens during JavaScript&apos;s Memory Creation Phase, why var behaves differently from let and const, how function declarations are hoisted, and how to avoid common interview mistakes.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <Clock className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">Estimated Time</p>
              <p className="font-semibold">13 minutes</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <Gauge className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">Difficulty</p>
              <p className="font-semibold">Beginner</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <BookOpenCheck className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="font-semibold">{estimatedProgress}% Complete</p>
            </div>
          </div>
        </motion.div>
      </section>

      <ConceptOverview />
      <ExecutionFlowTimeline />
      <HoistingVisualizer />
      <HoistingComparison />
      <TemporalDeadZone />
      <FunctionHoistingPlayground />
      <MemoryVisualization />
      <CodePlayground />
      <CommonMistakes />
      <RealWorldAndReact />
      <InterviewQuestions />
      <Quiz />
      <CheatsheetAndBestPractices />
      <CopyReadyCodeExamples />
    </div>
  );
}
