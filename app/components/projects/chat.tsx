"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";
import { Panel } from "@xyflow/react";
import { History, Loader2, MessageSquareDot, Send, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Result = {
  comment: string;
  email: string;
  id: string;
};

interface Session {
  data: {
    id: string;
    email: string;
  };
}

export default function Chat() {
  const [comment, setComment] = useState<string>("");
  const [loading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result[]>([]);
  const session = (useSession() as unknown) as Session;
  const broadcast = useBroadcastEvent();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEventListener(({ event }) => {
    if (event && typeof event === "object" && "type" in event) {
      if (event.type === "Comment") {
        const payload = event.payload as {
          comment: Result;
        };

        if (payload) {
          setResult((prev) => [...prev, payload.comment]);
          scrollToBottom();
        }
      }
    }
  });

  const handleSend = () => {
    setIsLoading(true);

    setResult((prev) => [
      ...prev,
      {
        comment: comment,
        email: session.data.email,
        id: session.data.id,
      },
    ]);

    broadcast({
      type: "Comment",
      payload: {
        comment: JSON.parse(
          JSON.stringify({
            comment: comment,
            email: session.data.email,
            id: session.data.id,
          }),
        ),
      },
    });
    scrollToBottom();
    setComment("")
    setIsLoading(false);
  };

  return (
    <Panel className="flex flex-col gap-2 ">
      <Sheet>
        <SheetTrigger asChild>
          <button className="absolute top-20 bg-white p-1.5 rounded-sm -left-px cursor-pointer">
            <MessageSquareDot className="w-5 h-5  group-hover:rotate-12 transition-transform duration-300 text-amber-400 hover:text-amber-500" />
          </button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-lg bg-white shadow-2xl overflow-hidden">
          <div className="flex flex-col h-full w-full bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div>
                    <div className="px-2 flex items-center gap-x-3 mb-2">
                      <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <div className="size-4 bg-black rounded-sm rotate-45" />
                      </div>
                      <span className="text-xl font-bold tracking-tighter text-black">
                        Architect Ai
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-2.5">
                      <div className="w-1 h-1 rounded-full animate-ping bg-green-500" />
                      <span className="text-[9px] text-slate-400 ">
                        Discussion Room
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
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-[#fdfdfd]">
              <div className="flex flex-col min-h-full space-y-6 animate-in fade-in duration-300">
                {result.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center py-20 opacity-40 select-none">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      <History className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-sm mb-2 uppercase tracking-wide">
                      Ready to discuss about architecture
                    </h3>
                    <p className="text-[12px] text-slate-500 max-w-60 leading-relaxed font-medium">
                      Discuss about bottlenecks, security hardening, or cost
                      optimizations for your current layout.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pb-6">
                    {result.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          msg?.id === session.data.id
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-full px-5 py-4 rounded-4xl text-[13px] leading-relaxed shadow-sm border overflow-hidden ${
                            msg?.id === session.data.id
                              ? "bg-amber-600 border-amber-500 text-white rounded-tr-none"
                              : "bg-white border-slate-100 text-slate-700 rounded-tl-none ring-1 ring-slate-100/50"
                          }`}
                        >
                          <div
                            className="prose prose-sm prose-slate max-w-none wrap-break-words overflow-x-hidden
                            prose-headings:font-bold prose-headings:text-slate-900 
                            prose-p:leading-relaxed prose-strong:text-amber-600
                            prose-code:bg-amber-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-amber-700 prose-code:font-mono prose-code:text-[12px]
                            prose-pre:bg-slate-900 prose-pre:p-4 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:border prose-pre:border-slate-800
                            [&_pre_code]:text-amber-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
                          >
                            <span className="text-[10px] text-zinc-900">
                              {msg.email}
                            </span>
                            <ReactMarkdown>{msg?.comment}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse ring-1 ring-amber-50">
                        <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          message is being send...
                        </span>
                      </div>
                    )}
                    <div ref={chatEndRef} className="pb-10" />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Inputs */}
            <div className="px-6 pb-8 pt-4 border-t border-slate-100 bg-white shrink-0">
              <div className="flex flex-col gap-1 group">
                <div className="relative flex items-center bg-white border border-slate-200 p-1 rounded-md shadow-lg shadow-slate-100 focus-within:ring-4 focus-within:ring-amber-500/5 focus-within:border-amber-400 transition-all duration-300">
                  <textarea
                    rows={1}
                    placeholder="Start Discuss..."
                    className="flex-1 bg-transparent px-5 py-4 text-sm text-slate-700 outline-none font-medium border-0 shadow-none focus:ring-0 resize-none max-h-32 scrollbar-hide"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!comment?.trim() || loading}
                    className="self-end mb-1 mr-1 p-3.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-100 text-white disabled:text-slate-300 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] text-slate-400">
                    Press Enter to send
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Panel>
  );
}
