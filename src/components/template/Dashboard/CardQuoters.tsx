import { Quoter } from "@/entities/Quoter";
import formatCurrency from "@/utils/formatCurrency";
import { Button } from "@heroui/react";
import { EyeIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ICardQuotersProps {
  quoter: Quoter;
}

export default function CardQuoters({ quoter }: ICardQuotersProps) {
  const formattedDate = new Date(quoter.dateLimit).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex p-6 rounded-lg bg-gray-800 border border-gray-700 w-full transition-all hover:bg-gray-700">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-white font-semibold text-lg">{quoter.artist}</p>
            <div className="flex items-center text-gray-400 text-sm">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>Fecha límite: {formattedDate}</span>
            </div>
          </div>
          <p className="text-white font-semibold text-xl">
            {formatCurrency(quoter.totalAmount)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                quoter.status === "PENDIENTE"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {quoter.status === "PENDIENTE" ? "Pendiente" : "En proceso"}
            </span>
            {quoter.products && (
              <span className="text-gray-400 text-sm">
                {quoter.products.length} producto
                {quoter.products.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Link href={`/admin/quoter/${quoter._id}`}>
            <Button
              variant="bordered"
              className="inline-flex items-center space-x-2 text-white hover:text-gray-200"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Ver detalles</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
