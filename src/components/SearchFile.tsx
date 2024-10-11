"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";
import clsx from "clsx";

type FileSearchInput = {
  query: string;
};

export default function FileSearch({
  formClassNames,
}: {
  formClassNames?: string;
}) {
  const formInfo = useForm<FileSearchInput>();

  return (
    <>
      <p>Search</p>
      <form
        onSubmit={formInfo.handleSubmit(() => console.log("Received data!"))}
        className={clsx("flex", formClassNames)}
      >
        <input
          {...formInfo.register("query")}
          type="text"
          placeholder="Search..."
          className="basis-1 grow h-10 px-3 rounded-l-md bg-green-300 text-green-950 focus:border-none
          placeholder:text-green-950"
        />
        {/* <input type="submit" value="Search" /> */}
        <button
          type="submit"
          className="bg-green-600 text-white w-12 h-10 rounded-r-md inline-flex items-center justify-center"
        >
          <MdSearch className="size-6" />
        </button>
      </form>
    </>
  );
}
