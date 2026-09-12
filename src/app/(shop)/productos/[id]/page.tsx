import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ProductoDetalleClient from "@/components/ProductoDetalleClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: `${product.name} — TIENDROPA`,
    description: product.description,
  };
}

export default async function ProductoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const dbProduct = await prisma.product.findUnique({ where: { id, active: true } });
  if (!dbProduct) notFound();

  const dbRelated = await prisma.product.findMany({
    where: { category: dbProduct.category, id: { not: dbProduct.id }, active: true },
    take: 4,
  });

  const parseSizes = (s: string): string[] => { try { return JSON.parse(s); } catch { return []; } };

  const parseImages = (s: string): string[] => { try { return JSON.parse(s); } catch { return []; } };
  const product = { ...dbProduct, sizes: parseSizes(dbProduct.sizes), images: parseImages(dbProduct.images) };
  const related = dbRelated.map((p) => ({ ...p, sizes: parseSizes(p.sizes) }));

  return <ProductoDetalleClient product={product} related={related} />;
}
