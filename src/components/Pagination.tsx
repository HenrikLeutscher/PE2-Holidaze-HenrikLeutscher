import React from "react";
import { Button } from "./ui/Button";
import type { PaginationProps } from "../types/Pagination";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const maxButtons = 5;
  let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="flex justify-center gap-2 py-5 flex-wrap">
      <Button
        text="Previous"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={currentPage === 1 ? "bg-disabled" : ""}
      />

      {startPage > 1 && (
        <>
          <Button text="1" onClick={() => onPageChange(1)} />
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          text={page.toString()}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "font-bold bg-disabled" : ""}
        />
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            text={totalPages.toString()}
            onClick={() => onPageChange(totalPages)}
          />
        </>
      )}

      <Button
        text="Next"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "bg-disabled" : ""}
      />
    </div>
  );
};
