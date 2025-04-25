"use server";

import QuoterDashboard from "@/components/template/Dashboard/QuoterDashboard";
import SkeletonDashboard from "@/components/template/Dashboard/SkeletonDashboard";
import { QuoterRepository } from "@/data/quoter.repository";
import { Quoter } from "@/entities/Quoter";
import { cookies } from "next/headers";
import { Suspense } from "react";

async function QuoterDashboardWrapper() {
  const cookiesStore = cookies();
  const token = cookiesStore.get("next-auth.session-token")?.value;
  const repository = QuoterRepository.instance(token);
  const {
    success,
    quotersPending,
    quotersProcess,
  }: {
    success: boolean;
    quotersPending: Quoter[];
    quotersProcess: Quoter[];
  } = await repository.getQuoters();

  if (!success) {
    throw new Error("Error getting quoters");
  }

  return (
    <QuoterDashboard
      quotersPending={quotersPending}
      quotersProcess={quotersProcess}
    />
  );
}

export default async function DashboardPage() {
  return (
    <div className="px-4 pt-6">
      <h1 className="text-white text-xl font-semibold">Inicio</h1>
      <Suspense fallback={<SkeletonDashboard />}>
        <QuoterDashboardWrapper />
      </Suspense>
    </div>
  );
}
