import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(dataUrl: string, folder = "tiendropa/products"): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    transformation: [{ width: 800, height: 1000, crop: "fill", quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
