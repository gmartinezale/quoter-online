"use client";
import { ChangeEvent } from "react";
import { Category } from "@/entities/Category";
import { Product } from "@/entities/Product";
import { Type } from "@/entities/Type";
import { ProductsQuoter } from "@/entities/Quoter";
import { ProductRepository } from "@/data/products.repository";
import { TypeRepository } from "@/data/types.repository";
import { Select, TextInput } from "flowbite-react";
import { DocumentPlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface ProductFormProps {
  index: number;
  categories: Category[];
  filterProducts: Record<number, Product[]>;
  filterTypes: Record<number, Type[]>;
  extraProducts: Record<number, Type[]>;
  productQuoters: ProductsQuoter[];
  setProductQuoters: (products: ProductsQuoter[]) => void;
  setFilterProducts: (products: Record<number, Product[]>) => void;
  setFilterTypes: (types: Record<number, Type[]>) => void;
  setExtraProducts: (extras: Record<number, Type[]>) => void;
}

export function ProductForm({
  index,
  categories,
  filterProducts,
  filterTypes,
  extraProducts,
  productQuoters,
  setProductQuoters,
  setFilterProducts,
  setFilterTypes,
  setExtraProducts,
}: ProductFormProps) {
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

      if (extraItems) {
        const repositoryProduct = TypeRepository.instance();
        const { types } = await repositoryProduct.getTypes({
          options: { params: { productId: extraItems._id } },
        });
        setExtraProducts({ ...extraProducts, [index]: types });
      }

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

      const repository = TypeRepository.instance();
      const { types } = await repository.getTypes({
        options: { params: { productId } },
      });

      setFilterTypes({ ...filterTypes, [index]: types });

      const filterProduct = filterProducts[index]?.find(
        (product) => product._id === productId,
      );

      const updatedProducts = [...productQuoters];
      updatedProducts[index].type = filterProduct?._id ?? "";
      setProductQuoters(updatedProducts);
    } catch (error) {
      console.error("Error getting types:", error);
    }
  };

  const handleChangeType = (e: ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    const type = filterTypes[index]?.find((type) => type._id === typeId);
    if (!type) return;

    const updatedProducts = [...productQuoters];
    updatedProducts[index].price = type.price;
    updatedProducts[index].description = type._id ?? "";
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
            className="w-full bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
            onChange={changeCategorySelect}
          >
            <option value="" disabled selected className="text-gray-400">
              Seleccione un producto
            </option>
            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
                className="text-white"
              >
                {category.name}
              </option>
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
            className="w-full bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
            onChange={changeProductSelect}
            required
          >
            <option value="" disabled selected className="text-gray-400">
              Seleccione un acabado
            </option>
            {filterProducts[index]?.map((product) => (
              <option
                key={product._id}
                value={product._id}
                className="text-white"
              >
                {product.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="col-span-4 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-400">Tipo</label>
        <div className="mt-1">
          <Select
            className="w-full bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
            onChange={handleChangeType}
            required
          >
            <option value="" disabled selected className="text-gray-400">
              Seleccione un precio
            </option>
            {filterTypes[index]?.map((type) => (
              <option key={type._id} value={type._id} className="text-white">
                {type.description}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="col-span-4 sm:pl-3 sm:col-span-1">
        <label className="block text-sm font-medium text-gray-400">
          Cantidad
        </label>
        <div className="mt-1 flex items-center gap-2">
          <TextInput
            defaultValue={0}
            type="number"
            required
            placeholder="Ingrese cantidad"
            className="w-full bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
            onChange={handleAmountChange}
          />
          {extraProducts[index] && extraProducts[index].length > 0 && (
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
