"use client";

import { useState, useEffect } from "react";
import { getCategories, saveCategory, deleteCategory, uploadImage } from "@/actions/adminActions";
import { Plus, Edit, Trash2, Save, X, ImageIcon, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", price: 499, imageUrl: "" });
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Client-side compression to speed up upload
      const compressedFile = await new Promise<File>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const newFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                resolve(file);
              }
            }, 'image/jpeg', 0.8);
          };
          img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
      });

      const uploadFormData = new FormData();
      uploadFormData.append("imageFile", compressedFile);

      const result = await uploadImage(uploadFormData);
      if (result.success && result.url) {
        if (editingCategory) {
          setEditingCategory({ ...editingCategory, imageUrl: result.url });
        } else {
          setFormData({ ...formData, imageUrl: result.url });
        }
        toast.success("Asset optimized and uploaded.");
      } else {
        toast.error(result.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Compression error:", err);
      toast.error("Failed to process image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const result = await saveCategory(editingCategory || formData);
    if (result.success) {
      setEditingCategory(null);
      setIsAdding(false);
      setFormData({ title: "", description: "", price: 499, imageUrl: "" });
      loadCategories();
      toast.success("Category state committed.");
    } else {
      toast.error(result.error || "Failed to save category.");
    }
  }

  async function handleDelete(id: string) {
    console.log("Delete request initiated for category:", id);
    const result = await deleteCategory(id);
    if (result.success) {
      toast.success("Category vault updated.");
      setCategoryToDelete(null);
      loadCategories();
    } else {
      toast.error("Category termination failed.");
    }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Category <span className="text-primary">Vault</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight mt-2">Manage architectural taxonomies and pricing tiers.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center gap-3 uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> Initialize New Category
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingCategory) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Category Designation</label>
                  <input 
                    required
                    value={(() => {
                      const val = editingCategory ? editingCategory.title : formData.title;
                      return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, title: e.target.value}) : setFormData({...formData, title: e.target.value})}
                    placeholder="E.G. REAL ESTATE..." 
                    className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-6 py-4 text-zinc-900 dark:text-white text-sm font-bold uppercase focus:outline-none focus:bg-white dark:focus:bg-black focus:border-primary transition-all placeholder:text-zinc-400" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Base Valuation (₹)</label>
                  <input 
                    type="number"
                    required
                    value={editingCategory ? editingCategory.price : formData.price}
                    onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, price: Number(e.target.value)}) : setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-6 py-4 text-zinc-900 dark:text-white text-sm font-bold uppercase focus:outline-none focus:bg-white dark:focus:bg-black focus:border-primary transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Structural Description</label>
                <textarea 
                  required
                  rows={2}
                  value={(() => {
                    const val = editingCategory ? editingCategory.description : formData.description;
                    return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                  })()}
                  onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, description: e.target.value}) : setFormData({...formData, description: e.target.value})}
                  placeholder="TAXONOMY DETAILS..." 
                  className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-6 py-4 text-zinc-900 dark:text-white text-sm font-bold uppercase focus:outline-none focus:bg-white dark:focus:bg-black focus:border-primary transition-all placeholder:text-zinc-400 resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Visual Asset (Recommended: 800x800px)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input 
                      value={editingCategory ? editingCategory.imageUrl : formData.imageUrl}
                      onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, imageUrl: e.target.value}) : setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="HTTPS://IMAGE-URL.COM..." 
                      className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-6 py-4 text-zinc-900 dark:text-white text-sm font-bold focus:outline-none focus:bg-white dark:focus:bg-black focus:border-primary transition-all placeholder:text-zinc-400" 
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <div className="w-full bg-white/5 border border-dashed border-white/10 rounded-xl px-6 py-4 text-zinc-500 text-xs font-bold uppercase flex items-center justify-center gap-3">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4" />}
                        {uploading ? "Uploading Architecture..." : "Upload Local Asset"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative group">
                    {(editingCategory?.imageUrl || formData.imageUrl) ? (
                      <img 
                        src={editingCategory ? editingCategory.imageUrl : formData.imageUrl} 
                        className="w-full h-full object-cover" 
                        alt="Preview" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-700">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-[8px] font-black uppercase tracking-widest">No Asset Loaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="bg-primary text-black px-4 md:px-10 py-3 md:py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto cursor-pointer">
                  <Save className="w-4 h-4" /> Commit Changes
                </button>
                <button type="button" onClick={() => { setEditingCategory(null); setIsAdding(false); }} className="bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 md:px-10 py-3 md:py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-zinc-200 dark:border-white/5 w-full sm:w-auto cursor-pointer">
                  <X className="w-4 h-4" /> Abort
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-card/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
              <button onClick={() => setEditingCategory(category)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-blue-400 hover:bg-blue-400/20 transition-all border border-white/10">
                <Edit className="w-4 h-4" />
              </button>
              
              {categoryToDelete === category.id ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setCategoryToDelete(null)}
                    className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-zinc-400 hover:text-white transition-all border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setCategoryToDelete(category.id)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-red-400 hover:bg-red-400/20 transition-all border border-white/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {category.imageUrl && (
              <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-30 transition-opacity">
                <img src={category.imageUrl} className="w-full h-full object-cover grayscale" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>
            )}
            
            <div className="text-primary font-black text-[9px] uppercase tracking-[0.4em] mb-4">Code: {category.id.split('-')[1]}</div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
              {typeof category.title === 'object' && category.title !== null ? ((category.title as any).en || "") : (category.title || "")}
            </h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
              {typeof category.description === 'object' && category.description !== null ? ((category.description as any).en || "") : (category.description || "")}
            </p>
            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">Valuation</span>
              <span className="text-white font-black italic">₹{category.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
