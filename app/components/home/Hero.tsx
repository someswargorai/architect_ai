"use client";

import Link from "next/link";

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = () => {

  return (
      <div className="relative overflow-hidden selection:bg-amber-500/30">

         <section className="relative pt-52 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] font-bold mb-10 uppercase tracking-[0.2em]">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
            Cloud-Native Engine 4.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85]">
            SYSTEM DESIGN <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600">
              REIMAGINED.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-zinc-500 text-sm md:text-sm mb-12 font-medium leading-relaxed">
            The world&apos;s first predictive architecture platform. Collaborate in real-time on complex distributed systems with an AI that understands latency, throughput, and costs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href={"/auth"}
              className="group relative w-full sm:w-auto px-12 py-5 bg-amber-500 text-black rounded-sm font-500 text-sm transition-all hover:scale-105 shadow-[0_20px_40px_rgba(245,158,11,0.2)]"
            >
              Launch Platform
            </Link>
            <button className="w-full sm:w-auto px-12 py-5 bg-transparent text-white rounded-sm font-500 text-sm border border-white/10 hover:bg-white/5 transition-all">
              Request Demo
            </button>
          </div>

          {/* Social Proof / Logos */}
          <div className="mt-32 pt-20 border-t border-white/5">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mb-12">Trusted by Infrastructure Teams at</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-2xl font-black tracking-tighter">CLOUDCORE</span>
              <span className="text-2xl font-black tracking-tighter italic underline decoration-amber-500">VELOCITY</span>
              <span className="text-2xl font-black tracking-tighter">DATASTRATUM</span>
              <span className="text-2xl font-black tracking-tighter uppercase">Nexus.io</span>
            </div>
          </div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08)_0%,transparent_50%)] -z-10"></div>
      </section>


      <section className="py-40 px-6 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="w-12 h-1 bg-amber-500 mb-8"></div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
              An AI that actually <br />
              understands <span className="text-amber-500 underline decoration-amber-500/20">Back-of-Envelope</span> calculations.
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-10">
              Unlike generic LLMs, Architect AI is trained on over 4 million system design docs and real-world post-mortems. It doesn&apos;t just draw nodes; it validates your bottlenecks.
            </p>
            <ul className="space-y-4">
              {[
                "Automatic VPC & Subnet isolation logic",
                "Real-time latency estimates per hop",
                "Cost forecasting based on node types",
                "Failure-mode analysis & remediation"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-full border border-white/5 rounded-2xl bg-zinc-950/50 p-6 font-mono text-[10px] text-zinc-500">
                <div className="text-amber-500 mb-4 font-bold">AI ANALYSIS IN PROGRESS</div>
                <p className="mb-2">DETECTED: Multi-region setup for OrdersService.</p>
                <p className="mb-2 text-white">REASONING: Replication lag on &quot;OrderDB&quot; may exceed 200ms across us-east and eu-west.</p>
                <p className="mb-6 text-green-500 font-bold">SUGGESTION: Introduce Global DynamoDB with Streams.</p>
                <div className="h-32 w-full bg-zinc-900/50 rounded flex items-center justify-center border border-white/5">
                  <div className="w-3/4 h-[1px] bg-white/10 relative">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full blur-sm"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-700 rounded-full"></div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-zinc-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 px-6 max-w-7xl mx-auto"  id="pricing">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black mb-6">Built for every scale.</h2>
          <p className="text-zinc-500 font-medium">From solo architects to global infrastructure teams.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Starter", price: "$0", features: ["1 Workspace", "Basic AI Insights", "PNG Export", "Solo Work"], current: false },
            { name: "Professional", price: "$29", features: ["Unlimited Workspaces", "Advanced Predictive AI", "Terraform Export", "Team (up to 10)"], current: true },
            { name: "Enterprise", price: "Custom", features: ["SSO & Governance", "Custom AI Training", "On-Prem Deployment", "24/7 Priority Support"], current: false }
          ].map((plan, i) => (
            <div key={i} className={`p-10 rounded-3xl border ${plan.current ? 'border-amber-500 bg-zinc-900/40' : 'border-white/5 bg-zinc-900/20'} relative flex flex-col`}>
              {plan.current && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full uppercase">Most Popular</span>}
              <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
              <div className="text-4xl font-black mb-8">{plan.price}<span className="text-sm text-zinc-600 font-bold ml-1">{plan.price.startsWith('$') ? '/mo' : ''}</span></div>
              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-xs text-zinc-400 flex items-center gap-2">
                    <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold text-xs transition-all ${plan.current ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Trial'}
              </button>
            </div>
          ))}
        </div>
      </section>
      
      </div>
  );
};

export default Hero;
