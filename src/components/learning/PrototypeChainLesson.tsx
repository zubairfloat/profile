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
  Database,
  GitBranch,
  Layers3,
  Link2,
  MemoryStick,
  Play,
  RefreshCcw,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  SquareFunction,
  SquareStack,
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
  memoryTrick: string;
  interviewTip: string;
};

const objectives = [
  "What the Prototype Chain is",
  "How JavaScript searches for properties",
  "Why objects can use methods they do not own",
  "How arrays, strings, and functions get built-in methods",
  "Why Object.prototype and null matter",
  "How prototype-based inheritance differs from Java or C# classes",
  "How to explain prototypes in interviews",
  "Common prototype mistakes",
];

const lookupSteps = [
  {
    label: "Search person",
    target: "person",
    property: "name",
    result: "Found",
    detail: "person has its own name property, so lookup stops immediately.",
  },
  {
    label: "Search dog",
    target: "dog",
    property: "eat",
    result: "Not Found",
    detail: "dog does not own eat, so JavaScript follows the prototype link.",
  },
  {
    label: "Follow Prototype",
    target: "animal",
    property: "eat",
    result: "Found",
    detail: "animal has eat(), so JavaScript returns and executes that function.",
  },
];

const visualizerCode = `const animal = {
  eat() {
    return "Eating";
  }
};

const dog = Object.create(animal);
dog.name = "Tom";

console.log(dog.eat());`;

const visualizerSteps = [
  {
    title: "Create animal",
    activeLine: 1,
    currentObject: ["animal.eat: Function()"],
    prototype: ["Object.prototype"],
    chain: ["animal", "Object.prototype", "null"],
    memory: ["animal -> { eat() }"],
    console: [] as string[],
    note: "The animal object owns the shared eat method.",
  },
  {
    title: "Create dog with Object.create",
    activeLine: 7,
    currentObject: ["dog: empty object"],
    prototype: ["[[Prototype]] -> animal"],
    chain: ["dog", "animal", "Object.prototype", "null"],
    memory: ["dog -> animal", "animal -> { eat() }"],
    console: [] as string[],
    note: "Object.create(animal) creates dog and links dog to animal as its prototype.",
  },
  {
    title: "Assign dog.name",
    activeLine: 8,
    currentObject: ["dog.name: Tom"],
    prototype: ["animal.eat: Function()"],
    chain: ["dog", "animal", "Object.prototype", "null"],
    memory: ["dog -> { name: Tom }", "dog.[[Prototype]] -> animal"],
    console: [] as string[],
    note: "name is stored directly on dog. It is not copied to animal.",
  },
  {
    title: "Search dog for eat",
    activeLine: 10,
    currentObject: ["dog.name: Tom", "eat: not found"],
    prototype: ["animal.eat: Function()"],
    chain: ["dog", "animal", "Object.prototype", "null"],
    memory: ["Lookup starts on dog"],
    console: [] as string[],
    note: "JavaScript first checks the current object. dog does not own eat.",
  },
  {
    title: "Follow prototype and execute",
    activeLine: 10,
    currentObject: ["dog.name: Tom"],
    prototype: ["animal.eat: Function() found"],
    chain: ["dog", "animal", "Object.prototype", "null"],
    memory: ["Shared method reused from animal"],
    console: ["Eating"],
    note: "JavaScript follows the prototype link, finds eat on animal, then executes it.",
  },
];

const chainNodes = ["dog", "animal", "Object.prototype", "null"];

const constructorCode = `function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return "Hello";
};

const user = new Person("Zubair");
user.sayHello();`;

const classCode = `class Person {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return "Hello";
  }
}

const user = new Person("Zubair");`;

const comparisonCards = [
  {
    title: "prototype",
    text: "Belongs to constructor functions and contains methods shared by objects created with new.",
    points: ["Constructor property", "Used when creating objects", "Contains shared methods"],
  },
  {
    title: "__proto__",
    text: "Belongs to objects and points to the next object in the prototype chain.",
    points: ["Object link", "Used during lookup", "Points to prototype"],
  },
  {
    title: "constructor",
    text: "A reference commonly available through the prototype back to the constructor function.",
    points: ["Reference to constructor", "Useful for inspection", "Not the lookup chain itself"],
  },
];

const beginnerExamples = [
  {
    title: "Example 1: Basic Prototype Chain",
    code: `const animal = {
  eat() {
    console.log("Eating...");
  }
};

const dog = {
  bark() {
    console.log("Woof!");
  }
};

Object.setPrototypeOf(dog, animal);

dog.bark();
dog.eat();`,
    output: ["Woof!", "Eating..."],
    explanation:
      "dog owns bark(), but it does not own eat(). JavaScript follows dog's prototype link to animal and finds eat() there.",
  },
  {
    title: "Example 2: Property Lookup",
    code: `const person = {
  country: "Pakistan"
};

const employee = {
  name: "Zubair"
};

Object.setPrototypeOf(employee, person);

console.log(employee.name);
console.log(employee.country);`,
    output: ["Zubair", "Pakistan"],
    explanation:
      "name is found directly on employee. country is not found on employee, so JavaScript checks person and returns Pakistan.",
  },
  {
    title: "Example 3: Multiple Prototype Levels",
    code: `const grandParent = {
  city: "Lahore"
};

const parent = {
  car: "Honda"
};

const child = {
  laptop: "MacBook"
};

Object.setPrototypeOf(parent, grandParent);
Object.setPrototypeOf(child, parent);

console.log(child.city);`,
    output: ["Lahore"],
    explanation:
      "city is not on child or parent. JavaScript keeps walking upward and finds city on grandParent.",
  },
];

const builtInChains = [
  {
    title: "Array",
    code: `const numbers = [10, 20, 30];

numbers.push(40);`,
    question: "Where does push() come from?",
    answer:
      "It comes from Array.prototype. The array instance does not store a separate copy of push().",
    chain: ["numbers", "Array.prototype", "Object.prototype", "null"],
  },
  {
    title: "String",
    code: `const name = "Zubair";

console.log(name.toUpperCase());`,
    question: "Where does toUpperCase() come from?",
    answer:
      "JavaScript temporarily wraps the primitive string and looks up toUpperCase() on String.prototype.",
    chain: ["name", "String.prototype", "Object.prototype", "null"],
  },
  {
    title: "Function",
    code: `function greet() {}

greet.call(null);`,
    question: "Where does call() come from?",
    answer:
      "Functions are objects too. call() is found through Function.prototype.",
    chain: ["greet", "Function.prototype", "Object.prototype", "null"],
  },
];

const visualSearchSteps: Array<{ label: string; success: boolean }> = [
  { label: "Does child have city?", success: false },
  { label: "Check prototype", success: false },
  { label: "Check next prototype", success: true },
  { label: "Return value", success: true },
];

const playgroundExamples: PlaygroundExample[] = [
  {
    title: "Object.create()",
    code: `const animal = {
  eat() {
    return "Eating";
  }
};

const dog = Object.create(animal);
dog.eat();`,
    output: ["Eating"],
    memory: ["dog -> animal", "animal.eat shared"],
    explanation: "Object.create() creates a new object with the parent object as its prototype.",
    activeLines: [1, 7, 8],
  },
  {
    title: "Constructor Function",
    code: constructorCode,
    output: ["Hello"],
    memory: ["user -> Person.prototype", "Person.prototype.sayHello shared"],
    explanation: "new Person() links the created object to Person.prototype.",
    activeLines: [1, 5, 9, 10],
  },
  {
    title: "Prototype Method",
    code: `function Cart() {
  this.items = [];
}

Cart.prototype.add = function(item) {
  this.items.push(item);
};

const cart = new Cart();
cart.add("Keyboard");`,
    output: ["items: Keyboard"],
    memory: ["cart owns items", "Cart.prototype owns add"],
    explanation: "Methods on the prototype are shared instead of copied into every instance.",
    activeLines: [1, 5, 9, 10],
  },
  {
    title: "ES6 Class",
    code: classCode,
    output: ["Hello"],
    memory: ["class syntax", "methods on Person.prototype"],
    explanation: "Classes are cleaner syntax over JavaScript's prototype system.",
    activeLines: [1, 6, 11],
  },
  {
    title: "Inheritance",
    code: `const animal = {
  breathe() {
    return "Breathing";
  }
};

const dog = Object.create(animal);
const retriever = Object.create(dog);

retriever.breathe();`,
    output: ["Breathing"],
    memory: ["retriever -> dog -> animal"],
    explanation: "Lookup can travel through multiple prototype levels until it finds a property.",
    activeLines: [1, 7, 8, 10],
  },
  {
    title: "Property Lookup",
    code: `const user = { name: "Zubair" };

user.name;
user.toString();`,
    output: ["Zubair", "[object Object]"],
    memory: ["name found on user", "toString found on Object.prototype"],
    explanation: "Own properties are found first. Built-in methods can come from Object.prototype.",
    activeLines: [1, 3, 4],
  },
  {
    title: "Shared Methods",
    code: `function User(name) {
  this.name = name;
}

User.prototype.login = function() {
  return this.name + " logged in";
};

const a = new User("A");
const b = new User("B");`,
    output: ["Both users share one login function"],
    memory: ["a -> User.prototype", "b -> User.prototype", "one shared login"],
    explanation: "Prototype methods save memory because instances share a single method reference.",
    activeLines: [1, 5, 9, 10],
  },
  {
    title: "Prototype Override",
    code: `const animal = {
  speak() {
    return "generic sound";
  }
};

const dog = Object.create(animal);
dog.speak = function() {
  return "bark";
};

dog.speak();`,
    output: ["bark"],
    memory: ["dog.speak shadows animal.speak"],
    explanation: "If an object owns a property, lookup stops there and does not use the prototype version.",
    activeLines: [1, 7, 8, 12],
  },
];

const realWorldExamples = [
  "React Components",
  "Express Request Object",
  "Node.js Streams",
  "Arrays",
  "Dates",
  "Maps",
  "Sets",
  "DOM Elements",
];

const mistakes = [
  "Thinking prototype copies methods.",
  "Confusing prototype with __proto__.",
  "Thinking classes replace prototypes.",
  "Editing Object.prototype.",
  "Breaking inheritance by overwriting prototype incorrectly.",
];

const interviewQuestions = [
  {
    question: "What is Prototype?",
    simple: "A prototype is a hidden link from one object to another object.",
    technical: "Each object has an internal [[Prototype]] reference used for property lookup.",
    interview: "A prototype is the object JavaScript checks when a property is not found on the current object.",
    example: "dog can use animal.eat through its prototype link.",
    trick: "Prototype is the backup place to search.",
    mistake: "Thinking prototype means properties are copied.",
  },
  {
    question: "What is Prototype Chain?",
    simple: "It is the path JavaScript follows when looking for missing properties.",
    technical: "The chain is formed by [[Prototype]] links from object to prototype until null.",
    interview: "Prototype Chain is JavaScript's property lookup chain across linked objects.",
    example: "dog -> animal -> Object.prototype -> null.",
    trick: "Chain means keep following links.",
    mistake: "Thinking lookup searches every object in memory.",
  },
  {
    question: "Difference between prototype and __proto__?",
    simple: "prototype belongs to functions. __proto__ belongs to objects.",
    technical: "Constructor.prototype is used for instances created by new. Object.__proto__ points to the actual prototype link.",
    interview: "prototype is the object assigned as the prototype of new instances; __proto__ is an object's prototype link.",
    example: "user.__proto__ === Person.prototype.",
    trick: "Function has prototype. Object has proto link.",
    mistake: "Using both words as if they are identical.",
  },
  {
    question: "Difference between Object.create() and new?",
    simple: "Object.create links directly to a parent object. new uses a constructor function.",
    technical: "Object.create(proto) creates an object with proto as [[Prototype]]. new creates an object, links it to Constructor.prototype, and calls the constructor.",
    interview: "Object.create is direct prototype delegation; new combines object creation, prototype linking, and constructor execution.",
    example: "Object.create(animal) vs new Person('Zubair').",
    trick: "create links; new constructs.",
    mistake: "Thinking Object.create calls a constructor.",
  },
  {
    question: "Why does JavaScript use prototypes?",
    simple: "To let objects share behavior without copying methods everywhere.",
    technical: "Prototype delegation allows property and method reuse through linked objects.",
    interview: "JavaScript uses prototypal inheritance where objects delegate lookup to other objects.",
    example: "All arrays share map from Array.prototype.",
    trick: "Share methods, save memory.",
    mistake: "Thinking JavaScript inheritance is only class-based.",
  },
  {
    question: "How does property lookup work?",
    simple: "JavaScript checks the object first, then its prototype, then keeps going.",
    technical: "Lookup checks own properties, then follows [[Prototype]] links until found or null.",
    interview: "Property lookup traverses the prototype chain and stops when the property is found.",
    example: "arr.map is found on Array.prototype.",
    trick: "Own first, prototype next.",
    mistake: "Thinking prototypes are checked before own properties.",
  },
  {
    question: "Why do arrays have map()?",
    simple: "Because arrays inherit map from Array.prototype.",
    technical: "Array instances delegate method lookup to Array.prototype, where map is defined.",
    interview: "arr.map works because arr's prototype chain includes Array.prototype.",
    example: "[1,2,3].map(...) finds map on Array.prototype.",
    trick: "Array methods live on Array.prototype.",
    mistake: "Thinking every array owns its own copy of map.",
  },
  {
    question: "How do classes use prototypes?",
    simple: "Class methods are placed on the class prototype.",
    technical: "ES6 class syntax creates constructor functions and prototype methods under the hood.",
    interview: "Classes are syntactic sugar over JavaScript prototypes.",
    example: "Person.prototype.sayHello exists for class Person { sayHello() {} }.",
    trick: "Class syntax, prototype engine.",
    mistake: "Thinking classes replaced prototypes.",
  },
  {
    question: "What happens when property is not found?",
    simple: "JavaScript keeps searching prototypes until null, then returns undefined.",
    technical: "If lookup reaches null without finding the property, the result is undefined.",
    interview: "Lookup ends at null, which terminates the prototype chain.",
    example: "user.unknown returns undefined.",
    trick: "Null is the end of the road.",
    mistake: "Expecting an error for every missing property.",
  },
  {
    question: "Why avoid modifying Object.prototype?",
    simple: "It affects almost every object and can break code.",
    technical: "Object.prototype sits near the top of most object chains, so changes can leak globally and cause collisions.",
    interview: "Avoid modifying Object.prototype because it can pollute global object behavior and break libraries.",
    example: "Adding Object.prototype.debug appears on many objects.",
    trick: "Top of chain means wide blast radius.",
    mistake: "Adding helper methods globally for convenience.",
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "What is a prototype in JavaScript?",
    options: ["A linked object used for lookup", "A CSS class", "A database table", "A React-only feature"],
    correct: "A linked object used for lookup",
    explanation: "A prototype is the object JavaScript checks when a property is missing on the current object.",
    whyWrong: {
      "A CSS class": "CSS classes style elements; prototypes are JavaScript object links.",
      "A database table": "Prototype lookup is in memory, not a database.",
      "A React-only feature": "Prototypes are core JavaScript.",
    },
    memoryTrick: "Prototype is the backup object.",
    interviewTip: "Mention property lookup and [[Prototype]].",
  },
  {
    question: "What is the end of most prototype chains?",
    options: ["null", "Array.prototype", "document", "A Promise"],
    correct: "null",
    explanation: "Prototype chains terminate at null.",
    whyWrong: {
      "Array.prototype": "Arrays pass through Array.prototype, then Object.prototype, then null.",
      document: "document is a DOM object, not the universal chain end.",
      "A Promise": "Promises have their own prototype chain.",
    },
    memoryTrick: "Null means no more links.",
    interviewTip: "Say lookup stops at null.",
  },
  {
    question: "Where is map() found for an array?",
    options: ["Array.prototype", "The array's own properties", "Object.create", "null"],
    correct: "Array.prototype",
    explanation: "Array methods like map live on Array.prototype.",
    whyWrong: {
      "The array's own properties": "The array owns indexes and length, not a copy of every method.",
      "Object.create": "Object.create is an object creation API.",
      null: "null ends the chain and has no methods.",
    },
    memoryTrick: "Array methods live on Array.prototype.",
    interviewTip: "Use arr.map as the classic lookup example.",
  },
  {
    question: "What does Constructor.prototype contain?",
    options: ["Shared methods for instances", "Only private variables", "CSS modules", "Network requests"],
    correct: "Shared methods for instances",
    explanation: "Objects created with new link to Constructor.prototype for shared behavior.",
    whyWrong: {
      "Only private variables": "Prototype methods are generally shared and public.",
      "CSS modules": "CSS modules are unrelated.",
      "Network requests": "Network requests are not stored on prototypes.",
    },
    memoryTrick: "prototype is the shared method shelf.",
    interviewTip: "Connect this to memory efficiency.",
  },
  {
    question: "What does __proto__ point to?",
    options: ["An object's prototype link", "A constructor's source file", "A package version", "A CSS selector"],
    correct: "An object's prototype link",
    explanation: "__proto__ exposes the object's prototype link in many environments.",
    whyWrong: {
      "A constructor's source file": "It points to an object, not a file.",
      "A package version": "Package metadata is unrelated.",
      "A CSS selector": "CSS is unrelated.",
    },
    memoryTrick: "__proto__ is the object's link.",
    interviewTip: "Prefer saying [[Prototype]] for technical accuracy.",
  },
  {
    question: "What does Object.create(animal) do?",
    options: ["Creates an object linked to animal", "Copies all animal methods permanently", "Deletes animal", "Creates a class"],
    correct: "Creates an object linked to animal",
    explanation: "Object.create uses animal as the new object's prototype.",
    whyWrong: {
      "Copies all animal methods permanently": "It links, not copies.",
      "Deletes animal": "The parent object remains.",
      "Creates a class": "Object.create creates an object, not class syntax.",
    },
    memoryTrick: "create links.",
    interviewTip: "Contrast Object.create with new.",
  },
  {
    question: "What happens when an object has its own property with the same name as a prototype property?",
    options: ["The own property wins", "The prototype property always wins", "Both run automatically", "JavaScript throws"],
    correct: "The own property wins",
    explanation: "Lookup checks own properties before prototypes.",
    whyWrong: {
      "The prototype property always wins": "Prototype is checked only after own properties.",
      "Both run automatically": "Lookup returns the first match.",
      "JavaScript throws": "Shadowing is allowed.",
    },
    memoryTrick: "Own first.",
    interviewTip: "This is called shadowing.",
  },
  {
    question: "Classes in JavaScript are...",
    options: ["Syntax over prototypes", "A replacement for objects", "Only TypeScript", "Stored in CSS"],
    correct: "Syntax over prototypes",
    explanation: "Class methods are still placed on prototypes.",
    whyWrong: {
      "A replacement for objects": "Classes create objects; they do not replace them.",
      "Only TypeScript": "Classes exist in JavaScript.",
      "Stored in CSS": "CSS is unrelated.",
    },
    memoryTrick: "Class outside, prototype inside.",
    interviewTip: "Say syntactic sugar carefully.",
  },
  {
    question: "Why are prototype methods memory efficient?",
    options: ["Instances share one method reference", "Every instance copies all methods", "They are stored in localStorage", "They skip JavaScript execution"],
    correct: "Instances share one method reference",
    explanation: "Methods on the prototype are reused through lookup.",
    whyWrong: {
      "Every instance copies all methods": "That would be less memory efficient.",
      "They are stored in localStorage": "Prototypes are runtime object links.",
      "They skip JavaScript execution": "Methods still execute normally.",
    },
    memoryTrick: "Share, do not copy.",
    interviewTip: "Use constructor instances as an example.",
  },
  {
    question: "Which chain is correct for an array?",
    options: ["array -> Array.prototype -> Object.prototype -> null", "array -> null -> Object.prototype", "array -> Function.prototype only", "array -> document"],
    correct: "array -> Array.prototype -> Object.prototype -> null",
    explanation: "Arrays inherit array methods, then object methods, then the chain ends.",
    whyWrong: {
      "array -> null -> Object.prototype": "null ends lookup.",
      "array -> Function.prototype only": "Arrays are not functions.",
      "array -> document": "document is unrelated.",
    },
    memoryTrick: "Array, array methods, object methods, end.",
    interviewTip: "Mention Array.prototype.map.",
  },
  {
    question: "What should you avoid modifying?",
    options: ["Object.prototype", "A local object you own", "A class you wrote", "A function body you control"],
    correct: "Object.prototype",
    explanation: "Object.prototype affects a huge number of objects and can break libraries.",
    whyWrong: {
      "A local object you own": "Local objects can be changed intentionally.",
      "A class you wrote": "Your own class can be edited safely when controlled.",
      "A function body you control": "Changing owned code is normal.",
    },
    memoryTrick: "Do not pollute the top.",
    interviewTip: "Use the phrase prototype pollution.",
  },
  {
    question: "What does property lookup return if nothing is found?",
    options: ["undefined", "null always", "A syntax error", "The nearest function"],
    correct: "undefined",
    explanation: "Missing property access returns undefined after lookup reaches null.",
    whyWrong: {
      "null always": "null ends the chain, but the property result is undefined.",
      "A syntax error": "Accessing a missing property is valid.",
      "The nearest function": "Functions are unrelated to missing property values.",
    },
    memoryTrick: "Not found means undefined.",
    interviewTip: "Differentiate missing property from calling undefined as a function.",
  },
  {
    question: "What is prototypal inheritance?",
    options: ["Objects delegating behavior to other objects", "Classes copying bytecode", "CSS inheritance", "Database inheritance"],
    correct: "Objects delegating behavior to other objects",
    explanation: "JavaScript objects inherit by delegating lookup through prototype links.",
    whyWrong: {
      "Classes copying bytecode": "JavaScript does not copy class bytecode for inheritance.",
      "CSS inheritance": "CSS has a separate inheritance model.",
      "Database inheritance": "Databases are unrelated.",
    },
    memoryTrick: "Inheritance by delegation.",
    interviewTip: "Use the word delegation.",
  },
  {
    question: "What is Person.prototype used for?",
    options: ["As the prototype of objects created by new Person()", "As a React prop", "As a server port", "As a package lock"],
    correct: "As the prototype of objects created by new Person()",
    explanation: "new links instances to the constructor's prototype object.",
    whyWrong: {
      "As a React prop": "React props are different.",
      "As a server port": "Ports are networking values.",
      "As a package lock": "Package locks manage dependencies.",
    },
    memoryTrick: "new points to prototype.",
    interviewTip: "Mention instance.__proto__ === Person.prototype.",
  },
  {
    question: "What does lookup do after finding a property?",
    options: ["Stops and returns the value", "Keeps searching forever", "Deletes the property", "Copies all prototypes"],
    correct: "Stops and returns the value",
    explanation: "Lookup stops at the first matching property.",
    whyWrong: {
      "Keeps searching forever": "Lookup stops when found or when it reaches null.",
      "Deletes the property": "Lookup does not delete properties.",
      "Copies all prototypes": "Lookup follows links, not copies.",
    },
    memoryTrick: "Found means stop.",
    interviewTip: "This explains property shadowing.",
  },
];

const cheatsheetRows = [
  ["Prototype", "Hidden linked object used for fallback lookup"],
  ["Prototype Chain", "Linked path from object to prototypes to null"],
  ["prototype", "Constructor property used for new instances"],
  ["__proto__", "Object's prototype link"],
  ["Constructor", "Function used with new to create and initialize objects"],
  ["Object.create()", "Creates an object with a chosen prototype"],
  ["new", "Creates object, links prototype, runs constructor"],
  ["Class", "Readable syntax over prototypes"],
  ["Inheritance", "Objects delegate behavior through prototype links"],
  ["Property Lookup", "Own property first, then prototypes upward"],
];

const bestPractices = [
  "Prefer ES6 classes for readability.",
  "Understand that classes still use prototypes.",
  "Avoid modifying Object.prototype.",
  "Use Object.create() intentionally.",
  "Keep shared methods on prototypes.",
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
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p> : null}
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

function DiagramPanel({ title, diagram }: { title: string; diagram: string }) {
  const [copied, setCopied] = useState(false);

  async function copyDiagram() {
    await navigator.clipboard.writeText(diagram);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="rounded-lg border border-border bg-slate-950 p-4 text-slate-100 shadow-sm dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-code text-xs uppercase tracking-widest text-slate-400">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={copyDiagram}
          className="h-8 w-8 text-slate-300 hover:bg-white/10 hover:text-white"
          aria-label={`Copy ${title} diagram`}
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap font-code text-sm leading-7">{diagram}</pre>
    </div>
  );
}

function ConceptOverview() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-headline font-bold">What is the Prototype Chain?</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              The Prototype Chain is JavaScript&apos;s inheritance mechanism. It
              lets an object inherit properties and methods from another object
              through a hidden prototype link.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Unlike Java or C#, JavaScript uses prototype-based inheritance.
              The modern <span className="font-code text-foreground">class</span>{" "}
              syntax is still built on top of prototypes.
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

function BeginnerPrototypeGuide() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Beginner Mental Model"
        icon={Layers3}
        title="Think of Prototypes Like a Family Tree"
        description="When JavaScript cannot find something on the current object, it asks the parent prototype, then the next one, until it reaches null."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <DiagramPanel
              title="Family Tree Analogy"
              diagram={`Grandfather
     ^
Father
     ^
Son

Grandfather owns a house.
Father owns a car.
Son owns a laptop.

If the son needs something:
1. Does the son have it?
2. If not, check the father.
3. If not, check the grandfather.
4. If nobody has it, return undefined.`}
            />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {[
            ["Son", "Current object", "JavaScript checks here first."],
            ["Father", "Prototype", "Checked only if the property is missing."],
            ["Grandfather", "Next prototype", "JavaScript keeps walking upward."],
            ["undefined", "Not found", "Returned when the chain ends without a match."],
          ].map(([label, role, text], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-code text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{label}</h3>
                  <p className="mt-1 text-sm text-primary">{role}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {beginnerExamples.map((example) => (
          <Card key={example.title} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">{example.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <CodePanel code={example.code} />
              <div className="rounded-lg border border-success/25 bg-success/10 p-4">
                <p className="mb-2 text-xs uppercase tracking-widest text-success">Output</p>
                {example.output.map((line) => (
                  <p key={line} className="font-code text-sm text-foreground">{line}</p>
                ))}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{example.explanation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function VisualRepresentationAndSearch() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Visual Representation"
        icon={GitBranch}
        title="The Lookup Path from Object to null"
        description="This is the shape to remember for interviews and debugging."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <DiagramPanel
          title="Prototype Chain"
          diagram={`child Object
      |
      v
Parent Prototype
      |
      v
Grandparent Prototype
      |
      v
Object.prototype
      |
      v
null`}
        />

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">How JavaScript Searches</h3>
            <p className="mt-4 text-base leading-8 text-muted-foreground">Suppose we access:</p>
            <CodePanel code="child.city;" />
            <div className="mt-5 space-y-3">
              {visualSearchSteps.map((item, index) => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-background/70 p-4">
                  <span className="font-code text-sm text-muted-foreground">{index + 1}.</span>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.success ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <h3 className="text-2xl font-headline font-bold">Company Hierarchy Example</h3>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            Imagine a developer object linked to a manager object, and the manager
            linked to a CEO object. If you ask for{" "}
            <span className="font-code text-foreground">developer.company</span>,
            JavaScript checks Developer, then Manager, then CEO, and returns the
            company when it finds it.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["CEO", "company: Systems Limited"],
              ["Manager", "department: Commerce"],
              ["Developer", "name: Zubair"],
            ].map(([title, value]) => (
              <div key={title} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 font-code text-xs text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function PropertyLookupAnimation() {
  const [step, setStep] = useState(0);
  const current = lookupSteps[step];

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Property Lookup Animation"
        icon={GitBranch}
        title="Own Object First, Prototype Second"
        description="Lookup stops as soon as JavaScript finds the property."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            {lookupSteps.map((item, index) => (
              <Button
                key={item.label}
                variant="outline"
                onClick={() => setStep(index)}
                className={cn(
                  "h-auto w-full justify-start rounded-lg border-white/10 p-4 text-left",
                  step === index && "border-primary/40 bg-primary/10"
                )}
              >
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.property}: {item.result}
                  </p>
                </div>
              </Button>
            ))}
          </div>
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-background/70 px-4 py-3 font-code text-sm">
                {current.target}
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
              <div className="rounded-lg border border-white/10 bg-background/70 px-4 py-3 font-code text-sm">
                Search {current.property}
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
              <Badge
                variant="outline"
                className={cn(
                  "border-white/10 bg-background/70",
                  current.result === "Found" ? "text-emerald-300" : "text-yellow-300"
                )}
              >
                {current.result}
              </Badge>
            </div>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{current.detail}</p>
          </motion.div>
        </CardContent>
      </Card>
    </section>
  );
}

function PrototypeVisualizer() {
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
        badge="Interactive Prototype Visualizer"
        icon={MemoryStick}
        title="Follow the Lookup Chain"
        description="Step through source code, current object, prototype, chain, memory, and console output."
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
              <Button onClick={() => setStep(0)} className="rounded-full">Start</Button>
              <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-full border-white/10">
                <SkipBack className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button variant="outline" onClick={() => setStep((value) => Math.min(visualizerSteps.length - 1, value + 1))} className="rounded-full border-white/10">
                Next <SkipForward className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setAutoPlay((value) => !value)} className="rounded-full border-white/10">
                <Play className="mr-2 h-4 w-4" /> {autoPlay ? "Pause" : "Auto Play"}
              </Button>
              <Button variant="outline" onClick={() => { setStep(0); setAutoPlay(false); }} className="rounded-full border-white/10">
                <RefreshCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            <Progress value={((step + 1) / visualizerSteps.length) * 100} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Current Object", current.currentObject, Boxes],
            ["Prototype", current.prototype, Link2],
            ["Prototype Chain", current.chain, GitBranch],
            ["Memory", current.memory, MemoryStick],
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
                {current.console.length ? current.console.map((line) => <p key={line} className="text-primary">{line}</p>) : <span className="text-muted-foreground">(empty)</span>}
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

function ChainExplorer() {
  const [active, setActive] = useState(0);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Prototype Chain Explorer"
        icon={GitBranch}
        title="dog -> animal -> Object.prototype -> null"
        description="Animate each link in the chain and see where lookup travels."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {chainNodes.map((node, index) => (
              <button
                key={node}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "rounded-lg border p-5 text-left transition-all",
                  active === index ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/60"
                )}
              >
                <p className="font-code text-sm">{node}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {index === chainNodes.length - 1 ? "Lookup ends here." : `Prototype link ${index + 1}`}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ConstructorAndClassExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Constructor + Class"
        icon={SquareFunction}
        title="Two Syntaxes, Same Prototype Engine"
        description="Constructor functions and ES6 classes both use prototypes for shared methods."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader><CardTitle>Constructor Function</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <CodePanel code={constructorCode} activeLine={5} />
            <div className="grid gap-3 sm:grid-cols-4">
              {["Constructor", "Prototype", "Object", "Method Lookup"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-background/60 p-3 text-center text-xs">{item}</div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader><CardTitle>ES6 Class</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <CodePanel code={classCode} activeLine={6} />
            <p className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-7 text-muted-foreground">
              Classes are syntactic sugar over prototypes. Methods still live on the class prototype.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PrototypeComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="prototype vs __proto__"
        icon={Layers3}
        title="Three Names That Get Mixed Up"
        description="Keep these roles separate and prototype questions become much easier."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {comparisonCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="rounded-lg border border-white/10 bg-card/45 p-6 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-headline font-bold">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.text}</p>
            <div className="mt-5 space-y-2">
              {card.points.map((point) => (
                <div key={point} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {point}
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function MemoryAndInheritance() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Memory + Inheritance"
        icon={MemoryStick}
        title="Shared Memory, Linked Objects"
        description="Prototype methods are referenced through links instead of being copied into every object."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            {["Objects", "Prototype", "Methods", "References", "Memory links", "Shared memory"].map((item, index) => (
              <div key={item} className="mb-3 flex items-center gap-3 last:mb-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs text-primary">{index + 1}</div>
                <div className="flex-1 rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm">{item}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            {["Animal", "Dog", "Golden Retriever"].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 font-code text-sm">{item}</div>
                {index < 2 ? <ArrowDown className="h-5 w-5 text-primary" /> : null}
                <p className="text-sm text-muted-foreground">{index === 2 ? "inherits methods upward through Dog and Animal" : ""}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function BuiltInChainsAndMethodLookup() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Built-in Prototype Chain"
        icon={Database}
        title="Arrays, Strings, and Functions Use Prototypes Too"
        description="Built-in methods like push(), toUpperCase(), and call() are found through the same prototype lookup process."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {builtInChains.map((item) => (
          <Card key={item.title} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <CodePanel code={item.code} />
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="font-semibold">{item.question}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </div>
              <DiagramPanel title={`${item.title} chain`} diagram={item.chain.join("\n\n|\nv\n\n")} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6 border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <h3 className="text-2xl font-headline font-bold">Every Object Eventually Ends Here</h3>
          <DiagramPanel
            title="Universal ending"
            diagram={`Object

|
v

Object.prototype

|
v

null`}
          />
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            If JavaScript reaches null, it stops searching. At that point, a missing
            property returns undefined.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function WhyItMattersAndInterviewAnswer() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interview Ready"
        icon={BookOpenCheck}
        title="Why the Prototype Chain Matters"
        description="This concept explains inheritance, shared methods, and many built-in JavaScript APIs."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">It Enables</h3>
            <div className="mt-5 grid gap-3">
              {[
                "Code reuse",
                "Inheritance through object links",
                "Shared methods instead of duplicate methods on every object",
                "Efficient memory usage",
                "Built-in methods like map(), filter(), push(), toUpperCase(), and call()",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-background/70 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-background/60 text-primary">
              30-second answer
            </Badge>
            <p className="text-base leading-8 text-muted-foreground">
              The Prototype Chain is JavaScript&apos;s inheritance mechanism.
              Every object has an internal reference to another object called
              its prototype. When a property or method is accessed, JavaScript
              first looks for it on the object itself. If it is not found,
              JavaScript follows the prototype chain, checking each prototype
              until it either finds the property or reaches null. This allows
              objects to inherit shared properties and methods efficiently
              without duplicating them.
            </p>
          </CardContent>
        </Card>
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
        title="Prototype Examples You Can Step Through"
        description="Run, reset, copy, and step through prototype lookup examples with memory notes."
      />
      <Tabs value={example.title} className="space-y-6">
        <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4 xl:grid-cols-8">
          {playgroundExamples.map((item, index) => (
            <TabsTrigger key={item.title} value={item.title} onClick={() => reset(index)} className="rounded-md text-xs">
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
                    <Button onClick={() => setRan(true)} className="rounded-full"><Play className="mr-2 h-4 w-4" />Run</Button>
                    <Button variant="outline" onClick={() => setLineStep((value) => Math.min(value + 1, item.activeLines.length - 1))} className="rounded-full border-white/10">Step-by-Step</Button>
                    <Button variant="outline" onClick={() => reset()} className="rounded-full border-white/10"><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
                  <CardHeader><CardTitle className="text-lg">Console</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {ran ? item.output.map((line) => <div key={line} className="rounded-lg border border-white/10 bg-background/70 p-3 font-code text-sm">{line}</div>) : <p className="rounded-lg border border-white/10 bg-background/70 p-3 text-sm text-muted-foreground">Click Run to see output.</p>}
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
                  <CardHeader><CardTitle className="text-lg">Memory</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {item.memory.map((line) => <div key={line} className="rounded-lg border border-white/10 bg-background/70 p-3 font-code text-sm">{line}</div>)}
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

function RealWorldAndEngine() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Real World Examples"
        icon={Zap}
        title="Where Prototypes Show Up"
        description="Prototypes power many objects you use every day."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {realWorldExamples.map((item, index) => (
          <motion.article key={item} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
            <SquareStack className="mb-4 h-5 w-5 text-primary" />
            <h3 className="font-semibold">{item}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Uses internal prototype links for shared behavior, lookup, or object APIs.</p>
          </motion.article>
        ))}
      </div>
      <Card className="mt-6 border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            {["Object", "Property Lookup", "Prototype", "Prototype", "Object.prototype", "null"].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-background/70 px-4 py-3 font-code text-xs">{item}</div>
                {index < 5 ? <ArrowRight className="h-4 w-4 text-primary" /> : null}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">Lookup stops when the property is found, or when the chain reaches null.</p>
        </CardContent>
      </Card>
    </section>
  );
}

function CommonMistakes() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader badge="Common Mistakes" icon={AlertTriangle} title="Prototype Traps to Avoid" description="These mistakes make prototype questions harder than they need to be." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {mistakes.map((mistake, index) => (
          <motion.div key={mistake} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="rounded-lg border border-red-400/25 bg-red-400/10 p-5 backdrop-blur-xl">
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
      <SectionHeader badge="Interview Questions" icon={BookOpenCheck} title="Prototype Chain Interview Prep" description="Each answer includes a simple explanation, technical explanation, interview answer, example, memory trick, and common mistake." />
      <Accordion type="single" collapsible defaultValue="question-0" className="rounded-lg border border-white/10 bg-card/35 px-5 backdrop-blur-xl">
        {interviewQuestions.map((item, index) => (
          <AccordionItem key={item.question} value={`question-${index}`} className="border-white/10">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">Q{index + 1}</span>
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
      <SectionHeader badge="Interactive Quiz" icon={BookOpenCheck} title="Check Your Prototype Model" description="Fifteen questions with explanations, wrong-answer reasoning, memory tricks, and interview tips." />
      <Card className="mb-6 border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="mt-1 text-2xl font-headline font-bold">{answered}/{quizQuestions.length} answered</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary/20 bg-background/60 text-primary">Score: {correct}/{answered || quizQuestions.length}</Badge>
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
                <h3 className="text-lg font-semibold"><span className="font-code text-primary">{index + 1}.</span> {quiz.question}</h3>
                <div className="mt-5 grid gap-2">
                  {quiz.options.map((option) => {
                    const chosen = selected === option;
                    const isCorrect = option === quiz.correct;
                    return (
                      <Button key={option} variant="outline" onClick={() => setAnswers((current) => ({ ...current, [index]: option }))} className={cn("h-auto justify-start whitespace-normal rounded-lg border-white/10 px-4 py-3 text-left", selected && isCorrect && "border-emerald-400/45 bg-emerald-400/10 text-emerald-100", chosen && !isCorrect && "border-red-400/45 bg-red-400/10 text-red-100")}>
                        {selected ? isCorrect ? <Check className="mr-2 h-4 w-4 shrink-0" /> : chosen ? <X className="mr-2 h-4 w-4 shrink-0" /> : null : null}
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {selected ? (
                  <div className="mt-5 space-y-3">
                    <p className="rounded-lg border border-white/10 bg-background/60 p-4 text-sm leading-7 text-muted-foreground">{quiz.explanation}</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-primary">Memory trick:</span> {quiz.memoryTrick}</div>
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-primary">Interview tip:</span> {quiz.interviewTip}</div>
                    </div>
                    {quiz.options.filter((option) => option !== quiz.correct).map((option) => (
                      <p key={option} className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-red-200">{option}:</span> {quiz.whyWrong[option]}</p>
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
      <SectionHeader badge="Visual Cheatsheet" icon={Clipboard} title="Prototype Chain Summary" description="Quick revision for the terms that usually get confused." />
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

export function PrototypeChainLesson() {
  const estimatedProgress = useMemo(() => 0, []);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient -z-10" />
      <section className="container mx-auto px-4 pb-16 pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            JavaScript Objects
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            <span className="gradient-text">Prototype Chain</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand how JavaScript finds properties and methods through the prototype chain.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Learn how objects inherit from other objects, how property lookup works, why everything ultimately inherits from Object.prototype, and how JavaScript uses prototypes instead of traditional class inheritance.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <Clock className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">Estimated Time</p>
              <p className="font-semibold">15 minutes</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-card/45 p-4 backdrop-blur-xl">
              <GitBranch className="mx-auto mb-2 h-5 w-5 text-primary" />
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
      <BeginnerPrototypeGuide />
      <VisualRepresentationAndSearch />
      <PropertyLookupAnimation />
      <PrototypeVisualizer />
      <ChainExplorer />
      <ConstructorAndClassExamples />
      <PrototypeComparison />
      <MemoryAndInheritance />
      <BuiltInChainsAndMethodLookup />
      <WhyItMattersAndInterviewAnswer />
      <CodePlayground />
      <RealWorldAndEngine />
      <CommonMistakes />
      <InterviewQuestions />
      <Quiz />
      <CheatsheetAndBestPractices />
    </div>
  );
}
