"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }

      router.push(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full px-4 sm:px-8">
      <Input
        className="form-input rounded-lg border-[1px] border-gray-600 bg-gray-700/60 pl-4 pr-4 sm:px-6 max-w-4xl placeholder:text-gray-400 text-white text-sm sm:text-lg w-full"
        placeholder="Search with Title or Description"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
