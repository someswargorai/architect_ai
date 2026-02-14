"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Zod schema for validation
const authSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

const AuthPageClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email.trim(),
        password: data.password.trim(),
        name: data.name?.trim() || undefined,
      });

      if (response?.ok || response?.status === 200) {
        toast.success("Welcome to ArchitectAI!");
        router.push("/projects");
        router.refresh();
      } else {
        toast.error(response?.error || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
      {/* Premium Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[100px] -z-10"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative"
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="text-center mb-10">
            {/* Logo matching Sidebar brand */}
            <div
              className="size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mx-auto mb-6 cursor-pointer transform hover:rotate-12 transition-transform duration-500"
            //   onClick={() => setView("landing")}
            >
              <div className="size-6 bg-black rounded-md rotate-45" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Architect AI
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-tight">
              Access your personal creative workspace
            </p>
          </div>

          {/* Social Connectors - Premium Stealth Style */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="py-3 px-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2.5 text-xs font-bold text-zinc-300 group">
              <svg
                className="size-4 group-hover:text-amber-500 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.805.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
            <button className="py-3 px-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2.5 text-xs font-bold text-zinc-300 group">
              <svg
                className="size-4 group-hover:text-amber-500 transition-colors"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.25em]">
              <span className="bg-[#0b0f1a]/0 px-4 text-zinc-600">
                Secure Entry
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                Full Identity
              </label>
              <input
                type="text"
                placeholder="Name"
                {...register("name")}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all text-sm"
              />
              {errors.name && (
                <p className="text-amber-500/80 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                Work Email
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                {...register("email")}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all text-sm"
              />
              {errors.email && (
                <p className="text-amber-500/80 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-wider">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                Security Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all text-sm"
              />
              {errors.password && (
                <p className="text-amber-500/80 text-[10px] font-bold mt-1.5 ml-1 ">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-sm text-xs shadow-[0_10px_30px_rgba(245,158,11,0.2)] transition-all transform hover:scale-[1.01] active:scale-[0.98] mt-4 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
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
                "Authorize"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href={"/"}
              className="text-zinc-500 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPageClient;
