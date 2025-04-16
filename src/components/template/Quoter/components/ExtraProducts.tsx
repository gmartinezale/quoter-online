"use client";
import { ChangeEvent } from "react";
import { Type } from "@/entities/Type";
import { ProductsQuoter } from "@/entities/Quoter";
import { Card, Select, TextInput } from "flowbite-react";
import { PlusIcon } from "@heroicons/react/24/outline";

interface ExtraProductsProps {
  index: number;
  extraProducts: Record<number, Type[]>;
  productQuoters: ProductsQuoter[];
  setProductQuoters: (products: ProductsQuoter[]) => void;
  getProduct: (productId: string, index: number) => string;
  getDescription: (description: string, index: number) => string;
}

export function ExtraProducts({
  index,
  extraProducts,
  productQuoters,
  setProductQuoters,
  getProduct,
  getDescription,
}: ExtraProductsProps) {
  const handleAddExtra = () => {
    const updatedProducts = [...productQuoters];
    updatedProducts[index].extras?.push({
      description: "",
      price: 0,
      amount: 0,
    });
    setProductQuoters(updatedProducts);
  };

  const handleExtraChange = (
    e: ChangeEvent<HTMLSelectElement>,
    extraIndex: number,
  ) => {
    const [description, price] = e.target.value.split("-");
    const updatedProducts = [...productQuoters];
    updatedProducts[index].extras[extraIndex].price = parseInt(price);
    updatedProducts[index].extras[extraIndex].description = description;
    setProductQuoters(updatedProducts);
  };

  const handleExtraAmountChange = (
    e: ChangeEvent<HTMLInputElement>,
    extraIndex: number,
  ) => {
    const amount = parseInt(e.target.value);
    const updatedProducts = [...productQuoters];
    updatedProducts[index].extras[extraIndex].amount = amount;
    setProductQuoters(updatedProducts);
  };

  return (
    <Card className="col-span-4 mt-4 bg-gray-800 border-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-semibold text-white flex items-center gap-2">
          Extras{" "}
          {`${getProduct(
            productQuoters[index].type as string,
            index,
          )} ${getDescription(productQuoters[index].description, index)}`}
          <button
            type="button"
            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            onClick={handleAddExtra}
          >
            <PlusIcon className="h-4 w-4 text-white" />
          </button>
        </h5>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4">
        {productQuoters[index].extras?.map((extra, extraIndex) => (
          <div key={extraIndex} className="col-span-4 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-400">
              Extra
            </label>
            <div className="mt-1">
              <Select
                className="w-full bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
                onChange={(e) => handleExtraChange(e, extraIndex)}
              >
                <option value="" disabled selected className="text-gray-400">
                  Seleccione un extra
                </option>
                {extraProducts[index]?.map((product) => (
                  <option
                    key={"extra-" + product.description}
                    value={`${product.description}-${product.price}`}
                    className="text-white"
                  >
                    {product.description}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ))}
        {productQuoters[index].extras?.map((extra, extraIndex) => (
          <div key={extraIndex} className="col-span-4 sm:pl-3 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-400">
              Cantidad
            </label>
            <div className="mt-1">
              <TextInput
                defaultValue={0}
                type="number"
                required
                placeholder="Ingrese cantidad"
                className="w-full bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
                onChange={(e) => handleExtraAmountChange(e, extraIndex)}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
