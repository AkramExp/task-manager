import { LogOut } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./ui/LogoutButton";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-gray-800 text-white shadow-md">
      <div className="container flex items-center justify-between py-4 px-6">
        <Link href="/" className="text-2xl font-semibold">
          Task Manager
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navbar;
