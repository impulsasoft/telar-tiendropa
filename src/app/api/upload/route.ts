import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { dataUrl, folder } = await req.json();
  if (!dataUrl?.startsWith("data:image")) {
    return NextResponse.json({ error: "Imagen inválida" }, { status: 400 });
  }

  const url = await uploadImage(dataUrl, folder ?? "tiendropa/products");
  return NextResponse.json({ url });
}
