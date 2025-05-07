"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function useCurrentUser() {
  const token = Cookies.get("userToken");

  const { data: currentUser, isLoading } = useQuery({
    queryFn: async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/current`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.data;
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            "Error fetching tasks, Please try again later"
        );
        return null;
      }
    },
    queryKey: ["current-user"],
  });

  return { currentUser, isLoading };
}
