"use client";
import { AuthContext } from "@/context/AuthContext";
import server from "@/lib/api";
import { useEffect, useState } from "react";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await server.get("/api/auth/loginuser", {
          withCredentials: true,
        });
        setUser(res.data.currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  const authinfo = { user, loading };

  return (
    <AuthContext.Provider value={authinfo}>{children}</AuthContext.Provider>
  );
}
