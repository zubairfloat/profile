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
  Gauge,
  GitBranch,
  Layers3,
  MemoryStick,
  Play,
  RefreshCcw,
  RotateCcw,
  Server,
  SkipBack,
  SkipForward,
  Sparkles,
  SquareFunction,
  SquareStack,
  Terminal,
  Workflow,
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

type ScopeLookupStep = {
  scope: string;
  variable: string;
  status: "checking" | "found" | "missing";
};

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
  examTip: string;
  memoryTrick: string;
};

const objectives = [
  "What Execution Context is",
  "Global Execution Context",
  "Function Execution Context",
  "Creation Phase",
  "Execution Phase",
  "Lexical Environment",
  "Variable Environment",
  "Scope Chain",
  "this Binding",
  "Execution Context Stack",
];

const flowSteps = [
  "Source Code",
  "Global Execution Context Created",
  "Memory Creation Phase",
  "Execution Phase",
  "Function Called",
  "Function Execution Context Created",
  "Function Finishes",
  "Execution Context Removed",
  "Program Ends",
];

const visualizerCode = `var name = "Zubair";

function greet() {
  var age = 30;
  console.log(name);
}

greet();`;

const visualizerSteps = [
  {
    title: "Create Global Execution Context",
    activeLine: 0,
    callStack: ["Global()"],
    contextStack: ["Global EC"],
    memory: ["name: undefined", "greet: Function()"],
    scope: ["Global Scope"],
    console: [] as string[],
    note:
      "JavaScript starts by creating the Global Execution Context and reserving memory for global declarations.",
  },
  {
    title: "Execution: name = Zubair",
    activeLine: 1,
    callStack: ["Global()"],
    contextStack: ["Global EC"],
    memory: ["name: Zubair", "greet: Function()"],
    scope: ["Global Scope"],
    console: [] as string[],
    note:
      "During execution, JavaScript assigns the real value to name.",
  },
  {
    title: "Function Called: greet()",
    activeLine: 8,
    callStack: ["greet()", "Global()"],
    contextStack: ["greet Function EC", "Global EC"],
    memory: ["Global name: Zubair", "greet: Function()"],
    scope: ["greet Local Scope", "Global Scope"],
    console: [] as string[],
    note:
      "Calling greet pushes a new function execution context onto the stack.",
  },
  {
    title: "Function Memory Creation",
    activeLine: 3,
    callStack: ["greet()", "Global()"],
    contextStack: ["greet Function EC", "Global EC"],
    memory: ["age: undefined", "Outer reference: Global Scope"],
    scope: ["greet Local Scope", "Global Scope"],
    console: [] as string[],
    note:
      "Inside greet, JavaScript creates memory for local variables and stores an outer scope reference.",
  },
  {
    title: "Function Execution + Scope Lookup",
    activeLine: 5,
    callStack: ["console.log(name)", "greet()", "Global()"],
    contextStack: ["greet Function EC", "Global EC"],
    memory: ["age: 30", "Local name: not found", "Global name: Zubair"],
    scope: ["greet Local Scope", "Global Scope", "Found name"],
    console: ["Zubair"],
    note:
      "name is not inside greet, so JavaScript searches upward through the scope chain and finds name globally.",
  },
  {
    title: "Function Ends",
    activeLine: 6,
    callStack: ["Global()"],
    contextStack: ["Global EC"],
    memory: ["name: Zubair", "greet: Function()"],
    scope: ["Global Scope"],
    console: ["Zubair"],
    note:
      "When greet finishes, its execution context is popped from the stack.",
  },
];

const phaseCards = [
  {
    title: "Creation Phase",
    icon: MemoryStick,
    points: [
      "Creates memory",
      "Stores functions",
      "Stores variables",
      "Initializes var as undefined",
      "Creates scope",
      "Creates this",
    ],
  },
  {
    title: "Execution Phase",
    icon: Play,
    points: [
      "Runs code",
      "Assigns values",
      "Calls functions",
      "Evaluates expressions",
      "Produces output",
    ],
  },
];

const functionContextSteps = [
  "Function Called",
  "Function Context Created",
  "Own Variables",
  "Arguments",
  "this",
  "Outer Scope Reference",
];

const lexicalScopes = [
  {
    name: "Global Scope",
    values: ["company = Google"],
  },
  {
    name: "Function A",
    values: ["team = Frontend"],
  },
  {
    name: "Function B",
    values: ["console.log(company)", "console.log(team)"],
  },
  {
    name: "Function C",
    values: ["can read upward", "cannot read downward"],
  },
];

const lookupSteps: ScopeLookupStep[] = [
  { scope: "Function B", variable: "company", status: "checking" },
  { scope: "Function A", variable: "company", status: "missing" },
  { scope: "Global Scope", variable: "company", status: "found" },
  { scope: "Function B", variable: "team", status: "checking" },
  { scope: "Function A", variable: "team", status: "found" },
];

const variableEnvironmentRows = [
  ["name", "undefined", "Zubair"],
  ["age", "undefined", "30"],
  ["greet", "Function()", "Function()"],
  ["arguments", "Created per function", "Available inside function"],
];

const thisRows = [
  ["Global", "Browser: window", "In browsers, global this points to window."],
  ["Function", "Depends on call site", "Strict mode can make this undefined."],
  ["Method", "Object before the dot", "user.sayHi() sets this to user."],
  ["Arrow Function", "Outer this", "Arrow functions do not create their own this."],
  ["Class", "Instance", "Methods usually use this for the current instance."],
  ["Constructor", "New object", "new User() binds this to the created object."],
];

const stackFlow = ["main()", "login()", "validate()", "payment()", "return", "return", "return"];

const memoryCards = [
  ["Variables", "Names are prepared during creation and updated during execution."],
  ["Functions", "Function declarations are stored as callable functions."],
  ["Arguments", "Each function call receives its own arguments object or parameters."],
  ["this", "The value of this is created for each execution context."],
  ["Scope", "Each context keeps a reference to its outer lexical environment."],
  ["Console Output", "Output appears during execution, not creation."],
];

const playgroundExamples: PlaygroundExample[] = [
  {
    title: "Simple Variable",
    code: `var user = "Zubair";
console.log(user);`,
    output: ["Zubair"],
    memory: ["Creation: user = undefined", "Execution: user = Zubair"],
    explanation:
      "The global context creates user first, then execution assigns the value and logs it.",
    activeLines: [1, 2],
  },
  {
    title: "Nested Functions",
    code: `function outer() {
  var message = "Hello";

  function inner() {
    console.log(message);
  }

  inner();
}

outer();`,
    output: ["Hello"],
    memory: ["outer EC", "inner EC", "message found through outer scope"],
    explanation:
      "Each function call creates a context. inner can read message through the scope chain.",
    activeLines: [1, 4, 5, 8, 11],
  },
  {
    title: "Scope Chain",
    code: `var company = "Google";

function A() {
  let team = "Frontend";

  function B() {
    console.log(company);
    console.log(team);
  }

  B();
}`,
    output: ["Google", "Frontend"],
    memory: ["B scope", "A scope", "Global scope"],
    explanation:
      "JavaScript checks the current scope first, then climbs upward until it finds the variable.",
    activeLines: [1, 3, 6, 7, 8, 11],
  },
  {
    title: "this Example",
    code: `const user = {
  name: "Zubair",
  greet() {
    console.log(this.name);
  }
};

user.greet();`,
    output: ["Zubair"],
    memory: ["this inside greet = user"],
    explanation:
      "Because greet is called as user.greet(), this points to the user object.",
    activeLines: [1, 3, 4, 8],
  },
  {
    title: "Function Execution",
    code: `function add(a, b) {
  const result = a + b;
  return result;
}

add(2, 3);`,
    output: ["5"],
    memory: ["add EC", "a = 2", "b = 3", "result = 5"],
    explanation:
      "Calling add creates a function context with parameters, local variables, this, and an outer reference.",
    activeLines: [1, 2, 3, 6],
  },
  {
    title: "Closure Example",
    code: `function createCounter() {
  let count = 0;

  return function increment() {
    count++;
    return count;
  };
}

const counter = createCounter();
counter();`,
    output: ["1"],
    memory: ["createCounter EC", "count preserved", "increment EC"],
    explanation:
      "The returned function keeps access to count from its outer execution environment.",
    activeLines: [1, 2, 4, 5, 9, 10],
  },
];

const realWorldExamples = [
  ["React Component Rendering", "Every render calls your component function and creates a fresh execution context."],
  ["Express Route Handler", "Each request runs the handler in a new context with request and response references."],
  ["Node.js Module", "The module creates its own top-level environment for exports, imports, and variables."],
  ["API Request", "Callbacks and async handlers create contexts when response data arrives."],
  ["Recursive Function", "Every recursive call adds another execution context to the stack."],
  ["Event Handler", "A click handler creates a context only when the user triggers the event."],
  ["Promise Callback", "then and async continuations run in their own function execution contexts."],
];

const mistakes = [
  "Thinking Execution Context equals Call Stack.",
  "Confusing Scope Chain with Call Stack.",
  "Thinking variables move between contexts.",
  "Misunderstanding this binding.",
  "Ignoring Creation Phase.",
];

const interviewQuestions = [
  {
    question: "What is Execution Context?",
    simple: "It is JavaScript's workspace for running code.",
    technical:
      "An execution context stores the variable environment, lexical environment, this binding, and references needed to execute code.",
    interview:
      "Execution Context is the environment JavaScript creates to execute global code or a function call.",
    example: "Calling greet() creates a new function execution context.",
    trick: "Context equals workspace.",
    mistake: "Confusing the workspace with the stack that stores workspaces.",
  },
  {
    question: "Difference between Global and Function Execution Context?",
    simple:
      "Global context runs the whole file. Function context runs one function call.",
    technical:
      "The Global Execution Context is created once for a script or module. A Function Execution Context is created every time a function is invoked.",
    interview:
      "Global EC contains global variables and functions. Function EC contains local variables, arguments, this, and an outer reference.",
    example: "A page creates one global context, but every click handler call creates a function context.",
    trick: "Global once, function per call.",
    mistake: "Thinking one function has only one context forever.",
  },
  {
    question: "What happens during Creation Phase?",
    simple:
      "JavaScript prepares memory before running lines.",
    technical:
      "It creates variable and lexical environments, stores function declarations, initializes var as undefined, keeps let and const uninitialized, and sets this.",
    interview:
      "Creation phase is setup: memory allocation, function storage, scope creation, and this binding.",
    example: "var name exists as undefined before assignment.",
    trick: "Setup before run.",
    mistake: "Thinking assignments happen during creation.",
  },
  {
    question: "What happens during Execution Phase?",
    simple:
      "JavaScript runs the code line by line.",
    technical:
      "It assigns values, executes expressions, invokes functions, creates new contexts, and produces output.",
    interview:
      "Execution phase is the runtime phase where statements are evaluated and function calls push new contexts.",
    example: "name = 'Zubair' happens during execution.",
    trick: "Run after setup.",
    mistake: "Thinking memory creation logs console output.",
  },
  {
    question: "What is Variable Environment?",
    simple:
      "It is the memory area for variables inside a context.",
    technical:
      "The variable environment stores var declarations and function-scoped bindings for the execution context.",
    interview:
      "Variable Environment is the record where variable bindings are stored and updated during execution.",
    example: "age starts as undefined, then becomes 30 inside greet.",
    trick: "Variable environment equals variable memory.",
    mistake: "Thinking variables move into parent contexts.",
  },
  {
    question: "What is Lexical Environment?",
    simple:
      "It is the current scope plus a link to the outer scope.",
    technical:
      "A lexical environment contains an environment record and an outer lexical environment reference.",
    interview:
      "Lexical Environment is how JavaScript knows where variables live based on where code is written.",
    example: "inner() can access variables from outer() because of lexical scope.",
    trick: "Lexical means where written.",
    mistake: "Thinking lexical scope depends on where a function is called.",
  },
  {
    question: "What is Scope Chain?",
    simple:
      "It is the upward search path for variables.",
    technical:
      "If a variable is not found in the current lexical environment, JavaScript checks outer environments until it reaches global scope.",
    interview:
      "Scope Chain is the chain of lexical environments used to resolve identifiers.",
    example: "B finds team in A and company globally.",
    trick: "Search upward, never downward.",
    mistake: "Confusing it with the call stack order.",
  },
  {
    question: "How does this get assigned?",
    simple:
      "this depends on how a function is called.",
    technical:
      "For normal functions, this is determined by the call site. For arrow functions, this is lexically inherited from the outer scope.",
    interview:
      "this binding is created for each execution context and usually depends on invocation style.",
    example: "user.greet() makes this equal user.",
    trick: "Look left of the dot.",
    mistake: "Assuming this always means the function itself.",
  },
  {
    question: "Difference between Execution Context Stack and Call Stack?",
    simple:
      "The stack stores execution contexts in call order.",
    technical:
      "The call stack is the data structure. Execution contexts are the items pushed onto and popped from it.",
    interview:
      "Execution Context Stack and Call Stack are closely related; the call stack tracks active execution contexts.",
    example: "main calls login calls validate, so validate is on top.",
    trick: "Stack is the pile. Contexts are the cards.",
    mistake: "Treating scope lookup as stack lookup.",
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "What is an Execution Context?",
    options: [
      "A workspace JavaScript creates to run code",
      "Only the browser console",
      "A CSS layout phase",
      "A database connection",
    ],
    correct: "A workspace JavaScript creates to run code",
    explanation:
      "An execution context stores the environment needed to run global code or a function call.",
    whyWrong: {
      "Only the browser console": "The console can show output, but it is not the execution context.",
      "A CSS layout phase": "Execution context is JavaScript runtime behavior.",
      "A database connection": "It is unrelated to databases.",
    },
    examTip: "Workspace for running JavaScript code = Execution Context.",
    memoryTrick: "Context is the desk where JavaScript works.",
  },
  {
    question: "How many Global Execution Contexts are created for a normal script?",
    options: ["One", "One per function", "One per variable", "Zero"],
    correct: "One",
    explanation:
      "A script starts with one global execution context. Function calls create additional function contexts.",
    whyWrong: {
      "One per function": "That describes function execution contexts.",
      "One per variable": "Variables are stored inside contexts.",
      Zero: "JavaScript needs a global context to begin running code.",
    },
    examTip: "Global is created first and usually once.",
    memoryTrick: "One page, one global workspace.",
  },
  {
    question: "When is a Function Execution Context created?",
    options: [
      "Every time a function is called",
      "Only when a function is declared",
      "Only during CSS rendering",
      "Only when a variable is assigned",
    ],
    correct: "Every time a function is called",
    explanation:
      "A new function execution context is created on each invocation.",
    whyWrong: {
      "Only when a function is declared": "Declaration stores the function; calling it creates the context.",
      "Only during CSS rendering": "CSS rendering is unrelated.",
      "Only when a variable is assigned": "Assignment happens during execution but does not itself create a function context.",
    },
    examTip: "Function call = new function context.",
    memoryTrick: "Call it, create it.",
  },
  {
    question: "What happens during Creation Phase?",
    options: [
      "Memory and scope are prepared",
      "All console logs execute",
      "All functions are removed",
      "Network requests are sent automatically",
    ],
    correct: "Memory and scope are prepared",
    explanation:
      "Creation Phase prepares variables, functions, scope, and this binding.",
    whyWrong: {
      "All console logs execute": "Console logs run during execution phase.",
      "All functions are removed": "Functions are stored, not removed.",
      "Network requests are sent automatically": "Requests happen only when code executes them.",
    },
    examTip: "Creation means setup.",
    memoryTrick: "Prepare before play.",
  },
  {
    question: "What happens during Execution Phase?",
    options: [
      "Code runs line by line",
      "Only memory is reserved",
      "Scope chains disappear",
      "this is never used",
    ],
    correct: "Code runs line by line",
    explanation:
      "Execution Phase assigns values, calls functions, evaluates expressions, and produces output.",
    whyWrong: {
      "Only memory is reserved": "That describes creation phase.",
      "Scope chains disappear": "Scope chains are used during execution for lookup.",
      "this is never used": "this is available based on invocation style.",
    },
    examTip: "Execution means line-by-line runtime.",
    memoryTrick: "Creation sets the stage; execution performs.",
  },
  {
    question: "What does the call stack store?",
    options: [
      "Active execution contexts",
      "CSS rules",
      "Only global variables",
      "Database rows",
    ],
    correct: "Active execution contexts",
    explanation:
      "The call stack tracks which execution contexts are currently active.",
    whyWrong: {
      "CSS rules": "CSS is unrelated.",
      "Only global variables": "Variables live inside contexts; the stack stores active contexts.",
      "Database rows": "The JavaScript call stack does not store database rows.",
    },
    examTip: "Call stack = stack of active contexts.",
    memoryTrick: "Stack stores workspaces.",
  },
  {
    question: "What is the Scope Chain used for?",
    options: [
      "Looking up variables through outer scopes",
      "Ordering HTTP requests",
      "Styling components",
      "Deleting functions",
    ],
    correct: "Looking up variables through outer scopes",
    explanation:
      "JavaScript checks the current scope first, then outer scopes until the variable is found or global scope is reached.",
    whyWrong: {
      "Ordering HTTP requests": "HTTP ordering is not scope resolution.",
      "Styling components": "Styling is unrelated to scope chain.",
      "Deleting functions": "Scope chain does not delete functions.",
    },
    examTip: "Variable missing locally? Search upward.",
    memoryTrick: "Scope chain is a ladder upward.",
  },
  {
    question: "What is Lexical Environment?",
    options: [
      "A scope record plus outer reference",
      "The browser address bar",
      "A CSS selector",
      "Only a React hook",
    ],
    correct: "A scope record plus outer reference",
    explanation:
      "Lexical Environment contains local bindings and a reference to the outer lexical environment.",
    whyWrong: {
      "The browser address bar": "That is not JavaScript runtime memory.",
      "A CSS selector": "CSS selectors are not lexical environments.",
      "Only a React hook": "React hooks use JavaScript, but lexical environments are language-level.",
    },
    examTip: "Lexical means based on where code is written.",
    memoryTrick: "Lexical = local record + outer link.",
  },
  {
    question: "What does JavaScript search first when resolving a variable?",
    options: [
      "Current scope",
      "Global scope always",
      "Random parent scope",
      "Browser cache",
    ],
    correct: "Current scope",
    explanation:
      "JavaScript starts in the current lexical environment, then moves outward.",
    whyWrong: {
      "Global scope always": "Global is checked after closer scopes.",
      "Random parent scope": "Lookup follows lexical structure, not randomness.",
      "Browser cache": "Browser cache is unrelated.",
    },
    examTip: "Current first, parent next, global last.",
    memoryTrick: "Search near before far.",
  },
  {
    question: "For a normal method call user.greet(), what is this usually?",
    options: ["user", "window always", "undefined always", "the function source code"],
    correct: "user",
    explanation:
      "For method calls, this usually points to the object before the dot.",
    whyWrong: {
      "window always": "Global this may be window, but method calls bind this to the object.",
      "undefined always": "Strict mode affects plain function calls, not normal method calls like this.",
      "the function source code": "this is a value, not source text.",
    },
    examTip: "Method call this = object before dot.",
    memoryTrick: "Look left of the dot.",
  },
  {
    question: "How do arrow functions handle this?",
    options: [
      "They inherit this from outer scope",
      "They always create a new this",
      "They always bind this to window",
      "They erase this",
    ],
    correct: "They inherit this from outer scope",
    explanation:
      "Arrow functions do not create their own this binding.",
    whyWrong: {
      "They always create a new this": "That is the opposite of arrow function behavior.",
      "They always bind this to window": "They inherit this from where they are created.",
      "They erase this": "They can still read outer this.",
    },
    examTip: "Arrow function this is lexical.",
    memoryTrick: "Arrow borrows this.",
  },
  {
    question: "What is the Variable Environment responsible for?",
    options: [
      "Storing variable bindings",
      "Painting pixels",
      "Handling DNS",
      "Creating HTML tags",
    ],
    correct: "Storing variable bindings",
    explanation:
      "Variable Environment stores and updates variable bindings for the execution context.",
    whyWrong: {
      "Painting pixels": "Painting is a browser rendering concern.",
      "Handling DNS": "DNS is networking.",
      "Creating HTML tags": "DOM creation is separate from execution context memory.",
    },
    examTip: "Variable Environment = variable storage.",
    memoryTrick: "Variables live in variable memory.",
  },
  {
    question: "What happens when a function finishes?",
    options: [
      "Its execution context is popped from the stack",
      "The global context is always deleted",
      "All variables in the program are deleted",
      "The browser closes",
    ],
    correct: "Its execution context is popped from the stack",
    explanation:
      "When a function completes, its context is removed from the call stack.",
    whyWrong: {
      "The global context is always deleted": "Global context remains until the program or page ends.",
      "All variables in the program are deleted": "Only that function context is removed, except retained closures.",
      "The browser closes": "Function completion does not close the browser.",
    },
    examTip: "Function return = pop context.",
    memoryTrick: "Done means pop.",
  },
  {
    question: "Which statement is correct?",
    options: [
      "Every function call creates a new execution context",
      "Every variable creates a new call stack",
      "Scope chain searches downward first",
      "Creation phase happens after execution",
    ],
    correct: "Every function call creates a new execution context",
    explanation:
      "A function creates a new execution context each time it is invoked.",
    whyWrong: {
      "Every variable creates a new call stack": "Variables are stored inside contexts.",
      "Scope chain searches downward first": "Scope lookup searches upward through outer scopes.",
      "Creation phase happens after execution": "Creation happens before execution.",
    },
    examTip: "Per call, not per declaration.",
    memoryTrick: "New call, new context.",
  },
  {
    question: "What is the best mental model for Execution Context?",
    options: [
      "A workspace containing memory, scope, and this",
      "A permanent database table",
      "A CSS animation frame",
      "A package manager",
    ],
    correct: "A workspace containing memory, scope, and this",
    explanation:
      "Execution Context is easiest to understand as a workspace JavaScript creates to run code.",
    whyWrong: {
      "A permanent database table": "Contexts are runtime structures and can be removed.",
      "A CSS animation frame": "CSS animation is unrelated.",
      "A package manager": "Package managers install dependencies, not run code contexts.",
    },
    examTip: "Memory, scope, this = execution context.",
    memoryTrick: "Workspace with drawers.",
  },
];

const cheatsheetRows = [
  ["Execution Context", "Workspace JavaScript creates to run code"],
  ["Call Stack", "Stack that tracks active execution contexts"],
  ["Scope Chain", "Upward variable lookup path"],
  ["Lexical Environment", "Current scope record plus outer reference"],
  ["Variable Environment", "Variable binding storage"],
  ["this", "Value assigned based on invocation style"],
  ["Creation Phase", "Memory, scope, and this setup"],
  ["Execution Phase", "Line-by-line code execution"],
  ["Global EC", "Created first for top-level code"],
  ["Function EC", "Created every time a function is called"],
];

const bestPractices = [
  "Understand Creation Phase first.",
  "Remember every function creates a new Execution Context.",
  "Learn Scope Chain before Closures.",
  "Understand this separately.",
  "Never confuse Execution Context with the Call Stack.",
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

function ConceptOverview() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-headline font-bold">What is Execution Context?</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Think of Execution Context as JavaScript&apos;s workspace. Whenever
              JavaScript starts or a function runs, it creates a brand-new
              workspace where variables, functions, and the value of this are
              stored.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">
              Every function call gets its own workspace. When the function
              finishes, that workspace is removed from the stack.
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
        badge="Execution Flow"
        icon={Workflow}
        title="From Source Code to Program End"
        description="Execution Context is easier when you see the full lifecycle as a sequence."
      />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-9">
        {flowSteps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="relative rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm text-primary">
              {index + 1}
            </div>
            <p className="text-sm font-semibold leading-6">{step}</p>
            {index < flowSteps.length - 1 ? (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary xl:block" />
            ) : null}
            {index < flowSteps.length - 1 ? (
              <ArrowDown className="mx-auto mt-3 h-5 w-5 text-primary xl:hidden" />
            ) : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ExecutionContextVisualizer() {
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
        title="Execution Context Simulator"
        description="Step through source code, call stack, execution context stack, memory, scope chain, and console output."
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
                Next
                <SkipForward className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (step >= visualizerSteps.length - 1) setStep(0);
                  setAutoPlay((value) => !value);
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
          {[
            ["Call Stack", current.callStack, SquareStack],
            ["Execution Context Stack", current.contextStack, Layers3],
            ["Memory", current.memory, MemoryStick],
            ["Scope Chain", current.scope, GitBranch],
          ].map(([title, items, Icon]) => {
            const DisplayIcon = Icon as LucideIcon;
            return (
              <Card key={title as string} className="border-border/60 bg-card/45 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DisplayIcon className="h-5 w-5 text-primary" />
                    {title as string}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(items as string[]).map((item) => (
                    <motion.div
                      key={`${step}-${item}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-white/10 bg-background/60 px-4 py-3 font-code text-xs text-muted-foreground"
                    >
                      {item}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-border/60 bg-card/45 backdrop-blur-xl md:col-span-2">
            <CardContent className="grid gap-5 p-6 md:grid-cols-[0.7fr_1.3fr]">
              <div className="rounded-lg border border-white/10 bg-background/80 p-4 font-code text-sm">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Console</p>
                {current.console.length ? (
                  current.console.map((line) => (
                    <motion.div key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary">
                      {line}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-muted-foreground">(empty)</span>
                )}
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <Badge variant="outline" className="mb-3 border-primary/20 bg-background/60 text-primary">
                  {current.title}
                </Badge>
                <p className="text-sm leading-7 text-muted-foreground">{current.note}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function PhaseComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Creation vs Execution"
        icon={Layers3}
        title="Two Phases of Every Context"
        description="Each execution context starts with setup, then runs code."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {phaseCards.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <motion.article
              key={phase.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-headline font-bold">{phase.title}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {phase.points.map((point) => (
                  <div key={point} className="flex gap-3 rounded-lg border border-white/10 bg-background/60 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function GlobalExecutionContext() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Global Execution Context"
        icon={Server}
        title="The First Workspace"
        description="In the browser, the global context is connected to the window object. Node.js has a different global object model."
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            {["Browser", "Window Object", "Global Execution Context", "Variables", "Functions", "this"].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs text-primary">
                  {index + 1}
                </div>
                <div className="my-2 flex-1 rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm">
                  {item}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <p className="font-code text-sm text-primary">Browser example</p>
            <div className="mt-4 rounded-lg border border-white/10 bg-background/80 p-4 font-code text-sm">
              this === window // true in browser global script
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              In Node.js, the global model is different. Top-level this in a
              CommonJS module is not the same as browser window. For interviews,
              remember the concept: every environment still creates a top-level
              execution context.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FunctionExecutionContext() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Function Execution Context"
        icon={SquareFunction}
        title="Every Function Call Gets a Workspace"
        description="A function context has its own memory, arguments, this, and an outer scope reference."
      />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {functionContextSteps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm text-primary">
              {index + 1}
            </div>
            <p className="text-sm font-semibold leading-6">{step}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function LexicalEnvironment() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Lexical Environment"
        icon={GitBranch}
        title="Nested Scopes and Upward Lookup"
        description="JavaScript searches the current scope first, then moves upward. It never searches downward."
      />
      <div className="grid gap-4 lg:grid-cols-4">
        {lexicalScopes.map((scope, index) => (
          <motion.div
            key={scope.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className={cn(
              "rounded-lg border p-5 backdrop-blur-xl",
              index === 0 ? "border-primary/30 bg-primary/10" : "border-white/10 bg-card/45"
            )}
          >
            <h3 className="font-semibold">{scope.name}</h3>
            <div className="mt-4 space-y-2">
              {scope.values.map((value) => (
                <div key={value} className="rounded-lg border border-white/10 bg-background/60 px-3 py-2 font-code text-xs text-muted-foreground">
                  {value}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ScopeChainVisualizer() {
  const [lookup, setLookup] = useState(0);
  const current = lookupSteps[lookup];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Scope Chain Visualizer"
        icon={GitBranch}
        title="Watch Variable Lookup"
        description="The lookup starts in the current scope, then climbs toward the global scope."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <CodePanel
              code={`var company = "Google";

function A() {
  let team = "Frontend";

  function B() {
    console.log(company);
    console.log(team);
  }
}`}
              activeLine={current.variable === "company" ? 7 : 8}
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                onClick={() => setLookup((value) => Math.max(0, value - 1))}
                variant="outline"
                className="rounded-full border-white/10"
              >
                <SkipBack className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={() => setLookup((value) => Math.min(lookupSteps.length - 1, value + 1))}
                className="rounded-full"
              >
                Next Lookup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">Looking for</p>
              <p className="mt-1 font-code text-2xl text-primary">{current.variable}</p>
            </div>
            <div className="space-y-3">
              {lookupSteps.slice(0, lookup + 1).map((item, index) => (
                <motion.div
                  key={`${item.scope}-${item.variable}-${index}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "rounded-lg border p-4",
                    item.status === "found"
                      ? "border-emerald-400/40 bg-emerald-400/10"
                      : item.status === "missing"
                        ? "border-red-400/35 bg-red-400/10"
                        : "border-yellow-400/35 bg-yellow-400/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.scope}</p>
                    <Badge variant="outline" className="border-white/10 bg-background/60">
                      {item.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function VariableEnvironment() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Variable Environment"
        icon={MemoryStick}
        title="Initial Values Become Current Values"
        description="Creation prepares memory; execution updates that memory."
      />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-card/45 backdrop-blur-xl">
        <div className="grid grid-cols-3 border-b border-white/10 bg-background/70 p-4 text-sm font-semibold">
          <div>Variable</div>
          <div>Initial Value</div>
          <div>Current Value</div>
        </div>
        {variableEnvironmentRows.map(([variable, initial, current]) => (
          <div key={variable} className="grid grid-cols-3 border-b border-white/10 p-4 text-sm last:border-b-0">
            <div className="font-code text-primary">{variable}</div>
            <div className="text-muted-foreground">{initial}</div>
            <div className="text-muted-foreground">{current}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThisBinding() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="this Binding"
        icon={Zap}
        title="What this Points To"
        description="this is created for execution contexts, but its value depends on how code is called."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {thisRows.map(([kind, pointsTo, detail]) => (
          <Card key={kind} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{kind}</p>
              <p className="mt-2 text-xl font-headline font-bold text-primary">{pointsTo}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CallStackIntegration() {
  const [depth, setDepth] = useState(0);
  const stackItems = stackFlow.slice(0, Math.min(depth + 1, 4));
  const returning = depth > 3;
  const displayItems = returning ? stackFlow.slice(Math.max(0, 7 - depth), 4) : stackItems;

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Call Stack Integration"
        icon={SquareStack}
        title="Push, Run, Pop"
        description="The call stack grows when functions call functions and shrinks when they return."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <Button
              onClick={() => setDepth((value) => Math.min(stackFlow.length - 1, value + 1))}
              className="w-full rounded-full"
            >
              Step Stack
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setDepth(0)}
              className="w-full rounded-full border-white/10"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <p className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
              {returning
                ? "Functions are returning, so contexts are being popped."
                : "Functions are being called, so contexts are being pushed."}
            </p>
          </div>
          <div className="flex min-h-72 flex-col-reverse gap-3 rounded-lg border border-white/10 bg-background/60 p-5">
            {displayItems.map((item) => (
              <motion.div
                key={`${depth}-${item}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-primary/20 bg-primary/10 p-4 font-code text-sm"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function MemoryVisualization() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Memory Visualization"
        icon={MemoryStick}
        title="What Lives Inside a Context"
        description="Creation Phase prepares the containers. Execution Phase fills and updates them."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {memoryCards.map(([title, text], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
          >
            <MemoryStick className="mb-4 h-5 w-5 text-primary" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
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
  const [copied, setCopied] = useState(false);
  const example = playgroundExamples[active];
  const activeLine = example.activeLines[Math.min(lineStep, example.activeLines.length - 1)];

  function reset(nextActive = active) {
    setActive(nextActive);
    setLineStep(0);
    setRan(false);
    setCopied(false);
  }

  async function copyCode() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Code Playground"
        icon={Code2}
        title="Run Execution Context Examples"
        description="Each example includes run, reset, step-by-step highlighting, copy, console, memory, and explanation."
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
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <Button variant="outline" size="icon" onClick={copyCode} className="border-white/10">
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-5">
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
                      Step by Step
                    </Button>
                    <Button variant="outline" onClick={() => reset()} className="rounded-full border-white/10">
                      <RefreshCcw className="mr-2 h-4 w-4" />
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

function RealWorldExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Real World Examples"
        icon={Boxes}
        title="Execution Contexts in Real Projects"
        description="Every function creates a context, whether it is rendering UI, handling a request, or processing an event."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {realWorldExamples.map(([title, text], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl"
          >
            <SquareFunction className="mb-4 h-5 w-5 text-primary" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function CommonMistakes() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Common Mistakes"
        icon={AlertTriangle}
        title="Avoid These Mental Model Bugs"
        description="These are the mistakes that make execution context feel harder than it is."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {mistakes.map((mistake, index) => (
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

function InterviewQuestions() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Common Interview Questions"
        icon={BookOpenCheck}
        title="Execution Context Interview Prep"
        description="Every answer includes a simple explanation, technical explanation, interview answer, real-world example, memory trick, and common mistake."
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
                  ["Technical explanation", item.technical],
                  ["Interview answer", item.interview],
                  ["Real-world example", item.example],
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
        title="Check Your Execution Context Model"
        description="Fifteen multiple-choice questions with explanations, wrong-answer reasoning, exam tips, and memory tricks."
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
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
                        <span className="font-semibold text-primary">Exam tip:</span>{" "}
                        {quiz.examTip}
                      </div>
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
                        <span className="font-semibold text-primary">Memory trick:</span>{" "}
                        {quiz.memoryTrick}
                      </div>
                    </div>
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
    <section className="container mx-auto px-4 pb-24 pt-10">
      <SectionHeader
        badge="Visual Cheatsheet"
        icon={Clipboard}
        title="Execution Context Summary"
        description="Quick revision for the terms that usually get mixed together."
      />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-card/45 backdrop-blur-xl">
        <div className="grid grid-cols-[0.8fr_1.2fr] border-b border-white/10 bg-background/70 p-4 text-sm font-semibold">
          <div>Concept</div>
          <div>Meaning</div>
        </div>
        {cheatsheetRows.map(([concept, meaning]) => (
          <div key={concept} className="grid grid-cols-[0.8fr_1.2fr] border-b border-white/10 p-4 text-sm last:border-b-0">
            <div className="font-semibold text-primary">{concept}</div>
            <div className="text-muted-foreground">{meaning}</div>
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

export function ExecutionContextLesson() {
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
            <span className="gradient-text">Execution Context</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand how JavaScript creates execution environments, manages variables, resolves scope, and executes your code step by step.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Learn how Global Execution Context, Function Execution Context, Lexical Environment, Variable Environment, Scope Chain, and this binding work together behind the scenes.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <Clock className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">Estimated Time</p>
              <p className="font-semibold">15 minutes</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <Gauge className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">Difficulty</p>
              <p className="font-semibold">Intermediate</p>
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
      <ExecutionContextVisualizer />
      <PhaseComparison />
      <GlobalExecutionContext />
      <FunctionExecutionContext />
      <LexicalEnvironment />
      <ScopeChainVisualizer />
      <VariableEnvironment />
      <ThisBinding />
      <CallStackIntegration />
      <MemoryVisualization />
      <CodePlayground />
      <RealWorldExamples />
      <CommonMistakes />
      <InterviewQuestions />
      <Quiz />
      <CheatsheetAndBestPractices />
    </div>
  );
}
