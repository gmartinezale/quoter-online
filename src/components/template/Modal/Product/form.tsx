// Product form component using react-hook-form
import { ProductRepository } from "@/data/products.repository";
import { Button, Select, SelectItem, Input, Spinner, Tabs, Tab } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { CategoryRepository } from "@/data/categories.repository";
import { Category } from "@/entities/Category";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Product } from "@/entities/Product";

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
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span>Espere un momento...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(saveProduct)}>
      <div className="flex flex-col gap-4">
        <Controller
          name="name"
          control={control}
          defaultValue={name}
          render={({ field }) => (
            <Input
              {...field}
              label="Nombre"
              type="text"
              placeholder="Ingrese nombre del producto"
              variant="bordered"
              ref={emailInputRef}
              isRequired
            />
          )}
        />

        {!category && (
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Categoría"
                placeholder="Seleccione una categoría"
                variant="bordered"
                isRequired
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  field.onChange(value);
                }}
              >
                {categories.map((categoryItem) => (
                  <SelectItem key={categoryItem._id || ""}>
                    {categoryItem.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        )}

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Tipos:</h2>
            <Button
              type="button"
              isIconOnly
              size="sm"
              color="success"
              variant="flat"
              onPress={() =>
                append({ _id: "", description: "", price: 0, stock: 0 })
              }
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>

          {fields.map((item, index) => (
            <div key={`${item._id}-${index}`} className="flex gap-2 items-end">
              <Controller
                name={`types.${index}.description`}
                control={control}
                defaultValue={item.description}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Descripción"
                    type="text"
                    placeholder="Descripción"
                    variant="bordered"
                    size="sm"
                    isRequired
                  />
                )}
              />
              <Controller
                name={`types.${index}.stock`}
                control={control}
                defaultValue={item.stock}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    label="Stock"
                    type="number"
                    placeholder="Stock"
                    variant="bordered"
                    size="sm"
                  />
                )}
              />
              <Controller
                name={`types.${index}.price`}
                control={control}
                defaultValue={item.price}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    label="Precio"
                    type="number"
                    placeholder="Precio"
                    variant="bordered"
                    size="sm"
                    isRequired
                  />
                )}
              />
              <Button
                type="button"
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => remove(index)}
              >
                <MinusIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>

        <Button 
          type="submit" 
          color="primary"
          isLoading={isSaving}
          className="w-full"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
