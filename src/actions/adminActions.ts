"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function getProductsAdmin() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getProductsAdmin:", error);
    return [];
  }
}

export type UploadResult = 
  | { success: true; url: string } 
  | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("imageFile") as File;
    if (!file) return { success: false, error: "No file provided" };

    const filename = `appearance/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, file);

    if (error) {
      console.error("Upload error in product-images bucket:", error);
      throw new Error(`Critical asset upload failure: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error("Category image upload error:", error);
    return { success: false, error: error.message || "Failed to upload architectural asset" };
  }
}

// --- CATEGORIES ---
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(cat => ({
      ...cat,
      imageUrl: cat.image_url
    }));
  } catch { return []; }
}

export async function saveCategory(category: any) {
  try {
    const data = {
      title: typeof category.title === 'string' ? { en: category.title } : category.title,
      description: typeof category.description === 'string' ? { en: category.description } : category.description,
      price: Number(category.price),
      image_url: category.imageUrl
    };

    let error;
    // Check if category exists by ID (ignoring prefix requirement)
    if (category.id) {
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
      title: 'Master the Art of <span class="text-primary neon-text">Presentation Design</span>',
      subtitle: "Elevate your visual storytelling with our curated collection of architectural-grade presentation assets. Experience structural clarity and cinematic impact.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e5381bb6e?auto=format&fit=crop&q=80",
      badge: "THE PROFESSIONAL STANDARD"
    },
    about: {
      title: 'The Digital <span class="text-primary">Atelier</span>',
      description: "We are a specialized laboratory of digital architects, dedicated to engineering the most sophisticated presentation frameworks in the modern era.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
    },
    story: {
      title: `Beyond the <br /> <span class="text-primary">Standard</span>`,
      subtitle: "Elevating professional narratives into cinematic experiences of architectural clarity.",
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
    buttons: {
      primary: { label: "Buy Now", link: "/#catalog" },
      secondary: { label: "Learn More", link: "/#story" }
    },
    policies: {
      userAgreement: "Standard User Agreement text...",
      shipping: "Shipping Policy details...",
      refund: "Refund Policy details...",
      privacy: "Privacy Policy details...",
      terms: "Terms of Service details..."
    },
    customPpt: {
      price: 200,
      salePrice: 200,
      mrpPrice: 499,
      enabled: true,
      timelineText: "Your custom PPT will be completed within 7 days."
    },
    trust: {
      downloads: "1,200+",
      users: "500+",
      rating: "4.9/5",
      customOrders: "100+",
      animated: true
    },
    homepageLayout: [
      'hero',
      'trust',
      'featured',
      'bestsellers',
      'categories',
      'customPpt',
      'about',
      'story',
      'testimonials',
      'contact'
    ],
    sectionVisibility: {
      hero: true,
      trust: true,
      featured: true,
      bestsellers: true,
      categories: true,
      customPpt: true,
      about: true,
      story: true,
      testimonials: true,
      contact: true
    },
    featured: {
      heading: 'Premium <span class="text-primary">Featured</span> Additions',
      subtitle: 'The absolute elite in presentation architecture, curated for high-stakes impact.',
      productIds: []
    },
    bestsellers: {
      heading: 'Our <span class="text-primary">Bestsellers</span>',
      subtitle: 'Most Loved Templates by Our Customers.',
      productIds: []
    },
    categorySlider: {
      heading: 'Browse by <span class="text-primary">Intelligence</span>',
      subtitle: 'Discover specialized frameworks across diverse strategic sectors.',
      categoryIds: []
    },
    testimonials: {
      heading: 'Client <span class="text-primary">Intelligence</span>',
      subtitle: "Voices from the world's leading strategic innovators."
    }
  };

  try {
    const { data, error } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'global')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return defaultAppearance;
      throw error;
    }
    
    const dbData = data.data || {};
    return {
      ...defaultAppearance,
      ...dbData,
      hero: { ...defaultAppearance.hero, ...(dbData.hero || {}) },
      about: { ...defaultAppearance.about, ...(dbData.about || {}) },
      story: { ...defaultAppearance.story, ...(dbData.story || {}) },
      site: { ...defaultAppearance.site, ...(dbData.site || {}) },
      contact: { ...defaultAppearance.contact, ...(dbData.contact || {}) },
      buttons: { ...defaultAppearance.buttons, ...(dbData.buttons || {}) },
      policies: { ...defaultAppearance.policies, ...(dbData.policies || {}) },
      customPpt: { ...defaultAppearance.customPpt, ...(dbData.customPpt || {}) },
      trust: { ...defaultAppearance.trust, ...(dbData.trust || {}) },
      sectionVisibility: { ...defaultAppearance.sectionVisibility, ...(dbData.sectionVisibility || {}) },
      featured: { ...defaultAppearance.featured, ...(dbData.featured || {}) },
      bestsellers: { ...defaultAppearance.bestsellers, ...(dbData.bestsellers || {}) },
      categorySlider: { ...defaultAppearance.categorySlider, ...(dbData.categorySlider || {}) },
      testimonials: { ...defaultAppearance.testimonials, ...(dbData.testimonials || {}) }
    };
  } catch (error) {
    console.error("Error fetching appearance:", error);
    return defaultAppearance;
  }
}

export async function getAppearanceDraft() {
  // Use a local copy of defaultAppearance to avoid unnecessary async chain
  const defaultApp = await getAppearance(); 
  
  try {
    const { data, error } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'draft')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return defaultApp;
      console.error("Supabase error in getAppearanceDraft:", error);
      return defaultApp;
    }
    
    const dbData = data.data || {};
    // Deep merge logic...
    return {
      ...defaultApp,
      ...dbData,
      hero: { ...defaultApp.hero, ...(dbData.hero || {}) },
      about: { ...defaultApp.about, ...(dbData.about || {}) },
      story: { ...defaultApp.story, ...(dbData.story || {}) },
      site: { ...defaultApp.site, ...(dbData.site || {}) },
      contact: { ...defaultApp.contact, ...(dbData.contact || {}) },
      buttons: { ...defaultApp.buttons, ...(dbData.buttons || {}) },
      policies: { ...defaultApp.policies, ...(dbData.policies || {}) },
      customPpt: { ...defaultApp.customPpt, ...(dbData.customPpt || {}) },
      trust: { ...defaultApp.trust, ...(dbData.trust || {}) },
      sectionVisibility: { ...defaultApp.sectionVisibility, ...(dbData.sectionVisibility || {}) },
      featured: { ...defaultApp.featured, ...(dbData.featured || {}) },
      bestsellers: { ...defaultApp.bestsellers, ...(dbData.bestsellers || {}) },
      categorySlider: { ...defaultApp.categorySlider, ...(dbData.categorySlider || {}) },
      testimonials: { ...defaultApp.testimonials, ...(dbData.testimonials || {}) }
    };
  } catch (error) {
    console.error("Catch in getAppearanceDraft:", error);
    return defaultApp;
  }
}

export async function saveAppearanceDraft(data: any) {
  try {
    const { error } = await supabase
      .from('appearance')
      .upsert({ id: 'draft', data });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishAppearance(data: any) {
  try {
    // 1. Get current global as "previous"
    const current = await getAppearance();
    await supabase.from('appearance').upsert({ id: 'previous', data: current });

    // 2. Update global
    const { error } = await supabase
      .from('appearance')
      .upsert({ id: 'global', data });
    
    if (error) throw error;

    // 3. Update draft to match global
    await supabase.from('appearance').upsert({ id: 'draft', data });

    revalidatePath("/");
    revalidatePath("/admin/appearance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function revertAppearance() {
  try {
    const { data, error } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'previous')
      .single();
    
    if (error) throw error;
    
    await supabase.from('appearance').upsert({ id: 'global', data: data.data });
    await supabase.from('appearance').upsert({ id: 'draft', data: data.data });

    revalidatePath("/");
    revalidatePath("/admin/appearance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAppearance(data: any) {
  // Legacy support - just calls publish
  return await publishAppearance(data);
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

export async function addReview(reviewData: { userName: string; productId: string; comment: string; rating: number }) {
  try {
    const data = {
      id: `rev-${Date.now()}`,
      name: { en: reviewData.userName },
      role: { en: reviewData.productId },
      text: { en: reviewData.comment },
      code: "VERIFIED_BUYER",
      rating: Number(reviewData.rating),
      date: new Date().toLocaleDateString(),
      status: "approved"
    };

    const { error } = await supabase
      .from('reviews')
      .insert(data);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Add review error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

// --- COUPONS ---
export async function getCoupons() {
  try {
    const { data, error } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'global')
      .single();
    
    if (error) return [];
    return data?.data?.coupons || [];
  } catch {
    return [];
  }
}

export async function saveCoupon(coupon: any) {
  try {
    const { data: appData, error: fetchError } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'global')
      .single();

    const currentData = fetchError ? {} : (appData?.data || {});
    const existingCoupons = currentData.coupons || [];

    let newCoupons = [];
    if (coupon.id) {
      newCoupons = existingCoupons.map((c: any) => c.id === coupon.id ? coupon : c);
    } else {
      newCoupons = [...existingCoupons, { ...coupon, id: `cpn-${Date.now()}` }];
    }

    const { error } = await supabase
      .from('appearance')
      .upsert({ id: 'global', data: { ...currentData, coupons: newCoupons } });

    if (error) throw error;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Save coupon error:", error);
    return { success: false, error: "Failed to secure offer parameters." };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const { data: appData, error: fetchError } = await supabase
      .from('appearance')
      .select('data')
      .eq('id', 'global')
      .single();

    if (fetchError) throw fetchError;
    const currentData = appData.data || {};
    const existingCoupons = currentData.coupons || [];
    const newCoupons = existingCoupons.filter((c: any) => c.id !== id);

    const { error } = await supabase
      .from('appearance')
      .upsert({ id: 'global', data: { ...currentData, coupons: newCoupons } });

    if (error) throw error;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete coupon error:", error);
    return { success: false };
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
