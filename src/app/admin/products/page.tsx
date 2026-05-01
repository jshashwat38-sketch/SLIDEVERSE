"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Image as ImageIcon, Link as LinkIcon, AlertCircle, Package, FolderOpen, Trash2, Edit2, X, Sparkles } from "lucide-react";
import { addProduct, getProducts, updateProduct, deleteProduct } from "@/actions/productActions";
import { getCategories } from "@/actions/adminActions";
import { toast } from "react-hot-toast";
import { compressImage } from "@/utils/imageUtils";

export default function ProductsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    driveLink: "",
    features: "",
    categoryId: "",
    isBestseller: false,
    isTop9: false,
    mrp: ""
  });

  const [imageUrls, setImageUrls] = useState<string[]>(["", "", "", "", "", ""]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null, null]);
  
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>(Array(7).fill({question: "", answer: ""}));
  const [variants, setVariants] = useState<{name: string, price: string, driveLink: string, imageUrl: string, imageFile: File | null}[]>([]);

  useEffect(() => {
    fetchProducts();
    getCategories().then((data) => {
      setCategories(data);
      if (data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      }
    });
  }, []); // Run only on mount to prevent infinite loop

  const fetchProducts = async () => {
    const data = await getProducts();
    // Exclude bundles from the products list
    const filtered = data.filter((p: any) => !(typeof p.title === 'object' && p.title?.is_bundle));
    setProducts(filtered);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", description: "", price: "", driveLink: "", features: "", categoryId: categories[0]?.id || "", isBestseller: false, isTop9: false, mrp: "" });
    setImageUrls(["", "", "", "", "", ""]);
    setImageFiles([null, null, null, null, null, null]);
    setFaqs(Array.from({ length: 7 }, () => ({ question: "", answer: "" })));
    setVariants([]);
  };

  const handleEditClick = (product: any) => {
    setFormData({
      title: typeof product.title === 'object' && product.title !== null ? (product.title.en || Object.values(product.title)[0] || "") : (product.title || ""),
      description: typeof product.description === 'object' && product.description !== null ? (product.description.en || Object.values(product.description)[0] || "") : (product.description || ""),
      price: product.price ? product.price.toString() : "",
      driveLink: product.drive_link || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : "",
      categoryId: product.category_id || "",
      isBestseller: product.is_bestseller || (typeof product.title === 'object' && product.title?.is_bestseller) || false,
      isTop9: product.is_top9 || (typeof product.title === 'object' && product.title?.is_top9) || false,
      mrp: typeof product.title === 'object' && product.title !== null ? (product.title.mrp || "").toString() : ""
    });
    
    const existingImages = product.images || [product.image_url];
    const newUrls = ["", "", "", "", "", ""];
    existingImages.forEach((url: string, i: number) => {
      if (i < 6) newUrls[i] = url;
    });
    
    const existingFaqs = product.faqs || [];
    const newFaqs = Array.from({ length: 7 }, () => ({ question: "", answer: "" }));
    existingFaqs.forEach((faq: any, i: number) => {
      if (i < 7) newFaqs[i] = faq;
    });
    
    setImageUrls(newUrls);
    setImageFiles([null, null, null, null, null, null]);
    setFaqs(newFaqs);
    setVariants(product.variants?.map((v: any) => ({
      name: v.name || "",
      price: v.price?.toString() || "",
      driveLink: v.drive_link || "",
      imageUrl: v.image || "",
      imageFile: null
    })) || []);
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete request initiated for entity:", id);
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Entity purged from matrix.");
      setProductToDelete(null);
      await fetchProducts();
    } else {
      toast.error(`Purge failed: ${res.error || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting product submission protocol...");
    
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("features", formData.features);
      data.append("driveLink", formData.driveLink);
      data.append("categoryId", formData.categoryId);
      data.append("isBestseller", String(formData.isBestseller));
      data.append("mrp", formData.mrp);
      
      console.log("Form data assembled. Title:", formData.title);

      imageUrls.forEach(url => {
        if (url) data.append("imageUrls", url);
      });
      
      imageFiles.forEach(file => {
        if (file) data.append("imageFiles", file);
      });

      faqs.forEach(faq => {
        if (faq.question && faq.answer) {
          data.append("questions", faq.question);
          data.append("answers", faq.answer);
        }
      });

      variants.forEach(v => {
        if (v.name || v.price || v.driveLink || v.imageUrl || v.imageFile) {
          data.append("variantNames", v.name);
          data.append("variantPrices", v.price);
          data.append("variantDriveLinks", v.driveLink || "");
          data.append("variantImageUrls", v.imageUrl || "");
          if (v.imageFile) data.append("variantImageFiles", v.imageFile);
          else data.append("variantImageFiles", new File([], "empty")); // Placeholder to maintain index alignment
        }
      });
      
      setIsSubmitting(true);
      console.log("Invoking server action...");
      const res = editingId ? await updateProduct(editingId, data) : await addProduct(data);
      console.log("Server action response received:", res);
      
      if (res.success) {
        console.log("Submission successful. Resetting form.");
        toast.success(editingId ? "Product updated successfully!" : "Product deployed successfully!");
        await fetchProducts(); // Refresh list first
        resetForm(); // Then close form
      } else {
        console.error("Server action failed:", res.error);
        toast.error(`Failed to ${editingId ? 'update' : 'save'} product: ${res.error || 'Unknown error'}`);
      }
      setIsSubmitting(false);
    } catch (err) {
      console.error("Client-side submission error:", err);
      setIsSubmitting(false);
      alert("A critical error occurred during submission. Check the console.");
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Product <span className="text-primary neon-text">Catalog</span></h1>
          <p className="text-zinc-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Manage your digital inventory and cloud delivery links.</p>
        </div>
        <button 
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,165,114,0.2)] hover:shadow-[0_0_25px_rgba(197,165,114,0.4)] hover:-translate-y-0.5 uppercase tracking-widest text-xs"
        >
          {isAdding ? "Cancel Operation" : <><Plus className="w-5 h-5" /> Deploy Product</>}
        </button>
      </div>

      {isAdding ? (
        <div className="bg-[#09090B] rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden mb-12 relative group mx-4 pb-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-black text-white italic uppercase tracking-widest">{editingId ? 'Modify Product Entity' : 'New Product Deployment'}</h2>
          </div>
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-16 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Product Name</label>
                  <input
                    type="text"
                    value={(() => {
                      const val = formData.title;
                      return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-bold uppercase text-sm"
                    placeholder="E.G. TITAN SLIDE DECK"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Classification
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white appearance-none cursor-pointer uppercase font-black text-xs tracking-[0.2em]"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {typeof cat.title === 'object' && cat.title !== null ? (((cat.title as any).en || Object.values(cat.title)[0] || "Unclassified") as string).toUpperCase() : (cat.title as string || "UNCLASSIFIED").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Entity Description</label>
                  <textarea
                    rows={3}
                    value={(() => {
                      const val = formData.description;
                      return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 resize-none font-medium text-sm leading-relaxed"
                    placeholder="PROVIDE SYSTEM SPECIFICATIONS..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">MRP Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mrp}
                    onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono text-lg font-black italic"
                    placeholder="000.00"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono text-lg font-black italic"
                    placeholder="000.00"
                  />
                  {Number(formData.mrp) > Number(formData.price) && (
                    <span className="text-xs text-primary font-bold ml-4 mt-2 inline-block">
                      🏷️ {Math.round(((Number(formData.mrp) - Number(formData.price)) / Number(formData.mrp)) * 100)}% DISCOUNT DETECTED
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Core Features (CSV)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-bold text-sm"
                    placeholder="FEATURE A, FEATURE B..."
                  />
                </div>

                <div className="md:col-span-2 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 ml-2">Storefront Assignment</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isBestseller: !formData.isBestseller, isTop9: false})}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${formData.isBestseller ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_20px_rgba(197,165,114,0.1)]' : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${formData.isBestseller ? 'bg-primary text-black' : 'bg-white/5'}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black uppercase tracking-widest mb-1">Bestsellers</div>
                          <div className="text-[10px] opacity-60 font-medium">Show in premium matrix</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.isBestseller ? 'border-primary bg-primary' : 'border-white/10'}`}>
                        {formData.isBestseller && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isTop9: !formData.isTop9, isBestseller: false})}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${formData.isTop9 ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_20px_rgba(197,165,114,0.1)]' : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${formData.isTop9 ? 'bg-primary text-black' : 'bg-white/5'}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black uppercase tracking-widest mb-1">Featured Additions</div>
                          <div className="text-[10px] opacity-60 font-medium">Show in primary showcase</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.isTop9 ? 'border-primary bg-primary' : 'border-white/10'}`}>
                        {formData.isTop9 && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                    </button>
                  </div>
                  <p className="mt-4 ml-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Select one section or leave both unselected for standard catalog placement.</p>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Visual Inventory</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex flex-col gap-3 max-w-md">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Cover Image (Recommended: 1200x800px)</span>
                        {imageUrls[0] || imageFiles[0] ? (
                          <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Active</span>
                        ) : (
                          <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest bg-white/[0.02] px-2 py-0.5 rounded-full border border-white/5">Required</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                compressImage(file).then(optimized => {
                                  setImageFiles(prev => {
                                    const next = [...prev];
                                    next[0] = optimized;
                                    return next;
                                  });
                                  setImageUrls(prev => {
                                    const next = [...prev];
                                    next[0] = "";
                                    return next;
                                  });
                                });
                              }
                            }}
                            className="hidden"
                            id="image-upload-cover"
                          />
                          <label 
                            htmlFor="image-upload-cover"
                            className={`flex items-center justify-center w-16 h-16 rounded-2xl cursor-pointer transition-all border overflow-hidden ${imageFiles[0] || imageUrls[0] ? 'border-primary shadow-[0_0_15px_rgba(197,165,114,0.3)]' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-primary/30 hover:bg-primary/5'}`}
                          >
                            {imageFiles[0] || imageUrls[0] ? (
                              <img src={imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : imageUrls[0]} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6" />
                            )}
                          </label>
                        </div>
                        <input
                          type="url"
                          value={imageUrls[0]}
                          onChange={(e) => {
                            const newUrls = [...imageUrls];
                            newUrls[0] = e.target.value;
                            setImageUrls(newUrls);
                            const newFiles = [...imageFiles];
                            newFiles[0] = null;
                            setImageFiles(newFiles);
                          }}
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/40 text-xs text-white placeholder:text-zinc-600"
                          placeholder="Paste image URL here..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 mt-8">
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Gallery Assets</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-12">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between px-2">
                          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                            Gallery Asset {index} (Rec: 1200x800px)
                          </span>
                          {imageUrls[index] || imageFiles[index] ? (
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Active</span>
                          ) : (
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest bg-white/[0.02] px-2 py-0.5 rounded-full border border-white/5">Optional</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  compressImage(file).then(optimized => {
                                    setImageFiles(prev => {
                                      const next = [...prev];
                                      next[index] = optimized;
                                      return next;
                                    });
                                    setImageUrls(prev => {
                                      const next = [...prev];
                                      next[index] = "";
                                      return next;
                                    });
                                  });
                                }
                              }}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <label 
                              htmlFor={`image-upload-${index}`}
                              className={`flex items-center justify-center w-16 h-16 rounded-2xl cursor-pointer transition-all border overflow-hidden ${imageFiles[index] || imageUrls[index] ? 'border-primary shadow-[0_0_15px_rgba(197,165,114,0.3)]' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-primary/30 hover:bg-primary/5'}`}
                            >
                              {imageFiles[index] || imageUrls[index] ? (
                                <img src={imageFiles[index] ? URL.createObjectURL(imageFiles[index]) : imageUrls[index]} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6" />
                              )}
                            </label>
                          </div>
                          <input
                            type="url"
                            value={imageUrls[index]}
                            onChange={(e) => {
                              const newUrls = [...imageUrls];
                              newUrls[index] = e.target.value;
                              setImageUrls(newUrls);
                              const newFiles = [...imageFiles];
                              newFiles[index] = null;
                              setImageFiles(newFiles);
                            }}
                            className="flex-1 px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs font-bold"
                            placeholder="PASTE REMOTE URL..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Intelligence Matrix (FAQs)</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <div className="space-y-8">
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] p-6 rounded-[2rem] border border-white/5 group/faq transition-all hover:bg-white/[0.03] hover:border-white/10">
                        <div className="md:col-span-1">
                          <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">Question {index + 1}</label>
                          <input
                            type="text"
                            value={faqs[index].question}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                              setFaqs(newFaqs);
                            }}
                            className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-bold text-xs"
                            placeholder="QUERY IDENTIFIER..."
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">Resolution {index + 1}</label>
                          <input
                            type="text"
                            value={faqs[index].answer}
                            onChange={(e) => {
                              const newFaqs = [...faqs];
                              newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                              setFaqs(newFaqs);
                            }}
                            className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium text-xs"
                            placeholder="SYSTEM RESPONSE..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>


                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Product Variations</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <div className="space-y-6 mb-12">
                    {(variants || []).map((variant, index) => (
                      <div key={index} className="flex flex-col gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative group/variant transition-all hover:bg-white/[0.04]">
                        <button 
                          type="button"
                          onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/variant:opacity-100 transition-opacity hover:bg-red-500 hover:text-black z-20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">Variant Identifier</label>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index] = { ...newVariants[index], name: e.target.value };
                                setVariants(newVariants);
                              }}
                              className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-bold text-xs"
                              placeholder="E.G. PREMIUM EDITION"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">Surcharge Value (₹)</label>
                            <input
                              type="number"
                              value={variant.price || ""}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index] = { ...newVariants[index], price: e.target.value };
                                setVariants(newVariants);
                              }}
                              className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono text-xs"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">Variant Asset (URL or Upload)</label>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`variant-img-${index}`}
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      const file = e.target.files[0];
                                      compressImage(file).then(optimized => {
                                        setVariants(prev => {
                                          const next = [...prev];
                                          next[index] = { ...next[index], imageFile: optimized, imageUrl: "" };
                                          return next;
                                        });
                                      });
                                    }
                                  }}
                                />
                                <label 
                                  htmlFor={`variant-img-${index}`}
                                  className={`flex items-center justify-center w-12 h-12 rounded-xl border cursor-pointer transition-all ${variant.imageFile ? 'bg-primary text-black border-primary' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-primary/40'}`}
                                >
                                  <ImageIcon className="w-5 h-5" />
                                </label>
                              </div>
                              <input
                                type="url"
                                value={variant.imageUrl || ""}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[index] = { ...newVariants[index], imageUrl: e.target.value, imageFile: null };
                                  setVariants(newVariants);
                                }}
                                className="flex-1 px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-xs"
                                placeholder="ASSET URL..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">Variant Delivery Link</label>
                            <input
                              type="url"
                              value={variant.driveLink || ""}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index] = { ...newVariants[index], driveLink: e.target.value };
                                setVariants(newVariants);
                              }}
                              className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono text-xs"
                              placeholder="CLOUDFLARE/DRIVE LINK..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setVariants([...variants, { name: "", price: "", driveLink: "", imageUrl: "", imageFile: null }])}
                      className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-zinc-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 uppercase font-black text-[10px] tracking-widest"
                    >
                      <Plus className="w-4 h-4" /> Add Variation Segment
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Deployment Protocol</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Secure Delivery Link (Cloud Storage)
                  </label>
                  <input
                    type="url"
                    value={formData.driveLink}
                    onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                    className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono text-sm"
                    placeholder="HTTPS://DRIVE.GOOGLE.COM/..."
                  />
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors"
                >
                  Terminate
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-[0_0_20px_rgba(197,165,114,0.3)] hover:shadow-[0_0_50px_rgba(197,165,114,0.5)] hover:-translate-y-1 uppercase tracking-widest italic ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? "Processing..." : "Execute Deployment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-[#09090B] rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden mx-4">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
                    <th className="p-10">Entity Asset</th>
                    <th className="p-10">Market Value</th>
                    <th className="p-10">System ID</th>
                    <th className="p-10 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-10">
                        <div className="flex items-center gap-8">
                          <div className="w-32 h-20 rounded-[1.2rem] overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all shadow-2xl relative shrink-0">
                            <img 
                              src={product.image_url || product.imageUrl || (product.images && product.images[0]) || "https://placehold.co/400x400?text=No+Asset"} 
                              alt="" 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Broken+Asset";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tighter italic text-xl group-hover:text-primary transition-colors">
                              {typeof product.title === 'object' && product.title !== null ? ((product.title as any).en || Object.values(product.title)[0] || "") : (product.title || "")}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                {(() => {
                                  const category = categories.find(c => c.id === product.category_id);
                                  if (!category) return "Unclassified";
                                  const title = category.title;
                                  return (typeof title === 'object' && title !== null ? ((title as any).en || Object.values(title)[0] || "Unclassified") : (title || "Unclassified")).toUpperCase();
                                })()}
                              </p>
                              {product.is_bestseller && (
                                <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 tracking-widest uppercase">Bestseller</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-10">
                        <span className="font-mono text-2xl text-white font-black italic tracking-tighter">₹{product.price}</span>
                      </td>
                      <td className="p-10">
                        <span className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.2em]">{product.id}</span>
                      </td>
                      <td className="p-10 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="p-3 text-zinc-500 hover:text-primary bg-white/5 hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/30 group/btn"
                              title="Edit Product"
                            >
                              <Edit2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            
                            {productToDelete === product.id ? (
                              <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                                <button 
                                  onClick={() => handleDelete(product.id)}
                                  className="px-4 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                                >
                                  Confirm
                                </button>
                                <button 
                                  onClick={() => setProductToDelete(null)}
                                  className="p-3 bg-white/10 text-zinc-400 rounded-xl hover:text-white transition-all border border-white/5"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setProductToDelete(product.id)}
                                className="p-3 text-zinc-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30 group/btn"
                                title="Delete Product"
                              >
                                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                              </button>
                            )}
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 animate-pulse relative">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
                <Package className="w-10 h-10 text-zinc-700 relative z-10" />
              </div>
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-[0.2em] italic">System Repository Empty</h3>
              <p className="text-zinc-500 max-w-sm mb-12 font-medium uppercase text-[10px] tracking-widest leading-relaxed">
                No custom product entities detected in the current sector. Initialize your first deployment to populate the matrix.
              </p>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-[0_0_20px_rgba(197,165,114,0.2)] uppercase tracking-widest italic"
              >
                Create First Entry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
