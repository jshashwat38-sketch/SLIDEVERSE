"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export async function addProduct(formData: FormData) {
  try {
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
    
    const finalImages: string[] = [];

    // 1. Handle URL images
    imageUrls.forEach(url => {
      if (url && url.trim()) finalImages.push(url.trim());
    });

    // 2. Handle File uploads to Supabase Storage
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filename);

        finalImages.push(publicUrlData.publicUrl);
      }
    }

    const faqs = questions.map((q, i) => ({
      question: q.trim(),
      answer: answers[i]?.trim() || ""
    })).filter(faq => faq.question && faq.answer);

    const newProduct = {
      id: `prod-${Date.now()}`,
      title: { en: title }, // Match JSONB schema
      description: { en: description }, // Match JSONB schema if applicable
      price: Number(price),
      category_id: categoryId,
      image_url: finalImages[0] || "",
      images: finalImages,
      features: features.split(',').map((f: string) => f.trim()).filter(Boolean),
      drive_link: driveLink,
      faqs: faqs
    };
    
    const { error: insertError } = await supabase
      .from("products")
      .insert([newProduct]);

    if (insertError) throw insertError;

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
    
    const finalImages: string[] = [];

    imageUrls.forEach(url => {
      if (url && url.trim()) finalImages.push(url.trim());
    });

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filename);
          finalImages.push(publicUrlData.publicUrl);
        }
      }
    }

    const faqs = questions.map((q, i) => ({
      question: q.trim(),
      answer: answers[i]?.trim() || ""
    })).filter(faq => faq.question && faq.answer);

    const updateData: any = {
      title: { en: title },
      description: { en: description },
      price: Number(price),
      category_id: categoryId,
      features: features.split(',').map((f: string) => f.trim()).filter(Boolean),
      drive_link: driveLink,
      faqs: faqs
    };

    if (finalImages.length > 0) {
      updateData.images = finalImages;
      updateData.image_url = finalImages[0];
    }

    const { error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
