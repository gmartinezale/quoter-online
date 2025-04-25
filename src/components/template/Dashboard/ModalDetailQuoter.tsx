"use client";

import { Quoter } from "@/entities/Quoter";
import formatCurrency from "@/utils/formatCurrency";

interface ModalDetailQuoterProps {
  quoter: Quoter;
}

export default function ModalDetailQuoter({ quoter }: ModalDetailQuoterProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Artista</p>
          <p className="text-white font-semibold">{quoter.artist}</p>
        </div>
        <div>
          <p className="text-gray-400">Total</p>
          <p className="text-white font-semibold text-xl">
            {formatCurrency(quoter.totalAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Productos</h4>
        {quoter.products.map((product, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gray-700 border border-gray-600"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Producto</p>
                <p className="text-white font-semibold">
                  {typeof product.category === "object"
                    ? product.category.name
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Cantidad</p>
                <p className="text-white font-semibold">{product.amount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-400">Acabado</p>
                <p className="text-white font-semibold">
                  {typeof product.type === "object" ? product.type.name : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Precio unitario</p>
                <p className="text-white font-semibold">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-400">Tipo</p>
                <p className="text-white font-semibold">
                  {typeof product.description === "object"
                    ? product.description.description
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Subtotal</p>
                <p className="text-white font-semibold">
                  {formatCurrency(product.price * product.amount)}
                </p>
              </div>
            </div>

            {product.extras && product.extras.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <h5 className="text-sm font-semibold text-gray-400 mb-2">
                  Extras
                </h5>
                {product.extras.map((extra, extraIndex) => (
                  <div
                    key={extraIndex}
                    className="flex justify-between items-center mb-2"
                  >
                    <p className="text-white">{extra.description}</p>
                    <p className="text-white">
                      {formatCurrency(extra.price * extra.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
