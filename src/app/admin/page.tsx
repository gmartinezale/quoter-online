'use server';
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="px-4 pt-6">
      <h1 className="text-white text-xl font-semibold">Hola!.</h1>
    </div>
  );
}
