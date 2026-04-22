"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function uploadImage(formData: FormData) {
  try {
    const imageFile = formData.get("imageFile") as File;
    if (!imageFile || imageFile.size === 0) return { success: false, error: "No file provided" };

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}

const categoriesPath = path.join(process.cwd(), "src", "data", "categories.json");
const appearancePath = path.join(process.cwd(), "src", "data", "appearance.json");
const reviewsPath = path.join(process.cwd(), "src", "data", "reviews.json");

// --- CATEGORIES ---
export async function getCategories() {
  try {
    const data = await fs.readFile(categoriesPath, "utf8");
    return JSON.parse(data);
  } catch { return []; }
}

export async function saveCategory(category: any) {
  const categories = await getCategories();
  const index = categories.findIndex((c: any) => c.id === category.id);
  
  if (index > -1) {
    categories[index] = category;
  } else {
    categories.push({ ...category, id: `cat-${Date.now()}` });
  }
  
  await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const categories = await getCategories();
  const filtered = categories.filter((c: any) => c.id !== id);
  await fs.writeFile(categoriesPath, JSON.stringify(filtered, null, 2));
  revalidatePath("/admin/categories");
  return { success: true };
}

// --- APPEARANCE ---
export async function getAppearance() {
  try {
    const data = await fs.readFile(appearancePath, "utf8");
    return JSON.parse(data);
  } catch { return {}; }
}

export async function updateAppearance(data: any) {
  await fs.writeFile(appearancePath, JSON.stringify(data, null, 2));
  revalidatePath("/");
  revalidatePath("/admin/appearance");
  return { success: true };
}

// --- REVIEWS ---
export async function getReviews() {
  try {
    const data = await fs.readFile(reviewsPath, "utf8");
    return JSON.parse(data);
  } catch { return []; }
}

export async function saveReview(review: any) {
  const reviews = await getReviews();
  const index = reviews.findIndex((r: any) => r.id === review.id);
  
  if (index > -1) {
    reviews[index] = review;
  } else {
    reviews.push({ ...review, id: `rev-${Date.now()}` });
  }
  
  await fs.writeFile(reviewsPath, JSON.stringify(reviews, null, 2));
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReview(id: string) {
  const reviews = await getReviews();
  const filtered = reviews.filter((r: any) => r.id !== id);
  await fs.writeFile(reviewsPath, JSON.stringify(filtered, null, 2));
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  return { success: true };
}
