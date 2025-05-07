import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskType } from "@/types";

const TaskDetail = ({
  task,
  openDialog,
  setOpenDialog,
}: {
  task: TaskType;
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white mb-4 font-bold text-xl">
            {task.title}
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white p-2 rounded-sm">
          <p className="text-zinc-900 font-[500] text-lg italic">
            {task.description || "*No Description*"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetail;
