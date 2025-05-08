import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Notifications from "./Notifications";
import { User } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-gray-800 text-white shadow-md">
      <div className="flex items-center justify-between py-4 px-6">
        <Link
          href="/dashboard"
          className="text-xl sm:text-2xl font-semibold flex items-center gap-3"
        >
          <Image
            src={"/logo.png"}
            width={30}
            height={30}
            alt="logo"
            className="rounded-sm"
          />
          <p className="hidden sm:block">TaskFlow</p>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/user">
            <div className="border-white border-2 mr-2 rounded-full p-1">
              <User className="w-5 h-5" />
            </div>
          </Link>
          <Notifications />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
