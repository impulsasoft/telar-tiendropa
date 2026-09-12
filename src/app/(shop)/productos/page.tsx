import { prisma } from "@/lib/prisma";
import ProductosClient from "@/components/ProductosClient";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  const products = dbProducts.map((p) => ({
    ...p,
    sizes: (() => { try { return JSON.parse(p.sizes); } catch { return []; } })(),
  }));

  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  return <ProductosClient products={products} categories={categories} />;
}
