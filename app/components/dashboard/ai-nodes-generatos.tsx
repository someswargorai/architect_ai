"use client";

import React, { useEffect, useRef, useState } from "react";
import { SheetContent, } from "@/components/ui/sheet";
import {
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  Cpu,
  History,
  AlertCircle,
  Terminal,
  Zap,
  ChevronDown,
  Layout,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setNodes, setEdges } from "@/store/slices/flowSlice";
import { RootState } from "@/store/store";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github.css";
import axios from "axios";
import { getLayoutedElements } from "@/utils/get-element-layout";

type Message = {
  role: string;
  content: string;
};

type AICreateNodeSheetContentProps = {
  onCancel: () => void;
};

const AICreateNodeSheetContent: React.FC<AICreateNodeSheetContentProps> = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const edges = useSelector((state: RootState) => state.flow.edges);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "ask") {
      scrollToBottom();
    }
  }, [chatHistory, activeTab, loading]);

 
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/system-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to generate design");
        return;
      }

      let graph;
      try {
        graph = JSON.parse(data.text);
      } catch (err) {
        setError("AI returned invalid JSON. Try rephrasing your prompt.");
        console.error("JSON parse error:", err, data.text);
        return;
      }

      const {
        nodes: layoutedNodes,
        edges: layoutedEdges,
      } = getLayoutedElements(
        graph.nodes.map((n: {
            id: string;
            label: string;
            type?: string;
            description?: string;
          }) => ({
            id: n.id,
            data: { label: n.label, description: n.description || "" },
            type: n.type ?? "default",
          }),
        ),
        graph.edges,
      );

      dispatch(setNodes(layoutedNodes));
      dispatch(setEdges(layoutedEdges));

      setPrompt("");
      setError(null);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);

    const newHistory = [...chatHistory, { role: "user", content: question }];
    setChatHistory(newHistory);
    setQuestion(""); 

    try {
      const res = await fetch("/api/ai/ask-about-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question,
          nodes,
          edges,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to get answer");
        return;
      }
      setChatHistory([...newHistory, { role: "ai", content: data.text }]);
    } catch (err) {
    
      if(axios.isAxiosError(err)){
          setError("Network error. Please try again.");
      }  
    } finally {
      setLoading(false);
    }
  };

  return (
    <SheetContent className="sm:max-w-lg bg-white shadow-2xl overflow-hidden">
      <div className="flex flex-col h-full w-full bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                  Architect
                  <span className="text-indigo-600 font-extrabold">AI</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    v0.2 Pro
                  </span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    Active Workspace
                  </span>
                </div>
              </div>
            </div>
            <button
              // onClick={onCancel}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === "generate"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate
            </button>
            <button
              onClick={() => setActiveTab("ask")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === "ask"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Analyze
            </button>
          </div>
        </div>

        {/* Main Content Area - Properly Handles Overflows */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-[#FCFDFF]">
          {activeTab === "generate" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" />
                    Technical Requirements
                  </label>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                    <Layout className="w-3 h-3" />
                    <span className="text-[10px] font-bold">Design Mode</span>
                  </div>
                </div>
                <textarea
                  className="w-full h-64 px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 resize-none text-sm text-slate-700 placeholder:text-slate-300 font-medium leading-relaxed shadow-sm"
                  placeholder="Describe your infrastructure needs (e.g., 'A multi-region e-commerce platform with Redis caching and S3 storage for static assets')..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-24 group hover:border-indigo-200 transition-colors">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Architecture
                  </p>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    Cloud Native
                  </p>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300 self-end" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-24 group hover:border-indigo-200 transition-colors">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Resolution
                  </p>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    High Detail
                  </p>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300 self-end" />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 animate-in zoom-in-95">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-300">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-20 opacity-40 select-none">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <History className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mb-2 uppercase tracking-wide">
                    Ready for Analysis
                  </h3>
                  <p className="text-[12px] text-slate-500 max-w-[240px] leading-relaxed font-medium">
                    Ask me about bottlenecks, security hardening, or cost
                    optimizations for your current layout.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-6">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-full px-4 py-4 rounded-[20px] text-[13px] leading-relaxed shadow-sm border overflow-hidden ${
                          msg.role === "user"
                            ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none"
                            : "bg-white border-slate-100 text-slate-700 rounded-tl-none ring-1 ring-slate-100/50"
                        }`}
                      >
                        <div
                          className="prose prose-sm prose-slate max-w-none break-word overflow-x-auto
                        prose-headings:font-bold prose-headings:text-slate-900 
                        prose-p:leading-relaxed prose-strong:text-indigo-600
                        prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-indigo-600 prose-code:font-mono prose-code:text-[12px]
                        prose-pre:bg-slate-900 prose-pre:p-4 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:border prose-pre:border-slate-800
                        [&_pre_code]:font-semibold
                        [&_pre_code]:text-slate-600 [&_pre_code]:bg-transparent [&_pre_code]:p-0
                      "
                        >
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 mt-1.5 uppercase tracking-widest px-2">
                        {msg.role === "user" ? "Requested" : "Analysis"}
                      </span>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse ring-1 ring-indigo-50">
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Architect is thinking...
                      </span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Inputs - Sticky and Responsive */}
        <div className="px-6 pb-8 pt-4 border-t border-slate-100 bg-white shrink-0">
          {activeTab === "generate" ? (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-xl shadow-indigo-100 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-white" />
              )}
              Synthesize Blueprint
            </button>
          ) : (
            <div className="flex flex-col gap-3 group">
              <div className="relative flex items-center bg-white border border-slate-200 p-1 rounded-2xl shadow-lg shadow-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-400 transition-all duration-300">
                <textarea
                  rows={1}
                  placeholder="Ask Architect AI..."
                  className="flex-1 bg-transparent px-5 py-4 text-sm text-slate-700 outline-none font-medium border-0 shadow-none focus:ring-0 resize-none max-h-32 scrollbar-hide"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  disabled={loading}
                />
                <button
                  onClick={handleAsk}
                  disabled={!question.trim() || loading}
                  className="self-end mb-1 mr-1 p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-300 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between px-2">
                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                  Gemini Flash 3 Engine
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                  Press Enter to send
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  );
};

export default AICreateNodeSheetContent;
