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
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/store/hook/hook";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  addProjectOptimistic,
  removeProject,
  updateProjectId,
} from "@/store/slices/projectSlice";
import http from "@/lib/apiClient";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const projectSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .required("Project name is required"),
  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  priority: yup
    .string()
    .oneOf(
      ["high", "medium", "low"],
      "you have to select any of the values from high, medium, low",
    )
    .required("Priority is required"),
  appearance: yup
    .string()
    .oneOf(
      ["public", "private"],
      "you have to select any of the values from public,  private",
    )
    .required("appearance is required"),
});

type ProjectFormValues = yup.InferType<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    const tempId = uuidv4();

    const optimisticProject = {
      _id: tempId,
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      progress: "0",
      priority: data.priority || "Medium",
      appearance:data.appearance
    };

    dispatch(addProjectOptimistic(optimisticProject));

    try {
      const res = await http.post("/api/projects", data);
      dispatch(updateProjectId({ tempId, realId: res.data._id }));
      toast.success("Project created");

      reset();
      onOpenChange(false);
    } catch (error) {
      dispatch(removeProject(tempId));
      toast.error("Failed to create project");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
    bg-[#0B0F14]
    text-white
    border border-white/10
    rounded-2xl
    shadow-xl
    max-w-md
  "
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            New Project
          </DialogTitle>
          <p className="text-sm text-gray-400">
            Set up your project details to get started.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Project name
            </label>
            <Input
              placeholder="e.g. AI Architecture Dashboard"
              {...register("name")}
              className="
            bg-[#121821]
            border-white/10
            text-white
            placeholder:text-gray-500
            focus-visible:ring-1
            focus-visible:ring-amber-400
          "
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Description
            </label>
            <Textarea
              placeholder="Briefly describe what this project is about..."
              {...register("description")}
              className="
            bg-[#121821]
            border-white/10
            text-white
            placeholder:text-gray-500
            resize-none
            min-h-[90px]
            focus-visible:ring-1
            focus-visible:ring-amber-400
          "
            />
            {errors.description && (
              <p className="text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-[#121821] border-white/10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔥 High</SelectItem>
                    <SelectItem value="medium">⚡ Medium</SelectItem>
                    <SelectItem value="low">🧊 Low</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-xs text-red-400">{errors.priority.message}</p>
            )}
          </div>

          {/* Appearance */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Visibility
            </label>
            <Controller
              name="appearance"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-[#121821] border-white/10">
                    <SelectValue placeholder="Who can see this project?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">🌍 Public</SelectItem>
                    <SelectItem value="private">🔒 Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.appearance && (
              <p className="text-xs text-red-400">
                {errors.appearance.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="
            w-full
            bg-amber-400
            text-black
            hover:bg-amber-300
            font-medium
            rounded-md
            transition
            disabled:opacity-60
          "
            >
              {isSubmitting ? "Creating project…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
