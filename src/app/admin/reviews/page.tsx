"use client";

import { useState, useEffect } from "react";
import { getReviews, saveReview, deleteReview } from "@/actions/adminActions";
import { Plus, Edit, Trash2, Save, X, MessageSquare, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", text: "", code: "SIGMA-XX" });

  useEffect(() => { loadReviews(); }, []);

  async function loadReviews() {
    const data = await getReviews();
    setReviews(data);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const result = await saveReview(editingReview || formData);
    if (result.success) {
      setEditingReview(null);
      setIsAdding(false);
      setFormData({ name: "", role: "", text: "", code: `SIGMA-${Math.floor(Math.random() * 90 + 10)}` });
      loadReviews();
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Terminate this transmission?")) {
      await deleteReview(id);
      loadReviews();
    }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Client <span className="text-primary">Transmissions</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight mt-2">Moderate and curate field intelligence and feedback.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center gap-3 uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> Capture New Feed
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingReview) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Source Identity</label>
                  <input 
                    required
                    value={(() => {
                      const val = editingReview ? editingReview.name : formData.name;
                      return typeof val === 'object' && val !== null ? (val.en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => editingReview ? setEditingReview({...editingReview, name: e.target.value}) : setFormData({...formData, name: e.target.value})}
                    placeholder="E.G. JOHN DOE..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Designation</label>
                  <input 
                    required
                    value={(() => {
                      const val = editingReview ? editingReview.role : formData.role;
                      return typeof val === 'object' && val !== null ? (val.en || Object.values(val)[0] || "") : (val || "");
                    })()}
                    onChange={(e) => editingReview ? setEditingReview({...editingReview, role: e.target.value}) : setFormData({...formData, role: e.target.value})}
                    placeholder="E.G. CEO, ARCHITECT..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Relay Code</label>
                  <input 
                    required
                    value={editingReview ? editingReview.code : formData.code}
                    onChange={(e) => editingReview ? setEditingReview({...editingReview, code: e.target.value}) : setFormData({...formData, code: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Transmission Content</label>
                <textarea 
                  required
                  rows={3}
                  value={(() => {
                    const val = editingReview ? editingReview.text : formData.text;
                    return typeof val === 'object' && val !== null ? (val.en || Object.values(val)[0] || "") : (val || "");
                  })()}
                  onChange={(e) => editingReview ? setEditingReview({...editingReview, text: e.target.value}) : setFormData({...formData, text: e.target.value})}
                  placeholder="FEEDBACK DETAILS..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800 resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-primary text-black px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <Save className="w-4 h-4" /> Authenticate Feed
                </button>
                <button type="button" onClick={() => { setEditingReview(null); setIsAdding(false); }} className="bg-white/5 text-zinc-400 hover:text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-white/5">
                  <X className="w-4 h-4" /> Discard
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
              <button onClick={() => handleDelete(review.id)} className="p-3 bg-white/5 rounded-xl text-red-400 hover:bg-red-400/20 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Quote className="w-6 h-6" />
              </div>
              <div>
                <div className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">{review.code}</div>
                <div className="text-white font-black uppercase italic tracking-tighter text-xl mt-1">
                  {typeof review.name === 'object' && review.name !== null ? (review.name.en || "") : (review.name || "")}
                </div>
              </div>
            </div>
            
            <p className="text-zinc-400 text-base font-medium leading-relaxed italic mb-8">
              "{typeof review.text === 'object' && review.text !== null ? (review.text.en || "") : (review.text || "")}"
            </p>
            
            <div className="text-primary text-[10px] font-black uppercase tracking-[0.3em] pt-6 border-t border-white/5">
              Source Designation: {typeof review.role === 'object' && review.role !== null ? (review.role.en || "") : (review.role || "")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
