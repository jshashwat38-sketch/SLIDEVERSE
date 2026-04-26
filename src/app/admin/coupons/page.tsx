"use client";

import { useState, useEffect } from "react";
import { Plus, Save, Gift, Trash2, Edit2, Calendar, AlertCircle, Check } from "lucide-react";
import { getCoupons, saveCoupon, deleteCoupon } from "@/actions/adminActions";
import { toast } from "react-hot-toast";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "flat" | "percentage",
    value: "",
    expiryDate: "",
    minCartValue: "",
    maxUses: "",
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const data = await getCoupons();
    setCoupons(data);
    setLoading(false);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      expiryDate: "",
      minCartValue: "",
      maxUses: "",
      isActive: true
    });
  };

  const handleEdit = (coupon: any) => {
    setFormData({
      code: coupon.code || "",
      type: coupon.type || "percentage",
      value: coupon.value?.toString() || "",
      expiryDate: coupon.expiryDate || "",
      minCartValue: coupon.minCartValue?.toString() || "",
      maxUses: coupon.maxUses?.toString() || "",
      isActive: coupon.isActive !== false
    });
    setEditingId(coupon.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Execute coupon removal protocol?")) {
      const res = await deleteCoupon(id);
      if (res.success) {
        toast.success("Coupon executed.");
        fetchCoupons();
      } else {
        toast.error("Operation failed.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast.error("Identify mandatory inputs.");
      return;
    }

    const payload = {
      id: editingId || undefined,
      code: formData.code.toUpperCase().trim(),
      type: formData.type,
      value: Number(formData.value),
      expiryDate: formData.expiryDate,
      minCartValue: Number(formData.minCartValue) || 0,
      maxUses: Number(formData.maxUses) || 9999,
      isActive: formData.isActive
    };

    const res = await saveCoupon(payload);
    if (res.success) {
      toast.success(editingId ? "Coupon updated securely" : "New coupon securely integrated");
      resetForm();
      fetchCoupons();
    } else {
      toast.error(res.error || "Execution failed.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Offers & <span className="text-primary neon-text">Coupons</span></h1>
          <p className="text-zinc-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Deploy client discount mechanisms securely.</p>
        </div>
        <button 
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,165,114,0.2)] hover:shadow-[0_0_25px_rgba(197,165,114,0.4)] uppercase tracking-widest text-xs"
        >
          {isAdding ? "Cancel" : <><Plus className="w-5 h-5" /> Issue Coupon</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#09090B] rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden mb-12 relative group p-10">
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Coupon Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white placeholder:text-zinc-800 font-bold uppercase text-sm"
                  placeholder="E.G. SAVE50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Offer Configuration</label>
                <select
                  value={formData.type}
                  onChange={(e: any) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white appearance-none cursor-pointer uppercase font-black text-xs tracking-[0.2em]"
                >
                  <option value="percentage" className="bg-zinc-900 text-white">PERCENTAGE DISCOUNT (%)</option>
                  <option value="flat" className="bg-zinc-900 text-white">FLAT DISCOUNT (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Discount Magnitude</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white font-mono text-lg font-black"
                  placeholder="E.G. 10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4 flex items-center gap-2">Minimum Cart Value (₹)</label>
                <input
                  type="number"
                  value={formData.minCartValue}
                  onChange={(e) => setFormData({...formData, minCartValue: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white font-mono"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 ml-4">Maximum Uses Allowed</label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white font-mono"
                  placeholder="9999"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <input 
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5 rounded accent-primary border-white/10 bg-transparent cursor-pointer"
                  id="couponActive"
                />
                <label htmlFor="couponActive" className="text-xs font-black text-white uppercase tracking-widest cursor-pointer select-none">Mark Coupon Active</label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-2xl font-black flex items-center gap-2 shadow-[0_0_20px_rgba(197,165,114,0.3)] transition-all cursor-pointer uppercase tracking-widest text-sm"
              >
                <Save className="w-5 h-5" />
                Commit Offer
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-600 text-center uppercase tracking-widest text-xs py-20">Retrieving security codes...</p>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[2.5rem] mx-4">
          <p className="text-zinc-500 uppercase tracking-widest font-black text-xs">Zero operational coupons located.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {coupons.map((coupon) => (
            <div 
              key={coupon.id} 
              className={`bg-[#09090B] border rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-primary/20 transition-all duration-500 ${coupon.isActive ? 'border-white/5' : 'border-red-950/40 opacity-60'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-black italic text-white uppercase tracking-wider">{coupon.code}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${coupon.isActive ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-zinc-800 text-zinc-500'}`}>
                    {coupon.isActive ? "ACTIVE" : "DISABLED"}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-3xl font-black italic text-primary">
                    {coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-wide uppercase">
                    Minimum Cart: ₹{coupon.minCartValue || 0}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-wide uppercase">
                    Uses Allowed: {coupon.maxUses || '9999'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
                <span className="text-[9px] font-black text-zinc-600 tracking-widest uppercase flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {coupon.expiryDate || 'NO EXPIRY'}</span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(coupon)}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-3 bg-red-950/10 rounded-xl hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-all border border-red-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
