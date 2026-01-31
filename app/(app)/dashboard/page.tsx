"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectDialog } from "@/app/components/projects/project-dialog";
import http from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  progress?: number;
  priority?: "Low" | "Medium" | "High";
}

interface DashboardProps {
  onLaunchEditor: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunchEditor, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      _id: "1",
      name: "Microservices Mesh",
      description: "Internal service communication diagram",
      createdAt: new Date().toISOString(),
      progress: 65,
      priority: "High",
    },
    {
      _id: "2",
      name: "Edge Gateway v2",
      description: "Public API entry point",
      createdAt: new Date().toISOString(),
      progress: 100,
      priority: "Medium",
    },
    {
      _id: "3",
      name: "Auth Bridge",
      description: "SSO and Identity provider flow",
      createdAt: new Date().toISOString(),
      progress: 12,
      priority: "High",
    },
  ]);
  const [recentlyAddedArchitures, setRecentlyAddedArchitectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(true);
  const {status} =  useSession();

  useEffect(() => {
    if(status!=="authenticated") return;

    const fetchRecentlyInvitedArchitectures = async () => {
      try {
        const response = await http.get(
          "/api/dashboard/recently-invited-architectures",
        );

        if (!response?.data?.success) {
          return toast.error(response?.data?.message);
        }

        console.log(response?.data?.projects);;
        setRecentlyAddedArchitectures(response?.data?.projects);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return toast.error(err?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyInvitedArchitectures();
  }, [status]);

  // Mocked session data
  const sessionUser = { name: "Architect One" };

  const recentProjects = projects.slice(0, 5);
  const starredProjects = projects.filter((p) => p.priority === "High");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter">
      <div className="container mx-auto p-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
            >
              Control Center
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter"
            >
              Welcome back, <br />
              <span className="text-zinc-500">
                {sessionUser.name.split(" ")[0]}
              </span>
            </motion.h1>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setOpen(true)}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-sm shadow-[0_10px_30px_rgba(245,158,11,0.2)] transition-all flex items-center gap-3 group cursor-pointer"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </motion.button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Designs"
            value={projects.length.toString()}
            trend="+2 this week"
            icon="folder"
          />
          <StatCard
            title="AI Operations"
            value="142"
            trend="Active compute"
            icon="sparkle"
          />
          <StatCard
            title="High Priority"
            value={starredProjects.length.toString()}
            trend="Needs review"
            icon="star"
          />
          <StatCard
            title="Deployment"
            value="8"
            trend="Live infrastructure"
            icon="cloud"
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Projects */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Recent Invited Architecture Designs
            </h2>
            <div className="bg-zinc-900/30 border border-white/5 backdrop-blur-xl rounded-sm p-2">
              {recentlyAddedArchitures.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="size-16 bg-zinc-950 rounded-sm border border-white/5 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-6 h-6 text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    No active projects
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentlyAddedArchitures.map((project, index) => (
                    <ProjectItem
                      key={index}
                      project={project}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Panel: Actions & Starred */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Fast Access
              </h2>
              <div className="space-y-3">
                <QuickAction
                  title="Generate with AI"
                  desc="Text-to-architecture studio"
                  icon="ai"
                  onClick={onLaunchEditor}
                />
                <QuickAction
                  title="Blank Canvas"
                  desc="Manual precision drafting"
                  icon="plus"
                  onClick={onLaunchEditor}
                />
                <QuickAction
                  title="Library"
                  desc="Pre-built cloud patterns"
                  icon="book"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};

// ── Helper Sub-Components (Themed) ──────────────────────────────

function StatCard({
  title,
  value,
  trend,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  icon: string;
}) {
  return (
    <div className="bg-zinc-900/30 border border-white/5 backdrop-blur-xl p-8 rounded-sm hover:border-amber-500/10 transition-all relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-0 bg-amber-500 group-hover:h-full transition-all duration-500"></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">
            {title}
          </p>
          <p className="text-4xl font-black tracking-tighter text-white">
            {value}
          </p>
        </div>
        <div className="size-10 bg-zinc-950 rounded-sm flex items-center justify-center text-amber-500/20 group-hover:text-amber-500 transition-colors border border-white/5">
          {icon === "folder" && (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          )}
          {icon === "sparkle" && (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
              />
            </svg>
          )}
          {icon === "star" && (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          )}
          {icon === "cloud" && (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          )}
        </div>
      </div>
      <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-amber-500/50 transition-colors">
        {trend}
      </p>
    </div>
  );
}

function QuickAction({
  title,
  desc,
  icon,
  onClick,
}: {
  title: string;
  desc: string;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-5 p-5 bg-zinc-900/30 border border-white/5 rounded-sm hover:border-amber-500/20 hover:bg-zinc-900/50 transition-all text-left group"
    >
      <div className="size-12 bg-zinc-950 rounded-sm border border-white/5 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 transition-transform">
        {icon === "ai" && (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M16.243 16.243l-.707.707M12 8c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4z"
            />
          </svg>
        )}
        {icon === "plus" && (
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
        {icon === "book" && (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
          {title}
        </h3>
        <p className="text-[10px] font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase tracking-tight">
          {desc}
        </p>
      </div>
      <svg
        className="w-3 h-3 text-zinc-800 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

function ProjectItem({
  project,
}: {
  project: Project;
}) {
  const date = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <Link
     href={`/projects/${project._id}`}
      className="p-5 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-zinc-900/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-6">
        <div className="size-12 bg-zinc-950 rounded-sm border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight mb-1">
            {project.name}
          </h4>
          <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
            {date} • {project.priority} Priority
          </p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-amber-500/80 mb-1">
            {project.progress || 0}%
          </span>
          <div className="w-24 h-0.5 bg-zinc-800 rounded-full">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        <svg
          className="w-4 h-4 text-zinc-800 group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </Link>
  );
}

export default Dashboard;
