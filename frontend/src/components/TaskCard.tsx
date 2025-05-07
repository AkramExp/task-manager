"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import { useCurrentUser } from "@/react-query/user";
import { CircleCheckBig, Pencil } from "lucide-react";
import { useState } from "react";
import TaskDeleteConfirmation from "./TaskDeleteConfirmation";
import TaskDetail from "./TaskDetail";
import TaskForm from "./TaskForm";
import { Button } from "./ui/button";
import UpdateStatusForm from "./UpdateStatusForm";

type TaskCardProps = {
  task: any;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const { currentUser } = useCurrentUser();

  const assignedTo =
    task.assignedTo._id === currentUser?._id &&
    task.assignedTo._id !== task.createdBy._id;

  return (
    <>
      <div
        className="bg-gray-800 shadow-lg rounded-xl p-5 w-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:bg-gray-700 cursor-pointer flex flex-col justify-between"
        onClick={() => {
          setOpenDetails(true);
        }}
      >
        <div>
          <h3 className="text-center text-xl font-semibold text-white mb-3">
            {task.title}
          </h3>
          <div className="flex flex-col gap-2 text-sm text-gray-300 mb-3">
            <div>
              <span className="font-medium text-gray-400">Due Date: </span>
              {new Date(task?.dueDate) < new Date() ? (
                <span
                  className={`${
                    new Date(task?.dueDate) < new Date() &&
                    "bg-red-900 text-white font-semibold px-2 py-[2px] rounded-full"
                  }`}
                >
                  {task.dueDate
                    ? formatDateTime(task.dueDate).dateOnly + " Overdue!"
                    : "N/A"}
                </span>
              ) : (
                <span className="font-bold text-[15px]">
                  {task.dueDate ? formatDateTime(task.dueDate).dateOnly : "N/A"}
                </span>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-400">Priority: </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1
      ${
        task.priority === "High"
          ? "bg-red-700 text-red-100"
          : task.priority === "Medium"
          ? "bg-yellow-600 text-yellow-100"
          : "bg-green-600 text-green-100"
      }`}
              >
                {task.priority}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-400">Status: </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1
      ${
        task.status === "Completed"
          ? "bg-green-700 text-green-100"
          : task.status === "In Progress"
          ? "bg-blue-600 text-blue-100"
          : "bg-gray-600 text-gray-200"
      }`}
              >
                {task.status}
              </span>
            </div>
            <div>
              {assignedTo ? (
                <span className="font-medium text-gray-400">Assigned By: </span>
              ) : (
                <span className="font-medium text-gray-400">Assigned To: </span>
              )}
              {assignedTo ? (
                <span className="text-white">
                  {task.createdBy?.name || "Unassigned"}
                </span>
              ) : (
                <span className="text-white">
                  {task.assignedTo?.name || "Unassigned"}
                </span>
              )}
              {assignedTo ? (
                <span className="block text-xs text-gray-300">
                  {task.createdBy?.email || "No user assigned"}
                </span>
              ) : (
                <span className="block text-xs text-gray-300">
                  {task.assignedTo?.email || "No user assigned"}
                </span>
              )}
            </div>
          </div>
        </div>
        {assignedTo ? (
          <div className="flex justify-end gap-2 mt-2">
            <Button
              className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-green-700 text-white hover:bg-green-600 transition cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenUpdateStatus(true);
              }}
            >
              <CircleCheckBig size={16} />
              Update Status
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2 mt-2">
            <Button
              className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-green-700 text-white hover:bg-green-600 transition cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenEdit(true);
              }}
            >
              <Pencil size={16} />
              Edit
            </Button>
            <div onClick={(e) => e.stopPropagation()}>
              <TaskDeleteConfirmation taskId={task._id} />
            </div>
          </div>
        )}
      </div>
      <TaskDetail
        setOpenDialog={setOpenDetails}
        openDialog={openDetails}
        task={task}
      />
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white mb-4">Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm type="edit" task={task} setToggleForm={setOpenEdit} />
        </DialogContent>
      </Dialog>
      <Dialog open={openUpdateStatus} onOpenChange={setOpenUpdateStatus}>
        <DialogContent className="sm:max-w-[300px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white mb-4">Update Status</DialogTitle>
          </DialogHeader>
          <UpdateStatusForm task={task} setToggleForm={setOpenUpdateStatus} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
