"use server";

import QuoterDashboard from "@/components/template/Dashboard/QuoterDashboard";
import { QuoterRepository } from "@/data/quoter.repository";
import { cookies } from "next/headers";

const getQuoters = async () => {
  try {
    const cookiesStore = cookies();
    const token = cookiesStore.get("next-auth.session-token")?.value;
    const repository = QuoterRepository.instance(token);
    const { success, quotersPending, quotersProcess } =
      await repository.getQuoters();

    if (!success) {
      throw new Error("Error getting quoters");
    }
    return { quotersPending, quotersProcess };
  } catch (error) {
    console.error("Error get quoters: ", error);
    throw error;
  }
};

export default async function Home() {
  const { quotersPending, quotersProcess } = await getQuoters();
  return (
    <div className="px-4 pt-6">
      <h1 className="text-white text-xl font-semibold">Inicio</h1>
      <QuoterDashboard
        quotersPending={quotersPending}
        quotersProcess={quotersProcess}
      />
    </div>
  );
}
