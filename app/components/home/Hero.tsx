"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 0.5], [100, -50]);
  const rotateX = useTransform(smoothProgress, [0, 0.4], [15, 0]);
  const scale = useTransform(smoothProgress, [0, 0.4], [0.9, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-40 px-6 overflow-hidden grid-bg"
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          NEW: AI-POWERED AUTO-DIAGRAMMING
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          System Design at the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Speed of Thought
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10"
        >
          The collaborative canvas where AI helps you architect complex systems,
          generate technical docs, and map cloud infrastructure in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Create Your First Diagram
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-md font-bold text-sm transition-all cursor-pointer">
            Watch Demo
          </button>
        </motion.div>

        <div className="mt-24 perspective-[2000px]">
          <motion.div
            style={{
              y,
              rotateX,
              scale,
              opacity,
              transformStyle: "preserve-3d",
            }}
            className="relative group max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative glass rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
              <Image
                src="https://res.cloudinary.com/dpacclyw4/image/upload/v1769416119/Screenshot_2026-01-26_134249_lrddwg.png"
                alt="ArchitectAI Interface"
                className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                width={1200}
                height={800}
                loading='eager'
                fetchPriority='high'
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 bg-black/80 rounded-2xl border border-white/10 backdrop-blur-xl text-left max-w-sm shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-[10px] font-bold">
                      AI
                    </div>
                    <span className="text-sm font-semibold text-white">
                      Architect Co-pilot
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    &quot;I&quot;ve analyzed your microservices proposal. Adding
                    a Redis cache between the API Gateway and Auth Service would
                    reduce latency by ~24%.&quot;
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[10px] font-bold text-white hover:bg-indigo-500 transition-colors">
                      Apply Changes
                    </button>
                    <button className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-bold text-white hover:bg-white/20 transition-colors">
                      Explain Why
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -z-10"></div>
      <div className="absolute top-1/4 right-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] -z-10"></div>
    </section>
  );
};

export default Hero;
