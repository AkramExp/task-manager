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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BACKEND_URL } from "../../config";
import { TaskType } from "@/types";

const statusOptions = ["Todo", "In Progress", "Completed"];

const UpdateStatusForm = ({
  task,
  setToggleForm,
}: {
  task: TaskType;
  setToggleForm: (value: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof StatusValidation>>({
    resolver: zodResolver(StatusValidation),
    defaultValues: {
      status: task?.status || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof StatusValidation>) {
    try {
      console.log(values);

      const payload = {
        ...task,
        status: values.status,
      };

      const token = localStorage.getItem("userToken");

      const response = await axios.put(
        `${BACKEND_URL}/task/update-status/${task?._id}`,
        payload,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
        setToggleForm(false);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong updating status, Please try again later"
      );
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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

        <Button
          type="submit"
          className="mt-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default UpdateStatusForm;
