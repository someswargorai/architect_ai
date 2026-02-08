"use client";

import React from "react";


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
