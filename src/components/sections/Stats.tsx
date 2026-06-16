
"use client"

import React from 'react';
import { motion } from "framer-motion";

const stats = [
  { label: "Years Experience", value: "8+" },
  { label: "Projects Delivered", value: "50+" },
  { label: "Enterprise Integrations", value: "10+" },
  { label: "Users Served", value: "Millions" },
  { label: "Features Shipped", value: "100+" }
];

export function Stats() {
  return (
    <section className="py-20 bg-primary/5 border-y border-white/5">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center space-y-2"
            >
              <h3 className="text-4xl lg:text-5xl font-bold font-headline gradient-text">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
