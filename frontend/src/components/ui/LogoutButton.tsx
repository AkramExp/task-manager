"use client";

import axios from "axios";
import { LogOut } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../config";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
      className="bg-red-600 flex items-center py-1 px-2 rounded-md hover:bg-red-500 cursor-pointer"
      onClick={handleLogout}
    >
      <LogOut className="w-6 h-6 mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;
