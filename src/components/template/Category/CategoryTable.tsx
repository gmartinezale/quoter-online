"use client";
import { Category } from "@/entities/Category";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import Table from "@/components/elements/Table/Table";
import { MRT_ColumnDef } from "material-react-table";
import {
  ArrowTopRightOnSquareIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { CategoryRepository } from "@/data/categories.repository";
import Link from "next/link";
import { ModalData } from "@/types";
import { FormCategory } from "../Modal/Category/form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";

interface ICategoryTableProps {
  initialCategories: Category[];
}

const CategoryTable = ({ initialCategories }: ICategoryTableProps) => {
  const { showToast } = useContext(ToastContext);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData>({
    title: "Categoría",
    size: "md",
  });
  const [showModal, setShowModal] = useState(false);

  const updateCategories = async () => {
    try {
      setIsLoading(true);
      const repository = CategoryRepository.instance();
      const { categories } = await repository.getCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Error update categories: ", error);
      throw error;
    } finally {
      setUpdateData(false);
      setIsLoading(false);
    }
  };

  const closeAddCategoryModal = (update?: boolean) => {
    if (update) {
      setUpdateData(true);
    }
    setShowModal(false);
    setModalData({ ...modalData, content: null });
  };

  const openCategoryModal = (category?: Category) => {
    setShowModal(true);
    if (category) {
      setModalData({
        title: "Editar categoría",
        size: "2xl",
        content: (
          <FormCategory
            closeAddCategoryModal={closeAddCategoryModal}
            id={category._id}
            name={category.name}
          />
        ),
      });
    } else {
      setModalData({
        title: "Agregar categoría",
        size: "2xl",
        content: <FormCategory closeAddCategoryModal={closeAddCategoryModal} />,
      });
    }
  };

  const deleteCategory = async (id?: string) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const repository = CategoryRepository.instance();
      await repository.deleteCategory(id);
      showToast(true, "Categoría eliminada");
    } catch (error) {
      console.error("Error delete category: ", error);
      showToast(false, "Ocurrío un error al eliminar la categoría");
      throw error;
    } finally {
      setUpdateData(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (updateData) {
      updateCategories();
    }
  }, [updateData]);

  const columnsCategory: MRT_ColumnDef<Category>[] = [
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Acciones",
      accessorKey: "_id",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Cell: (row) => {
        const category = row.row.original as Category;
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => openCategoryModal(category)}
            >
              <PencilIcon className="w-4 h-4 text-white" />
            </button>
            <button
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => deleteCategory(category._id)}
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
      <h1 className="text-xl text-white font-semibold">Categorías</h1>
      <div className="flex flex-col mt-6 bg-gray-800 border-gray-700 rounded-lg">
        <div className="justify-between px-4 py-3">
          <div className="w-full pb-2 flex justify-end">
            <Button onClick={() => openCategoryModal()}>Agregar</Button>
          </div>
          <Table
            columns={columnsCategory}
            data={categories}
            isLoading={isLoading}
          />
        </div>
      </div>
      <Modal
        size={modalData.size}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setModalData({ ...modalData, content: null });
        }}
        className="dark"
      >
        <Modal.Header>
          {modalData.title ?? ""}
          {modalData.link && (
            <Link
              href={modalData.link}
              target="_blank"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              <ArrowTopRightOnSquareIcon
                width="24"
                height="24"
                className="mb-1 ml-2 inline"
              />
            </Link>
          )}
        </Modal.Header>
        <Modal.Body className="max-h-[90vh] overflow-y-auto">
          {modalData.content ?? ""}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryTable;
