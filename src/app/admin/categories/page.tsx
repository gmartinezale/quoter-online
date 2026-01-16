import CategoryTable from "@/components/template/Category/CategoryTable";
import { Category } from "@/entities/Category";
import { CategoryRepository } from "@/data/categories.repository";
import { cookies } from "next/headers";
import SkeletonLoading from "@/components/layouts/loading";
import { Suspense } from "react";

const getCategories = async () => {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("next-auth.session-token")?.value;
    const repository = CategoryRepository.instance(token);
    const { categories } = await repository.getCategories();
    return categories;
  } catch (error) {
    console.error("Error get categories: ", error);
    throw error;
  }
};

export default async function CategoryPage() {
  const categories: Category[] = await getCategories();
  return (
    <Suspense fallback={<SkeletonLoading />}>
      <CategoryTable initialCategories={categories} />
    </Suspense>
  );
}
