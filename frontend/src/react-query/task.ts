"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { StatusValidation, TaskValidation } from "@/lib/validation";
import { z } from "zod";

const token = Cookies.get("userToken");

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

export function useUpdateTaskStatus(
  taskId: string,
  setToggleForm: (value: boolean) => void
) {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof StatusValidation>) => {
      const { data } = await axios.put(
        `${BACKEND_URL}/task/update-status/${taskId}`,
        payload,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      setToggleForm(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong updating status, Please try again later"
      );
    },
  });

  return { updateStatus, isPending };
}

export function useCreateOrUpdateTask(
  taskId: string,
  setToggleForm: (value: boolean) => void,
  type: string
) {
  const queryClient = useQueryClient();

  const { mutate: createOrUpdateTask, isPending } = useMutation({
    mutationFn: async ({
      payload,
      type,
    }: {
      payload: z.infer<typeof TaskValidation>;
      type: string;
    }) => {
      if (type === "edit") {
        const { data } = await axios.put(
          `${BACKEND_URL}/task/update/${taskId}`,
          payload,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        return data;
      } else {
        const { data } = await axios.post(
          `${BACKEND_URL}/task/create`,
          payload,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        return data;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      setToggleForm(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          `Something went wrong ${
            type === "edit" ? "editing" : "creating"
          } task, Please try again later`
      );
    },
  });

  return { createOrUpdateTask, isPending };
}
