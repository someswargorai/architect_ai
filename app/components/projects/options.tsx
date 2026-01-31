"use client";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProject from "./edit-project";
import { DeleteProject } from "./delete-project";

interface ProjectActionsProps {
  name: string;
  id: string;
  description: string;
}

export function ProjectActions({ name, id, description }: ProjectActionsProps) {
  return (
    <DropdownMenu>
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
          p-1
          shadow-[0_20px_50px_rgba(0,0,0,0.8)]
        "
      >
        {/* Edit */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="
            flex items-center gap-2
            rounded-lg
            px-3 py-2
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-white/5
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <EditProject name={name} id={id} description={description}/>
        </DropdownMenuItem>

        {/* Divider */}
        <div className="my-1 h-px bg-white/5" />

        {/* Delete */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="
            flex items-center gap-2
            rounded-lg
            px-3 py-2
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-white/5
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <DeleteProject id={id}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
