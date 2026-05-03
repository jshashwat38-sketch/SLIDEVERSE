"use client";

import { useState, useEffect } from "react";
import { getReviews, saveReview, deleteReview } from "@/actions/adminActions";
import { Plus, Edit, Trash2, Save, X, MessageSquare, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    role: "", 
    text: "", 
    code: "VERIFIED_BUYER", 
    rating: 5,
    type: "product" // 'testimonial' | 'product'
  });
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  useEffect(() => { 
    loadReviews(); 
    loadProducts();
  }, []);

  async function loadReviews() {
    const data = await getReviews();
    setReviews(data);
  }

  async function loadProducts() {
    // Get both standalone products and bundles
    const { supabase } = await import("@/lib/supabase");
    const { data } = await supabase.from('products').select('id, title');
    setProducts(data || []);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const result = await saveReview(editingReview || formData);
    if (result.success) {
      toast.success("Intelligence authenticated.");
      setEditingReview(null);
      setIsAdding(false);
      setFormData({ 
        name: "", 
        role: "", 
        text: "", 
        code: "VERIFIED_BUYER", 
        rating: 5,
        type: "product"
      });
      loadReviews();
    }
  }

  async function handleDelete(id: string) {
    console.log("Transmission termination initiated for review:", id);
    const result = await deleteReview(id);
    if (result.success) {
      toast.success("Feed purged.");
      setReviewToDelete(null);
      loadReviews();
    }
  }

  const StarRating = ({ value, onChange, disabled = false }: { value: number, onChange: (v: number) => void, disabled?: boolean }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
            star <= value 
              ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(197,165,114,0.1)]' 
              : 'bg-white/5 border-white/10 text-zinc-600 hover:border-white/20'
          }`}
        >
          <Quote className={`w-4 h-4 ${star <= value ? 'fill-primary' : ''}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      <div className="flex justify-between items-end px-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Field <span className="text-primary">Intelligence</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight mt-2 uppercase text-[10px] tracking-widest">Moderate and curate field transmissions and product testimonials.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black text-xs transition-all shadow-lg flex items-center gap-3 uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> Deploy New Relay
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingReview) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#09090B] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden mx-4"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Review Type</label>
                  <select 
                    value={editingReview ? (editingReview.code === 'VERIFIED_BUYER' ? 'product' : 'testimonial') : formData.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      if (editingReview) {
                        setEditingReview({...editingReview, code: type === 'product' ? 'VERIFIED_BUYER' : 'SIGMA-RELAY'});
                      } else {
                        setFormData({...formData, type, code: type === 'product' ? 'VERIFIED_BUYER' : 'SIGMA-RELAY'});
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="product" className="bg-zinc-900">Product Review</option>
                    <option value="testimonial" className="bg-zinc-900">General Testimonial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Source Identity</label>
                  <input 
                    required
                    value={(() => {
                      const val = editingReview ? editingReview.name : formData.name;
                      return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => editingReview ? setEditingReview({...editingReview, name: e.target.value}) : setFormData({...formData, name: e.target.value})}
                    placeholder="E.G. ALEX RIVERA..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">
                    { (editingReview ? (editingReview.code === 'VERIFIED_BUYER') : (formData.type === 'product')) ? 'Target Asset' : 'Source Designation'}
                  </label>
                  { (editingReview ? (editingReview.code === 'VERIFIED_BUYER') : (formData.type === 'product')) ? (
                    <select
                      required
                      value={(() => {
                        const val = editingReview ? editingReview.role : formData.role;
                        return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                      })()}
                      onChange={(e) => editingReview ? setEditingReview({...editingReview, role: e.target.value}) : setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="" className="bg-zinc-900 text-zinc-600">Select Product/Bundle...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id} className="bg-zinc-900">
                          {typeof p.title === 'object' ? p.title.en : p.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      required
                      value={(() => {
                        const val = editingReview ? editingReview.role : formData.role;
                        return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                      })()}
                      onChange={(e) => editingReview ? setEditingReview({...editingReview, role: e.target.value}) : setFormData({...formData, role: e.target.value})}
                      placeholder="E.G. SENIOR ARCHITECT..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800" 
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Impact Rating</label>
                  <StarRating 
                    value={editingReview ? editingReview.rating : formData.rating} 
                    onChange={(v) => editingReview ? setEditingReview({...editingReview, rating: v}) : setFormData({...formData, rating: v})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Relay Protocol</label>
                  <input 
                    required
                    value={editingReview ? editingReview.code : formData.code}
                    onChange={(e) => editingReview ? setEditingReview({...editingReview, code: e.target.value}) : setFormData({...formData, code: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-zinc-500 text-sm font-bold uppercase focus:outline-none transition-all" 
                    readOnly={formData.type === 'product' && !editingReview}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Transmission Content</label>
                <textarea 
                  required
                  rows={4}
                  value={(() => {
                    const val = editingReview ? (editingReview.text || editingReview.comment) : formData.text;
                    return typeof val === 'object' && val !== null ? ((val as any).en || Object.values(val)[0] || "") : (val || "");
                  })()}
                  onChange={(e) => editingReview ? setEditingReview({...editingReview, text: e.target.value}) : setFormData({...formData, text: e.target.value})}
                  placeholder="DETAILS OF FIELD INTELLIGENCE..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-8 py-6 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-primary text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg hover:shadow-primary/20 transition-all">
                  <Save className="w-5 h-4" /> Authenticate Transmission
                </button>
                <button type="button" onClick={() => { setEditingReview(null); setIsAdding(false); }} className="bg-white/5 text-zinc-400 hover:text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-white/5">
                  <X className="w-4 h-4" /> Terminate Relay
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card/20 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingReview(review)} className="p-3 bg-white/5 rounded-xl text-blue-400 hover:bg-blue-400/20 transition-all">
                <Edit className="w-5 h-5" />
              </button>
              
              {reviewToDelete === review.id ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => setReviewToDelete(null)}
                    className="p-3 bg-white/5 text-zinc-400 rounded-xl hover:text-white transition-all border border-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setReviewToDelete(review.id)} className="p-3 bg-white/5 rounded-xl text-red-400 hover:bg-red-400/20 transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Quote className="w-6 h-6" />
              </div>
              <div>
                <div className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">{review.code}</div>
                <div className="text-white font-black uppercase italic tracking-tighter text-xl mt-1">
                  {typeof review.name === 'object' && review.name !== null ? ((review.name as any).en || "") : (review.name || "")}
                </div>
              </div>
            </div>
            
            <p className="text-zinc-400 text-base font-medium leading-relaxed italic mb-8">
              "{typeof review.text === 'object' && review.text !== null ? ((review.text as any).en || "") : (review.text || "")}"
            </p>
            
            <div className="text-primary text-[10px] font-black uppercase tracking-[0.3em] pt-6 border-t border-white/5">
              Source Designation: {typeof review.role === 'object' && review.role !== null ? ((review.role as any).en || "") : (review.role || "")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
