import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  // Convertir formato DB → formato tienda (sizes de JSON string a array)
  const products = dbProducts.map((p) => ({
    ...p,
    sizes: (() => { try { return JSON.parse(p.sizes); } catch { return []; } })(),
  }));

  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  return <HomeClient products={products} categories={categories} />;
}
