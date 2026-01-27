"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { setProjects } from "@/store/slices/projectSlice";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/app/components/projects/project-dialog";
import http from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import {
  ArrowUpRight,
  Bookmark,
  Calendar,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectActions } from "@/app/components/projects/options";
import { Input } from "@/components/ui/input";

export default function ProjectsSection() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const projects = useAppSelector((state) => state.project.projects);
  const dispatch = useAppDispatch();
  const { status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await http.get(`/api/projects?search=${search}`);
        dispatch(setProjects(res?.data));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [dispatch, status, search]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSearch(value);
    }, 500);
  };

  const skeletonCount = 6;

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              My Projects
            </h2>
            <div className="px-2 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
              {isLoading ? "..." : projects.length} Projects
            </div>
          </div>
          <p className="text-zinc-500 text-sm">
            Organize and execute your personal creative and technical goals.
          </p>
        </div>

        <div className="flex items-center gap-x-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
            <Input
              type="text"
              onChange={handleSearch}
              placeholder="Search my projects..."
              className="h-10 w-48 lg:w-64 bg-zinc-900/50 border border-white/5 rounded-sm pl-10 pr-4 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-700 hover:ring-0!"
              disabled={isLoading}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-white/5 bg-zinc-900/50 h-10 px-4"
            disabled={isLoading}
          >
            <Filter className="size-4 mr-2 text-zinc-400" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex flex-col p-6 bg-zinc-900/40 backdrop-blur-xl rounded-smz border border-white/5 overflow-hidden shadow-2xl h-full min-h-[340px]"
            >
              <div className="flex justify-between items-start mb-6">
                <Skeleton className="h-5 w-20 rounded-lg bg-zinc-800/80" />
                <Skeleton className="size-8 rounded-full bg-zinc-800/80" />
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-3/4 rounded-md bg-zinc-800/80" />
                  <Skeleton className="size-5 rounded-full bg-zinc-800/80" />
                </div>
                <Skeleton className="h-4 w-40 rounded bg-zinc-800/80" />
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-28 rounded bg-zinc-800/80" />
                  <Skeleton className="h-3 w-10 rounded bg-zinc-800/80" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full bg-zinc-800/80" />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="size-1.5 rounded-full bg-zinc-800/80" />
                  <Skeleton className="h-3 w-24 rounded bg-zinc-800/80" />
                </div>
                <Skeleton className="h-3 w-16 rounded bg-zinc-800/80" />
              </div>

              <div className="absolute -bottom-12 -right-12 size-32 bg-zinc-800/20 blur-[60px]" />
            </div>
          ))
        ) : (
          <>
            {projects.map((project) => (
              <div
                key={project._id}
                className="group relative flex flex-col p-6 bg-zinc-900/40 backdrop-blur-xl rounded-sm border border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-lg font-bold uppercase tracking-widest text-zinc-400 group-hover:text-amber-500 transition-colors"></div>
                  <ProjectActions
                    onEdit={() => {
                      console.log("Edit project", project._id);
                    }}
                    onDelete={() => {
                      console.log("Delete project", project._id);
                    }}
                  />
                </div>

                <div className="space-y-1 mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight truncate pr-4">
                      {project.name}
                    </h3>
                    <ArrowUpRight
                      className="size-4 text-zinc-700 group-hover:text-amber-500 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    />
                  </div>
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <Calendar className="size-3 mr-1.5" />
                    Started {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 ">
                    <span>Milestones reached</span>
                    <span className="text-amber-500">
                      {project.progress || 0}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-x-2">
                    <div
                      className={cn(
                        "size-1.5 rounded-full",
                        project.priority === "High"
                          ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                          : project.priority === "Completed"
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                      )}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {project.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center gap-x-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    <Bookmark className="size-3" />
                    Private
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-12 size-32 bg-amber-500/5 blur-[60px] group-hover:bg-amber-500/10 transition-colors" />
              </div>
            ))}

            <div
              onClick={() => setOpen(true)}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-sm hover:border-amber-500/20 hover:bg-white/[0.01] transition-all cursor-pointer group h-full min-h-[340px]"
            >
              <div className="size-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-amber-500/40 transition-all">
                <Plus className="size-5 text-zinc-600 group-hover:text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-300">
                Add Project
              </p>
            </div>
          </>
        )}
      </div>

      <ProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
