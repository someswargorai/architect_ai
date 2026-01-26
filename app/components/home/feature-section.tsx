"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Auto-Diagramming",
    description:
      "Describe your system in plain text and watch the AI generate a fully editable architectural diagram.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Real-time Collaboration",
    description:
      "Multiplayer editing for teams. See cursors, comments, and changes live as they happen.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Infrastructure as Code",
    description:
      "Export your designs directly to Terraform or AWS CloudFormation snippets with one click.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
];

const FeatureSection: React.FC = () => {
  return (
    <section
      id="features"
      className="py-40 bg-[#050505] relative overflow-hidden"
    >
      {/* Background decoration matching hero */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-500 text-[10px] font-black tracking-[0.2em] uppercase mb-4"
          >
            Core Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            Everything you need to <br />
            <span className="text-zinc-500">ship faster</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-lg font-medium"
          >
            Stop wasting time fighting with diagramming tools. ArchitectAI
            handles the heavy lifting so you can focus on building.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="group p-10 bg-zinc-900/30 backdrop-blur-xl rounded-sm border border-white/5 hover:border-amber-500/20 transition-all duration-500 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"></div>

              <div className="w-12 h-12 bg-amber-500/10 rounded-sm flex items-center justify-center mb-10 group-hover:scale-110 transition-transform text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.05)] border border-amber-500/10">
                {feature.icon}
              </div>

              <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-amber-500 transition-colors">
                {feature.title}
              </h3>

              <p className="text-zinc-500 leading-relaxed font-medium">
                {feature.description}
              </p>

              <div className="mt-8 flex items-center gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors cursor-pointer">
                <span className="text-[10px]">
                  Learn More
                </span>
                <svg
                  className="w-3 h-3 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
