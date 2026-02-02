// app/projects/[id]/members/page.tsx   (or wherever it fits your structure)

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/apiClient";
import { useSession } from "next-auth/react";

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
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/api/get-invite-project-members?id=${id}`);
        if (res.data.success) {
          console.log(res.data.users);
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

  // Update permission
  const updatePermission = async (
    userId: string,
    newPermission: "read" | "write",
  ) => {
    setUpdatingId(userId);
    try {
      // Replace this with your actual API endpoint
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

  // Remove member
  const removeMember = async (userId: string) => {
    if (!confirm("Remove this member from the project?")) return;

    try {
      const res = await http.post(`/api/delete-members-from-projects`, {
        userId: userId,
        id: id,
      });

      if (res.data.success) {
        setMembers((prev) => prev.filter((m) => m._id !== userId));
        toast.success("Member removed");
      } else {
        toast.error("Failed to remove member");
      }
    } catch (err) {
      toast.error("Error removing member");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <Skeleton className="h-6 w-64" />
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold">
            Project Members
          </CardTitle>
          <CardDescription>
            Manage who can view and edit this project
          </CardDescription>
        </CardHeader>

        <CardContent>
          {members?.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No members have been added to this project yet.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[55%]">Email</TableHead>
                    <TableHead className="w-[25%]">Permission</TableHead>
                    <TableHead className="w-[20%] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.user._id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">
                        {member?.user?.email}
                      </TableCell>

                      <TableCell>
                        <Select
                          value={member.permission}
                          onValueChange={(value: "read" | "write") =>
                            updatePermission(member.user._id, value)
                          }
                          disabled={updatingId === member.user._id}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">
                              <Badge variant="outline" className="text-xs">
                                Read
                              </Badge>
                            </SelectItem>
                            <SelectItem value="write">
                              <Badge variant="default" className="text-xs">
                                Write
                              </Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          onClick={() => removeMember(member._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
