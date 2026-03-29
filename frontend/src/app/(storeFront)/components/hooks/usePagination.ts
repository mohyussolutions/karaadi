import { useMemo } from "react";

interface PaginationResult<T> {
  paginatedItems: T[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  isEmpty: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

const usePagination = <T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number,
): PaginationResult<T> => {
  const paginationData = useMemo<PaginationResult<T>>(() => {
    if (!Array.isArray(items)) {
      return {
        paginatedItems: [],
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalItems: 0,
        startIndex: 0,
        endIndex: 0,
        isEmpty: true,
        isFirstPage: true,
        isLastPage: true,
      };
    }

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const safePage = Math.max(1, Math.min(currentPage, totalPages));

    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      paginatedItems,
      totalPages,
      currentPage: safePage,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
      totalItems,
      startIndex,
      endIndex,
      isEmpty: totalItems === 0,
      isFirstPage: safePage === 1,
      isLastPage: safePage === totalPages,
    };
  }, [items, currentPage, itemsPerPage]);

  return paginationData;
};

export default usePagination;
