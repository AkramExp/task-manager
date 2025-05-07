"use client";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BACKEND_URL } from "../../config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const TaskDeleteConfirmation = ({ taskId }: { taskId: string }) => {
  const queryClient = useQueryClient();

  async function deleteTask() {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/task/delete/${taskId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "Something went wrong deleting task, Please try again later"
      );
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-red-700 text-white hover:bg-red-600 transition cursor-pointer h-full">
          <Trash2 size={16} />
          Delete
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-gray-800 text-white rounded-lg shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold">
            Are you sure you want to delete?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action will permanently delete this task.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel className="bg-gray-600 text-white hover:bg-gray-500 px-4 py-2 rounded-lg transition cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              deleteTask();
            }}
            className="bg-red-700 text-white hover:bg-red-600 px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TaskDeleteConfirmation;
