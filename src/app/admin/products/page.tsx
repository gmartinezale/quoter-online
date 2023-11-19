import ProductTable from "@/components/template/Product/ProductTable";
import { Product } from "@/entities/Product";
import { ProductRepository } from "@/data/products.repository";
import { cookies } from "next/headers";

const getProducts = async () => {
  try {
    const cookiesStore = cookies();
    const token = cookiesStore.get("next-auth.session-token")?.value;
    const repository = ProductRepository.instance(token);
    const { products } = await repository.getProducts();
    return products;
  } catch (error) {
    console.error("Error get products: ", error);
    throw error;
  }
};

export default async function ProductPage() {
  const products: Product[] = await getProducts();
  return <ProductTable initialProducts={products} />;
}
