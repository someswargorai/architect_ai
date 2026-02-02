import {
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  Users,
  History,
  Cpu,
  ArrowRight,
} from "lucide-react";

export default function PricingPage() {
  const freeFeatures = [
    { text: "Up to 5 Team Members", icon: <Users className="w-4 h-4" /> },
    { text: "24h Activity Retention", icon: <History className="w-4 h-4" /> },
    { text: "Basic Project Insights", icon: <Zap className="w-4 h-4" /> },
    { text: "Standard Support", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const proFeatures = [
    { text: "Unlimited Team Members", icon: <Users className="w-4 h-4" /> },
    {
      text: "Architect AI Bot Assistant",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      text: "Advanced Permissions Control",
      icon: <Crown className="w-4 h-4" />,
    },
    { text: "High-Priority Infrastructure", icon: <Cpu className="w-4 h-4" /> },
    {
      text: "24/7 Dedicated Support",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-6xl w-full mx-auto px-4 animate-in slide-in-from-bottom-4 duration-700 overflow-y-auto h-[calc(100vh-80px)]">
      {/* Header Section */}
      <div className="text-center mb-16 mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] uppercase font-bold tracking-widest mb-6">
          <Zap className="w-3 h-3" /> Upgrade to Pro
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Simple, Transparent{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Pricing
          </span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Unlock the full potential of project governance with our
          professional-grade features and AI-driven insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative group p-px rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent ">
          <div className="relative bg-[#0A0A0B]/90 backdrop-blur-3xl rounded-[2.45rem] p-10 h-full flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-zinc-500 text-sm">
                Perfect for individuals and small prototype teams.
              </p>
            </div>

            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-5xl font-bold text-white tracking-tighter">
                $0
              </span>
              <span className="text-zinc-500 font-medium">/mo</span>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                Included Features
              </p>
              {freeFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400">
                    {feature.icon}
                  </div>
                  <span className="text-zinc-300 text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-[0.98]">
              Get Started for Free
            </button>
          </div>
        </div>

        <div className="relative group p-px rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-400">
          {/* Pro Glow Effect */}
          <div className="absolute -inset-2 bg-orange-600/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity rounded-[2.5rem]"></div>

          <div className="relative bg-[#0A0A0B] rounded-[2.45rem] p-10 h-full flex flex-col overflow-hidden">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 px-8 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-black text-[10px] font-bold uppercase tracking-widest rounded-bl-3xl shadow-lg">
              Most Popular
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Crown className="w-6 h-6" />
                <h3 className="text-2xl font-bold text-white">Pro</h3>
              </div>
              <p className="text-zinc-500 text-sm">
                Advanced tools for professional engineering teams.
              </p>
            </div>

            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-5xl font-bold text-white tracking-tighter">
                $29
              </span>
              <span className="text-zinc-500 font-medium">/mo</span>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <p className="text-orange-500/80 text-xs font-bold uppercase tracking-widest">
                Everything in Free, plus:
              </p>
              {proFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                    {feature.icon}
                  </div>
                  <span className="text-zinc-200 text-sm font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-2xl bg-orange-500 text-black font-extrabold hover:bg-orange-600 transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 group/btn">
              Upgrade to Pro{" "}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 py-12 border-t border-white/5 text-center">
        <p className="text-zinc-500 text-sm mb-8 font-medium">
          Trusted by high-performance engineering teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
          <div className="text-2xl font-black text-white italic">QUANTUM</div>
          <div className="text-2xl font-black text-white">NEXUS</div>
          <div className="text-2xl font-black text-white underline decoration-orange-500">
            VECTOR
          </div>
          <div className="text-2xl font-black text-white uppercase tracking-tighter">
            Prism
          </div>
        </div>
      </div>

      <div className="text-center mt-12 mb-20">
        <p className="text-zinc-500 text-sm">
          Have more than 50 team members?{" "}
          <a href="#" className="text-orange-500 font-bold hover:underline">
            Contact Sales for Enterprise
          </a>
        </p>
      </div>
    </div>
  );
}
