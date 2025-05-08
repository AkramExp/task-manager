"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  SigninValidation,
  SignupValidation,
  UserValidation,
} from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";

export function useCurrentUser() {
  const token = Cookies.get("userToken");

  const { data: currentUser, isLoading } = useQuery({
    queryFn: async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/current`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.data;
      } catch (error: any) {
        toast.error(
          error.response.data.message ||
            "Error fetching tasks, Please try again later"
        );
        return null;
      }
    },
    queryKey: ["current-user"],
  });

  return { currentUser, isLoading };
}

export function useSignup() {
  const router = useRouter();

  const { mutate: signupUser, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof SignupValidation>) => {
      const { data } = await axios.post(
        `${BACKEND_URL}/user/register`,
        payload
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success("Registered successfully");

      localStorage.setItem("userToken", data.token);
      Cookies.set("userToken", data.token, {
        expires: 7,
        path: "/",
      });

      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "Something went wrong while registering, Please try again later"
      );
    },
  });

  return { signupUser, isPending };
}

export function useSignin() {
  const router = useRouter();

  const { mutate: signinUser, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof SigninValidation>) => {
      const { data } = await axios.post(`${BACKEND_URL}/user/login`, payload);

      return data;
    },
    onSuccess: (data) => {
      toast.success("Logged in successfully");

      localStorage.setItem("userToken", data.token);
      Cookies.set("userToken", data.token, {
        expires: 7,
        path: "/",
      });

      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "Something went wrong while login, Please try again later"
      );
    },
  });

  return { signinUser, isPending };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof UserValidation>) => {
      const { data } = await axios.put(
        `${BACKEND_URL}/user/update-profile`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "Something went wrong updating, Please try again later"
      );
    },
  });

  return { updateProfile, isPending };
}
