"use client";
import { Product } from "@/entities/Product";
import { useContext, useEffect, useState } from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import Table from "@/components/elements/Table/Table";
import { MRT_ColumnDef } from "material-react-table";
import {
  ArrowTopRightOnSquareIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ProductRepository } from "@/data/products.repository";
import Link from "next/link";
import { ModalData } from "@/types";
import { FormProduct } from "../Modal/Product/form";
import { ToastContext } from "@/components/elements/Toast/ToastComponent";
import { Category } from "@/entities/Category";
import formatCurrency from "@/utils/formatCurrency";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TypeRepository } from "@/data/types.repository";
import { Type } from "@/entities/Type";

interface IProductTableProps {
  initialProducts: Product[];
}

const ProductTable = ({ initialProducts }: IProductTableProps) => {
  const { showToast } = useContext(ToastContext);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData>({
    title: "Producto",
    size: "md",
  });
  const [showModal, setShowModal] = useState(false);

  const updateProducts = async () => {
    try {
      setIsLoading(true);
      const repository = ProductRepository.instance();
      const { products } = await repository.getProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error get products: ", error);
      throw error;
    } finally {
      setUpdateData(false);
      setIsLoading(false);
    }
  };

  const closeProductFormModal = (update?: boolean) => {
    if (update) {
      setUpdateData(true);
    }
    setShowModal(false);
    setModalData({ ...modalData, content: null });
  };

  const openProductModal = (product?: Product) => {
    setShowModal(true);
    if (product) {
      const categoryId = product.category._id;
      setModalData({
        title: "Editar producto",
        size: "3xl",
        content: (
          <FormProduct
            closeProductFormModal={closeProductFormModal}
            id={product._id}
            name={product.name}
            category={categoryId}
          />
        ),
      });
    } else {
      setModalData({
        title: "Agregar producto",
        size: "3xl",
        content: <FormProduct closeProductFormModal={closeProductFormModal} />,
      });
    }
  };

  const deleteProduct = async (id?: string) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const repository = ProductRepository.instance();
      await repository.deleteProduct(id);
      showToast(true, "Producto eliminada");
    } catch (error) {
      console.error("Error delete product: ", error);
      showToast(false, "Ocurrío un error al eliminar el producto");
      throw error;
    } finally {
      setUpdateData(true);
      setIsLoading(false);
    }
  };

  const showModalPrices = async (productId: string) => {
    try {
      const typeRepository = TypeRepository.instance();
      const { types } = await typeRepository.getTypesByProduct(productId);
      setShowModal(true);
      setModalData({
        title: "Tipos",
        size: "2xl",
        content: (
          <div className="flex flex-col text-white">
            Espere un momento.... <Spinner />
          </div>
        ),
      });
      if (types.length === 0) {
        showToast(false, "No existen precios para este producto");
      } else {
        setModalData({
          title: "Tipos",
          size: "2xl",
          content: (
            <div className="flex flex-col text-white">
              {(types as Type[]).map((type, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-1">
                    <h4>{type.description}</h4>
                  </div>
                  <div className="flex-1 text-white">
                    {formatCurrency(type.price)}
                  </div>
                </div>
              ))}
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error get types: ", error);
      throw error;
    }
  };

  useEffect(() => {
    if (updateData) {
      updateProducts();
    }
  }, [updateData]);

  const columnsProduct: MRT_ColumnDef<Product>[] = [
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Tipos",
      accessorKey: "_id",
      Cell: (row) => {
        const id = row.cell.getValue<string>();
        return (
          <MagnifyingGlassIcon
            className="w-5 h-5 text-white cursor-pointer"
            onClick={() => showModalPrices(id)}
          />
        );
      },
    },
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
      header: "Acciones",
      accessorKey: "_id",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Cell: (row) => {
        const product = row.row.original as Product;
        return (
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => openProductModal(product)}
            >
              <PencilIcon className="w-4 h-4 text-white" />
            </button>
            <button
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => deleteProduct(product._id)}
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-4 pt-6 dark">
      <h1 className="text-xl text-white font-semibold">Productos</h1>
      <div className="flex flex-col mt-6 bg-gray-800 border-gray-700 rounded-lg">
        <div className="justify-between px-4 py-3">
          <div className="w-full pb-2 flex justify-end">
            <Button onClick={() => openProductModal()}>Agregar</Button>
          </div>
          <Table
            columns={columnsProduct}
            data={products}
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

export default ProductTable;
