"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
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
    const featuresStr = formData.get("features") as string;
    const driveLink = formData.get("driveLink") as string;
    const categoryId = formData.get("categoryId") as string;
    
    const imageUrls = formData.getAll("imageUrls") as string[];
    const images = imageUrls.filter(url => url && url.trim()).slice(0, 6);
    const faqs = (formData.getAll("questions") as string[]).map((q, i) => ({
      question: q.trim(),
      answer: (formData.getAll("answers") as string[])[i]?.trim() || ""
    })).filter(faq => faq.question && faq.answer).slice(0, 7);

    const newProduct = {
      id: `prod-${Date.now()}`,
      title: { en: title },
      description: { en: description },
      price: Number(price),
      category_id: categoryId,
      image_url: images[0] || "",
      images,
      features: featuresStr.split(',').map((f: string) => f.trim()).filter(Boolean),
      drive_link: driveLink,
      faqs,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('products').insert(newProduct);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, product: newProduct };
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to add product:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const featuresStr = formData.get("features") as string;
    const driveLink = formData.get("driveLink") as string;
    const categoryId = formData.get("categoryId") as string;
    
    const imageUrls = formData.getAll("imageUrls") as string[];
    const images = imageUrls.filter(url => url && url.trim()).slice(0, 6);
    const faqs = (formData.getAll("questions") as string[]).map((q, i) => ({
      question: q.trim(),
      answer: (formData.getAll("answers") as string[])[i]?.trim() || ""
    })).filter(faq => faq.question && faq.answer).slice(0, 7);

    const updateData: any = {
      title: { en: title },
      description: { en: description },
      price: Number(price),
      category_id: categoryId,
      features: featuresStr.split(',').map((f: string) => f.trim()).filter(Boolean),
      drive_link: driveLink,
      faqs
    };

    if (images.length > 0) {
      updateData.images = images;
      updateData.image_url = images[0];
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to update product:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to delete product:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete product" };
  }
}
