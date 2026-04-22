"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const dataFilePath = path.join(process.cwd(), "src", "data", "products.json");

export async function getProducts() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export async function addProduct(formData: FormData) {
  try {
    const products = await getProducts();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const features = formData.get("features") as string;
    const driveLink = formData.get("driveLink") as string;
    const categoryId = formData.get("categoryId") as string;
    
    const imageUrls = formData.getAll("imageUrls") as string[];
    const imageFiles = formData.getAll("imageFiles") as File[];
    
    const questions = formData.getAll("questions") as string[];
    const answers = formData.getAll("answers") as string[];
    
    const images: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    imageUrls.forEach(url => {
      if (url && url.trim()) images.push(url.trim());
    });

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        images.push(`/uploads/${filename}`);
      }
    }

    const faqs = questions.map((q, i) => ({
      question: q.trim(),
      answer: answers[i]?.trim() || ""
    })).filter(faq => faq.question && faq.answer).slice(0, 7);

    const newProduct = {
      title,
      description,
      driveLink,
      categoryId,
      images: images.slice(0, 6),
      imageUrl: images[0] || "",
      faqs,
      id: `prod-${Date.now()}`,
      price: Number(price),
      features: features.split(',').map((f: string) => f.trim()).filter(Boolean)
    };
    
    products.push(newProduct);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to add product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const products = await getProducts();
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) return { success: false, error: "Product not found" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const features = formData.get("features") as string;
    const driveLink = formData.get("driveLink") as string;
    const categoryId = formData.get("categoryId") as string;
    
    const imageUrls = formData.getAll("imageUrls") as string[];
    const imageFiles = formData.getAll("imageFiles") as File[];

    const questions = formData.getAll("questions") as string[];
    const answers = formData.getAll("answers") as string[];
    
    const images: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    imageUrls.forEach(url => {
      if (url && url.trim()) images.push(url.trim());
    });

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        images.push(`/uploads/${filename}`);
      }
    }

    const finalImages = images.length > 0 ? images.slice(0, 6) : (products[index].images || [products[index].imageUrl]);

    const faqs = questions.map((q, i) => ({
      question: q.trim(),
      answer: answers[i]?.trim() || ""
    })).filter(faq => faq.question && faq.answer).slice(0, 7);

    products[index] = {
      ...products[index],
      title,
      description,
      driveLink,
      categoryId,
      images: finalImages,
      imageUrl: finalImages[0] || "",
      faqs: faqs.length > 0 ? faqs : products[index].faqs,
      price: Number(price),
      features: features.split(',').map((f: string) => f.trim()).filter(Boolean)
    };
    
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, product: products[index] };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const products = await getProducts();
    const newProducts = products.filter((p: any) => p.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(newProducts, null, 2));
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
