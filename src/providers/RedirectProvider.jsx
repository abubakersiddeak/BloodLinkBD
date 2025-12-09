"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";

export default function RedirectProvider({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login"); // not logged in
        return;
      }

      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "volunteer") {
        router.push("/dashboard/volunteer");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) return <Loading />;

  return <>{children}</>;
}
