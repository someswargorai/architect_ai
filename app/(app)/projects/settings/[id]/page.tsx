"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Users,
  ChevronDown,
  Shield,
  Eye,
  Edit3,
  MoreHorizontal,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import http from "@/lib/apiClient";
import { toast } from "sonner";
import Link from "next/link";

// Types
type User = {
  _id: string;
  email: string;
};

type Member = {
  _id: string;
  user: User;
  permission?: "read" | "write";
};

export default function ProjectMembersPage() {
  const { id } = useParams();
  const { status } = useSession();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/api/get-invite-project-members?id=${id}`);
        if (res.data.success) {
          setMembers(res.data.users);
        } else {
          toast.error("Failed to load members");
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [id, status]);

  const updatePermission = async (
    userId: string,
    newPermission: "read" | "write",
  ) => {
    setUpdatingId(userId);
    try {
      const res = await http.post(`/api/get-project-members-with-permissions`, {
        id,
        userId,
        permission: newPermission,
      });

      if (res.data.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.user._id === userId ? { ...m, permission: newPermission } : m,
          ),
        );
        toast.success("Permission updated");
      } else {
        toast.error("Failed to update permission");
      }
    } catch (err) {
      toast.error("Error updating permission");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeMember = async () => {
    if (!removeTarget) return;

    try {
      const res = await http.post(`/api/delete-members-from-projects`, {
        userId: removeTarget.user._id,
        id,
      });

      if (res.data.success) {
        setMembers((prev) =>
          prev.filter((m) => m.user._id !== removeTarget.user._id),
        );
        toast.success("Member removed");
      } else {
        toast.error("Failed to remove member");
      }
    } catch (err) {
      toast.error("Error removing member");
      console.error(err);
    } finally {
      setRemoveTarget(null);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 mt-5 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] uppercase font-bold tracking-widest mb-4">
            <Shield className="w-3 h-3" /> Access Control
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Project{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Members
            </span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Fine-tune project governance. Manage roles, permissions, and team
            access with surgical precision.
          </p>
        </div>
        {/* <button className="group relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <UserPlus className="w-5 h-5" />
          Add Member
          <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </button> */}
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

        <div className="relative bg-[#0A0A0B]/80 backdrop-blur-3xl border border-white/10 rounded-sm h-[calc(100vh-350px)] overflow-y-auto shadow-2xl">
          {loading && (
            <div className="max-w-6xl w-full mx-auto px-4 mt-5 animate-in slide-in-from-bottom-4 duration-700">
              <div className="bg-[#0A0A0B] border border-white/5 rounded-3xl p-10 space-y-8">
                <div className="space-y-3">
                  <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse"></div>
                  <div className="h-5 w-96 bg-white/5 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-6 border-b border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse"></div>
                        <div className="h-6 w-48 bg-white/5 rounded-lg animate-pulse"></div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-10 bg-white/5 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No team members yet
              </h3>
              <p className="text-zinc-500 max-w-xs">
                Start building your collaborative workspace by inviting your
                colleagues.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-zinc-900 sticky top-0 z-1000">
                    <th className="px-8 py-6 text-sm font-semibold text-zinc-500">
                      Collaborator
                    </th>
                    <th className="px-8 py-6 text-sm font-semibold text-zinc-500 ">
                      Role & Permission
                    </th>
                    <th className="px-8 py-6 text-sm font-semibold text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member) => (
                    <tr
                      key={member.user._id}
                      className="group/row hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-zinc-300 text-lg">
                            {member.user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-base group-hover/row:text-orange-400 transition-colors">
                              {member.user.email.split("@")[0]}
                            </span>
                            <span className="text-zinc-500 text-sm">
                              {member.user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="relative inline-block w-40">
                          <select
                            value={member.permission}
                            disabled={updatingId === member.user._id}
                            onChange={(e) =>
                              updatePermission(
                                member.user._id,
                                e.target.value as "read" | "write",
                              )
                            }
                            className="w-full appearance-none bg-zinc-900/50 border border-white/10 rounded-sm px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <option value="read">Reader Access</option>
                            <option value="write">Writer Access</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            {updatingId === member.user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {member.permission === "write" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[8px] font-bold uppercase">
                              <Edit3 className="w-3 h-3" /> Full Editor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase">
                              <Eye className="w-3 h-3" /> View Only
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 ">
                          {/* <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                            <MoreHorizontal className="w-5 h-5" />
                          </button> */}
                          <button
                            onClick={() => {
                              setRemoveTarget(member);
                              setIsAlertOpen(true);
                            }}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Stats / Info Footer */}
      <div className="mt-8 flex items-center justify-between text-zinc-500 text-sm ">
        <div className="flex items-center gap-4">
          <span>
            Total Seats: <b className="text-zinc-300">{members.length} / 50</b>
          </span>
          <span className="w-px h-4 bg-white/10"></span>
          <span>
            Project Visibility: <b className="text-zinc-300">Team Restricted</b>
          </span>
        </div>
        <Link
          href={`/logs/${id}`}
          className="flex items-center gap-1 text-orange-500/80 font-medium cursor-pointer hover:text-orange-500 transition-colors"
        >
          View Detailed Permissions Log
        </Link>
      </div>

      {isAlertOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-300"
            onClick={() => setIsAlertOpen(false)}
          />
          <div className="relative bg-[#111112] border border-white/10 rounded-sm p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6 ">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Remove team member?
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
              This action will revoke all access for{" "}
              <span className="text-white font-medium">
                {removeTarget?.user.email}
              </span>
              . They will no longer be able to view or contribute to this
              project&apos;s assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsAlertOpen(false)}
                className="flex-1 px-6 py-3 rounded-sm border border-white/5 text-zinc-300 font-bold hover:bg-white/5 transition-all text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={removeMember}
                className="flex-1 px-3 py-3 rounded-sm bg-red-600 hover:bg-red-700 text-white font-bold transition-all text-sm cursor-pointer"
              >
                Remove Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
