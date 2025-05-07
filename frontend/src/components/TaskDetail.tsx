import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TaskDetail = ({
  task,
  openDialog,
  setOpenDialog,
}: {
  task: any;
  openDialog: any;
  setOpenDialog: any;
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white mb-4 font-bold">
            {task.title}
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white p-2 rounded-sm">
          <p className="text-zinc-900 font-semibold text-lg italic">
            {task.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetail;
