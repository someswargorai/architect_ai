"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hook/hook";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  addProjectOptimistic,
  removeProject,
  updateProjectId,
} from "@/store/slices/projectSlice";
import http from "@/lib/apiClient";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = React.useState("");
  const dispatch = useAppDispatch();

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Project name cannot be empty");

    const tempId = uuidv4();
    const optimisticProject = {
      _id: tempId,
      name,
      createdAt: new Date().toISOString(),
      progress: "0",
      priority: "Medium",
    };
    dispatch(addProjectOptimistic(optimisticProject));

    try {
      const res = await http.post("/api/projects",{name: name});
      const data = res.data;
      dispatch(updateProjectId({ tempId, realId: data._id }));
      toast.success("Project created!");
    } catch (error) {
      dispatch(removeProject(tempId));
      toast.error("Failed to create project");
      console.error(error);
    }

    setName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E1E1E] text-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#2B2B2B] text-white placeholder:text-gray-400"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            className="bg-white text-black hover:bg-gray-200"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
