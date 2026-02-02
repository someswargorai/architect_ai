"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Clock,
  Search,
  ArrowUpRight,
  Database,
  User,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import http from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";

interface ActivityLog {
  _id: string;
  projectId: string;
  log: string;
  email: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "INVITE" | string;
  createdAt: string;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case "CREATE":
      return <Zap className="w-4 h-4 text-orange-400" />;
    case "UPDATE":
      return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
    case "DELETE":
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    case "INVITE":
      return <User className="w-4 h-4 text-green-400" />;
    default:
      return <Activity className="w-4 h-4 text-zinc-400" />;
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

export default function ActivityLogsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { status } = useSession();
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const handleDebounceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value= e.target.value

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

      debounceRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, 400);
    
  };

  useEffect(() => {
    const fetchLogs = async () => {
      if (status !== "authenticated") return;
      try {
        setLoading(true);

        const res = await http.get("/api/logs", {
          params: {
            projectId,
            q: searchQuery || undefined,
          },
        });

        if (res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchLogs();
    }
  }, [projectId, status, searchQuery]);

  return (
    <div className="max-w-6xl w-full mt-4 mx-auto px-4 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] uppercase font-bold tracking-widest mb-4">
            <Database className="w-3 h-3" /> System Audit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Activity{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Logs
            </span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            A comprehensive immutable ledger of every modification, interaction,
            and system event within this project.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search logs..."
              onChange={handleDebounceSearch}
              className="bg-white/5 border border-white/10 rounded-sm pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-0! focus:ring-orange-500/50 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/5 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

        <div className="relative bg-[#0A0A0B]/80 backdrop-blur-3xl border border-white/10 rounded-sm h-[calc(100vh-350px)] overflow-y-auto shadow-2xl p-8 md:p-12">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-white/5 to-transparent"></div>
            {loading && (
              <div className="max-w-6xl w-full mx-auto px-4">
                <div className="bg-[#0A0A0B] border border-white/5 rounded-[2rem] p-10 space-y-10 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-10 w-48 bg-white/5 rounded-lg"></div>
                    <div className="h-10 w-32 bg-white/5 rounded-lg"></div>
                  </div>
                  <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-6">
                        <div className="w-10 h-10 rounded-full bg-white/5 shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                          <div className="h-3 w-1/4 bg-white/5 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                  <p className="text-zinc-500 font-medium text-lg">
                    No matching events found
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-orange-500 text-sm mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={log._id}
                    className="relative flex gap-8 group/item animate-in fade-in slide-in-from-left-4 transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover/item:border-orange-500/50 transition-colors">
                      {getActionIcon(log.action)}

                      <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-md group-hover/item:text-orange-400 transition-colors">
                            {log.action}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          <span className="text-zinc-400 text-sm font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {formatTime(log.createdAt)}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
                          ID: {log._id}
                        </div>
                      </div>

                      <p className="text-zinc-300 text-sm mb-2 max-w-2xl">
                        {log.log}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                            {log.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-zinc-500 text-sm italic">
                            Performed by{" "}
                            <span className="text-zinc-300 non-italic">
                              Owner
                            </span>
                          </span>
                        </div>

                        {/* <button className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-white transition-colors group/link">
                          Details{" "}
                          <ChevronRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </button> */}
                      </div>
                    </div>

                    {/* Subtle separator for modern aesthetic */}
                    <div className="absolute -bottom-6 left-16 right-0 h-px bg-gradient-to-r from-white/5 to-transparent"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6 text-sm text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
            {logs.length} Events Logged
          </div>
        </div>

        <button className="flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold text-sm transition-colors">
          Export Audit Trail <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
