import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constans/data-table-constan";
import { useState } from "react";
import useDebaounce from "./use-debounce";

export default function useDataTable() {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
  const [currentSearch, setCurrentSearch] = useState("");
  const debounce = useDebaounce();

  const headleChangePage = (page: number) => setCurrentPage(page);

  const headleChangeLimit = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(DEFAULT_PAGE);
  };

  const headleChangeSearch = (search: string) => {
    debounce(() => {
      setCurrentSearch(search);
      setCurrentPage(DEFAULT_PAGE);
    }, 500);
  };

  return {
    currentPage,
    headleChangePage,
    currentLimit,
    headleChangeLimit,
    currentSearch,
    headleChangeSearch,
  };
}
