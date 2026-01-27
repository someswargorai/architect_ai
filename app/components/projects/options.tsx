"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ProjectActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectActions({ onEdit, onDelete }: ProjectActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            inline-flex items-center justify-center
            size-8 rounded-full
            hover:bg-white/5
            transition-colors
          "
        >
          <MoreHorizontal className="size-4 text-zinc-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="
          bg-[#0B0F14]
          border border-white/10
          rounded-xl
          shadow-xl
          min-w-[140px]
        "
      >
        <DropdownMenuItem
          onClick={onEdit}
          className="
            gap-2 cursor-pointer
            text-zinc-300
            focus:bg-white/5
            focus:text-white
          "
        >
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="
            gap-2 cursor-pointer
            text-red-400
            focus:bg-red-500/10
            focus:text-red-400
          "
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
