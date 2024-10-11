"use client";
import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { env } from "process";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

function toggleDarkMode() {
  const htmlElement = document.getElementById("htmlElement");
  htmlElement?.classList.toggle("dark");
}

export default function Profile({ children }: { children: ReactElement }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger>
        <button onClick={() => setIsOpen(true)}>{children}</button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 bg-white shadow-md
        border-gray-300 border-[1px] rounded-xl dark:bg-gray-800 dark:text-gray-100"
      >
        <form className="flex justify-between p-2">
          <label htmlFor="dark-mode-toggle">Dark Mode</label>
          <input
            id="dark-mode-toggle"
            type="checkbox"
            onChange={toggleDarkMode}
          />
        </form>
        <Link
          href={"/settings"}
          className="visited:text-black text-black px-2 py-2 hover:bg-gray-100 block dark:visited:text-white dark:hover:bg-gray-600"
        >
          Settings
        </Link>
        <hr className="border-[1px] border-l-gray-300" />
        <Link
          href={`/api/auth/logout`}
          className="visited:text-red-600 text-red-600 px-2 py-2 hover:bg-gray-100 block dark:hover:bg-gray-600"
        >
          Log out
        </Link>
      </PopoverContent>
    </Popover>
  );
}
