"use client";

import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { setUser } from "@/store/slices/authSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && !isAuthenticated) {
      dispatch(setUser(session));
    }
  }, [status, session, isAuthenticated, dispatch]);

  return <>{children}</>;
}
