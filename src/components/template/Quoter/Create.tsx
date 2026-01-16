"use client";
import { Category } from "@/entities/Category";
import { Product, ProductExtra } from "@/entities/Product";
import { ProductsQuoter } from "@/entities/Quoter";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, DatePicker, Spinner } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { QuoterRepository } from "@/data/quoter.repository";
import { ProductForm } from "./components/ProductForm";
import { ExtraProducts } from "./components/ExtraProducts";
import { TotalAmount } from "./components/TotalAmount";

interface ICreateQuoterProps {
  initialCategories: Category[];
}

/* TODO: change model product, independent collection price */

export default function CreateQuoter({
  initialCategories,
}: ICreateQuoterProps) {
  const { showToast } = useContext(ToastContext);
  const { control, handleSubmit, reset } = useForm({
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

  const [categories] = useState<Category[]>(initialCategories);
  const [filterProducts, setFilterProducts] = useState<
    Record<number, Product[]>
  >({});
  const [totalCalculate, setTotalCalculate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productQuoters, setProductQuoters] = useState<ProductsQuoter[]>([
    {
      amount: 0,
      price: 0,
      category: "",
      isFinished: false,
      extras: [],
      product: ""
    },
  ]);

  useEffect(() => {
    if (productQuoters.length === 0) return;
    const total = productQuoters.reduce((acc, item) => {
      if (!item) return acc;
      const price = item.price ?? 0;
      const amount = item.amount ?? 0;
      let totalExtras = 0;
      if (item.extras.length > 0) {
        totalExtras = item.extras.reduce((acc, extra) => {
          return acc + extra.price * extra.amount;
        }, 0);
      }
      return acc + price * amount + totalExtras;
    }, 0);
    setTotalCalculate(total);
  }, [productQuoters]);

  const getProduct = (productId: string, index: number) => {
    const product = filterProducts[index]?.find(
      (product) => product._id === productId,
    );
    return product?.name ?? "";
  };

  const saveQuoter = async (data: any) => {
    try {
      setIsLoading(true);
      const payload: any = {};
      payload.totalAmount = totalCalculate;
      payload.artist = data.artist;
      payload.dateLimit = data.dateLimit;
      payload.products = productQuoters;
      const repository = QuoterRepository.instance();
      const { success } = await repository.saveQuoter(payload);
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

  const handleAddProduct = () => {
    setProductQuoters([
      ...productQuoters,
      {
        amount: 0,
        price: 0,
        category: "",
        extras: [],
        isFinished: false,
        product: ""
      },
    ]);
  };

  return (
    <div className="px-4 pt-6">
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
                      <Input
                        {...field}
                        type="text"
                        variant="bordered"
                        placeholder="Ingrese nombre del artista"
                        isRequired
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
                      <DatePicker
                        variant="bordered"
                        label="Fecha de entrega"
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
                  className="text-md font-medium text-white flex items-center gap-2"
                >
                  Productos
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    onClick={handleAddProduct}
                  >
                    <PlusIcon className="h-4 w-4 text-white" />
                  </button>
                  <TotalAmount totalCalculate={totalCalculate} />
                </label>
                {productQuoters.map((item, index) => (
                  <div key={index}>
                    <ProductForm
                      index={index}
                      categories={categories}
                      filterProducts={filterProducts}
                      productQuoters={productQuoters}
                      setProductQuoters={setProductQuoters}
                      setFilterProducts={setFilterProducts}
                    />
                    {productQuoters[index].extras.length > 0 && (
                      <ExtraProducts
                        index={index}
                        extraProducts={{[index]: productQuoters[index].extras as ProductExtra[]}}
                        productQuoters={productQuoters}
                        setProductQuoters={setProductQuoters}
                        getProduct={getProduct}
                      />
                    )}
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-500 mt-4 w-full col-span-6" />
              <div className="col-span-6 sm:col-span-6">
                <TotalAmount totalCalculate={totalCalculate} isMobile />
                <Button
                  type="submit"
                  color="success"
                  className="float-right"
                  isLoading={isLoading}
                >
                  Guardar cotización
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
