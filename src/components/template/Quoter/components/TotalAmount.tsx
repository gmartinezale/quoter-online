"use client";

import formatCurrency from "@/utils/formatCurrency";

interface TotalAmountProps {
  totalCalculate: number;
  isMobile?: boolean;
}

export function TotalAmount({
  totalCalculate,
  isMobile = false,
}: TotalAmountProps) {
  return (
    <div className={isMobile ? "float-left sm:hidden" : "w-1/2 float-right"}>
      <h3
        className={`${
          isMobile ? "text-md" : "text-lg"
        } font-medium dark:text-gray-400`}
      >
        Total:
        {isMobile ? (
          <p className="ml-1 mt-1 dark:text-white">
            {formatCurrency(totalCalculate)}
          </p>
        ) : (
          <span className="ml-1 mt-1 dark:text-white">
            {formatCurrency(totalCalculate)}
          </span>
        )}
      </h3>
    </div>
  );
}
