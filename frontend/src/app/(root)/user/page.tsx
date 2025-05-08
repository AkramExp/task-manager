import UserForm from "@/components/UserForm";
import axios from "axios";
import React from "react";
import { BACKEND_URL } from "../../../../config";
import { cookies, headers } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();

  const response = await axios.get(`${BACKEND_URL}/user/current`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${cookieStore.get("userToken")?.value}` },
  });

  return (
    <div className="flex items-center justify-center pt-[6rem] min-h-screen bg-gray-900 text-white">
      <UserForm user={response.data.data} />
    </div>
  );
};

export default page;
