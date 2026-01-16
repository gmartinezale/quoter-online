"use client";
import { ChangeEvent } from "react";
import { ProductsQuoter } from "@/entities/Quoter";
import { Card, CardHeader, CardBody, Select, SelectItem, Input } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Product, ProductExtra } from "@/entities/Product";

interface ExtraProductsProps {
  index: number;
  extraProducts: Record<number, ProductExtra[]>;
  productQuoters: ProductsQuoter[];
  setProductQuoters: (products: ProductsQuoter[]) => void;
  getProduct: (productId: string, index: number) => string;
}

export function ExtraProducts({
  index,
  extraProducts,
  productQuoters,
  setProductQuoters,
  getProduct,
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
    <Card className="col-span-4 mt-4">
      <CardHeader className="flex items-center justify-between">
        <h5 className="text-lg font-semibold flex items-center gap-2">
          Extras
          <button
            type="button"
            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            onClick={handleAddExtra}
          >
            <PlusIcon className="h-4 w-4 text-white" />
          </button>
        </h5>
      </CardHeader>
      <CardBody>
        <div className="mt-3 grid grid-cols-2 gap-4">
        {productQuoters[index].extras?.map((extra, extraIndex) => (
          <div key={extraIndex} className="col-span-4 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-400">
              Extra
            </label>
            <div className="mt-1">
              <Select
                variant="bordered"
                placeholder="Seleccione un extra"
                onChange={(e) => {
                  const mockEvent = {
                    target: { value: e.target.value }
                  } as ChangeEvent<HTMLSelectElement>;
                  handleExtraChange(mockEvent, extraIndex);
                }}
              >
                {extraProducts[index]?.map((product) => (
                  <SelectItem
                    key={`${product.description}-${product.price}`}
                  >
                    {product.description}
                  </SelectItem>
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
              <Input
                type="number"
                variant="bordered"
                placeholder="Ingrese cantidad"
                defaultValue="0"
                isRequired
                onChange={(e) => handleExtraAmountChange(e, extraIndex)}
              />
            </div>
          </div>
        ))}
      </div>      </CardBody>    </Card>
  );
}
