import { LogOut } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Notifications from "./Notifications";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-gray-800 text-white shadow-md">
      <div className="flex items-center justify-between py-4 px-6">
        <Link href="/" className="text-xl sm:text-2xl font-semibold">
          Task Manager
        </Link>
        <div className="flex items-center gap-2">
          <Notifications />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
