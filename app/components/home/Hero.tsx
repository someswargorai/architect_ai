"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 0.5], [100, -50]);
  const rotateX = useTransform(smoothProgress, [0, 0.4], [15, 0]);
  const scale = useTransform(smoothProgress, [0, 0.4], [0.9, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-40 px-6 overflow-hidden bg-[#050505]"
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          NEW: AI-POWERED AUTO-DIAGRAMMING
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter"
        >
          System Design at the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
            Speed of Thought
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl mb-10 font-medium"
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
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-sm  text-xs shadow-[0_10px_30px_rgba(245,158,11,0.2)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Launch Architect
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 border border-white/5 rounded-sm text-xs transition-all cursor-pointer">
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
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-zinc-950/80 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5">
              <Image
                width="1260"
                height="660"
                src="https://res.cloudinary.com/dpacclyw4/image/upload/v1769416119/Screenshot_2026-01-26_134249_lrddwg.png"
                alt="Architect AI Interface"
                className="w-full h-auto opacity-50 group-hover:opacity-70 transition-opacity duration-700 grayscale-[0.5] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-8 bg-zinc-900/90 rounded-sm border border-white/10 backdrop-blur-3xl text-left max-w-sm shadow-2xl relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 rounded-sm bg-amber-500 flex items-center justify-center text-[10px] font-black text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                      AI
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight uppercase">
                      Architect Co-pilot
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-medium">
                    &quot;I&quot;ve analyzed your microservices proposal. Adding
                    a Redis cache between the API Gateway and Auth Service would
                    reduce latency by ~24%.&quot;
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-amber-500 rounded-sm text-[10px] text-black hover:bg-amber-400 transition-all ">
                      Apply Changes
                    </button>
                    <button className="px-4 py-2 bg-white/5 rounded-sm text-[10px] text-white hover:bg-white/10 transition-all border border-white/5 ">
                      Explain Why
                    </button>
                  </div>
                  <div className="absolute top-[-20%] right-[-20%] size-32 bg-amber-500/10 blur-[40px] rounded-full" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Ambient Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[128px] -z-10"></div>
      <div className="absolute top-1/4 right-0 -translate-y-1/2 w-96 h-96 bg-amber-600/5 rounded-full blur-[128px] -z-10"></div>
    </section>
  );
};

export default Hero;
