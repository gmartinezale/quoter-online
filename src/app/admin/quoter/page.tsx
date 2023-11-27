import CreateQuoter from "@/components/template/Quoter/Create";
import { Category } from "@/entities/Category";
import { CategoryRepository } from "@/data/categories.repository";
import { cookies } from "next/headers";
import { Suspense } from "react";
import SkeletonLoading from "@/components/layouts/loading";

const getCategories = async () => {
  try {
    const cookiesStore = cookies();
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
      <CreateQuoter initialCategories={categories} />
    </Suspense>
  );
}
