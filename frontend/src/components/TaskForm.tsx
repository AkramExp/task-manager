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
import { TaskValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { log } from "node:console";

const statusOptions = ["Todo", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High"];

const TaskForm = () => {
  const router = useRouter();
  const [assignedToUsers, setAssignedToUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/list-all`);

        if (response.data.success) {
          setAssignedToUsers(response.data.data);
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
      title: "",
      description: "",
      dueDate: undefined,
      status: "",
      priority: "",
      assignedTo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof TaskValidation>) {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(`${BACKEND_URL}/task/create`, values, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong creating task, Please try again later"
      );
    }
  }

  return (
    <div className="h-[80vh] flex items-center justify-center w-full">
      <div className="relative flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/90 border border-gray-300 rounded-md p-6 shadow-md gap-3 max-w-md w-full">
        <div className="absolute left-0 -top-[3rem]">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <ChevronLeft />
            Back
          </Button>
        </div>
        <h2 className="text-3xl font-semibold text-center mb-6">Add Task</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task Title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task Description"
                      {...field}
                      cols={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned To */}
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => {
                  const [open, setOpen] = useState(false);

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Assigned To</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
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
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search user..." />
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value=""
                                onSelect={(val) => {
                                  form.setValue("assignedTo", "");
                                  setOpen(false);
                                }}
                              >
                                None
                              </CommandItem>
                              {assignedToUsers.map((user: any) => (
                                <CommandItem
                                  key={user.email}
                                  value={user._id}
                                  onSelect={(val) => {
                                    form.setValue("assignedTo", val);
                                    setOpen(false);
                                  }}
                                >
                                  <span
                                    className={cn(
                                      "flex flex-col w-full rounded-sm p-1",
                                      field.value === user._id && "bg-red-100"
                                    )}
                                  >
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
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

            <Button type="submit" className="mt-3">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TaskForm;
