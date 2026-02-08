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
   <section id="features" className="py-40 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-2xl mb-6">🤖</div>
            <h3 className="text-xl font-bold mb-4">AI Integration</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Automatically build system icons and manage node hierarchies with built-in AI intelligence.</p>
          </div>
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-2xl mb-6">🤝</div>
            <h3 className="text-xl font-bold mb-4">Real-time Collab</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Work synchronously with your team. See updates live as they happen on the shared canvas.</p>
          </div>
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-2xl mb-6">🔒</div>
            <h3 className="text-xl font-bold mb-4">Permission Drawing</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Control who can edit, draw, or view diagrams with granular permission-based drawing tools.</p>
          </div>
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-2xl mb-6">📝</div>
            <h3 className="text-xl font-bold mb-4">Note-taking Tab</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Integrated documentation tab to keep technical notes alongside your system diagrams.</p>
          </div>
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-2xl mb-6">🗂️</div>
            <h3 className="text-xl font-bold mb-4">Nodes & Edges Tab</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Dedicated management tabs for controlling every node and connection in your system architecture.</p>
          </div>
          <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-2xl mb-6">⚡</div>
            <h3 className="text-xl font-bold mb-4">Automate Build</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Speed up your workflow with automated icon placement and intelligent edge routing.</p>
          </div>
        </div>
      </section>
  );
};

export default FeatureSection;
