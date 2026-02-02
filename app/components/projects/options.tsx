"use client";

import { MoreHorizontal, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProject from "./edit-project";
import { DeleteProject } from "./delete-project";
import { useState } from "react";
import { UserMultiSelectDialog } from "./invite-member";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectActionsProps {
  name: string;
  id: string;
  description: string;
  priority: "high" | "medium" | "low";
  appearance: "public" | "private";
}

export function ProjectActions({
  name,
  id,
  description,
  priority,
  appearance,
}: ProjectActionsProps) {
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
  const router= useRouter();

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropDownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="
            inline-flex size-8 items-center justify-center 
            rounded-full
            border border-white/5
            bg-black/40
            text-zinc-500
            transition-all
            hover:bg-white/5
            hover:text-amber-400
            focus:outline-none
            focus:ring-2 focus:ring-amber-400/20
          "
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          min-w-[160px]
          rounded-xl
          border border-white/10
          bg-[#0b0b0b]
          
          shadow-[0_20px_50px_rgba(0,0,0,0.8)]
        "
      >
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="
            flex items-center gap-2
            rounded-lg
            px-6 py-3
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-white/5
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <span onClick={() => router.push(`/projects/settings/${id}`)} className="flex gap-1 items-center">
            <Settings /> Settings
          </span>
        </DropdownMenuItem>

        <div className="my-1 h-px bg-white/5" />

        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="
            flex items-center gap-2
            rounded-lg
            px-3
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-white/5
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <DeleteProject id={id} />
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="
            flex items-center gap-2
            rounded-lg
            px-3
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-white/5
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <EditProject
            name={name}
            id={id}
            description={description}
            priority={priority}
            appearance={appearance}
            setDropDownOpen={setDropDownOpen}
          />
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="
            flex items-center gap-2
            rounded-lg
            px-3
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-white/5
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <UserMultiSelectDialog
            id={id}
            inviteMemberOpen={inviteMemberOpen}
            setInviteMemberOpen={setInviteMemberOpen}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
