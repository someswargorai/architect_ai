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

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
      priority: "Medium",
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
          shadow-2xl
          max-w-md
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
          <p className="text-sm text-gray-400">
            Organize and track your next big idea
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Project Name */}
          <div className="space-y-1">
            <Input
              placeholder="Project name"
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
          <div className="space-y-1">
            <Textarea
              placeholder="Project description"
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
                rounded-sm
                disabled:opacity-60
                cursor-pointer
              "
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                </span>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
