"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Image as ImageIcon, Link as LinkIcon, FolderOpen, Trash2, Edit2, X, Sparkles, Package, Gift, ChevronRight } from "lucide-react";
import { getProducts, deleteProduct, addBundle, updateBundle } from "@/actions/productActions";
import { getCategories } from "@/actions/adminActions";
import { toast } from "react-hot-toast";
import { compressImage } from "@/utils/imageUtils";

export default function BundlesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bundles, setBundles] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    mrp: "",
    categoryId: "",
    imageUrl: "",
    driveLink: "",
    features: "",
    isBestseller: false,
    isTop9: false,
    active: true
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bundleItemsCustomData, setBundleItemsCustomData] = useState<Record<string, { name: string; image: string; imageFile?: File | null; description: string }>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const prods = await getProducts();
    setAllProducts(prods.filter(p => !(typeof p.title === 'object' && p.title?.is_bundle)));
    setBundles(prods.filter(p => typeof p.title === 'object' && p.title?.is_bundle));
    
    const cats = await getCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
    }
  };

  const handleEditClick = (bundle: any) => {
    const titleObj = bundle.title || {};
    setFormData({
      title: titleObj.en || "",
      description: bundle.description?.en || "",
      price: bundle.price?.toString() || "",
      mrp: titleObj.mrp?.toString() || "",
      categoryId: bundle.category_id || (categories[0]?.id || ""),
      imageUrl: bundle.image_url || "",
      driveLink: bundle.drive_link || "",
      features: Array.isArray(bundle.features) ? bundle.features.join(", ") : "",
      isBestseller: titleObj.is_bestseller || false,
      isTop9: titleObj.is_top9 || false,
      active: true
    });

    const items = titleObj.bundle_items || [];
    const pIds = items.map((item: any) => item.product_id);
    setSelectedProductIds(pIds);

    const customData: any = {};
    items.forEach((item: any) => {
      customData[item.product_id] = {
        name: item.name || "",
        image: item.image || "",
        imageFile: null,
        description: item.description || ""
      };
    });
    setBundleItemsCustomData(customData);

    setImageFile(null);
    setEditingId(bundle.id);
    setIsAdding(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Bundle deleted successfully.");
      fetchInitialData();
    } else {
      toast.error(`Error: ${res.error}`);
    }
  };

  const handleProductToggle = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
      // Pre-fill with existing product data
      const prod = allProducts.find(p => p.id === productId);
      if (prod) {
        setBundleItemsCustomData(prev => ({
          ...prev,
          [productId]: {
            name: typeof prod.title === 'object' ? (prod.title.en || "") : (prod.title || ""),
            image: prod.image_url || "",
            imageFile: null,
            description: typeof prod.description === 'object' ? (prod.description.en || "") : (prod.description || "")
          }
        }));
      }
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      mrp: "",
      categoryId: categories[0]?.id || "",
      imageUrl: "",
      driveLink: "",
      features: "",
      isBestseller: false,
      isTop9: false,
      active: true
    });
    setImageFile(null);
    setSelectedProductIds([]);
    setBundleItemsCustomData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bundleItems = selectedProductIds.map(id => ({
      product_id: id,
      name: bundleItemsCustomData[id]?.name || "",
      image: bundleItemsCustomData[id]?.image || "",
      imageFile: bundleItemsCustomData[id]?.imageFile || null,
      description: bundleItemsCustomData[id]?.description || ""
    }));

    const data = new FormData();
    const dataObj = { ...formData, bundleItems: bundleItems.map(item => ({ ...item, imageFile: undefined })) };
    data.append('bundleData', JSON.stringify(dataObj));

    if (imageFile) {
      data.append('mainImage', imageFile);
    }

    bundleItems.forEach((item, index) => {
      if (item.imageFile) {
        data.append(`itemImage_${index}`, item.imageFile);
      }
    });

    try {
      const res = editingId ? await updateBundle(editingId, data) : await addBundle(data);

      if (res.success) {
        toast.success(editingId ? "Bundle updated!" : "Bundle created!");
        resetForm();
        fetchInitialData();
      } else {
        toast.error(`Failed: ${res.error}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message || 'An error occurred during deployment'}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            PPT <span className="text-primary neon-text">Bundles</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium uppercase tracking-widest text-[10px]">
            Group standalone presentations into high-value marketplace bundles.
          </p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,165,114,0.2)] hover:shadow-[0_0_25px_rgba(197,165,114,0.4)] uppercase tracking-widest text-xs cursor-pointer"
        >
          {isAdding ? "Cancel Operation" : <><Plus className="w-5 h-5" /> Create Bundle</>}
        </button>
      </div>

      {isAdding ? (
        <div className="bg-[#09090B] rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden mb-12 relative group mx-4 pb-20">
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl mx-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Bundle Name</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white font-bold"
                    placeholder="Startup Pitch Bundle"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white font-bold"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {typeof cat.title === 'object' ? (cat.title.en || "Unclassified") : (cat.title || "Unclassified")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white font-bold font-mono"
                    placeholder="499"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                    className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white font-bold font-mono"
                    placeholder="999"
                  />
                </div>
              </div>

              {/* Storefront Assignment */}
              <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
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

              {/* Extra Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest">Main Bundle Image (Recommended: 1000x1000px Square)</label>
                    {formData.imageUrl || imageFile ? (
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
                              setImageFile(optimized);
                              setFormData(prev => ({ ...prev, imageUrl: "" }));
                            });
                          }
                        }}
                        className="hidden"
                        id="bundle-image-upload"
                      />
                      <label 
                        htmlFor="bundle-image-upload"
                        className={`flex items-center justify-center w-16 h-16 rounded-2xl cursor-pointer transition-all border ${imageFile ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(197,165,114,0.3)]' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-primary/30 hover:bg-primary/5'}`}
                      >
                        <ImageIcon className="w-6 h-6" />
                      </label>
                    </div>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({...formData, imageUrl: e.target.value});
                        setImageFile(null);
                      }}
                      className="flex-1 px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white font-bold"
                      placeholder="Paste image URL here..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Cloud Storage Delivery Link</label>
                  <input
                    type="url"
                    required
                    value={formData.driveLink}
                    onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                    className="w-full px-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white font-mono"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              {/* Toggle flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({...formData, isBestseller: e.target.checked})}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary cursor-pointer"
                  />
                  Mark as Bestseller
                </label>

                <label className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTop9}
                    onChange={(e) => setFormData({...formData, isTop9: e.target.checked})}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary cursor-pointer"
                  />
                  Featured Additions
                </label>
              </div>

              {/* Multi Select PPTs */}
              <div className="border-t border-white/5 pt-8">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Packaged Presentations (Select Multiple)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  {allProducts.map(prod => {
                    const titleStr = typeof prod.title === 'object' ? (prod.title.en || "") : (prod.title || "");
                    const isChecked = selectedProductIds.includes(prod.id);
                    return (
                      <label key={prod.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 hover:border-white/20 text-zinc-400'}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleProductToggle(prod.id)}
                          className="hidden"
                        />
                        <span className="text-xs font-bold line-clamp-1">{titleStr}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Custom Details for Each Selected PPT */}
              {selectedProductIds.length > 0 && (
                <div className="border-t border-white/5 pt-8 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Customize Bundle Display Details</h3>
                  {selectedProductIds.map(id => (
                    <div key={id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-1 flex items-center gap-4">
                        <img 
                          src={bundleItemsCustomData[id]?.image || "https://placehold.co/100x100"} 
                          className="w-12 h-12 object-cover rounded-lg border border-white/10" 
                          alt="PPT preview" 
                        />
                        <div className="flex-1">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Display Name</span>
                          <input
                            type="text"
                            required
                            value={bundleItemsCustomData[id]?.name || ""}
                            onChange={(e) => setBundleItemsCustomData({
                              ...bundleItemsCustomData,
                              [id]: { ...bundleItemsCustomData[id], name: e.target.value }
                            })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-bold text-xs"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Short Description</span>
                        <input
                          type="text"
                          required
                          value={bundleItemsCustomData[id]?.description || ""}
                          onChange={(e) => setBundleItemsCustomData({
                            ...bundleItemsCustomData,
                            [id]: { ...bundleItemsCustomData[id], description: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs"
                          placeholder="Startup funding slides"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Display Image Asset (Recommended: 1200x800px)</span>
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              id={`bundle-item-img-${id}`}
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  compressImage(file).then(optimized => {
                                    setBundleItemsCustomData(prev => ({
                                      ...prev,
                                      [id]: { ...prev[id], imageFile: optimized, image: "" }
                                    }));
                                  });
                                }
                              }}
                            />
                            <label 
                              htmlFor={`bundle-item-img-${id}`}
                              className={`flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer transition-all ${bundleItemsCustomData[id]?.imageFile ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(197,165,114,0.3)]' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-primary/40 hover:bg-primary/5'}`}
                            >
                              <ImageIcon className="w-4 h-4" />
                            </label>
                          </div>
                          <input
                            type="url"
                            value={bundleItemsCustomData[id]?.image || ""}
                            onChange={(e) => setBundleItemsCustomData({
                              ...bundleItemsCustomData,
                              [id]: { ...bundleItemsCustomData[id], image: e.target.value, imageFile: null }
                            })}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs"
                            placeholder="URL..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                {isSubmitting ? "Processing..." : <><Save className="w-5 h-5" /> Save Bundle Entity</>}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map(bundle => {
              const titleStr = typeof bundle.title === 'object' ? (bundle.title.en || "Untitled Bundle") : (bundle.title || "Untitled Bundle");
              return (
                <div key={bundle.id} className="bg-[#09090B] border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                  <div className="h-40 bg-zinc-900 rounded-2xl overflow-hidden mb-4 relative">
                    <img 
                      src={bundle.image_url || bundle.imageUrl || (bundle.images && bundle.images[0]) || "https://placehold.co/400x300?text=No+Asset"} 
                      alt={titleStr}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Broken+Asset";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-primary text-black font-black text-[10px] px-3 py-1 rounded-full uppercase">
                      Bundle
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase italic tracking-tighter line-clamp-1 mb-2">{titleStr}</h3>
                  <div className="text-xl font-black text-primary font-mono mb-4">₹{bundle.price}</div>
                  
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 mb-6">
                    <Package className="w-4 h-4" /> {bundle.title?.bundle_items?.length || 0} ITEMS PACKAGED
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <button
                      onClick={() => handleEditClick(bundle)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
                    >
                      <Edit2 className="w-4 h-4 text-primary" /> Modify
                    </button>
                    <button
                      onClick={() => handleDeleteClick(bundle.id)}
                      className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl transition-all cursor-pointer border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
