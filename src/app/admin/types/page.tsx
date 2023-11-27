import { Type } from "@/entities/Type";
import { TypeRepository } from "@/data/types.repository";
import { cookies } from "next/headers";
import SkeletonLoading from "@/components/layouts/loading";
import { Suspense } from "react";
import TypeTable from "@/components/template/Type/TypeTable";

const getTypes = async () => {
  try {
    const cookiesStore = cookies();
    const token = cookiesStore.get("next-auth.session-token")?.value;
    const repository = TypeRepository.instance(token);
    const { types } = await repository.getTypes();
    return types;
  } catch (error) {
    console.error("Error get types: ", error);
    throw error;
  }
};

export default async function Page() {
  const types: Type[] = await getTypes();
  return (
    <Suspense fallback={<SkeletonLoading />}>
      <TypeTable initialTypes={types} />
    </Suspense>
  );
}
