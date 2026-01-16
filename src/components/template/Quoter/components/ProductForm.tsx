"use client";
import { ChangeEvent, use, useState } from "react";
import { Category } from "@/entities/Category";
import { Product } from "@/entities/Product";
import { ProductsQuoter } from "@/entities/Quoter";
import { ProductRepository } from "@/data/products.repository";
import { Select, SelectItem, Input } from "@heroui/react";
import { DocumentPlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface ProductFormProps {
  index: number;
  categories: Category[];
  filterProducts: Record<number, Product[]>;
  productQuoters: ProductsQuoter[];
  setProductQuoters: (products: ProductsQuoter[]) => void;
  setFilterProducts: (products: Record<number, Product[]>) => void;
}

export function ProductForm({
  index,
  categories,
  filterProducts,
  productQuoters,
  setProductQuoters,
  setFilterProducts,
}: ProductFormProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const changeCategorySelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    try {
      const categoryId = e.target.value;
      if (!categoryId) return;

      const repository = ProductRepository.instance();
      const { products } = await repository.getProducts({
        options: { params: { categoryId } },
      });

      setFilterProducts({ ...filterProducts, [index]: products });

      const extraItems = products.find((product: Product) =>
        product.name.toLowerCase().includes("extra"),
      );

      const filterCategory = categories.find(
        (category) => category._id === categoryId,
      );

      const updatedProducts = [...productQuoters];
      updatedProducts[index].category = filterCategory?._id ?? "";
      setProductQuoters(updatedProducts);
    } catch (error) {
      console.error("Error getting products:", error);
    }
  };

  const changeProductSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    try {
      const productId = e.target.value;
      if (!productId) return;

      // const repository = TypeRepository.instance();
      // const { types } = await repository.getTypes({
      //   options: { params: { productId } },
      // });

      // setFilterTypes({ ...filterTypes, [index]: types });

      const filterProduct = filterProducts[index]?.find(
        (product) => product._id === productId,
      );

      const updatedProducts = [...productQuoters];
      setProductQuoters(updatedProducts);
    } catch (error) {
      console.error("Error getting types:", error);
    }
  };

  const handleChangeType = (e: ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;

    const updatedProducts = [...productQuoters];
    setProductQuoters(updatedProducts);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value);
    const updatedProducts = [...productQuoters];
    updatedProducts[index].amount = amount;
    setProductQuoters(updatedProducts);
  };

  const handleAddExtra = () => {
    const updatedProducts = [...productQuoters];
    updatedProducts[index].extras?.push({
      description: "",
      price: 0,
      amount: 0,
    });
    setProductQuoters(updatedProducts);
  };

  const handleRemoveProduct = () => {
    const updatedProducts = [...productQuoters];
    updatedProducts.splice(index, 1);
    setProductQuoters(updatedProducts);
  };

  return (
    <div className="mt-3 grid grid-cols-4 gap-4">
      <div className="col-span-4 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-400">
          Producto
        </label>
        <div className="mt-1">
          <Select
            variant="bordered"
            placeholder="Seleccione un producto"
            onChange={(e) => {
              const mockEvent = {
                target: { value: e.target.value }
              } as ChangeEvent<HTMLSelectElement>;
              changeCategorySelect(mockEvent);
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="col-span-4 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-400">
          Acabado
        </label>
        <div className="mt-1">
          <Select
            variant="bordered"
            placeholder="Seleccione un acabado"
            isRequired
            onChange={(e) => {
              const mockEvent = {
                target: { value: e.target.value }
              } as ChangeEvent<HTMLSelectElement>;
              changeProductSelect(mockEvent);
            }}
          >
            {filterProducts[index]?.map((product) => (
              <SelectItem key={product._id}>
                {product.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="col-span-4 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-400">Tipo</label>
        <div className="mt-1">
          <Select
            variant="bordered"
            placeholder="Seleccione un precio"
            isRequired
            onChange={(e) => {
              const mockEvent = {
                target: { value: e.target.value }
              } as ChangeEvent<HTMLSelectElement>;
              handleChangeType(mockEvent);
            }}
          >
            <SelectItem key="type1">
              Seleccione un tipo
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="col-span-4 sm:pl-3 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-400">
          Cantidad
        </label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            type="number"
            variant="bordered"
            placeholder="Ingrese cantidad"
            defaultValue="0"
            isRequired
            onChange={handleAmountChange}
          />
          {selectedProducts[index] && selectedProducts[index]?.extras && selectedProducts[index]?.extras.length > 0 && (
            <button
              type="button"
              className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              title="Agregar extra"
              onClick={handleAddExtra}
            >
              <DocumentPlusIcon className="h-4 w-4 text-white" />
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            onClick={handleRemoveProduct}
          >
            <MinusIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
