"use client";
import { Product } from "@/entities/Product";
import { useContext, useEffect, useState } from "react";
import Table from "@/components/elements/Table/Table";
import { MRT_ColumnDef } from "material-react-table";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { Category } from "@/entities/Category";
import formatCurrency from "@/utils/formatCurrency";
import { TypeRepository } from "@/data/types.repository";
import { Type } from "@/entities/Type";
import { TextInput, ToggleSwitch } from "flowbite-react";
import { useDebouncedCallback } from "use-debounce";

interface ITypeTable {
  initialTypes: Type[];
}

const TypeTable = ({ initialTypes }: ITypeTable) => {
  const { showToast } = useContext(ToastContext);
  const [types, setTypes] = useState<Type[]>(initialTypes);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateTypes = async () => {
    try {
      setIsLoading(true);
      const repository = TypeRepository.instance();
      const { types } = await repository.getTypes();
      setTypes(types);
    } catch (error) {
      console.error("Error get products: ", error);
      throw error;
    } finally {
      setUpdateData(false);
      setIsLoading(false);
    }
  };

  const updateType = async (
    type: Type,
    change: number | boolean,
    field: string,
  ) => {
    try {
      setIsLoading(true);
      const body = {
        ...type,
        [field]: change,
      };
      const repository = TypeRepository.instance();
      const { success } = await repository.updateType(body);
      if (!success) {
        showToast(false, "Ocurrió un error al actualizar el stock");
        return;
      }
      await updateTypes();
      showToast(true, "Stock actualizado");
    } catch (error) {
      console.error("Error update product: ", error);
      showToast(false, "Ocurrió un error al actualizar el stock");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedUpdateType = useDebouncedCallback(updateType, 300);

  useEffect(() => {
    if (updateData) {
      updateTypes();
    }
  }, [updateData]);

  const columnsProduct: MRT_ColumnDef<Type>[] = [
    {
      header: "Categoría",
      accessorKey: "category",
      filterFn: (row, id, filterValue) => {
        const category = row.original.category as Category;
        return category?.name.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: (row) => {
        const category = row.cell.getValue<Category>();
        return category?.name;
      },
    },
    {
      header: "Producto",
      accessorKey: "product",
      filterFn: (row, id, filterValue) => {
        const product = row.original.product as Product;
        return product?.name.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: (row) => {
        const product = row.cell.getValue<Product>();
        return product?.name;
      },
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Precio",
      accessorKey: "price",
      Cell: (row) => {
        const price = row.cell.getValue<number>();
        return formatCurrency(price);
      },
    },
    {
      header: "Stock",
      accessorKey: "stock",
      Cell: (row) => {
        const stock = row.cell.getValue<number>();
        const type = row.row.original as Type;
        return (
          <TextInput
            type="number"
            defaultValue={stock || 0}
            onChange={(event) => {
              debouncedUpdateType(type, parseInt(event.target.value), "stock");
            }}
          />
        );
      },
    },
    {
      header: "Usar Stock",
      accessorKey: "visibilityStock",
      Cell: (row) => {
        const visibilityStock = row.cell.getValue<boolean>();
        const type = row.row.original as Type;
        return (
          <ToggleSwitch
            checked={visibilityStock}
            onChange={() => {
              updateType(type, !visibilityStock, "visibilityStock");
            }}
          />
        );
      },
    },
    {
      header: "Acciones",
      accessorKey: "_id",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Cell: (row) => {
        const type = row.row.original as Type;
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => {
                updateType(type, false, "active");
              }}
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl text-white font-semibold">Stock</h1>
      <div className="flex flex-col mt-6 bg-gray-800 border-gray-700 rounded-lg">
        <div className="justify-between px-4 py-3">
          <Table columns={columnsProduct} data={types} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default TypeTable;
