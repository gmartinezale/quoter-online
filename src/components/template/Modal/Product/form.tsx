// generate a component use react-hook-form
import { ProductRepository } from "@/data/products.repository";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { CategoryRepository } from "@/data/categories.repository";
import { Category } from "@/entities/Category";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { TypeRepository } from "@/data/types.repository";

interface IFormProductProps {
  closeProductFormModal: (update: boolean) => void;
  name?: string;
  id?: string;
  category?: string;
}

export function FormProduct({
  closeProductFormModal,
  name,
  id,
  category,
}: IFormProductProps) {
  const { showToast } = useContext(ToastContext);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      id: "",
      name: "",
      category: "",
      types: [{ _id: "", description: "", price: 0, stock: 0 }],
    },
    shouldUnregister: false,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "types",
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

  const getTypes = async (productId: string) => {
    try {
      const repository = TypeRepository.instance();
      const { types } = await repository.getTypesByProduct(productId);
      console.log("types", types);
      setValue("types", types);
    } catch (error) {
      console.error("Error get types: ", error);
      throw error;
    }
  };

  useEffect(() => {
    getCategories().then(() => setIsLoading(false));
    if (id && id !== "") {
      getTypes(id);
    }
  }, []);

  useEffect(() => {
    reset();
    emailInputRef.current?.focus();
    setValue("name", name || "");
    setValue("category", category || "");
    if (id && id !== "") {
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
          {!category && (
            <>
              <div className="mb-2 block text-white">
                <label htmlFor="category">Categoría</label>
              </div>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
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
            </>
          )}
          <div className="block my-2">
            <div className="mb-2 text-white flex items-center">
              <h2 className="">
                Tipos:
                <button
                  type="button"
                  className="ml-2 p-1 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() =>
                    append({ _id: "", description: "", price: 0, stock: 0 })
                  }
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </h2>
            </div>
            {fields.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="pl-4 flex flex-col text-white"
              >
                <div className="flex space-x-3 items-center">
                  <label className="w-24">Descripción:</label>
                  <Controller
                    name={`types.${index}.description`}
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
                  <label className="w-24">Stock:</label>
                  <Controller
                    name={`types.${index}.stock`}
                    control={control}
                    defaultValue={item.stock}
                    render={({ field }) => (
                      <TextInput
                        value={field.value || ""}
                        type="number"
                        className="w-1/2 pb-2 rounded"
                        placeholder="Ingrese Stock"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  <label className="pl-2 w-24">Precio:</label>
                  <Controller
                    name={`types.${index}.price`}
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
              </div>
            ))}
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
