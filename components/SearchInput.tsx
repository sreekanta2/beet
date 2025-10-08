"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type SearchInputProps = {
  placeholder?: string;
  searchParamKey: string;
  debounceDelay?: number;
  className?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  searchParamKey,
  debounceDelay = 300,
  className = "",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchQuery = isMounted
    ? searchParams.get(searchParamKey) || ""
    : "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setIsMounted(true); // component is mounted
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [searchQuery, debounceDelay]);

  useEffect(() => {
    if (!isMounted) return; // wait for client
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery) {
      newSearchParams.set(searchParamKey, debouncedSearchQuery);
    } else {
      newSearchParams.delete(searchParamKey);
    }

    router.push(`?${newSearchParams.toString()}`);
  }, [debouncedSearchQuery, searchParamKey, searchParams, router, isMounted]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (!isMounted) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(searchParamKey);
    router.push(`?${newSearchParams.toString()}`);
  };

  // Render nothing until mounted to prevent SSR errors
  if (!isMounted) return null;

  return (
    <div
      className={`relative flex items-center w-full border bg-background rounded-md px-2 max-w-sm min-w-[200px] h-10   ${className} focus-within:border-primary`}
    >
      <span>
        <Search className="text-primary" size={16} />
      </span>
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full border-0  h-10 focus:outline-none"
      />
      {searchQuery && (
        <span
          className="absolute right-3 text-gray-500 cursor-pointer"
          onClick={clearSearch}
        >
          <X size={16} className="text-primary" />
        </span>
      )}
    </div>
  );
};

export default SearchInput;
