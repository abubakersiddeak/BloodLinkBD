"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import server from "@/lib/api";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";

export function SiteHeader() {
  const { user } = useAuth();
  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Clear user data

        const res = await server.post("/api/auth/logout");
        // Cookie removed now
        if (!res.ok) {
          Swal.fire({
            icon: "Faield",
            title: "Something went wrong",
            text: "Please Retry.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
        Swal.fire({
          icon: "success",
          title: "Logged Out Successfully",
          text: "You have been logged out.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/";
        });
      }
    });
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex justify-between w-full">
          <h1 className="text-base font-medium">Welcome {user?.name}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 cursor-pointer hover:text-red-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
