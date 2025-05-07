"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  totalPages: number;
};

const Pagination = ({ totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const router = useRouter();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const params = new URLSearchParams();

    params.set("page", String(pageValue));

    router.replace(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-3 mb-4 mt-10">
      <button
        className="w-fit border-[1px] border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 hover:text-gray-900 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        onClick={() => onClick("prev")}
        disabled={Number(page) === 1}
      >
        <ChevronLeft />
      </button>
      <span className="font-semibold">
        Page {page} out of {totalPages}
      </span>
      <button
        className="w-fit border-[1px] border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 hover:text-gray-900 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
