"use client";

import { cn } from "../lib/utils";
import { SIDEBAR_ITEMS } from "./constants/sidebar";
import Image from "next/image";
import { useAppSelector } from "@/store/hook/hook";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarIcon } from "lucide-react"; // optional icon for trigger

export default function AppSidebar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      {/* ----------------- MOBILE SIDEBAR TRIGGER ----------------- */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black/40 text-white hover:bg-black/60 transition">
            <SidebarIcon size={20} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-4 bg-black border-r border-white/5 flex flex-col gap-y-8 lg:hidden"
        >
          {/* Brand Logo */}
          <div className="px-2 flex items-center gap-x-3 mb-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <div className="size-4 bg-black rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              Architect Ai
            </span>
          </div>

          {/* Sidebar Items */}
          {SIDEBAR_ITEMS.map((group) => (
            <div key={group.id} className="flex flex-col gap-y-1">
              {group.name && (
                <div className="px-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                    {group.name}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-y-0.5">
                {group.children.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                        active
                          ? "bg-white/5 text-white"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]",
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          "transition-all",
                          active
                            ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            : "group-hover:text-zinc-300",
                        )}
                      />
                      <span className="text-sm font-medium tracking-tight">
                        {item.name}
                      </span>

                      {active && (
                        <div className="absolute left-0 w-1 h-4 bg-amber-500 rounded-r-full shadow-[2px_0_10px_rgba(245,158,11,0.4)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Footer / User */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-zinc-900/40 rounded-2xl p-4 border border-white/5 flex items-center gap-x-3">
              <Image
                src={
                  user?.profilePic ||
                  "https://res.cloudinary.com/dpacclyw4/image/upload/v1769409502/og_image_rrnstk.png"
                }
                className="size-10 rounded-full border border-white/10"
                width={50}
                height={50}
                alt="User"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">
                  {user?.firstName ?? "User"}
                </span>
                <span className="text-[10px] text-zinc-500">Free Account</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside className="w-64 hidden lg:flex h-screen sticky top-0 bg-black border-r border-white/5 flex-col p-4 gap-y-8 overflow-y-auto">
        {/* Brand Logo */}
        <div className="px-2 flex items-center gap-x-3 mb-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <div className="size-4 bg-black rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            Architect Ai
          </span>
        </div>

        {/* Sidebar Items */}
        {SIDEBAR_ITEMS.map((group) => (
          <div key={group.id} className="flex flex-col gap-y-1">
            {group.name && (
              <div className="px-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  {group.name}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-y-0.5">
              {group.children.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      active
                        ? "bg-white/5 text-white"
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]",
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "transition-all",
                        active
                          ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          : "group-hover:text-zinc-300",
                      )}
                    />
                    <span className="text-sm font-medium tracking-tight">
                      {item.name}
                    </span>

                    {active && (
                      <div className="absolute left-0 w-1 h-4 bg-amber-500 rounded-r-full shadow-[2px_0_10px_rgba(245,158,11,0.4)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer / User */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-white/5 flex items-center gap-x-3">
            <Image
              src={
                user?.profilePic ||
                "https://res.cloudinary.com/dpacclyw4/image/upload/v1769409502/og_image_rrnstk.png"
              }
              className="size-10 rounded-full border border-white/10"
              width={50}
              height={50}
              alt="User"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                {user?.firstName ?? "User"}
              </span>
              <span className="text-[10px] text-zinc-500">Free Account</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
