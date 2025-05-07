"use client";

import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function useTasks() {
  const searchParams = useSearchParams();

  const token = Cookies.get("userToken");

  const { data: allTasks, isLoading } = useQuery({
    queryFn: async () => {
      const query = searchParams.get("query") || "";
      const page = searchParams.get("page") || "1";
      const taskType = searchParams.get("taskType") || "all";
      const status = searchParams.get("status") || "all";
      const priority = searchParams.get("priority") || "all";
      const overdue = searchParams.get("overdue") || "all";
      const sort = searchParams.get("sort") || "all";

      try {
        const response = await axios.get(`${BACKEND_URL}/task/created`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
          params: { taskType, status, priority, overdue, sort, query, page },
        });

        const tasks = response.data;

        return tasks;
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            "Error fetching tasks, Please try again later"
        );
        return null;
      }
    },
    queryKey: ["all-tasks", searchParams.toString()],
  });

  return { allTasks, isLoading };
}
