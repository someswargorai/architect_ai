import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import http from "@/lib/apiClient";
import { toast } from "sonner";
import { editProject } from "@/store/slices/projectSlice";
import { useAppDispatch } from "@/store/hook/hook";
import { Pencil } from "lucide-react";
import { Loader } from "@/components/Loader";
import { Textarea } from "@/components/ui/textarea";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Project name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),

    description: yup
      .string()
      .required("Project description is required")
      .min(50, "Description must be at least 50 characters")
      .max(500, "Description must be at most 500 characters"),
  })
  .required();

type EditProjectFormData = yup.InferType<typeof schema>;

interface EditProjectProps {
  name: string;
  id: string;
  description: string;
}

export default function EditProject({
  name,
  id,
  description,
}: EditProjectProps) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: name || "",
      description: description || "",
    },
  });

  const onSubmit = async (data: EditProjectFormData) => {
    try {
      const response = await http.post(`/api/projects/edit/${id}`, {
        name: data.name,
        description: data.description,
      });

      if (!response?.data?.success) {
        return toast.error(response?.data?.message);
      }

      dispatch(editProject(response?.data?.response));
      toast.success(response?.data?.message);
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to update project name:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="
          border-none bg-transparent w-full
          justify-start gap-2
          text-zinc-200
          hover:bg-zinc-900
          hover:text-amber-400
          cursor-pointer
      "
        >
          <Pencil className="size-4 opacity-80" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
        sm:max-w-106.25
        bg-[#0b0b0b]
        border border-zinc-800
        text-zinc-200
        shadow-2xl
    "
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Edit project
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Make changes to your project name here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-300">
              Project name
            </Label>

            <Input
              id="name"
              type="text"
              placeholder="My awesome project"
              {...register("name")}
              className={`
              bg-black
              border-zinc-800
              text-white
              placeholder:text-zinc-500
              focus:border-amber-400
              focus:ring-amber-400/20
              selection:bg-amber-500
              ${errors.name ? "border-red-500" : ""}
          `}
            />

            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-300">
              Project description
            </Label>

            <Textarea
              id="description"
              placeholder="My awesome project description"
              {...register("description")}
              className={`
              bg-black
              border-zinc-800
              text-white
              placeholder:text-zinc-500
              focus:border-amber-400
              focus:ring-amber-400/20
              selection:bg-amber-500
              ${errors.description ? "border-red-500" : ""}
            `}
            />

            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="
              border-zinc-800
              bg-black
              text-zinc-300
              hover:text-black
              cursor-pointer
          "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="
              min-w-[110px]
            bg-amber-400
            text-black
            hover:bg-amber-300
            font-medium
            shadow-[0_0_20px_rgba(251,191,36,0.25)]
            cursor-pointer
          "
            >
              {isSubmitting ? <Loader /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
