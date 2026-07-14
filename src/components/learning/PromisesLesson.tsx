"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Check,
  Clipboard,
  Code2,
  Database,
  FileUp,
  Gauge,
  Loader2,
  PackageCheck,
  Play,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Timer,
  Trophy,
  Workflow,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PromiseState = "pending" | "fulfilled" | "rejected";

const stateCards = [
  {
    title: "Pending",
    state: "pending" as PromiseState,
    text: "The async operation has started, but it has not completed yet.",
    icon: Loader2,
  },
  {
    title: "Fulfilled",
    state: "fulfilled" as PromiseState,
    text: "The operation completed successfully and resolved with a value.",
    icon: Check,
  },
  {
    title: "Rejected",
    state: "rejected" as PromiseState,
    text: "The operation failed and rejected with an error reason.",
    icon: AlertCircle,
  },
];

const chainSteps = ["fetchUser()", "fetchOrders()", "fetchRecommendations()", "renderPage()"];

const realWorldExamples = [
  { title: "API Calls", icon: Database, text: "Fetch product, account, and content data without blocking the UI." },
  { title: "File Upload", icon: FileUp, text: "Track upload progress, completion, and upload failures with promise states." },
  { title: "Payment Processing", icon: ShieldCheck, text: "Chain validation, authorization, capture, and error recovery safely." },
  { title: "Order Placement", icon: PackageCheck, text: "Coordinate checkout calls and render confirmation only after success." },
  { title: "Analytics Requests", icon: Gauge, text: "Send non-blocking events while keeping the shopping journey responsive." },
];

const ecommerceExamples = [
  ["Product Search", "Debounced search returns a Promise that resolves with matching products."],
  ["Inventory Lookup", "Parallel inventory calls resolve before rendering availability badges."],
  ["Checkout Validation", "Shipping, payment, and address promises determine whether checkout can continue."],
  ["Payment Authorization", "Rejected promises surface recoverable payment errors."],
  ["Order Confirmation", "Fulfilled order placement promises render receipt and confirmation details."],
];

const codeExamples = [
  {
    title: "Basic Promise",
    code: `const request = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Products loaded");
  }, 500);
});

request.then((message) => {
  console.log(message);
});`,
  },
  {
    title: "Promise Chaining",
    code: `fetchUser()
  .then((user) => fetchOrders(user.id))
  .then((orders) => fetchRecommendations(orders))
  .then((recommendations) => renderPage(recommendations));`,
  },
  {
    title: "Promise.all",
    code: `Promise.all([
  fetchProduct(),
  fetchInventory(),
  fetchReviews(),
]).then(([product, inventory, reviews]) => {
  renderPDP({ product, inventory, reviews });
});`,
  },
  {
    title: "Promise.race",
    code: `Promise.race([
  fetchFromPrimaryApi(),
  fetchFromBackupApi(),
  timeoutAfter(1200),
]).then((firstResult) => {
  renderFastestResponse(firstResult);
});`,
  },
  {
    title: "Error Handling",
    code: `fetchCheckoutSession()
  .then(validatePayment)
  .then(placeOrder)
  .catch((error) => {
    showCheckoutError(error.message);
  })
  .finally(() => {
    hideLoadingState();
  });`,
  },
];

const promiseAnalogySteps = [
  ["Order placed", "Promise is pending while the kitchen prepares the food."],
  ["Food delivered", "Promise is fulfilled with the meal."],
  ["Order cancelled", "Promise is rejected with a reason."],
];

const promiseFlowDiagram = `Promise Created
      |
      v
Pending
      |
      +-------------------+
      |                   |
      v                   v
Fulfilled             Rejected
      |                   |
      v                   v
.then(value)         .catch(error)
      |
      v
.finally(cleanup)`;

const promiseChainDiagram = `fetchUser()
    |
    v
.then(fetchOrders)
    |
    v
.then(fetchRecommendations)
    |
    v
.then(renderPage)
    |
    v
.catch(handleError)`;

const promiseInterviewAnswer =
  "A Promise is a JavaScript object that represents the eventual result of an asynchronous operation. It starts in the Pending state and eventually becomes either Fulfilled by calling resolve() or Rejected by calling reject(). We consume Promises using .then(), .catch(), and .finally(), or with async/await. Promise callbacks are executed through the Microtask Queue, which the Event Loop processes before Macrotasks like setTimeout().";

const bankTransferDiagram = `Transfer Started
      |
      v
Processing...
      |
      +---------------------+
      |                     |
      v                     v
Money Sent           Insufficient Balance`;

const apiCallDiagram = `Request Sent
      |
      v
Waiting...
      |
      v
Server Responds
      |
      v
Products Received
      |
      v
Display Products`;

const lifecycleDiagram = `Create Promise
      |
      v
Pending
      |
      v
Success?
  |       |
 Yes      No
  |       |
  v       v
resolve() reject()
  |       |
  v       v
.then()  .catch()`;

const checkoutPromiseCode = `console.log("Validate Card");

createPayment()
  .then(() => {
    console.log("Payment Approved");
  })
  .catch(() => {
    console.log("Payment Failed");
  })
  .finally(() => {
    console.log("Hide Spinner");
  });

console.log("Show Spinner");`;

const eventLoopPromiseCode = `console.log("1");

Promise.resolve().then(() => {
  console.log("2");
});

console.log("3");`;

const callbackHellCode = `getUser(function(user) {
  getOrders(user, function(order) {
    getPayment(order, function(payment) {
      console.log(payment);
    });
  });
});`;

const cleanerPromiseCode = `getUser()
  .then(getOrders)
  .then(getPayment)
  .then(console.log)
  .catch(console.error);`;

const promiseVsAsyncCode = `// Using Promises
fetch("/api/products")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

// Using async/await
async function getProducts() {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}`;

const interviewQuestions = [
  {
    question: "What is a Promise?",
    answer:
      "A Promise is a JavaScript object representing the eventual result of an asynchronous operation. It starts pending, then becomes fulfilled with a value or rejected with an error.",
  },
  {
    question: "What are Promise States?",
    answer:
      "A Promise has three states: pending, fulfilled, and rejected. Once it settles as fulfilled or rejected, that state is final and cannot change.",
  },
  {
    question: "Difference between Promise.all and Promise.race?",
    answer:
      "Promise.all waits for every promise to fulfill and rejects if any promise rejects. Promise.race settles as soon as the first promise fulfills or rejects.",
  },
  {
    question: "How does Error Handling work?",
    answer:
      "Errors thrown inside a then callback or promises that reject move to the nearest catch handler. finally runs after settlement and is useful for cleanup like hiding loaders.",
  },
  {
    question: "What is Promise Chaining?",
    answer:
      "Promise chaining connects async steps by returning a value or another promise from each then callback. The next then waits for that returned promise before running.",
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
  icon?: typeof Sparkles;
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

function CodePanel({ code }: { code: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-white/10 bg-background/80 p-4 font-code text-xs leading-6 text-muted-foreground">
      <code>{code}</code>
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

function StateBadge({ state }: { state: PromiseState }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-white/10 bg-background/50 capitalize",
        state === "pending" && "border-primary/30 bg-primary/5 text-primary",
        state === "fulfilled" && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
        state === "rejected" && "border-destructive/50 bg-destructive/10 text-red-200"
      )}
    >
      {state}
    </Badge>
  );
}

function ConceptOverview() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {stateCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-lg border border-border/60 bg-card/45 p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-primary/10">
                <Icon className={cn("h-6 w-6 text-primary", item.state === "pending" && "animate-spin")} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-headline font-bold">{item.title}</h2>
                <StateBadge state={item.state} />
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function BeginnerPromiseGuide() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Beginner Mental Model"
        icon={Timer}
        title="A Promise Means: I Will Give You a Result Later"
        description="Promises help JavaScript represent work that has started but has not finished yet, like API calls, file uploads, timers, or payments."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">Food Delivery Analogy</h3>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              When you order food, you do not get the result immediately. The order
              is pending. Later it either succeeds, or it fails. A Promise works
              the same way for asynchronous JavaScript work.
            </p>
            <div className="mt-5 grid gap-3">
              {promiseAnalogySteps.map(([title, text], index) => (
                <div key={title} className="flex gap-3 rounded-lg border border-border bg-background/70 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-code text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <DiagramPanel title="Promise state flow" diagram={promiseFlowDiagram} />
            <CodePanel
              code={`const request = fetch("/api/products");

request
  .then((response) => response.json())
  .then((products) => renderProducts(products))
  .catch((error) => showError(error))
  .finally(() => hideLoader());`}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PromiseChainMentalModel() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Chain Mental Model"
        icon={Workflow}
        title="Promise Chains Pass Results Forward"
        description="Each then() can return a value or another Promise. The next step waits for that result before running."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <DiagramPanel title="Promise chain" diagram={promiseChainDiagram} />
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">What to Remember</h3>
            <div className="mt-5 grid gap-3">
              {[
                "then() handles a fulfilled Promise.",
                "catch() handles a rejected Promise.",
                "finally() runs after success or failure.",
                "Returning a Promise makes the next then() wait.",
                "A settled Promise cannot change state again.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CreatingPromisesExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Creating Promises"
        icon={Code2}
        title="resolve() Means Success, reject() Means Failure"
        description="A Promise constructor receives resolve and reject functions. Call resolve for success and reject for failure."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Successful Promise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <CodePanel
              code={`const promise = new Promise((resolve, reject) => {
  resolve("Payment Successful");
});

promise.then((result) => {
  console.log(result);
});`}
            />
            <div className="rounded-lg border border-success/25 bg-success/10 p-4">
              <p className="text-xs uppercase tracking-widest text-success">Output</p>
              <p className="mt-2 font-code text-sm">Payment Successful</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Failed Promise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <CodePanel
              code={`const promise = new Promise((resolve, reject) => {
  reject("Payment Failed");
});

promise.catch((error) => {
  console.log(error);
});`}
            />
            <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-4">
              <p className="text-xs uppercase tracking-widest text-destructive">Output</p>
              <p className="mt-2 font-code text-sm">Payment Failed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function RealWorldPromiseFlows() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Real-World Flows"
        icon={Database}
        title="Bank Transfers and API Calls Work Like Promises"
        description="You start the operation now, then handle success or failure later without freezing the UI."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Bank Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            <DiagramPanel title="Bank transfer flow" diagram={bankTransferDiagram} />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>API Call</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <DiagramPanel title="API call flow" diagram={apiCallDiagram} />
            <CodePanel
              code={`fetch("/api/products")
  .then((response) => response.json())
  .then((products) => {
    console.log(products);
  })
  .catch((error) => {
    console.log(error);
  });`}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PromiseLifecycleMethods() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Promise Methods"
        icon={Workflow}
        title=".then(), .catch(), and .finally()"
        description="These methods are the main way to consume a Promise before using async/await."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <DiagramPanel title="Promise lifecycle" diagram={lifecycleDiagram} />
        <div className="grid gap-4">
          {[
            [".then()", "Runs when the Promise is fulfilled.", `Promise.resolve("Hello").then((result) => console.log(result));`],
            [".catch()", "Runs when the Promise is rejected.", `Promise.reject("Error").catch((error) => console.log(error));`],
            [".finally()", "Runs whether the Promise succeeds or fails, usually for cleanup.", `fetch("/api/products").finally(() => console.log("Hide Loader"));`],
          ].map(([title, text, code]) => (
            <Card key={title} className="border-border/60 bg-card/45 backdrop-blur-xl">
              <CardContent className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-headline font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
                <CodePanel code={code} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallbackHellComparison() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Promises vs Callbacks"
        icon={Workflow}
        title="Promises Help Avoid Callback Hell"
        description="Nested callbacks become difficult to read and maintain. Promise chains make the async flow flatter and easier to handle."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-destructive/25 bg-destructive/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Callback Hell</CardTitle>
          </CardHeader>
          <CardContent>
            <CodePanel code={callbackHellCode} />
          </CardContent>
        </Card>
        <Card className="border-success/25 bg-success/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Cleaner Promise Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <CodePanel code={cleanerPromiseCode} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PromiseEventLoopSection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Event Loop"
        icon={Timer}
        title="Promise Callbacks Run in the Microtask Queue"
        description="Synchronous code runs first. Promise callbacks run after the call stack is empty and before macrotasks like setTimeout."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <CodePanel code={eventLoopPromiseCode} />
            <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
              <p className="text-xs uppercase tracking-widest text-primary">Output</p>
              <p className="mt-2 font-code text-sm">1</p>
              <p className="font-code text-sm">3</p>
              <p className="font-code text-sm">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">Why?</h3>
            <div className="mt-5 grid gap-3">
              {[
                "console.log(\"1\") runs immediately.",
                "Promise .then() is placed in the Microtask Queue.",
                "console.log(\"3\") runs immediately.",
                "The Event Loop runs microtasks, so console.log(\"2\") runs last.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-background/70 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-code text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CheckoutPaymentFlow() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Checkout Flow"
        icon={ShoppingCart}
        title="Real-World Example: Payment Promise"
        description="A payment Promise keeps checkout responsive while the authorization request is processed."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <CodePanel code={checkoutPromiseCode} />
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">Possible Outputs</h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-lg border border-success/25 bg-success/10 p-4">
                <p className="mb-2 text-xs uppercase tracking-widest text-success">Success</p>
                <p className="font-code text-sm">Validate Card</p>
                <p className="font-code text-sm">Show Spinner</p>
                <p className="font-code text-sm">Payment Approved</p>
                <p className="font-code text-sm">Hide Spinner</p>
              </div>
              <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-4">
                <p className="mb-2 text-xs uppercase tracking-widest text-destructive">Failure</p>
                <p className="font-code text-sm">Validate Card</p>
                <p className="font-code text-sm">Show Spinner</p>
                <p className="font-code text-sm">Payment Failed</p>
                <p className="font-code text-sm">Hide Spinner</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PromiseVsAsyncAwaitSection() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Promise vs async/await"
        icon={Code2}
        title="Same Behavior, Different Syntax"
        description="async/await is built on top of Promises and often makes asynchronous code easier to read."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <CodePanel code={promiseVsAsyncCode} />
        </CardContent>
      </Card>
    </section>
  );
}

function WhyPromisesMatter() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Why Promises?"
        icon={Zap}
        title="Why Do We Need Promises?"
        description="Promises make asynchronous JavaScript easier to read, chain, and recover from."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-destructive/25 bg-destructive/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">Without Promises</h3>
            <div className="mt-5 grid gap-3">
              {["Deeply nested callbacks", "Harder error handling", "Less readable code"].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/25 bg-success/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-2xl font-headline font-bold">With Promises</h3>
            <div className="mt-5 grid gap-3">
              {["Cleaner asynchronous code", "Better error handling with .catch()", "Easy chaining with .then()", "Works seamlessly with async/await"].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PromiseInterviewSummary() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Interview Ready"
        icon={Trophy}
        title="Promises in 30 Seconds"
        description="Use this answer when someone asks what a Promise is."
      />
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <p className="text-base leading-8 text-muted-foreground">{promiseInterviewAnswer}</p>
        </CardContent>
      </Card>
    </section>
  );
}

function PromiseLifecycleVisualizer() {
  const [state, setState] = useState<PromiseState>("pending");

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Promise Lifecycle"
        icon={Workflow}
        title="Promise Lifecycle Visualizer"
        description="A Promise begins pending, then settles into either fulfilled or rejected."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
            {stateCards.map((item, index) => {
              const active = item.state === state;
              const Icon = item.icon;
              return (
                <div key={item.title} className="contents">
                  <motion.button
                    onClick={() => setState(item.state)}
                    animate={{ y: active ? -8 : 0, scale: active ? 1.03 : 1 }}
                    className={cn(
                      "rounded-lg border p-6 text-left transition-colors",
                      active ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/50 hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Icon className={cn("h-6 w-6 text-primary", item.state === "pending" && active && "animate-spin")} />
                      <StateBadge state={item.state} />
                    </div>
                    <h3 className="mt-5 text-xl font-headline font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </motion.button>
                  {index < stateCards.length - 1 ? <ArrowRight className="mx-auto hidden h-5 w-5 text-primary md:block" /> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={() => setState("pending")} variant="outline" className="rounded-full border-white/10">
              Reset Pending
            </Button>
            <Button onClick={() => setState("fulfilled")} className="rounded-full">
              Resolve Fulfilled
            </Button>
            <Button onClick={() => setState("rejected")} variant="outline" className="rounded-full border-destructive/40 text-red-200">
              Reject Error
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ApiRequestSimulator() {
  const [state, setState] = useState<PromiseState>("pending");
  const [result, setResult] = useState("Click Fetch Products to start the request.");
  const [loading, setLoading] = useState(false);

  function fetchProducts(nextState: Exclude<PromiseState, "pending">) {
    setState("pending");
    setLoading(true);
    setResult("Fetching /api/products...");

    window.setTimeout(() => {
      setState(nextState);
      setLoading(false);
      setResult(
        nextState === "fulfilled"
          ? "Success: 24 products returned with price and inventory."
          : "Error: Product service timed out. Show retry state."
      );
    }, 900);
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="API Simulator"
        icon={Zap}
        title="API Request Simulator"
        description="Trigger success or failure and watch the Promise state drive loading, response, and error UI."
      />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-background/50 p-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Promise State</p>
                <div className="mt-2">
                  <StateBadge state={state} />
                </div>
              </div>
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <PackageCheck className="h-8 w-8 text-primary" />}
            </div>
            <div className="rounded-lg border border-white/10 bg-background/50 p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Response</p>
              <motion.p key={result} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm leading-6">
                {result}
              </motion.p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => fetchProducts("fulfilled")} disabled={loading} className="rounded-full">
                <Play className="mr-2 h-4 w-4" />
                Fetch Products
              </Button>
              <Button onClick={() => fetchProducts("rejected")} disabled={loading} variant="outline" className="rounded-full border-white/10">
                Simulate Error
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
          <CardContent className="p-6">
            <CodePanel
              code={`fetch("/api/products")
  .then((response) => response.json())
  .then((products) => renderProducts(products))
  .catch((error) => showRetryState(error));`}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function PromiseChainVisualizer() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        if (current >= chainSteps.length - 1) {
          setRunning(false);
          return current;
        }
        return current + 1;
      });
    }, 750);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Promise Chain"
        icon={Workflow}
        title="Promise Chain Visualizer"
        description="Each then step waits for the previous Promise to resolve before continuing."
      />
      <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {chainSteps.map((step, index) => (
              <motion.div
                key={step}
                animate={{ y: active === index ? -8 : 0 }}
                className={cn(
                  "rounded-lg border p-5 text-center",
                  active === index ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 bg-background/50"
                )}
              >
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-background font-code text-xs">
                  {index + 1}
                </div>
                <p className="font-code text-sm">{step}</p>
                {index < chainSteps.length - 1 ? <ArrowDown className="mx-auto mt-4 h-5 w-5 text-primary md:hidden" /> : null}
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setActive(0);
                setRunning(true);
              }}
              disabled={running}
              className="rounded-full"
            >
              Animate Chain
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRunning(false);
                setActive(0);
              }}
              className="rounded-full border-white/10"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ParallelVisualizer({ mode }: { mode: "all" | "race" }) {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState<number[]>([]);
  const winner = mode === "race" ? 1 : null;
  const requests = [
    { label: "Request A", delay: 900 },
    { label: "Request B", delay: 520 },
    { label: "Request C", delay: 1250 },
  ];
  const allDone = complete.length === requests.length;
  const raceDone = mode === "race" && complete.length > 0;

  function start() {
    setRunning(true);
    setComplete([]);
    requests.forEach((request, index) => {
      window.setTimeout(() => {
        setComplete((current) => (current.includes(index) ? current : [...current, index]));
        if (mode === "race" && index === winner) setRunning(false);
      }, request.delay);
    });
    window.setTimeout(() => setRunning(false), 1350);
  }

  return (
    <Card className="border-border/60 bg-card/45 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          {mode === "all" ? <PackageCheck className="h-5 w-5 text-primary" /> : <Trophy className="h-5 w-5 text-primary" />}
          Promise.{mode} Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3">
          {requests.map((request, index) => {
            const done = complete.includes(index);
            const won = mode === "race" && index === winner && done;
            return (
              <motion.div
                key={request.label}
                animate={{ scale: won ? 1.02 : 1 }}
                className={cn(
                  "rounded-lg border p-4",
                  won ? "border-primary/60 bg-primary/15" : done ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-background/50"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-code text-sm">{request.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {done ? (won ? "Winner" : "Complete") : running ? "Waiting..." : "Idle"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="rounded-lg border border-white/10 bg-background/50 p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Result</p>
          <p className="mt-2 text-sm leading-6">
            {mode === "all"
              ? allDone
                ? "All Complete: render combined results."
                : running
                  ? "Waiting for every request..."
                  : "Ready to start parallel requests."
              : raceDone
                ? "Fastest promise settled first: render winner."
                : running
                  ? "Racing requests..."
                  : "Ready to start the race."}
          </p>
        </div>
        <Button onClick={start} disabled={running} className="rounded-full">
          Run Promise.{mode}
        </Button>
      </CardContent>
    </Card>
  );
}

function RealWorldExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Applications"
        icon={Sparkles}
        title="Real World Promise Patterns"
        description="Promises power everyday async workflows across frontend, backend, and commerce systems."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {realWorldExamples.map((example, index) => {
          const Icon = example.icon;
          return (
            <motion.article
              key={example.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/5"
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
    </section>
  );
}

function EcommerceExamples() {
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeader
        badge="Enterprise eCommerce"
        icon={ShoppingCart}
        title="Commerce Promise Examples"
        description="Checkout and product journeys are full of async operations that need clean state, success, and failure paths."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {ecommerceExamples.map(([title, text]) => (
          <div key={title} className="rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur-xl">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CopyCodeBlock({ title, code }: { title: string; code: string }) {
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
      </CardContent>
    </Card>
  );
}

function InterviewQuestions() {
  return (
    <section className="container mx-auto px-4 pb-24 pt-10">
      <SectionHeader
        badge="Common Interview Questions"
        title="Promises Interview Prep"
        description="Detailed answers for Promise fundamentals, state transitions, chaining, and concurrency."
      />
      <div className="grid gap-4">
        {interviewQuestions.map((item, index) => (
          <Card key={item.question} className="border-border/60 bg-card/45 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  Q{index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function PromisesLesson() {
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
            <Timer className="mr-2 h-3.5 w-3.5" />
            JavaScript Async
          </Badge>
          <h1 className="text-5xl font-headline leading-tight tracking-normal lg:text-7xl">
            <span className="gradient-text">Promises</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Understand asynchronous programming, promise states, chaining, and error handling.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Learn how JavaScript handles asynchronous operations before async/await.
          </p>
        </motion.div>
      </section>

      <ConceptOverview />
      <BeginnerPromiseGuide />
      <CreatingPromisesExamples />
      <RealWorldPromiseFlows />
      <PromiseLifecycleMethods />
      <PromiseChainMentalModel />
      <CallbackHellComparison />
      <PromiseEventLoopSection />
      <CheckoutPaymentFlow />

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="lifecycle" className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-background/60 p-1 md:grid-cols-4">
            <TabsTrigger value="lifecycle" className="rounded-md">Lifecycle</TabsTrigger>
            <TabsTrigger value="api" className="rounded-md">API Request</TabsTrigger>
            <TabsTrigger value="flows" className="rounded-md">Flows</TabsTrigger>
            <TabsTrigger value="code" className="rounded-md">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="lifecycle">
            <PromiseLifecycleVisualizer />
          </TabsContent>
          <TabsContent value="api">
            <ApiRequestSimulator />
          </TabsContent>
          <TabsContent value="flows" className="space-y-10">
            <PromiseChainVisualizer />
            <section className="container mx-auto px-4 py-10">
              <div className="grid gap-6 lg:grid-cols-2">
                <ParallelVisualizer mode="all" />
                <ParallelVisualizer mode="race" />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="code">
            <section className="container mx-auto px-4 py-10">
              <SectionHeader
                badge="Code Examples"
                icon={Code2}
                title="Copy-ready Promise Examples"
                description="Practice basic promises, chaining, Promise.all, Promise.race, and error handling."
              />
              <div className="grid gap-6 lg:grid-cols-2">
                {codeExamples.map((example) => (
                  <CopyCodeBlock key={example.title} title={example.title} code={example.code} />
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>

      <RealWorldExamples />
      <EcommerceExamples />
      <PromiseVsAsyncAwaitSection />
      <WhyPromisesMatter />
      <PromiseInterviewSummary />
      <InterviewQuestions />
    </div>
  );
}
