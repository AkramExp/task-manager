"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Filters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    overdue: searchParams.get("overdue") || "all",
    taskType: searchParams.get("taskType") || "all",
    priority: searchParams.get("priority") || "all",
    status: searchParams.get("status") || "all",
    sort: searchParams.get("sort") || "none",
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.taskType !== "all") params.set("taskType", filters.taskType);
    if (filters.priority !== "all") params.set("priority", filters.priority);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.overdue !== "all") params.set("overdue", filters.overdue);
    if (filters.sort !== "none") params.set("sort", filters.sort);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  function onFilterChange(key: string, value: string | boolean) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap md:flex-nowrap">
      <Select
        value={filters.taskType}
        onValueChange={(value) => {
          onFilterChange("taskType", value);
        }}
      >
        <SelectTrigger className="bg-gray-800 border-gray-700">
          <SelectValue placeholder="Task Type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="assigned">Assigned to Me</SelectItem>
          <SelectItem value="created">Created by Me</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => {
          onFilterChange("status", value);
        }}
      >
        <SelectTrigger className="bg-gray-800 border-gray-700">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Todo">Todo</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) => {
          onFilterChange("priority", value);
        }}
      >
        <SelectTrigger className="bg-gray-800 border-gray-700">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.overdue}
        onValueChange={(value) => {
          onFilterChange("overdue", value);
        }}
      >
        <SelectTrigger className="bg-gray-800 border-gray-700">
          <SelectValue placeholder="Overdue" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="not-overdue">Not Overdue</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sort}
        onValueChange={(value) => {
          onFilterChange("sort", value);
        }}
      >
        <SelectTrigger className="bg-gray-800 border-gray-700">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="none">Default</SelectItem>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="createdDate">Created Date</SelectItem>
          <SelectItem value="status">Status</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
