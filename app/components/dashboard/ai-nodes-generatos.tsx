"use client";

import React, { useEffect, useRef, useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Sparkles,
  MessageSquare,
  Send,
  ChevronRight,
  Loader2,
  Cpu,
  History,
  AlertCircle,
  Terminal,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setNodes, setEdges } from "@/store/slices/flowSlice";
import { RootState } from "@/store/store";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
        graph.nodes.map(
          (n: {
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
          history: newHistory,
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
    <SheetContent className="max-w-lg bg-white shadow-2xl overflow-hidden">
      <div className="flex flex-col h-full bg-white relative">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-100">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <SheetTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Architect<span className="text-indigo-600">AI</span>
            </SheetTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <Zap className="w-2.5 h-2.5 fill-current" />
              v0.1 Enterprise
            </span>
            <span className="text-[10px] text-slate-400 font-bold ">
              Active Workspace
            </span>
          </div>
        </SheetHeader>

        <div className="px-3 pt-6 pb-2">
          <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer duration-300 ${
                activeTab === "generate"
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Generate
            </button>
            <button
              onClick={() => setActiveTab("ask")}
              className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "ask"
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Analyze
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
          {activeTab === "generate" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  Technical Requirement
                </label>
                <textarea
                  className="w-full h-80 px-5 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 resize-none text-slate-800 placeholder:text-slate-400 font-medium text-sm leading-relaxed"
                  placeholder="Describe infrastructure details..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Context
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {nodes.length} Nodes Loaded
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Output
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    JSON Architecture
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-500">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-20 opacity-40">
                  <History className="w-10 h-10 text-slate-400 mb-4" />
                  <h3 className="text-slate-900 font-bold text-sm mb-1">
                    Architecture Analysis
                  </h3>
                  <p className="text-[12px] text-slate-500 max-w-[200px] leading-relaxed">
                    Ask questions about bottlenecks, cost optimization, or
                    security.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pb-10">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[90%] px-5 py-4 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm border ${
                          msg.role === "user"
                            ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none"
                            : "bg-slate-50 border-slate-100 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        <div className="prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 px-5 py-4 bg-slate-50 rounded-2xl animate-pulse border border-slate-100">
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Analyzing Schema...
                      </span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 pb-8 pt-4 border-t border-slate-100 bg-white">
          {activeTab === "generate" ? (
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-md font-bold text-sm transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              Synthesize Blueprint
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-lg shadow-lg shadow-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
              <Textarea
                rows={6}
                placeholder="Ask Architect AI..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 outline-none font-medium border-0 shadow-none focus:ring-0!"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                disabled={loading}
              />
              <button
                onClick={handleAsk}
                disabled={!question.trim() || loading}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-md active:scale-90 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  );
};

export default AICreateNodeSheetContent;
