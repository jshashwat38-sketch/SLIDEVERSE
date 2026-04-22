"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type UploadResult = 
  | { success: true; url: string } 
  | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // Image uploads to local public/uploads will NOT work on Netlify.
  // Real implementation would use Supabase Storage.
  return { success: false, error: "Local uploads disabled for production. Please use external URLs." };
}

// --- CATEGORIES ---
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch { return []; }
}

export async function saveCategory(category: any) {
  try {
    const data = {
      title: category.title,
      description: category.description,
      price: Number(category.price),
      image_url: category.imageUrl
    };

    let error;
    if (category.id && category.id.startsWith('cat-')) {
      const { error: err } = await supabase
        .from('categories')
        .update(data)
        .eq('id', category.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('categories')
        .insert({ ...data, id: `cat-${Date.now()}` });
      error = err;
    }
    
    if (error) throw error;
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Save category error:", error);
    return { success: false, error: "Failed to save category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "System failure during category termination." };
  }
}

// --- APPEARANCE ---
export async function getAppearance() {
  const defaultAppearance = {
    hero: {
      title: "Design the Future of Presentations",
      subtitle: "Discover, share, and monetize premium presentation assets.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e5381bb6e?auto=format&fit=crop&q=80",
      badge: "V1.0 LIVE"
    },
    about: {
      title: "The Creative Atelier",
      description: "We are a collective of designers and curators dedicated to elevating the digital asset landscape.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
    },
    story: {
      title: "Our Genesis",
      subtitle: "Born from the need for a more curated presentation ecosystem.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
    },
    site: {
      logo: "/logo.png",
      name: "Slideverse"
    },
    contact: {
      email: "support@slideverse.pro",
      mobile: "+91 99999 99999"
    },
    policies: {
      userAgreement: "Standard User Agreement text...",
      shipping: "Shipping Policy details...",
      refund: "Refund Policy details...",
      privacy: "Privacy Policy details...",
      terms: "Terms of Service details..."
    }
  };

  try {
    const { data, error } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'global')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return defaultAppearance;
      }
      throw error;
    }
    
    // Merge database data with defaults to ensure all fields exist
    return {
      ...defaultAppearance,
      ...(data.data || {}),
      hero: { ...defaultAppearance.hero, ...(data.data?.hero || {}) },
      about: { ...defaultAppearance.about, ...(data.data?.about || {}) },
      story: { ...defaultAppearance.story, ...(data.data?.story || {}) },
      site: { ...defaultAppearance.site, ...(data.data?.site || {}) },
      contact: { ...defaultAppearance.contact, ...(data.data?.contact || {}) },
      policies: { ...defaultAppearance.policies, ...(data.data?.policies || {}) }
    };

  } catch (error) {
    console.error("Error fetching appearance:", error);
    return defaultAppearance;
  }
}


export async function updateAppearance(data: any) {
  try {
    const { error } = await supabase
      .from('appearance')
      .upsert({ id: 'global', data });
    
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/appearance");
    return { success: true };
  } catch (error) {
    console.error("Update appearance error:", error);
    return { success: false, error: "Failed to update appearance" };
  }
}

// --- REVIEWS ---
export async function getReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch { return []; }
}

export async function saveReview(review: any) {
  try {
    const data = {
      name: review.name,
      rating: Number(review.rating),
      comment: review.comment,
      date: review.date || new Date().toLocaleDateString(),
      status: review.status || "pending"
    };

    let error;
    if (review.id && review.id.startsWith('rev-')) {
      const { error: err } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', review.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('reviews')
        .insert({ ...data, id: `rev-${Date.now()}` });
      error = err;
    }
    
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Save review error:", error);
    return { success: false, error: "Failed to save review" };
  }
}

export async function deleteReview(id: string) {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "System failure during review termination." };
  }
}

// --- GRIEVANCES ---
export async function getGrievances() {
  try {
    const { data, error } = await supabase
      .from('grievances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch { return []; }
}

export async function saveGrievance(grievance: any) {
  try {
    const newGrievance = {
      id: `grv-${Date.now()}`,
      name: grievance.name,
      email: grievance.email,
      subject: grievance.subject,
      message: grievance.message,
      status: "pending",
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('grievances').insert(newGrievance);
    if (error) throw error;

    revalidatePath("/admin/grievances");
    return { success: true };
  } catch (error) {
    console.error("Save grievance error:", error);
    return { success: false, error: "Failed to save grievance" };
  }
}

export async function deleteGrievance(id: string) {
  try {
    const { error } = await supabase
      .from('grievances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    revalidatePath("/admin/grievances");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete grievance:", error);
    return { success: false, error: "System failure during grievance termination." };
  }
}
