import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  return <div>{redirect("/dashboard")}</div>;
};

export default page;
