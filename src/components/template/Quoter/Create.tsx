"use client";
import { Category } from "@/entities/Category";
import { Product } from "@/entities/Product";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Card,
  Datepicker,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import {
  DocumentPlusIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { ProductRepository } from "@/data/products.repository";
import { TypeRepository } from "@/data/types.repository";
import { Type } from "@/entities/Type";
import formatCurrency from "@/utils/formatCurrency";
import { QuoterRepository } from "@/data/quoter.repository";
import { ProductsQuoter } from "@/entities/Quoter";

interface ICreateQuoterProps {
  initialCategories: Category[];
}

/* TODO: change model product, independent collection price */

export default function CreateQuoter({
  initialCategories,
}: ICreateQuoterProps) {
  const { showToast } = useContext(ToastContext);
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      totalAmount: 0,
      artist: "",
      dateLimit: "",
      products: [
        {
          amount: 0,
          price: 0,
          description: "",
          product: "",
          category: "",
          type: "",
          extras: [] as any,
        },
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
  const [extraProducts, setExtraProducts] = useState<Record<number, Type[]>>(
    [],
  );
  const [filterTypes, setFilterTypes] = useState<Record<number, Type[]>>({});
  const [totalCalculate, setTotalCalculate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productQuoters, setProductQuoters] = useState<ProductsQuoter[]>([
    {
      amount: 0,
      price: 0,
      description: "",
      category: "",
      type: "",
      isFinished: false,
      extras: [],
    },
  ]);

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
      const extraItems = (products as Product[]).find((product) =>
        product.name.toLowerCase().includes("extra"),
      );
      if (extraItems) {
        const repositoryProduct = TypeRepository.instance();
        const { types } = await repositoryProduct.getTypes({
          options: {
            params: { productId: extraItems._id },
          },
        });
        setExtraProducts({ ...extraProducts, [index]: types });
      }
      const filterCategory = categories.find(
        (category) => category._id === categoryId,
      );
      productQuoters[index].category = filterCategory?.name ?? "";
      setProductQuoters([...productQuoters]);
    } catch (error) {
      console.error("Error get products: ", error);
      throw error;
    }
  };

  const changeProductSelect = async (e: any, index: number) => {
    try {
      const productId: string = e.target.value ?? "";
      if (productId === "") return;
      const repository = TypeRepository.instance();
      const { types } = await repository.getTypes({
        options: {
          params: { productId },
        },
      });
      setFilterTypes({ ...filterTypes, [index]: types });
      const filterProduct = filterProducts[index]?.find(
        (product) => product._id === productId,
      );
      productQuoters[index].type = filterProduct?.name ?? "";
      setProductQuoters([...productQuoters]);
    } catch (error) {
      console.error("Error get types: ", error);
      throw error;
    }
  };

  const handleChangeType = async (e: any, index: number) => {
    const typeId: string = e.target.value ?? "";
    const type = filterTypes[index]?.find((type) => type._id === typeId);
    if (!type) return;
    productQuoters[index].price = type.price;
    productQuoters[index].description = type.description;
    setProductQuoters([...productQuoters]);
  };

  useEffect(() => {
    if (productQuoters.length === 0) return;
    const total = productQuoters.reduce((acc, item) => {
      if (!item) return acc;
      const price = item.price ?? 0;
      const amount = item.amount ?? 0;
      return acc + price * amount;
    }, 0);
    setTotalCalculate(total);
  }, [productQuoters]);

  const saveQuoter = async (data: any) => {
    try {
      setIsLoading(true);
      data.totalAmount = totalCalculate;
      console.log("data", data);
      const repository = QuoterRepository.instance();
      const { success } = await repository.saveQuoter(data);
      if (!success) {
        showToast(false, "Ocurrió un error al guardar la cotización");
        return;
      }
      showToast(true, "Cotización guardada correctamente");
      reset();
    } catch (error) {
      console.error("Error save quoter: ", error);
      throw error;
    } finally {
      setIsLoading(false);
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
          <form className="pb-6" onSubmit={handleSubmit(saveQuoter)}>
            <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="artist"
                  className="block text-sm font-medium text-gray-400"
                >
                  Artista (nombre y email)
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
                        onSelectedDateChanged={(date) => {
                          field.onChange(date);
                        }}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
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
                        type: "",
                        extras: [],
                      })
                    }
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                  <h3 className="w-1/2 float-right text-lg font-medium dark:text-gray-400">
                    Total:
                    <span className="ml-1 mt-1 dark:text-white">
                      {formatCurrency(totalCalculate)}
                    </span>
                  </h3>
                </label>
                {productQuoters.map((item, index) => (
                  <div key={index} className="mt-3 grid grid-cols-4 gap-3">
                    <div className="col-span-4 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.category`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Producto
                      </label>
                      <div className="mt-1">
                        <Select
                          className="w-full pb-2 rounded"
                          onChange={(event) => {
                            changeCategorySelect(event, index);
                          }}
                        >
                          <option value="" disabled selected>
                            Seleccione un producto
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
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.product`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Acabado
                      </label>
                      <div className="mt-1">
                        <Select
                          className="w-full pb-2 rounded"
                          onChange={(e) => {
                            changeProductSelect(e, index);
                          }}
                          required
                        >
                          <option value="" disabled selected>
                            Seleccione un acabado
                          </option>
                          {filterProducts[index]?.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <label
                        htmlFor={`products.${index}.price`}
                        className="block text-sm font-medium text-gray-400"
                      >
                        Tipo
                      </label>
                      <div className="mt-1">
                        <Select
                          className="w-full pb-2 rounded"
                          onChange={(e) => {
                            handleChangeType(e, index);
                          }}
                          required
                        >
                          <option value="" disabled selected>
                            Seleccione un precio
                          </option>
                          {filterTypes[index]?.map((type) => (
                            <option key={type._id} value={type._id}>
                              {type.description}
                            </option>
                          ))}
                        </Select>
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
                        <TextInput
                          defaultValue={0}
                          type="number"
                          required
                          placeholder="Ingrese cantidad"
                          className="block w-full sm:w-1/2 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                          onChange={(e) => {
                            const amount = parseInt(e.target.value);
                            productQuoters[index].amount = amount;
                            setProductQuoters([...productQuoters]);
                          }}
                        />
                        {extraProducts[index] &&
                          extraProducts[index].length > 0 && (
                            <button
                              type="button"
                              className="text-white p-1 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              title="Agregar extra"
                              onClick={() => {
                                productQuoters[index].extras?.push({
                                  description: "",
                                  price: 0,
                                  amount: 0,
                                });
                                setProductQuoters([...productQuoters]);
                              }}
                            >
                              <DocumentPlusIcon className="h-5 w-5" />
                            </button>
                          )}
                        <button
                          type="button"
                          className="text-white ml-2 p-1 mb-1 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => remove(index)}
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {productQuoters[index].extras.length > 0 && (
                      <Card className="col-span-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                            Extras {`${item.type} ${item.description}`}
                            <button
                              type="button"
                              className="ml-2 p-1 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              onClick={() => {
                                productQuoters[index].extras?.push({
                                  description: "",
                                  price: 0,
                                  amount: 0,
                                });
                                setProductQuoters([...productQuoters]);
                              }}
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                          </h5>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {productQuoters[index].extras?.map(
                            (extra, extraIndex) => (
                              <>
                                <div className="col-span-4 sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-400">
                                    Extra
                                  </label>
                                  <div className="mt-1">
                                    <Select
                                      className="w-full pb-2 rounded"
                                      onChange={(e) => {
                                        const price = parseInt(e.target.value);
                                        productQuoters[index].extras[
                                          extraIndex
                                        ].price = price;
                                        setProductQuoters([...productQuoters]);
                                      }}
                                    >
                                      <option value="" disabled selected>
                                        Seleccione un extra
                                      </option>
                                      {extraProducts[index]?.map((product) => (
                                        <option
                                          key={"extra-" + product.description}
                                          value={product.price}
                                        >
                                          {product.description}
                                        </option>
                                      ))}
                                    </Select>
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
                                    <TextInput
                                      defaultValue={0}
                                      type="number"
                                      required
                                      placeholder="Ingrese cantidad"
                                      className="block w-full sm:w-1/2 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                      onChange={(e) => {
                                        const amount = parseInt(e.target.value);
                                        productQuoters[index].extras[
                                          extraIndex
                                        ].amount = amount;
                                        setProductQuoters([...productQuoters]);
                                      }}
                                    />
                                  </div>
                                </div>
                              </>
                            ),
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-500 mt-4 w-full col-span-6" />
              <div className="col-span-6 sm:col-span-6">
                <div className="float-left sm:hidden">
                  <h3 className="w-1/2 float-right text-md font-medium dark:text-gray-400">
                    Total:
                    <p className="ml-1 mt-1 dark:text-white">
                      {formatCurrency(totalCalculate)}
                    </p>
                  </h3>
                </div>
                <Button
                  type="submit"
                  className="justify-center py-2 px-4 text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 float-right"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span>
                      Guardando...
                      <Spinner className="ml-2 text-gray-400" />
                    </span>
                  )}
                  {!isLoading && <span>Guardar cotización</span>}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
