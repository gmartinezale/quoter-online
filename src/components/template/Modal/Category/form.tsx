// generate a component use react-hook-form
import { CategoryRepository } from "@/data/categories.repository";
import { Button, Spinner, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";

interface IFormCategoryProps {
  closeAddCategoryModal: (update: boolean) => void;
  name?: string;
  id?: string;
}

export function FormCategory({
  closeAddCategoryModal,
  name,
  id,
}: IFormCategoryProps) {
  const { showToast } = useContext(ToastContext);
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      id: "",
      name: "",
    },
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    reset();
    setValue("name", name || "");
    if (id) {
      setValue("id", id || "");
    }
  }, [name, id]);

  const saveCategory = async (data: any) => {
    try {
      setIsSaving(true);
      const repository = CategoryRepository.instance();
      if (data.id) {
        await repository.editCategory(data);
        showToast(true, "Categoría actualizada correctamente");
      } else {
        await repository.addCategory(data);
        showToast(true, "Categoría agregada correctamente");
      }
    } catch (error) {
      console.error("Error add category: ", error);
      showToast(false, "Ocurrió un error al agregar la categoría");
      throw error;
    } finally {
      setIsSaving(false);
      closeAddCategoryModal(true);
      reset();
    }
  };

  return (
    <form className="dark" onSubmit={handleSubmit(saveCategory)}>
      <div className="flex flex-col space-y-2">
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
              placeholder="Ingrese nombre de la categoría"
              color="gray"
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Spinner size="sm" className="mr-2" color="white" />}
          <span>Guardar</span>
        </Button>
      </div>
    </form>
  );
}
