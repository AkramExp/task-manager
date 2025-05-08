import CreateNewTask from "@/components/CreateNewTask";
import Filters from "@/components/Filters";
import SearchInput from "@/components/SearchInput";
import TasksList from "@/components/TasksList";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <div className="flex flex-col items-center pt-[6rem] min-h-screen bg-gray-900 text-white py-6">
        <div className="flex flex-col gap-6 max-w-[700px] w-full px-4">
          <SearchInput />

          <div className="flex flex-col items-center gap-6 justify-between px-8">
            <Filters />
            <CreateNewTask />
          </div>
        </div>

        <div className="w-full mt-6 md:px-4">
          <TasksList />
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
