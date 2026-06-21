"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const examples = [
  {
    id: "product-search",
    title: "Product Search",
    description: "Debounced API search with visual feedback",
    flow: [
      "User types in search box",
      "Debounce waits for user to stop (300ms)",
      "API request sent to Web APIs",
      "Network request happens in background",
      "Response received → Promise in Microtask Queue",
      "UI updates with search results",
    ],
    code: `const debouncedSearch = debounce(async (query) => {
  const results = await fetch(\`/api/products?q=\${query}\`);
  const data = await results.json();
  updateSearchUI(data);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});`,
    benefits: "Reduces API calls, improves performance, better UX",
  },
  {
    id: "checkout-payment",
    title: "Checkout Payment",
    description: "Payment gateway integration with event loop",
    flow: [
      "User clicks 'Place Order'",
      "Order validation (synchronous)",
      "Payment API called → Web APIs",
      "Stripe/PayPal processes in background",
      "Response received → Promise callbacks",
      "Update inventory + send confirmation",
    ],
    code: `async function processPayment(orderData) {
  // Synchronous validation
  validateOrder(orderData);

  try {
    // Async payment processing
    const payment = await stripe.confirmPayment(orderData);
    
    // Update database (Microtask Queue)
    await db.updateOrder(payment.id, 'completed');
    
    // Send confirmation
    await sendConfirmationEmail(order);
  } catch (error) {
    handlePaymentError(error);
  }
}`,
    benefits: "Non-blocking UI, handles concurrent requests, proper error handling",
  },
  {
    id: "inventory-sync",
    title: "Inventory Availability",
    description: "Real-time inventory updates on product pages",
    flow: [
      "Product page loads",
      "Fetch inventory data → Web APIs",
      "Multiple API calls queued",
      "Network responses come back",
      "All Promises batched in Microtask Queue",
      "DOM updated once with all data",
    ],
    code: `async function loadProductData(productId) {
  // Parallel requests
  const [product, inventory, reviews] = await Promise.all([
    fetch(\`/api/products/\${productId}\`),
    fetch(\`/api/inventory/\${productId}\`),
    fetch(\`/api/reviews/\${productId}\`),
  ]);

  // All resolve at roughly same time
  // Single batch DOM update
  updateProductPage({
    product: await product.json(),
    inventory: await inventory.json(),
    reviews: await reviews.json(),
  });
}`,
    benefits: "Parallel operations, batched updates, faster perceived performance",
  },
];

export function EnterpriseExamples() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [expandedFlow, setExpandedFlow] = useState<number | null>(null);

  const example = examples[selectedExample];

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/45 p-8 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold">Enterprise Commerce Examples</h2>
        <p className="mb-8 text-muted-foreground">
          Real-world scenarios from e-commerce applications where understanding the Event Loop is critical.
        </p>

        {/* Example Selector */}
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {examples.map((ex, index) => (
            <motion.div key={ex.id} whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => setSelectedExample(index)}
                variant={selectedExample === index ? "default" : "outline"}
                className="w-full rounded-lg text-left justify-start"
              >
                {ex.title}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Selected Example Details */}
        <motion.div
          key={example.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-6">
            <h3 className="mb-2 text-2xl font-bold">{example.title}</h3>
            <p className="text-muted-foreground mb-4">{example.description}</p>
            <Badge variant="outline" className="border-primary/50 bg-primary/20">
              {example.benefits}
            </Badge>
          </div>

          {/* Flow */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Execution Flow
            </h4>
            <div className="space-y-2">
              {example.flow.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg bg-background/40 p-3"
                >
                  <div className="mt-1 h-5 w-5 flex-shrink-0 rounded-full border border-primary bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Implementation
            </h4>
            <div className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-xs text-green-300">
              <pre>{example.code}</pre>
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Key Patterns */}
      <Card className="border-white/10 bg-card/45 p-6 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Event Loop Patterns in E-Commerce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Debouncing",
                desc: "Delay expensive operations until user stops interacting",
                use: "Search, filters, auto-save",
              },
              {
                title: "Promise.all()",
                desc: "Wait for multiple async operations in parallel",
                use: "Load product, inventory, reviews simultaneously",
              },
              {
                title: "Microtask Batching",
                desc: "Multiple Promise callbacks execute before rendering",
                use: "Batch state updates before DOM update",
              },
              {
                title: "setTimeout for UI",
                desc: "Callback Queue for non-urgent updates",
                use: "Analytics tracking, lazy loading",
              },
            ].map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-white/10 bg-background/40 p-4"
              >
                <p className="font-semibold mb-2">{pattern.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{pattern.desc}</p>
                <p className="text-xs text-primary">
                  <strong>Use case:</strong> {pattern.use}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="border-green-500/30 bg-green-500/10 p-6 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-400" />
            Performance Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-green-300 mb-1">1. Batch DOM Updates</p>
            <p className="text-muted-foreground">
              Use Promise.all() to wait for multiple data fetches, then update DOM once instead of multiple times.
            </p>
          </div>
          <div>
            <p className="font-semibold text-green-300 mb-1">2. Use requestAnimationFrame</p>
            <p className="text-muted-foreground">
              For animations, use requestAnimationFrame() which is scheduled during rendering phase of Event Loop.
            </p>
          </div>
          <div>
            <p className="font-semibold text-green-300 mb-1">3. Avoid Blocking Operations</p>
            <p className="text-muted-foreground">
              Heavy computations block the Event Loop. Use Web Workers to offload to separate threads.
            </p>
          </div>
          <div>
            <p className="font-semibold text-green-300 mb-1">4. Monitor Microtask Queue</p>
            <p className="text-muted-foreground">
              Too many Promises scheduled can starve rendering. Break up work into chunks with setTimeout.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
