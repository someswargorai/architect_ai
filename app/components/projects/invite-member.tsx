"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, X, Loader2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import http from "@/lib/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Loader } from "@/components/Loader";

interface User {
  _id: string;
  email: string;
}

interface InvitedEntry {
  user: User;
  permission: string;
  _id: string;
}
export function UserMultiSelectDialog({
  id,
  inviteMemberOpen,
  setInviteMemberOpen,
}: {
  id: string;
  inviteMemberOpen: boolean;
  setInviteMemberOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!inviteMemberOpen) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await http.get("/api/users", {
          params: { q: query },
        });
        setUsers(res.data.users || []);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, inviteMemberOpen]);

  useEffect(() => {
    const fetchInvitedUsers = async () => {
      const response = await http.get(
        `/api/get-invite-project-members?id=${id}`,
      );

      if (!response?.data?.success) {
        return toast.error(response?.data?.message) || "Error fetching users";
      }

       const invitedUsers = response.data.users.map(
         (entry: InvitedEntry) => entry.user,
       );

      setSelected(invitedUsers);
    };

    if (inviteMemberOpen) {
      fetchInvitedUsers();
    }
  }, [id, inviteMemberOpen]);

  const shareProject = async () => {
    try {
      setMemberLoading(true);

      const response = await http.post("/api/invite-project", {
        id: id,
        users: selected,
      });

      if (!response?.data?.success) {
        return toast.error(response?.data?.message);
      }

      toast.success(response?.data?.message);
      setInviteMemberOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return toast.error(err?.response?.data?.message);
      }
    } finally {
      setMemberLoading(false);
    }
  };

  const toggleUser = (user: User) => {
    setSelected((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user],
    );
  };

  return (
    <Dialog open={inviteMemberOpen} onOpenChange={setInviteMemberOpen}>
      <DialogTrigger asChild>
        <Button
          className="
            w-full justify-start gap-2
            bg-transparent border-none
            text-zinc-200
            hover:bg-zinc-900
            hover:text-amber-400
          "
        >
          <UserPlus className="h-4 w-4 opacity-80" />
          Invite members
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-w-md
          bg-[#0b0b0b]
          border border-zinc-800
          text-zinc-200
          shadow-2xl
          min-h-100
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Invite people
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add users who can view or edit this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-1.5 rounded-md border border-zinc-800 bg-black p-2 min-h-10.5">
            {selected.length === 0 && (
              <span className="text-sm text-zinc-500">
                Selected users will appear here
              </span>
            )}

            {selected.map((user) => (
              <span
                key={user._id}
                className="
                  flex items-center gap-1
                  rounded-md bg-zinc-800
                  px-2 py-0.5
                  text-xs text-zinc-200
                "
              >
                {user.email}
                {/* <X
                  className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => toggleUser(user)}
                /> */}
              </span>
            ))}
          </div>

          <Command className="h-50 rounded-md border border-zinc-800 bg-black text-zinc-200">
            <div className="flex items-center border-b border-zinc-800 px-3">
              <CommandInput
                placeholder="Search by email…"
                value={query}
                onValueChange={setQuery}
                className="border-none focus:ring-0 selection:bg-amber-500"
              />
            </div>

            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin opacity-60" />
              </div>
            )}

            {!loading && query && users.length === 0 && (
              <CommandEmpty>No users found.</CommandEmpty>
            )}

            <CommandGroup className="max-h-56 overflow-y-auto">
              {users.map((user) => {
                const isSelected = selected.some((u) => u._id === user._id);

                return (
                  <CommandItem
                    key={user._id}
                    value={user.email}
                    onSelect={() => toggleUser(user)}
                    className="
                      flex items-center justify-between
                      text-zinc-200  hover:bg-amber-500/5
                    "
                  >
                    <span>{user.email}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-amber-400",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </div>
        {memberLoading ? (
          <Loader />
        ) : (
          <Button onClick={shareProject} className="cursor-pointer bg-amber-500 hover:bg-amber-600">Confirm</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
