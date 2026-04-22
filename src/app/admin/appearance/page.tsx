"use client";

import { useState, useEffect } from "react";
import { getAppearance, updateAppearance, uploadImage } from "@/actions/adminActions";
import { Save, RefreshCw, Eye, Image as ImageIcon, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function AppearancePage() {
  const [appearance, setAppearance] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    loadAppearance();
  }, []);

  async function loadAppearance() {
    const data = await getAppearance();
    setAppearance(data);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await updateAppearance(appearance);
    setIsSaving(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, section: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(section);
    const formData = new FormData();
    formData.append("imageFile", file);

    const result = await uploadImage(formData);
    if (result.success && result.url) {
      const newAppearance = { ...appearance };
      if (section === "hero") newAppearance.hero = { ...(newAppearance.hero || {}), image: result.url };
      if (section === "about") newAppearance.about = { ...(newAppearance.about || {}), image: result.url };
      if (section === "story") newAppearance.story = { ...(newAppearance.story || {}), image: result.url };
      setAppearance(newAppearance);
    }
    setIsUploading(null);
  }

  if (!appearance) return <div className="text-primary animate-pulse font-black uppercase tracking-widest">Accessing Visual Core...</div>;

  return (
    <div className="space-y-12 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Visual <span className="text-primary">Architecture</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight mt-2">Re-engineer the landing page aesthetic and content layers.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={loadAppearance}
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all border border-white/10 flex items-center gap-3 uppercase tracking-widest"
          >
            <RefreshCw className="w-5 h-5" /> Reload Original
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary-hover text-black px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center gap-3 uppercase tracking-widest disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {isSaving ? "Syncing..." : "Commit Global Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        {/* Hero Section */}
        <div className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Vanguard Hero Layer</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Heading Designation</label>
                <textarea 
                  rows={3}
                  value={typeof (appearance?.hero?.title) === 'object' && appearance?.hero?.title !== null ? ((appearance.hero as any).en || "") : (appearance?.hero?.title || "")}
                  onChange={(e) => setAppearance({...appearance, hero: {...(appearance.hero || {}), title: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Mission Statement</label>
                <textarea 
                  rows={3}
                  value={typeof (appearance?.hero?.subtitle) === 'object' && appearance?.hero?.subtitle !== null ? ((appearance.hero as any).en || "") : (appearance?.hero?.subtitle || "")}
                  onChange={(e) => setAppearance({...appearance, hero: {...(appearance.hero || {}), subtitle: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all placeholder:text-zinc-800"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Visual Asset</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <input 
                      value={appearance.hero.image}
                      onChange={(e) => setAppearance({...appearance, hero: {...(appearance.hero || {}), image: e.target.value}})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-[10px] font-mono focus:outline-none focus:border-primary transition-all"
                    />
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 overflow-hidden shrink-0">
                      <img src={typeof appearance?.hero?.image === 'string' ? appearance.hero.image : ""} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <label className="cursor-pointer group flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-all">
                    <Upload className={`w-4 h-4 ${isUploading === 'hero' ? 'animate-bounce text-primary' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">
                      {isUploading === 'hero' ? 'Uploading...' : 'Upload New Hero Asset'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "hero")} />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Strategic Badge</label>
                <input 
                  value={typeof (appearance?.hero?.badge) === 'object' && appearance?.hero?.badge !== null ? ((appearance.hero as any).en || "") : (appearance?.hero?.badge || "")}
                  onChange={(e) => setAppearance({...appearance, hero: {...(appearance.hero || {}), badge: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Atelier Layer</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Atelier Heading</label>
                <input 
                  value={typeof (appearance?.about?.title) === 'object' && appearance?.about?.title !== null ? ((appearance.about as any).en || "") : (appearance?.about?.title || "")}
                  onChange={(e) => setAppearance({...appearance, about: {...(appearance.about || {}), title: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Laboratory Description</label>
                <textarea 
                  rows={4}
                  value={typeof (appearance?.about?.description) === 'object' && appearance?.about?.description !== null ? ((appearance.about as any).en || "") : (appearance?.about?.description || "")}
                  onChange={(e) => setAppearance({...appearance, about: {...(appearance.about || {}), description: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Atelier Visual</label>
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 h-48">
                <img src={typeof appearance?.about?.image === 'string' ? appearance.about.image : ""} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/40">
                  <label className="cursor-pointer group/up flex items-center justify-center gap-3 bg-primary text-black px-6 py-3 rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 mb-4">
                    <Upload className={`w-4 h-4 ${isUploading === 'about' ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {isUploading === 'about' ? 'Uploading...' : 'Replace Atelier Visual'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "about")} />
                  </label>
                  <input 
                    value={appearance.about.image}
                    onChange={(e) => setAppearance({...appearance, about: {...(appearance.about || {}), image: e.target.value}})}
                    className="w-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 text-white text-[10px] font-mono text-center focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Philosophy Layer</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Genesis Heading</label>
                <input 
                  value={typeof (appearance?.story?.title) === 'object' && appearance?.story?.title !== null ? ((appearance.story as any).en || "") : (appearance?.story?.title || "")}
                  onChange={(e) => setAppearance({...appearance, story: {...(appearance.story || {}), title: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Narrative Summary</label>
                <textarea 
                  rows={4}
                  value={typeof (appearance?.story?.subtitle) === 'object' && appearance?.story?.subtitle !== null ? ((appearance.story as any).en || "") : (appearance?.story?.subtitle || "")}
                  onChange={(e) => setAppearance({...appearance, story: {...(appearance.story || {}), subtitle: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Story Visual Asset</label>
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 h-48">
                <img src={typeof appearance?.story?.image === 'string' ? appearance.story.image : ""} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/40">
                  <label className="cursor-pointer group/up flex items-center justify-center gap-3 bg-primary text-black px-6 py-3 rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 mb-4">
                    <Upload className={`w-4 h-4 ${isUploading === 'story' ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {isUploading === 'story' ? 'Uploading...' : 'Replace Story Visual'}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "story")} />
                  </label>
                  <input 
                    value={appearance.story.image}
                    onChange={(e) => setAppearance({...appearance, story: {...(appearance.story || {}), image: e.target.value}})}
                    className="w-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 text-white text-[10px] font-mono text-center focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
