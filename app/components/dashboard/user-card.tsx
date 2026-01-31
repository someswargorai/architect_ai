"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface UserCardProps {
  user: {
    firstName: string;
    lastName: string;
    profilePic?: string;
    designation?: string;
    email: string;
  };
}

const UserCard = ({ user }: UserCardProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setLoading(true);
    try {
     
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      setLoading(false);
      router.push("/auth");
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Failed to log out");
      }
    }
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2.5 focus:outline-none">
            <Avatar className="sm:size-10 cursor-pointer ring-2 ring-transparent hover:ring-orange-400 transition-all">
              <AvatarImage
                src={
                  user?.profilePic ||
                  "https://res.cloudinary.com/dpacclyw4/image/upload/v1769409502/og_image_rrnstk.png"
                }
                alt={user.firstName + " " + user.lastName}
                className="object-cover"
              />

              <AvatarFallback className="text-white">User</AvatarFallback>
            </Avatar>

            <div className="hidden sm:block text-left">
              <p className="min-w-28 leading-none mb-1 text-sm text-white font-[450]">
                User
              </p>
              <p className="min-w-12 leading-none text-[13px] text-[#666666]">
                {user.email}
              </p>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-48 p-2" align="end">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-sm font-normal cursor-pointer"
              onClick={() => {
                setPopoverOpen(false);
                // router.push(`/members/profile/${session?.data?.id}`);
              }}
            >
              <User className="h-4 w-4" />
              View Profile
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-3 text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              onClick={() => {
                setPopoverOpen(false);
                setAlertOpen(true);
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="p-0 rounded-sm">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setAlertOpen(false)}
          />

          <div className="relative bg-zinc-950  rounded-sm p-6 w-full ">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Confirm Exit
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500 text-sm font-medium mb-12 leading-relaxed">
                You will be signed out of your current architectural
                environment. Ensure all changes are committed to the cloud
                registry.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex items-center justify-end gap-2">
              <AlertDialogCancel className="text-[10px] rounded-sm text-zinc-600 hover:text-black transition-colors cursor-pointer">
                Return
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleLogout}
                className="px-10 py-5 bg-amber-500! hover:bg-amber-600 text-black text-[10px] hover:ring-0 rounded-sm transition-all flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Sign Out"
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserCard;
