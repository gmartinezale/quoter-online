// generate a component use react-hook-form
import { ProductRepository } from "@/data/products.repository";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { Price } from "@/entities/Product";
import { CategoryRepository } from "@/data/categories.repository";
import { Category } from "@/entities/Category";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface IFormProductProps {
  closeProductFormModal: (update: boolean) => void;
  name?: string;
  id?: string;
  prices?: Price[];
  category?: string;
}

export function FormProduct({
  closeProductFormModal,
  name,
  id,
  prices,
  category,
}: IFormProductProps) {
  const { showToast } = useContext(ToastContext);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      id: "",
      name: "",
      category: "",
      prices: prices || [{ description: "", price: 0 }],
    },
    shouldUnregister: false,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCategories = async () => {
    try {
      const repository = CategoryRepository.instance();
      const { categories } = await repository.getCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Error get categories: ", error);
      throw error;
    }
  };

  useEffect(() => {
    getCategories().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    reset();
    emailInputRef.current?.focus();
    setValue("name", name || "");
    setValue("category", category || "");
    if (id) {
      setValue("id", id || "");
    }
  }, [name, id, category, reset, setValue]);

  const saveProduct = async (data: any) => {
    try {
      setIsSaving(true);
      const repository = ProductRepository.instance();
      if (data.id) {
        await repository.editProduct(data);
        showToast(true, "Categoría actualizada correctamente");
      } else {
        await repository.addProduct(data);
        showToast(true, "Categoría agregada correctamente");
      }
    } catch (error) {
      console.error("Error add category: ", error);
      showToast(false, "Ocurrió un error al agregar la categoría");
      throw error;
    } finally {
      setIsSaving(false);
      closeProductFormModal(true);
      reset();
    }
  };

  if (isLoading) {
    return (
      <div className="text-white">
        Espere un momento.... <Spinner />
      </div>
    );
  }

  return (
    <form className="dark" onSubmit={handleSubmit(saveProduct)}>
      <div className="flex flex-col space-y-2">
        <div className="block mb-2">
          <div className="mb-2 block text-white">
            <label htmlFor="name">Nombre</label>
          </div>
          <Controller
            name="name"
            control={control}
            defaultValue={name}
            render={({ field }) => (
              <TextInput
                value={field.value || ""}
                type="text"
                className="w-full pb-2 rounded"
                placeholder="Ingrese nombre del producto"
                color="gray"
                ref={emailInputRef}
                onChange={(e) => field.onChange(e.target.value)}
                required
              />
            )}
          />
        </div>
        <div className="block mb-2">
          <div className="mb-2 block text-white">
            <label htmlFor="category">Categoría</label>
          </div>
          <Controller
            name="category"
            control={control}
            defaultValue={category}
            render={({ field }) => (
              <Select
                className="w-full pb-2 rounded"
                placeholder="Seleccione una categoría"
                onChange={(e) => field.onChange(e.target.value)}
                required
              >
                <option value="" disabled selected={!category}>
                  Seleccione una categoría
                </option>
                {categories.map((categoryItem) => (
                  <option
                    key={categoryItem._id}
                    value={categoryItem._id}
                    selected={categoryItem._id === category ? true : false}
                  >
                    {categoryItem.name}
                  </option>
                ))}
              </Select>
            )}
          />
          <div className="block my-2">
            <div className="mb-2 text-white flex items-center">
              <h2 className="">
                Precios:
                <button
                  type="button"
                  className="ml-2 p-1 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => append({ description: "", price: 0 })}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </h2>
            </div>
            <div className="pl-4 flex flex-col text-white">
              {fields.map((item, index) => (
                <>
                  <div key={index} className="flex space-x-2 items-center">
                    <label className="w-24">Descripción:</label>
                    <Controller
                      name={`prices.${index}.description`}
                      control={control}
                      defaultValue={item.description}
                      render={({ field }) => (
                        <TextInput
                          value={field.value || ""}
                          type="text"
                          className="w-1/2 pb-2 rounded"
                          placeholder="Ingrese descripción del precio"
                          onChange={(e) => field.onChange(e.target.value)}
                          required
                        />
                      )}
                    />
                    <label className="pl-2 w-24">Precio:</label>
                    <Controller
                      name={`prices.${index}.price`}
                      control={control}
                      defaultValue={item.price}
                      render={({ field }) => (
                        <TextInput
                          value={field.value || ""}
                          type="number"
                          className="w-1/2 pb-2 rounded"
                          placeholder="Ingrese el precio"
                          onChange={(e) => field.onChange(e.target.value)}
                          required
                        />
                      )}
                    />
                    <button
                      type="button"
                      className="ml-2 p-1 mb-2 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => remove(index)}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Spinner size="sm" className="mr-2" color="white" />}
          <span>Guardar</span>
        </Button>
      </div>
    </form>
  );
}
