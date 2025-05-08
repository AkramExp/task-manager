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
import { SignupValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignUp = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/register`, values);
      if (response.data.success) {
        toast.success("Registered successfully");

        localStorage.setItem("userToken", response.data.token);
        Cookies.set("userToken", response.data.token, {
          expires: 7,
          path: "/",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while registering, Please try again later"
      );
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="sm:min-w-[25rem] bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="text-gray-400 mt-2">Sign up to use Task Manager</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      type="text"
                      className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

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
                Register
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
