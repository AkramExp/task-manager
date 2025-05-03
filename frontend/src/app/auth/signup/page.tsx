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
import { log } from "node:console";
import { useRouter } from "next/navigation";

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

      toast.success("Registered successfully");
      localStorage.setItem("userToken", response.data.token);
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while registering, Please try again later"
      );
    }
  }

  return (
    <div className="flex flex-col items-center bg-white rounded-md p-6 shadow-md gap-3 max-w-md w-full mx-4">
      <h2 className="h2-bold text-center text-blue-500">Create your account</h2>
      <p className="text-center mb-4 text-blue-400">
        Sign up to use task manager
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="shadcn-form-row">
                  <FormLabel className="shadcn-form-label text-blue-500 text-lg font-[600]">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      type="text"
                      className="form-input rounded-lg border-[1px] border-blue-300 bg-blue-100/30 max-w-4xl placeholder:text-zinc-700 text-zinc-900"
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shadcn-form-row">
                  <FormLabel className="shadcn-form-label text-blue-500 text-lg font-[600]">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                      className="form-input rounded-lg border-[1px] border-blue-300 bg-blue-100/30 max-w-4xl placeholder:text-zinc-700 text-zinc-900"
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="shadcn-form-row">
                  <FormLabel className="shadcn-form-label text-blue-500 text-lg font-[600]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      className="form-input rounded-lg border-[1px] border-blue-300 bg-blue-100/30 max-w-4xl placeholder:text-zinc-700 text-zinc-900"
                      type="password"
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />
          <p className="text-center text-sm font-medium">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600">
              Sign in
            </Link>
          </p>
          <Button
            type="submit"
            className="cursor-pointer mt-3 text-lg font-[500] bg-[#027efe] hover:bg-blue-500/90"
          >
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
