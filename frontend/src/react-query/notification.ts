"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "../../config";

export function useNotifications() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/notification/user-all`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        return response.data.data;
      } catch (error) {
        toast.error("Error fetching tasks, Please try again later");
        return null;
      }
    },
  });
  return { notifications, isLoading };
}
