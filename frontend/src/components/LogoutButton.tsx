"use client";

import axios from "axios";
import { LogOut } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BACKEND_URL } from "../../config";

const LogoutButton = () => {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/signin");
        localStorage.removeItem("userToken");
        Cookies.remove("userToken");
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "Error logging out, Please try again later"
      );
    }
  }

  return (
    <button
      className="bg-red-700 flex items-center py-[6px] px-2 rounded-md hover:bg-red-600 cursor-pointer font-semibold"
      onClick={handleLogout}
    >
      <LogOut className="w-6 h-6 mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;
