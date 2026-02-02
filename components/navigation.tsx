"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hook/hook";
import { BellIcon, BriefcaseMedicalIcon, ChevronRight, FolderIcon } from "lucide-react";
import UserCard from "@/app/components/dashboard/user-card";
import { useEffect, useState } from "react";

const Navigation = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { isMobile } = useSidebar();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const projectName = searchParams.get("projectName");
  const decodedName = decodeURIComponent(projectName || "");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-4 z-40 mx-4 transition-all duration-500 ease-in-out border flex items-center justify-between min-h-[76px] px-4 sm:px-6 rounded-2xl gap-x-3",
        "bg-black/40 backdrop-blur-2xl border-white/5",
        "shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]",
        scrolled ? "top-4 shadow-amber-500/5" : "top-2",
      )}
    >
      <div className="flex items-center flex-1 gap-x-4 overflow-hidden">
       
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-x-2 sm:gap-x-3 capitalize whitespace-nowrap">
            <Link
              href={`/${currentPath}`}
              className={cn(
                "flex items-center gap-x-2.5 transition-all duration-200 group",
                !!decodedName
                  ? "text-zinc-500 hover:text-zinc-200"
                  : "text-white font-bold cursor-default",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl border transition-all",
                  !!decodedName
                    ? "bg-zinc-900/50 border-white/5 group-hover:bg-zinc-800"
                    : "bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
                )}
              >
                {decodedName && isMobile ? (
                  <FolderIcon className="size-4 text-zinc-500 group-hover:text-zinc-300" />
                ) : (
                  <FolderIcon
                    className={cn(
                      "size-4",
                      !decodedName
                        ? "text-amber-500"
                        : "text-zinc-500 group-hover:text-zinc-300",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "tracking-tight sm:text-lg",
                  !decodedName && "text-white",
                )}
              >
                {currentPath}
              </span>
            </Link>

            {decodedName && (
              <>
                <ChevronRight className="size-4 text-zinc-700 shrink-0" />
                <div className="flex items-center gap-x-2.5 group overflow-hidden">
                  <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] shrink-0">
                    <BriefcaseMedicalIcon className="size-4 text-amber-500" />
                  </div>
                  <p className="text-white font-bold tracking-tight sm:text-lg truncate max-w-[100px] sm:max-w-xs group-hover:text-amber-400 transition-colors">
                    {decodedName}
                  </p>
                </div>
              </>
            )}
          </div>

          <p className="hidden sm:block text-zinc-500 text-xs font-medium mt-0.5 tracking-wide">
            Manage and track all your {currentPath}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <div className="flex items-center gap-x-1 sm:gap-x-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer bg-zinc-900/40 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all group relative"
                onClick={() => {
                  toast.info("This feature is coming soon!");
                }}
              >
                <BellIcon className="size-5 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                <span className="absolute top-2 right-2 size-2 bg-amber-500 rounded-full border-2 border-black" />
              </Button>

              <Separator
                orientation="vertical"
                className="mx-2 h-8 bg-zinc-800/50"
              />

              <UserCard user={user} />
            </>
          ) : (
            <div className="flex items-center gap-x-3">
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer bg-zinc-900/20 border border-white/5 rounded-xl opacity-50"
                disabled
              >
                <BellIcon className="size-5 text-zinc-700" />
              </Button>

              <Separator
                orientation="vertical"
                className="mx-2 h-8 bg-zinc-800/50"
              />

              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl bg-zinc-900" />
                <div className="hidden sm:flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-28 bg-zinc-900" />
                  <Skeleton className="h-2 w-12 bg-zinc-900" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
