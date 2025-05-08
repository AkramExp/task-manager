"use client";

import { useTasks } from "@/react-query/task";
import { Loader, SearchX } from "lucide-react";
import Pagination from "./Pagination";
import TaskCard from "./TaskCard";

const TasksList = () => {
  const { allTasks, isLoading } = useTasks();

  if (isLoading)
    return (
      <div className="flex flex-col gap-3 items-center justify-center h-[10rem] text-xl font-semibold">
        <Loader className="animate-spin h-10 w-10" />
        Loading Tasks
      </div>
    );

  return (
    <>
      <div className="w-full px-6 py-6">
        {allTasks?.data.length === 0 ? (
          <div className="w-full flex items-center justify-center gap-4 text-2xl sm:text-3xl font-bold text-gray-400">
            <SearchX className="w-8 h-8 sm:w-10 sm:h-10" />
            No Tasks Found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTasks?.data.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination totalPages={allTasks?.totalPages} />
      </div>
    </>
  );
};

export default TasksList;
