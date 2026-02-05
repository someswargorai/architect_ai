"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { setProjects } from "@/store/slices/projectSlice";
import { ProjectDialog } from "@/app/components/projects/project-dialog";
import http from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import {
  ArrowUpRight,
  Bookmark,
  Calendar,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectActions } from "@/app/components/projects/options";
import { Input } from "@/components/ui/input";
import FilterModal from "@/app/components/projects/filter";
import {motion} from 'framer-motion';
import { toast } from "sonner";
import axios from "axios";

export interface Form{
    priority: "medium" | "high" | "low" | undefined,
    startDate: Date | undefined ,
    appearance: "public" | "private" | undefined,
}

export default function ProjectsSection() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const projects = useAppSelector((state) => state.project.projects);
  const dispatch = useAppDispatch();
  const { status} = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(null);
  const session = useSession() as { data?: { id?: string } };
  const [form, setForm] = useState<Form>({
    priority: undefined,
    startDate: undefined,
    appearance: undefined,
  });
  const [refetch, setRefetch]= useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await http.get(`/api/projects?search=${search}&form=${JSON.stringify(form)}`);
        dispatch(setProjects(res?.data));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        if(axios.isAxiosError(error)){
          return toast.error(error?.response?.data?.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [dispatch, status, search, refetch]);

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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
              My{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Projects
              </span>
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] ">
              {isLoading ? "..." : projects.length} Projects
            </div>
          </div>
          <p className="text-zinc-500 text-sm">
            Organize and execute your personal creative and technical goals.
          </p>
        </div>

        <div className="flex items-center gap-x-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setOpen(true)}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-sm shadow-[0_10px_30px_rgba(245,158,11,0.2)] transition-all flex items-center gap-3 group cursor-pointer"
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

          <FilterModal
            form={form}
            setForm={setForm}
            setRefetch={setRefetch}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="h-[calc(100vh-225px)]  overflow-y-auto">
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
                  className="group relative flex  flex-col p-6 bg-zinc-900/40 backdrop-blur-xl rounded-sm border border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl"
                >
                  {session.data && session.data.id === project.user && (
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-3 py-1 rounded-lg font-bold uppercase tracking-widest text-zinc-400 group-hover:text-amber-500 transition-colors"></div>
                      <ProjectActions
                        name={project.name}
                        id={project._id}
                        description={project.description}
                        priority={project.priority}
                        appearance={project.appearance}
                      />
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors tracking-tight truncate pr-4">
                        {project.name}
                      </h3>
                      <ArrowUpRight
                        className="size-4 text-zinc-700 group-hover:text-amber-500 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        onClick={() => router.push(`/projects/${project._id}`)}
                      />
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2 group-hover:text-zinc-400 transition-colors">
                        {project.description}
                      </p>
                    )}

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
                    <div className="h-1.5 w-full flex-1 bg-white/5 rounded-full overflow-hidden">
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
                          project.priority === "high"
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            : project.priority === "medium"
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
                      {project.appearance}
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
      </div>

      <ProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
