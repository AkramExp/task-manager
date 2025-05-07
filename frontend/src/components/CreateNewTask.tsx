"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import { Button } from "./ui/button";

const CreateNewTask = () => {
  const [toggleForm, setToggleForm] = useState(false);

  return (
    <Dialog onOpenChange={setToggleForm} open={toggleForm}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          onClick={() => setToggleForm(true)}
        >
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white mb-4">Create New Task</DialogTitle>
        </DialogHeader>
        <TaskForm setToggleForm={setToggleForm} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewTask;
