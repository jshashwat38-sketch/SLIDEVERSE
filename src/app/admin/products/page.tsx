"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Image as ImageIcon, Link as LinkIcon, AlertCircle, Package, FolderOpen, Trash2, Edit2 } from "lucide-react";
import { addProduct, getProducts, updateProduct, deleteProduct } from "@/actions/productActions";
import { getCategories } from "@/actions/adminActions";

export default function AdminProducts() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    driveLink: "",
    features: "",
    categoryId: ""
  });

  const [imageUrls, setImageUrls] = useState<string[]>(["", "", "", "", "", ""]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null, null]);
  
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>(Array(7).fill({question: "", answer: ""}));

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
    setProducts(data);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", description: "", price: "", driveLink: "", features: "", categoryId: categories[0]?.id || "" });
    setImageUrls(["", "", "", "", "", ""]);
    setImageFiles([null, null, null, null, null, null]);
    setFaqs(Array(7).fill({question: "", answer: ""}));
  };

  const handleEditClick = (product: any) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      driveLink: product.driveLink,
      features: product.features.join(", "),
      categoryId: product.categoryId
    });
    
    const existingImages = product.images || [product.imageUrl];
    const newUrls = ["", "", "", "", "", ""];
    existingImages.forEach((url: string, i: number) => {
      if (i < 6) newUrls[i] = url;
    });
    
    const existingFaqs = product.faqs || [];
    const newFaqs = Array(7).fill({question: "", answer: ""});
    existingFaqs.forEach((faq: any, i: number) => {
      if (i < 7) newFaqs[i] = faq;
    });
    
    setImageUrls(newUrls);
    setImageFiles([null, null, null, null, null, null]);
    setFaqs(newFaqs);
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProduct(id);
      if (res.success) {
        await fetchProducts();
      } else {
        alert(`Failed to delete product: ${res.error || 'Unknown error'}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("features", formData.features);
    data.append("driveLink", formData.driveLink);
    data.append("categoryId", formData.categoryId);
    
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
    
    const res = editingId ? await updateProduct(editingId, data) : await addProduct(data);
    
    if (res.success) {
      await fetchProducts(); // Refresh list first
      resetForm(); // Then close form
    } else {
      alert(`Failed to ${editingId ? 'update' : 'save'} product: ${res.error || 'Unknown error'}`);
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
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,0,0.2)] hover:shadow-[0_0_25px_rgba(212,255,0,0.4)] hover:-translate-y-0.5 uppercase tracking-widest text-xs"
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
                    required
                    value={(() => {
                      const val = formData.title;
                      return typeof val === 'object' && val !== null ? (val.en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-bold uppercase text-sm"
                    placeholder="E.G. TITAN SLIDE DECK"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Classification
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white appearance-none cursor-pointer uppercase font-black text-xs tracking-[0.2em]"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                        {typeof cat.title === 'object' ? (cat.title.en || Object.values(cat.title)[0]).toUpperCase() : cat.title.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Entity Description</label>
                  <textarea
                    required
                    rows={3}
                    value={(() => {
                      const val = formData.description;
                      return typeof val === 'object' && val !== null ? (val.en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 resize-none font-medium text-sm leading-relaxed"
                    placeholder="PROVIDE SYSTEM SPECIFICATIONS..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Market Value (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-mono text-lg font-black italic"
                    placeholder="000.00"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Core Features (CSV)</label>
                  <input
                    type="text"
                    required
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-bold text-sm"
                    placeholder="FEATURE A, FEATURE B..."
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Visual Inventory</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-12">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between px-2">
                          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Asset Slot {index + 1}</span>
                          {imageUrls[index] || imageFiles[index] ? (
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Active</span>
                          ) : (
                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest bg-white/[0.02] px-2 py-0.5 rounded-full border border-white/5">Empty</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const newFiles = [...imageFiles];
                                  newFiles[index] = e.target.files[0];
                                  setImageFiles(newFiles);
                                  const newUrls = [...imageUrls];
                                  newUrls[index] = "";
                                  setImageUrls(newUrls);
                                }
                              }}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <label 
                              htmlFor={`image-upload-${index}`}
                              className={`flex items-center justify-center w-14 h-14 rounded-2xl cursor-pointer transition-all border ${imageFiles[index] ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(212,255,0,0.3)]' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-primary/30 hover:bg-primary/5'}`}
                            >
                              <ImageIcon className="w-5 h-5" />
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
                            className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 text-xs font-bold"
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
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:bg-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-bold text-xs"
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
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:bg-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-medium text-xs"
                            placeholder="SYSTEM RESPONSE..."
                          />
                        </div>
                      </div>
                    ))}
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
                    required
                    value={formData.driveLink}
                    onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-mono text-sm"
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
                  className="bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.3)] hover:shadow-[0_0_50px_rgba(212,255,0,0.5)] hover:-translate-y-1 uppercase tracking-widest italic"
                >
                  Execute Deployment
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
                          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all shadow-2xl relative">
                            <img 
                              src={product.imageUrl || "/placeholder-product.png"} 
                              alt="" 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tighter italic text-xl group-hover:text-primary transition-colors">
                              {typeof product.title === 'object' && product.title !== null ? (product.title.en || Object.values(product.title)[0] || "") : (product.title || "")}
                            </p>
                            <p className="text-zinc-600 text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              {(() => {
                                const category = categories.find(c => c.id === product.categoryId);
                                if (!category) return "Unclassified";
                                const title = category.title;
                                return (typeof title === 'object' && title !== null ? (title.en || Object.values(title)[0] || "Unclassified") : (title || "Unclassified")).toUpperCase();
                              })()}
                            </p>
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
                        <div className="flex items-center justify-end gap-4">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-4 text-zinc-500 hover:text-primary bg-white/5 hover:bg-primary/10 rounded-2xl transition-all border border-transparent hover:border-primary/30 group/btn"
                            title="Edit Product"
                          >
                            <Edit2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-4 text-zinc-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/30 group/btn"
                            title="Delete Product"
                          >
                            <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          </button>
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
                className="bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.2)] uppercase tracking-widest italic"
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
