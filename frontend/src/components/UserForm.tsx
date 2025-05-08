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
import { UserValidation } from "@/lib/validation";
import { useUpdateProfile } from "@/react-query/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UserForm = ({ user }: { user: any }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const { updateProfile, isPending } = useUpdateProfile();

  function onSubmit(values: z.infer<typeof UserValidation>) {
    updateProfile(values);
  }

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            User Profile
          </h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 block text-sm font-medium mb-1">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 block text-sm font-medium mb-1">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    type="email"
                    required
                    className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
          >
            {isPending ? (
              <div className="flex items-center gap-2 font-semibold">
                Updating <Loader className="animate-spin h-10 w-10" />
              </div>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
