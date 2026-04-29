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
    
    const variantNames = formData.getAll("variantNames") as string[];
    const variantPrices = formData.getAll("variantPrices") as string[];
    const variantDriveLinks = formData.getAll("variantDriveLinks") as string[];
    const variantImageUrls = formData.getAll("variantImageUrls") as string[];
    const variantImageFiles = formData.getAll("variantImageFiles") as File[];
    
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

    const variants = [];
    for (let i = 0; i < variantNames.length; i++) {
      // Process all variants sent from the frontend
      
      let variantImage = variantImageUrls[i] || "";
      const file = variantImageFiles[i];
      
      if (file && file.size > 0 && file.name !== "empty") {
        const filename = `variants/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filename);
          variantImage = publicUrlData.publicUrl;
        }
      }

      variants.push({
        name: variantNames[i].trim(),
        price: Number(variantPrices[i]) || 0,
        drive_link: variantDriveLinks[i] || "",
        image: variantImage
      });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      title: { 
        en: title, 
        mrp: Number(formData.get("mrp") || 0),
        is_bestseller: formData.get("isBestseller") === "true",
        is_top9: formData.get("isTop9") === "true"
      }, 
      description: { en: description }, 
      price: Number(price),
      category_id: categoryId,
      image_url: finalImages[0] || "",
      images: finalImages,
      features: features.split(',').map((f: string) => f.trim()).filter(Boolean),
      drive_link: driveLink,
      faqs: faqs,
      variants: variants
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
    return { success: false, error: error instanceof Error ? error.message : "Failed to add product" };
  }
}

export async function addBundle(bundleData: any) {
  try {
    const id = `bundle-${Date.now()}`;
    const newBundle = {
      id,
      title: { 
        en: bundleData.title, 
        mrp: Number(bundleData.mrp || 0),
        is_bestseller: bundleData.isBestseller,
        is_top9: bundleData.isTop9,
        is_bundle: true,
        bundle_items: bundleData.bundleItems || []
      },
      description: { en: bundleData.description || "" },
      price: Number(bundleData.price || 0),
      category_id: bundleData.categoryId || null,
      image_url: bundleData.imageUrl || "",
      images: [bundleData.imageUrl].filter(Boolean),
      features: typeof bundleData.features === 'string' ? bundleData.features.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
      drive_link: bundleData.driveLink || "",
      faqs: [],
      variants: []
    };

    const { error } = await supabase
      .from("products")
      .insert([newBundle]);

    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin/bundles");
    return { success: true, product: newBundle };
  } catch (error) {
    console.error("Error adding bundle:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create bundle" };
  }
}

export async function updateBundle(id: string, bundleData: any) {
  try {
    const updatedBundle: any = {
      title: { 
        en: bundleData.title, 
        mrp: Number(bundleData.mrp || 0),
        is_bestseller: bundleData.isBestseller,
        is_top9: bundleData.isTop9,
        is_bundle: true,
        bundle_items: bundleData.bundleItems || []
      },
      description: { en: bundleData.description || "" },
      price: Number(bundleData.price || 0),
      category_id: bundleData.categoryId || null,
      drive_link: bundleData.driveLink || ""
    };

    if (bundleData.imageUrl) {
      updatedBundle.image_url = bundleData.imageUrl;
      updatedBundle.images = [bundleData.imageUrl];
    }

    if (typeof bundleData.features === 'string') {
      updatedBundle.features = bundleData.features.split(',').map((f: string) => f.trim()).filter(Boolean);
    }

    const { error } = await supabase
      .from("products")
      .update(updatedBundle)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin/bundles");
    return { success: true };
  } catch (error) {
    console.error("Error updating bundle:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update bundle" };
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
    
    const variantNames = formData.getAll("variantNames") as string[];
    const variantPrices = formData.getAll("variantPrices") as string[];
    const variantDriveLinks = formData.getAll("variantDriveLinks") as string[];
    const variantImageUrls = formData.getAll("variantImageUrls") as string[];
    const variantImageFiles = formData.getAll("variantImageFiles") as File[];
    
    const finalImages: string[] = [];

    imageUrls.forEach(url => {
      if (url && url.trim()) finalImages.push(url.trim());
    });

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
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

    const variants = [];
    for (let i = 0; i < variantNames.length; i++) {
      // Process all variants sent from the frontend
      
      let variantImage = variantImageUrls[i] || "";
      const file = variantImageFiles[i];
      
      if (file && file.size > 0 && file.name !== "empty") {
        const filename = `variants/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filename);
          variantImage = publicUrlData.publicUrl;
        }
      }

      variants.push({
        name: variantNames[i].trim(),
        price: Number(variantPrices[i]) || 0,
        drive_link: variantDriveLinks[i] || "",
        image: variantImage
      });
    }

    const updateData: any = {
      title: { 
        en: title, 
        mrp: Number(formData.get("mrp") || 0),
        is_bestseller: formData.get("isBestseller") === "true",
        is_top9: formData.get("isTop9") === "true"
      },
      description: { en: description },
      price: Number(price),
      category_id: categoryId,
      features: features.split(',').map((f: string) => f.trim()).filter(Boolean),
      drive_link: driveLink,
      faqs: faqs,
      variants: variants
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
    return { success: false, error: error instanceof Error ? error.message : "Failed to update product" };
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
