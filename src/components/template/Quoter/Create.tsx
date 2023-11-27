"use client";
import { Category } from "@/entities/Category";
import { Product } from "@/entities/Product";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Datepicker, Select, TextInput } from "flowbite-react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CategoryRepository } from "@/data/categories.repository";
import { ProductRepository } from "@/data/products.repository";

interface ICreateQuoterProps {
  initialCategories: Category[];
}

/* TODO: change model product, independent collection price */

export default function CreateQuoter({
  initialCategories,
}: ICreateQuoterProps) {
  const { showToast } = useContext(ToastContext);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      totalAmount: 0,
      artist: "",
      dateLimit: "",
      products: [
        { amount: 0, price: 0, description: "", product: "", category: "" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filterProducts, setFilterProducts] = useState<
    Record<number, Product[]>
  >({});

  const changeCategorySelect = async (e: any, index: number) => {
    try {
      const categoryId: string = e.target.value ?? "";
      if (categoryId === "") return;
      const repository = ProductRepository.instance();
      const { products } = await repository.getProducts({
        options: {
          params: { categoryId },
        },
      });
      setFilterProducts({ ...filterProducts, [index]: products });
    } catch (error) {
      console.error("Error get products: ", error);
      throw error;
    }
  };

  return (
    <div className="px-4 pt-6 dark">
      <h1 className="text-xl text-white font-semibold">Cotizador</h1>
      <div className="flex flex-col mt-6 bg-gray-800 border-gray-700 rounded-lg px-6">
        <h5 className="inline-flex pt-4 items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-white">
          Datos de cotización
        </h5>
        <div className="space-y-12">
          <form className="pb-6">
            <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="artist"
                  className="block text-sm font-medium text-gray-400"
                >
                  Artista (nimbre y email)
                </label>
                <div className="mt-1">
                  <Controller
                    name="artist"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <TextInput
                        value={field.value || ""}
                        type="text"
                        id="artist"
                        required
                        placeholder="Ingrese nombre del artista"
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="dateLimit"
                  className="block text-sm font-medium text-gray-400"
                >
                  Fecha Entrega (opcional)
                </label>
                <div className="mt-1">
                  <Controller
                    name="dateLimit"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Datepicker
                        type="text"
                        id="artist"
                        language="es"
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                        minDate={new Date()}
                        defaultDate={new Date()}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </div>
              </div>
              <hr className="border-t border-gray-500 mt-4 w-full col-span-6" />
              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="dateLimit"
                  className="block text-md font-medium text-white"
                >
                  Productos
                  <button
                    type="button"
                    className="ml-2 p-1 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() =>
                      append({
                        amount: 0,
                        price: 0,
                        description: "",
                        product: "",
                        category: "",
                      })
                    }
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </label>
                {fields.map((item, index) => (
                  <div key={index} className="mt-3 grid grid-cols-4 gap-3">
                    <div className="col-span-4 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.category`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Categoría
                      </label>
                      <div className="mt-1">
                        <Controller
                          name={`products.${index}.category`}
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Select
                              className="w-full pb-2 rounded"
                              onChange={(event) => {
                                field.onChange(event.target.value);
                                changeCategorySelect(event, index);
                              }}
                              value={field.value || ""}
                            >
                              <option value="" disabled>
                                Seleccione una categoría
                              </option>
                              {categories.map((categoryItem) => (
                                <option
                                  key={categoryItem._id}
                                  value={categoryItem._id}
                                >
                                  {categoryItem.name}
                                </option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.product`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Producto
                      </label>
                      <div className="mt-1">
                        <Controller
                          name={`products.${index}.product`}
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              className="w-full pb-2 rounded"
                              onChange={(e) => field.onChange(e.target.value)}
                              required
                            >
                              <option value="" disabled>
                                Seleccione un producto
                              </option>
                              {filterProducts[index]?.map((product) => (
                                <option
                                  key={product._id}
                                  value={product._id}
                                  selected={
                                    product._id === field.value ? true : false
                                  }
                                >
                                  {product.name}
                                </option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.price`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Precio
                      </label>
                      <div className="mt-1">
                        <Controller
                          name={`products.${index}.description`}
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              className="w-full pb-2 rounded"
                              onChange={(e) => field.onChange(e.target.value)}
                              required
                            >
                              <option value="" disabled>
                                Seleccione un precio
                              </option>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-span-4 sm:pl-3 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.amount`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Cantidad
                      </label>
                      <div className="mt-1 flex space-x-2 items-center">
                        <Controller
                          name={`products.${index}.amount`}
                          control={control}
                          defaultValue={1}
                          render={({ field }) => (
                            <TextInput
                              value={field.value || ""}
                              type="number"
                              required
                              placeholder="Ingrese cantidad"
                              className="block w-full sm:w-1/2 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                        <button
                          type="button"
                          className="ml-2 p-1 mb-1 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => remove(index)}
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
