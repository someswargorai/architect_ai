import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import http from "@/lib/apiClient";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { setProjects } from "@/store/slices/projectSlice";
import axios from "axios";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export function DeleteProject({ id }: { id: string }) {
  const { projects } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();

  const DeleteProject = async () => {
    try {
      const response = await http.delete(`/api/projects/delete/${id}`);
      if (!response?.data?.success) {
        return toast.error(response?.data?.message);
      }

      const deletedProject = projects.filter((item) => item._id !== id);
      dispatch(setProjects(deletedProject));

      toast.success(response?.data?.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.success(err?.response?.data?.message);
      }
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="
            flex items-center gap-2
            rounded-lg
            px-3 py-2
            text-zinc-300
            cursor-pointer
            transition-colors
            hover:bg-transparent
            hover:text-amber-400
            focus:bg-white/5
            focus:text-amber-400
          "
        >
          <Trash className="size-4 opacity-80" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className="
          bg-[#0b0b0b]
          border border-zinc-800
          text-zinc-200
          shadow-[0_20px_60px_rgba(0,0,0,0.85)]
        "
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-white">
            Delete project?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400">
            This action cannot be undone. This will permanently delete your
            project and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="
              bg-black
              border border-zinc-800
              text-zinc-300
              hover:bg-zinc-900
              hover:text-white
            "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="
              bg-red-500
              text-white
              hover:bg-red-400
              shadow-[0_0_20px_rgba(239,68,68,0.25)]
            "
            onClick={DeleteProject}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
