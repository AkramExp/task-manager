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
import { useCurrentUser } from "@/react-query/user";
import { Loader } from "lucide-react";

const CreateNewTask = () => {
  const [toggleForm, setToggleForm] = useState(false);
  const { currentUser, isLoading } = useCurrentUser();

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
        {isLoading ? (
          <div className="flex flex-col gap-3 items-center justify-center h-[5rem] text-xl font-semibold">
            <Loader className="animate-spin h-10 w-10" />
          </div>
        ) : (
          <TaskForm setToggleForm={setToggleForm} currentUser={currentUser} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewTask;
