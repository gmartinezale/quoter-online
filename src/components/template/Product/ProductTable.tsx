"use client";
import { Product } from "@/entities/Product";
import { useContext, useEffect, useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, Spinner } from "@heroui/react";
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

interface IProductTableProps {
  initialProducts: Product[];
  categoryId?: string;
}

const ProductTable = ({ initialProducts, categoryId }: IProductTableProps) => {
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
      if (categoryId) {
        const { products } = await repository.getProductsByCategory(categoryId);
        setProducts(products);
      } else {
        const { products } = await repository.getProducts();
        setProducts(products);
      }
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
    if (product || categoryId) {
      let productCategoryId = categoryId;
      if (!productCategoryId) {
        productCategoryId = product?.category._id;
      }
      setModalData({
        title: "Editar producto",
        size: "3xl",
        content: (
          <FormProduct
            closeProductFormModal={closeProductFormModal}
            id={product?._id}
            name={product?.name}
            category={productCategoryId}
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

  const showModalDetails = async (product: Product) => {
    try {
      setShowModal(true);
      setModalData({
        title: `Detalles - ${product.name}`,
        size: "3xl",
        content: (
          <div className="flex flex-col gap-6 text-white p-4">
            {/* Base Price */}
            <div className="border-b border-gray-700 pb-4">
              <h3 className="text-lg font-semibold mb-2">Precio Base</h3>
              <p className="text-xl">{formatCurrency(product.price)}</p>
            </div>

            {/* Stock and Min Purchase */}
            {(product.stock !== undefined || product.minPurchase !== undefined) && (
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-lg font-semibold mb-2">Información de Inventario</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.stock !== undefined && (
                    <div>
                      <p className="text-sm text-gray-400">Stock disponible:</p>
                      <p className="text-lg">{product.stock} unidades</p>
                    </div>
                  )}
                  {product.minPurchase !== undefined && (
                    <div>
                      <p className="text-sm text-gray-400">Compra mínima:</p>
                      <p className="text-lg">{product.minPurchase} unidades</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Types */}
            {product.types && product.types.length > 0 && (
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-lg font-semibold mb-3">Tipos</h3>
                <div className="space-y-2">
                  {product.types.map((type, index) => (
                    <div key={type._id || index} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                      <span>{type.description}</span>
                      <span className="font-semibold">{formatCurrency(type.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finishes */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-lg font-semibold mb-3">Acabados</h3>
                <div className="space-y-2">
                  {product.finishes.map((finish, index) => (
                    <div key={finish._id || index} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                      <span>{finish.description}</span>
                      <span className="font-semibold">{formatCurrency(finish.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            {product.extras && product.extras.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Extras Opcionales</h3>
                <div className="space-y-2">
                  {product.extras.map((extra, index) => (
                    <div key={extra._id || index} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                      <span>{extra.description}</span>
                      <span className="font-semibold">{formatCurrency(extra.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {(!product.types || product.types.length === 0) && 
             (!product.finishes || product.finishes.length === 0) && 
             (!product.extras || product.extras.length === 0) && (
              <p className="text-center text-gray-400">No hay detalles adicionales configurados</p>
            )}
          </div>
        ),
      });
    } catch (error) {
      console.error("Error showing product details: ", error);
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
      header: "Precio Base",
      accessorKey: "price",
      Cell: (row) => {
        const price = row.cell.getValue<number>();
        return formatCurrency(price);
      },
    },
    {
      header: "Detalles",
      accessorKey: "_id",
      Cell: (row) => {
        const product = row.row.original as Product;
        return (
          <MagnifyingGlassIcon
            className="w-5 h-5 text-white cursor-pointer hover:text-blue-400"
            onClick={() => showModalDetails(product)}
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
    <div className="px-4 pt-2">
      {!categoryId && (
        <h1 className="text-xl text-white font-semibold">Productos</h1>
      )}
      <div className="flex flex-col">
        <div className="justify-between px-4 py-3">
          <div className="w-full pb-2 flex justify-end">
            <Button color="primary" onPress={() => openProductModal()}>Agregar</Button>
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
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setModalData({ ...modalData, content: null });
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-1">
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
          </ModalHeader>
          <ModalBody className="max-h-[90vh] overflow-y-auto">
            {modalData.content ?? ""}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductTable;
