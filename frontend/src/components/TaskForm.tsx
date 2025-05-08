"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TaskValidation } from "@/lib/validation";
import { useCreateOrUpdateTask } from "@/react-query/task";
import { TaskType, UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronsUpDown, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BACKEND_URL } from "../../config";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

const statusOptions = ["Todo", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High"];

const TaskForm = ({
  type = "create",
  task,
  setToggleForm,
  currentUser,
}: {
  type?: string;
  task?: TaskType;
  setToggleForm: (value: boolean) => void;
  currentUser: UserType;
}) => {
  const [assignedToUsers, setAssignedToUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/list-all`);

        if (response.data.success) {
          const filter = response.data.data.filter(
            (item: UserType) => item?._id !== currentUser?._id
          );

          setAssignedToUsers(filter);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong fetching users list, Please try again later"
        );
      }
    }

    getUsers();
  }, []);

  const form = useForm<z.infer<typeof TaskValidation>>({
    resolver: zodResolver(TaskValidation),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
      status: task?.status || undefined,
      priority: task?.priority || undefined,
      assignedTo: task?.assignedTo?._id || "",
    },
  });

  const { createOrUpdateTask, isPending } = useCreateOrUpdateTask(
    task?._id || "",
    setToggleForm,
    type
  );

  function onSubmit(values: z.infer<typeof TaskValidation>) {
    const payload = {
      ...values,
      assignedTo: values.assignedTo === "" ? undefined : values.assignedTo,
    };

    createOrUpdateTask({ payload, type });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 "
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Task Title"
                  {...field}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task Description"
                  {...field}
                  cols={20}
                  className="bg-gray-700 border-gray-600 text-white overflow-auto max-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {statusOptions.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="hover:bg-gray-700"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {priorityOptions.map((priority) => (
                      <SelectItem
                        key={priority}
                        value={priority}
                        className="hover:bg-gray-700"
                      >
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => {
              const [open, setOpen] = useState(false);

              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-300">Assigned To</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between bg-gray-700 border-gray-600 text-white",
                          !field.value && "text-gray-400"
                        )}
                      >
                        {field.value && field.value !== "None"
                          ? assignedToUsers.find(
                              (user: any) => user._id === field.value
                              // @ts-ignore
                            )?.name
                          : "Unassigned"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700 text-white">
                      <Command
                        className="bg-gray-800"
                        filter={(value, search) => {
                          // Custom filter function to search by name and email
                          const user: any = assignedToUsers.find(
                            (u: any) => u._id === value
                          );
                          if (!user) return 0; // for "None" option

                          const nameMatch = user.name
                            .toLowerCase()
                            .includes(search.toLowerCase());
                          const emailMatch = user.email
                            .toLowerCase()
                            .includes(search.toLowerCase());
                          return nameMatch || emailMatch ? 1 : 0;
                        }}
                      >
                        <CommandInput
                          placeholder="Search user..."
                          className="text-white"
                        />
                        <CommandEmpty className="text-white text-center p-2">
                          No user found
                        </CommandEmpty>
                        <CommandGroup className="text-white">
                          <CommandItem
                            value="None"
                            onSelect={() => {
                              form.setValue("assignedTo", "");
                              setOpen(false);
                            }}
                            className="hover:bg-gray-700 cursor-pointer"
                          >
                            None
                          </CommandItem>
                          {assignedToUsers.map((user: any) => (
                            <CommandItem
                              key={user.email}
                              value={user._id} // This is what gets stored
                              onSelect={(val) => {
                                form.setValue("assignedTo", val);
                                setOpen(false);
                              }}
                              className="hover:bg-gray-700 cursor-pointer text-white"
                            >
                              <span
                                className={cn(
                                  "flex flex-col w-full rounded-sm p-1",
                                  field.value === user._id && "bg-gray-600"
                                )}
                              >
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-gray-400">{user.email}</p>
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <Button
          type="submit"
          className="mt-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          {isPending ? (
            <div className="flex items-center gap-2 font-semibold">
              {type === "edit" ? "Updating" : "Creating"}
              <Loader className="animate-spin h-10 w-10" />
            </div>
          ) : (
            <>{type === "edit" ? "Update" : "Create Task"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
