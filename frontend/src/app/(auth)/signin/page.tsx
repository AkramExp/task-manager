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
import { SigninValidation } from "@/lib/validation";
import { useSignin } from "@/react-query/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignIn = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signinUser, isPending } = useSignin();

  function onSubmit(values: z.infer<typeof SigninValidation>) {
    signinUser(values);
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="sm:min-w-[25rem] bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="text-gray-400 mt-2">
            Log in to continue using Task Manager
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                      className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                      className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                {isPending ? (
                  <div className="flex items-center gap-2 font-semibold">
                    Logging in <Loader className="animate-spin h-10 w-10" />
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
