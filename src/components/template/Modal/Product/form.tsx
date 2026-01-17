// Product form component using react-hook-form
import { ProductRepository } from "@/data/products.repository";
import { Button, Input, Spinner, Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface IFormProductProps {
  closeProductFormModal: (update: boolean) => void;
  name?: string;
  id?: string;
}

interface ProductFormData {
  id: string;
  name: string;
  price: number;
  stock?: number;
  minPurchase?: number;
  types: Array<{ _id?: string; description: string; price: number }>;
  finishes: Array<{ _id?: string; description: string; price: number }>;
  extras: Array<{ _id?: string; description: string; price: number }>;
}

export function FormProduct({
  closeProductFormModal,
  name,
  id,
}: IFormProductProps) {
  const { showToast } = useContext(ToastContext);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, reset, setValue, watch } = useForm<ProductFormData>({
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      stock: undefined,
      minPurchase: undefined,
      types: [],
      finishes: [],
      extras: [],
    },
    shouldUnregister: false,
  });
  
  const { fields: typesFields, append: appendType, remove: removeType } = useFieldArray({
    control,
    name: "types",
  });
  
  const { fields: finishesFields, append: appendFinish, remove: removeFinish } = useFieldArray({
    control,
    name: "finishes",
  });
  
  const { fields: extrasFields, append: appendExtra, remove: removeExtra } = useFieldArray({
    control,
    name: "extras",
  });
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProduct = async (productId: string) => {
    try {
      const repository = ProductRepository.instance();
      const { product } = await repository.getProduct(productId);
      if (product) {
        setValue("id", product._id || "");
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("stock", product.stock);
        setValue("minPurchase", product.minPurchase);
        setValue("types", product.types || []);
        setValue("finishes", product.finishes || []);
        setValue("extras", product.extras || []);
      }
    } catch (error) {
      console.error("Error get product: ", error);
      showToast(false, "Error al cargar el producto");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (id) {
        await getProduct(id);
      } else {
        reset();
        setValue("name", name || "");
      }
      
      setIsLoading(false);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    };
    
    loadData();
  }, [id, name]);

  const saveProduct = async (data: ProductFormData) => {
    try {
      setIsSaving(true);
      const repository = ProductRepository.instance();
      
      if (data.id) {
        await repository.editProduct(data);
        showToast(true, "Producto actualizado correctamente");
      } else {
        await repository.addProduct(data);
        showToast(true, "Producto agregado correctamente");
      }
      
      closeProductFormModal(true);
      reset();
    } catch (error) {
      console.error("Error save product: ", error);
      showToast(false, "Ocurrió un error al guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        <Spinner size="sm" />
        <span>Cargando información...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(saveProduct)} className="flex flex-col gap-4">
      {/* Basic Information */}
      <Card className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700">
        <CardBody className="gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información Básica</h3>
          
          <Controller
            name="name"
            control={control}
            rules={{ required: "El nombre es requerido" }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Nombre del Producto"
                type="text"
                placeholder="Ej: Camiseta, Taza, etc."
                variant="bordered"
                ref={nameInputRef}
                isRequired
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{ 
              required: "El precio base es requerido",
              min: { value: 0, message: "El precio debe ser mayor o igual a 0" }
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value?.toString() || ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                label="Precio Base"
                type="number"
                placeholder="0"
                variant="bordered"
                isRequired
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="stock"
              control={control}
              rules={{ min: { value: 0, message: "El stock debe ser mayor o igual a 0" } }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  label="Stock (Opcional)"
                  type="number"
                  placeholder="0"
                  variant="bordered"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="minPurchase"
              control={control}
              rules={{ min: { value: 1, message: "La compra mínima debe ser mayor a 0" } }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value?.toString() || ""}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  label="Compra Mínima (Opcional)"
                  type="number"
                  placeholder="1"
                  variant="bordered"
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>
        </CardBody>
      </Card>

      {/* Product Variations */}
      <Card className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700">
        <CardBody>
          <Tabs aria-label="Variaciones del producto" color="primary">
            {/* Types Tab */}
            <Tab key="types" title="Tipos">
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Define los diferentes tipos de este producto (Ej: Tallas, Materiales)
                  </p>
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    color="success"
                    variant="flat"
                    onPress={() => appendType({ description: "", price: 0 })}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>

                {typesFields.length === 0 && (
                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
                    No hay tipos configurados
                  </p>
                )}

                {typesFields.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Controller
                      name={`types.${index}.description`}
                      control={control}
                      rules={{ required: "La descripción es requerida" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          label="Descripción"
                          type="text"
                          placeholder="Ej: Pequeño, Mediano, Grande"
                          variant="bordered"
                          size="sm"
                          isRequired
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          className="flex-1"
                        />
                      )}
                    />
                    <Controller
                      name={`types.${index}.price`}
                      control={control}
                      rules={{ 
                        required: "El precio es requerido",
                        min: { value: 0, message: "Debe ser mayor o igual a 0" }
                      }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          label="Precio"
                          type="number"
                          placeholder="0"
                          variant="bordered"
                          size="sm"
                          isRequired
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          className="w-32"
                          startContent={<span className="text-default-400 text-small">$</span>}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => removeType(index)}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>

            {/* Finishes Tab */}
            <Tab key="finishes" title="Acabados">
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Define los acabados disponibles (Ej: Colores, Texturas)
                  </p>
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    color="success"
                    variant="flat"
                    onPress={() => appendFinish({ description: "", price: 0 })}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>

                {finishesFields.length === 0 && (
                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
                    No hay acabados configurados
                  </p>
                )}

                {finishesFields.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Controller
                      name={`finishes.${index}.description`}
                      control={control}
                      rules={{ required: "La descripción es requerida" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          label="Descripción"
                          type="text"
                          placeholder="Ej: Mate, Brillante, Metalizado"
                          variant="bordered"
                          size="sm"
                          isRequired
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          className="flex-1"
                        />
                      )}
                    />
                    <Controller
                      name={`finishes.${index}.price`}
                      control={control}
                      rules={{ 
                        required: "El precio es requerido",
                        min: { value: 0, message: "Debe ser mayor o igual a 0" }
                      }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          label="Precio"
                          type="number"
                          placeholder="0"
                          variant="bordered"
                          size="sm"
                          isRequired
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          className="w-32"
                          startContent={<span className="text-default-400 text-small">$</span>}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => removeFinish(index)}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>

            {/* Extras Tab */}
            <Tab key="extras" title="Extras">
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Extras opcionales que se pueden agregar (Ej: Personalización, Empaque especial)
                  </p>
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    color="success"
                    variant="flat"
                    onPress={() => appendExtra({ description: "", price: 0 })}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>

                {extrasFields.length === 0 && (
                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
                    No hay extras configurados
                  </p>
                )}

                {extrasFields.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-end">
                    <Controller
                      name={`extras.${index}.description`}
                      control={control}
                      rules={{ required: "La descripción es requerida" }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          label="Descripción"
                          type="text"
                          placeholder="Ej: Logo personalizado, Caja de regalo"
                          variant="bordered"
                          size="sm"
                          isRequired
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          className="flex-1"
                        />
                      )}
                    />
                    <Controller
                      name={`extras.${index}.price`}
                      control={control}
                      rules={{ 
                        required: "El precio es requerido",
                        min: { value: 0, message: "Debe ser mayor o igual a 0" }
                      }}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          label="Precio"
                          type="number"
                          placeholder="0"
                          variant="bordered"
                          size="sm"
                          isRequired
                          isInvalid={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          className="w-32"
                          startContent={<span className="text-default-400 text-small">$</span>}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => removeExtra(index)}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        color="primary"
        size="lg"
        isLoading={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
      >
        {id ? "Actualizar Producto" : "Crear Producto"}
      </Button>
    </form>
  );
}
