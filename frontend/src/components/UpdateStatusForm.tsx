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
import { useUpdateTaskStatus } from "@/react-query/task";
import { TaskType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const statusOptions = ["Todo", "In Progress", "Completed"];

const UpdateStatusForm = ({
  task,
  setToggleForm,
}: {
  task: TaskType;
  setToggleForm: (value: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof StatusValidation>>({
    resolver: zodResolver(StatusValidation),
    defaultValues: {
      status: task?.status || undefined,
    },
  });

  const { updateStatus, isPending } = useUpdateTaskStatus(
    task?._id,
    setToggleForm
  );

  function onSubmit(values: z.infer<typeof StatusValidation>) {
    const payload = {
      ...task,
      status: values.status,
    };

    updateStatus(payload);
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
          {isPending ? (
            <div className="flex items-center gap-2 font-semibold">
              Updating <Loader className="animate-spin h-10 w-10" />
            </div>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateStatusForm;
