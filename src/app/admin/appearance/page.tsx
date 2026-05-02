"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getProductsAdmin,
  getAppearance,
  getAppearanceDraft, 
  saveAppearanceDraft, 
  publishAppearance, 
  revertAppearance, 
  uploadImage,
  getCategories,
  getReviews
} from "@/actions/adminActions";
import { 
  Save, 
  Send, 
  RotateCcw, 
  Eye, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronRight,
  Monitor,
  Smartphone,
  Check,
  X,
  Type,
  Layout,
  Star,
  Settings,
  Mail,
  ArrowRight,
  Sparkles,
  Zap,
  Phone
} from "lucide-react";
import LogoLoader from "@/components/common/LogoLoader";
import { toast } from "react-hot-toast";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import HomeClient from "@/app/(main)/HomeClient";

export default function AppearancePage() {
  const [appearance, setAppearance] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.3);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const width = previewContainerRef.current.offsetWidth;
        const targetWidth = previewMode === "desktop" ? 1440 : 320;
        setPreviewScale((width - 48) / targetWidth); // subtract padding
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [previewMode, appearance]); // Recalculate when mode changes

  const [fetchError, setFetchError] = useState<string | null>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;
    loadData();
  }, []);

  async function loadData() {
    // Set a safety timeout for the loader
    const safetyTimeout = setTimeout(() => {
      if (!appearance) {
        console.warn("Appearance fetch timing out. Forcing fallback.");
        getAppearance().then(fallback => setAppearance(fallback));
      }
    }, 8000);

    try {
      console.log("AppearancePage: Initializing data fetch...");
      const [pData, revData] = await Promise.all([
        getProductsAdmin(),
        getReviews()
      ]);
      
      console.log("AppearancePage: Products/Reviews loaded. Fetching draft...");
      const appData = await getAppearanceDraft();
      
      console.log("AppearancePage: Data fetch complete.");
      clearTimeout(safetyTimeout);
      setAppearance(appData);
      setProducts(pData || []);
      setReviews(revData || []);
    } catch (error) {
      clearTimeout(safetyTimeout);
      console.error("Critical failure in AppearancePage loadData:", error);
      toast.error("Emergency restoration active.");
      const fallback = await getAppearance();
      setAppearance(fallback);
    }
  }

  // Safe nested update utility
  const updateNestedField = (path: string[], value: any) => {
    setAppearance((prev: any) => {
      if (!prev) return prev;
      const newAppearance = { ...prev };
      let current = newAppearance;
      
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!current[key]) current[key] = {};
        current[key] = { ...current[key] };
        current = current[key];
      }
      
      current[path[path.length - 1]] = value;
      return newAppearance;
    });
  };

  const updateField = (section: string, field: string, value: any) => {
    setAppearance((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleVisibility = (section: string) => {
    setAppearance((prev: any) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
  };

  const handleReorder = useCallback((newOrder: string[]) => {
    setAppearance((prev: any) => {
      if (!prev) return prev;
      // Prevent update if order is identical to avoid loops
      if (JSON.stringify(prev.homepageLayout) === JSON.stringify(newOrder)) return prev;
      return {
        ...prev,
        homepageLayout: newOrder
      };
    });
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const res = await saveAppearanceDraft(appearance);
    if (res.success) toast.success("Draft saved successfully.");
    else toast.error("Failed to save draft.");
    setIsSaving(false);
  };

  const handlePublish = async () => {
    if (!confirm("Are you sure you want to push these changes to the LIVE website?")) return;
    setIsPublishing(true);
    const res = await publishAppearance(appearance);
    if (res.success) toast.success("Homepage published to live!");
    else toast.error("Failed to publish.");
    setIsPublishing(false);
  };

  const handleRevert = async () => {
    if (!confirm("Revert to the last published version? All unsaved draft changes will be lost.")) return;
    setIsReverting(true);
    const res = await revertAppearance();
    if (res.success) {
      toast.success("Restored previous version.");
      await loadData();
    } else {
      toast.error("Failed to revert.");
    }
    setIsReverting(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(`${section}-${field}`);
    const formData = new FormData();
    formData.append("imageFile", file);

    const result = await uploadImage(formData);
    if (result.success && result.url) {
      updateField(section, field, result.url);
      toast.success("Asset uploaded.");
    } else {
      toast.error(result.error || "Upload failed.");
    }
    setIsUploading(null);
  };

  if (!appearance) return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090B]">
      <LogoLoader />
    </div>
  );

  const sections = [
    { id: 'hero', name: 'Hero Banner', icon: Layout },
    { id: 'trust', name: 'Trust Stats', icon: Star },
    { id: 'featured', name: 'Featured Additions', icon: Sparkles },
    { id: 'bestsellers', name: 'Bestsellers', icon: Zap },
    { id: 'categories', name: 'Category Slider', icon: Settings },
    { id: 'customPpt', name: 'Custom PPT Box', icon: Plus },
    { id: 'about', name: 'About Atelier', icon: ImageIcon },
    { id: 'story', name: 'The Story', icon: Type },
    { id: 'testimonials', name: 'Testimonials', icon: Mail },
    { id: 'contact', name: 'Contact Hub', icon: Phone },
  ];

  return (
    <div className="fixed inset-0 flex flex-col bg-[#09090B] overflow-hidden text-zinc-300 font-sans">
      {/* Top Header Bar */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between px-8 z-50 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="xl:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Layout className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Homepage <span className="text-primary">Visual Editor</span>
            </h1>
          </div>
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 rounded-lg transition-all ${previewMode === "desktop" ? "bg-primary text-black" : "hover:text-white"}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 rounded-lg transition-all ${previewMode === "mobile" ? "bg-primary text-black" : "hover:text-white"}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleRevert}
            disabled={isReverting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Revert
          </button>
          <button 
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest transition-all"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-black text-xs font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(197,165,114,0.3)]"
          >
            <Send className="w-4 h-4" /> {isPublishing ? "Publishing..." : "Publish To Live"}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Section Management */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-black/95 border-r border-white/5 flex flex-col transition-transform duration-500 xl:relative xl:translate-x-0 xl:bg-black/20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Page Architecture</h3>
              <button onClick={() => setSidebarOpen(false)} className="xl:hidden p-2 text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Reorder.Group 
              axis="y" 
              values={(appearance?.homepageLayout || []).filter((id: string, index: number, self: string[]) => 
                self.indexOf(id) === index && sections.find(s => s.id === id)
              )} 
              onReorder={handleReorder}
              className="space-y-2"
            >
              {(appearance?.homepageLayout || []).filter((id: string, index: number, self: string[]) => 
                self.indexOf(id) === index && sections.find(s => s.id === id)
              ).map((id: string) => {
                const config = sections.find(s => s.id === id);
                if (!config) return null;
                const isVisible = appearance?.sectionVisibility ? appearance.sectionVisibility[id] !== false : true;
                const isActive = activeSection === id;

                return (
                  <Reorder.Item 
                    key={id} 
                    value={id}
                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-white/[0.02] border-white/5 hover:border-white/10 text-zinc-400"
                    }`}
                    onClick={() => setActiveSection(id)}
                  >
                    <GripVertical className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 shrink-0 cursor-grab active:cursor-grabbing" />
                    <config.icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider flex-1 truncate">{config.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleVisibility(id); }}
                      className={`p-1 rounded-md transition-all ${isVisible ? "text-primary hover:text-primary-hover" : "text-zinc-700 hover:text-zinc-500"}`}
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        </aside>

        {/* Middle Column: Active Section Editor */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 xl:p-16 custom-scrollbar bg-black/40">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    {(() => {
                      const Icon = sections.find(s => s.id === activeSection)?.icon || Settings;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                      {sections.find(s => s.id === activeSection)?.name}
                    </h2>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Configure section-specific intelligence layers</p>
                  </div>
                </div>

                {/* Section Specific Editors */}
                {activeSection === "hero" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Headline" value={appearance?.hero?.title} onChange={(val) => updateField("hero", "title", val)} type="textarea" rows={3} />
                    <EditorField label="Subheadline" value={appearance?.hero?.subtitle} onChange={(val) => updateField("hero", "subtitle", val)} type="textarea" rows={3} />
                    <EditorField label="Badge Text" value={appearance?.hero?.badge} onChange={(val) => updateField("hero", "badge", val)} />
                    <ImageUploadField label="Hero Showcase Image" value={appearance?.hero?.image} onChange={(url) => updateField("hero", "image", url)} uploading={isUploading === "hero-image"} onUpload={(e) => handleImageUpload(e, "hero", "image")} />
                    <div className="grid grid-cols-2 gap-6">
                      <EditorField label="Primary Button Text" value={appearance?.buttons?.primary?.label} onChange={(val) => updateNestedField(["buttons", "primary", "label"], val)} />
                      <EditorField label="Primary Link" value={appearance?.buttons?.primary?.link} onChange={(val) => updateNestedField(["buttons", "primary", "link"], val)} />
                    </div>
                  </div>
                )}

                {activeSection === "trust" && (
                  <div className="grid grid-cols-2 gap-8">
                    <EditorField label="Metric 1: Downloads" value={appearance?.trust?.downloads} onChange={(val) => updateField("trust", "downloads", val)} />
                    <EditorField label="Metric 2: Users" value={appearance?.trust?.users} onChange={(val) => updateField("trust", "users", val)} />
                    <EditorField label="Metric 3: Rating" value={appearance?.trust?.rating} onChange={(val) => updateField("trust", "rating", val)} />
                    <EditorField label="Metric 4: Custom Orders" value={appearance?.trust?.customOrders} onChange={(val) => updateField("trust", "customOrders", val)} />
                    <div className="col-span-2">
                      <label className="flex items-center gap-4 cursor-pointer p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                        <input 
                          type="checkbox"
                          checked={appearance?.trust?.animated !== false}
                          onChange={(e) => updateField("trust", "animated", e.target.checked)}
                          className="w-5 h-5 rounded border-white/10 bg-black/40 text-primary focus:ring-primary focus:ring-opacity-25"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white uppercase tracking-wider">Enable Animated Counters</span>
                          <span className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest mt-0.5">Numbers will count up on scroll for premium effect</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {activeSection === "featured" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Section Heading" value={appearance?.featured?.heading} onChange={(val) => updateField("featured", "heading", val)} />
                    <EditorField label="Subheadline" value={appearance?.featured?.subtitle} onChange={(val) => updateField("featured", "subtitle", val)} type="textarea" />
                    <ProductSelector 
                      label="Select Featured Products (Max 12)" 
                      products={products} 
                      selectedIds={appearance?.featured?.productIds || []} 
                      onChange={(ids) => updateField("featured", "productIds", ids)} 
                    />
                  </div>
                )}

                {activeSection === "bestsellers" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Section Heading" value={appearance?.bestsellers?.heading} onChange={(val) => updateField("bestsellers", "heading", val)} />
                    <EditorField label="Subheadline" value={appearance?.bestsellers?.subtitle} onChange={(val) => updateField("bestsellers", "subtitle", val)} type="textarea" />
                    <ProductSelector 
                      label="Select Bestsellers (Max 24)" 
                      products={products} 
                      selectedIds={appearance?.bestsellers?.productIds || []} 
                      onChange={(ids) => updateField("bestsellers", "productIds", ids)} 
                    />
                  </div>
                )}

                {activeSection === "categories" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Section Heading" value={appearance?.categorySlider?.heading} onChange={(val) => updateField("categorySlider", "heading", val)} />
                    <EditorField label="Subheadline" value={appearance?.categorySlider?.subtitle} onChange={(val) => updateField("categorySlider", "subtitle", val)} type="textarea" />
                  </div>
                )}

                {activeSection === "customPpt" && (
                  <div className="grid grid-cols-2 gap-8">
                    <EditorField label="Service Price (₹)" value={appearance?.customPpt?.price} onChange={(val) => updateField("customPpt", "price", Number(val))} type="number" />
                    <EditorField label="Sale Price (₹)" value={appearance?.customPpt?.salePrice} onChange={(val) => updateField("customPpt", "salePrice", Number(val))} type="number" />
                    <EditorField label="MRP Price (₹)" value={appearance?.customPpt?.mrpPrice} onChange={(val) => updateField("customPpt", "mrpPrice", Number(val))} type="number" />
                    <EditorField label="Completion Timeline" value={appearance?.customPpt?.timelineText} onChange={(val) => updateField("customPpt", "timelineText", val)} />
                  </div>
                )}

                {activeSection === "about" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Heading" value={appearance?.about?.title} onChange={(val) => updateField("about", "title", val)} />
                    <EditorField label="Description" value={appearance?.about?.description} onChange={(val) => updateField("about", "description", val)} type="textarea" rows={5} />
                    <ImageUploadField label="Side Visual" value={appearance?.about?.image} onChange={(url) => updateField("about", "image", url)} uploading={isUploading === "about-image"} onUpload={(e) => handleImageUpload(e, "about", "image")} />
                  </div>
                )}

                {activeSection === "story" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Heading" value={appearance?.story?.title} onChange={(val) => updateField("story", "title", val)} />
                    <EditorField label="Subtitle" value={appearance?.story?.subtitle} onChange={(val) => updateField("story", "subtitle", val)} type="textarea" />
                    <ImageUploadField label="Philosophy Visual" value={appearance?.story?.image} onChange={(url) => updateField("story", "image", url)} uploading={isUploading === "story-image"} onUpload={(e) => handleImageUpload(e, "story", "image")} />
                  </div>
                )}

                {activeSection === "testimonials" && (
                  <div className="grid grid-cols-1 gap-8">
                    <EditorField label="Section Heading" value={appearance?.testimonials?.heading} onChange={(val) => updateField("testimonials", "heading", val)} />
                    <EditorField label="Subheadline" value={appearance?.testimonials?.subtitle} onChange={(val) => updateField("testimonials", "subtitle", val)} type="textarea" />
                  </div>
                )}

                {activeSection === "contact" && (
                  <div className="grid grid-cols-2 gap-8">
                    <EditorField label="Official Email" value={appearance?.contact?.email} onChange={(val) => updateField("contact", "email", val)} />
                    <EditorField label="Support Line" value={appearance?.contact?.mobile} onChange={(val) => updateField("contact", "mobile", val)} />
                  </div>
                )}

                <div className="pt-12 border-t border-white/5">
                  <button 
                    onClick={handleSaveDraft}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-sm uppercase tracking-[0.2em] transition-all border border-white/10"
                  >
                    <Save className="w-5 h-5 text-primary" /> Save Changes to Draft
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Sidebar: Live Preview Screen */}
        <aside className="flex-1 lg:flex-[0_0_400px] xl:lg:flex-[0_0_500px] border-l border-white/5 bg-black/40 relative overflow-hidden shrink-0 flex flex-col">
          <div className="h-14 bg-black/40 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real-time Preview</span>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
          </div>
          
          <div ref={previewContainerRef} className="flex-1 overflow-hidden p-4 xl:p-8 flex items-center justify-center bg-[#09090B]">
            <div className={`transition-all duration-700 h-full border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-background relative ${previewMode === "desktop" ? "w-full" : "w-[320px]"}`}>
              <div className={`absolute inset-0 ${previewMode === "mobile" ? 'overflow-y-auto' : ''}`}>
                <div 
                  className="origin-top-left transition-transform duration-500"
                  style={{ 
                    width: previewMode === "desktop" ? "1440px" : "100%",
                    transform: previewMode === "desktop" ? `scale(${previewScale})` : 'none',
                    height: previewMode === "desktop" ? `${100 / previewScale}%` : "100%"
                  }}
                >
                {fetchError ? (
                  <div className="p-20 text-center">
                    <div className="text-primary text-4xl mb-4 font-black italic uppercase">System Alert</div>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">{fetchError}</p>
                  </div>
                ) : (
                  <HomeClient 
                    initialAppearance={appearance} 
                    initialProducts={products} 
                    initialReviews={reviews} 
                    isEditor={true} 
                  />
                )}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 right-10 pointer-events-none">
            <div className="bg-primary/10 backdrop-blur-3xl border border-primary/20 px-4 py-2 rounded-xl">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Draft Context Active</span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

// Helper Components
function EditorField({ label, value, onChange, type = "text", rows = 3 }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">{label}</label>
      {type === "textarea" ? (
        <textarea 
          rows={rows}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none"
        />
      ) : (
        <input 
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-bold focus:outline-none focus:border-primary transition-all"
        />
      )}
    </div>
  );
}

function ImageUploadField({ label, value, uploading, onUpload, onChange }: any) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">{label}</label>
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <input 
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-[10px] font-mono focus:outline-none focus:border-primary transition-all"
              placeholder="https://..."
            />
          </div>
          <label className="cursor-pointer group flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-4 transition-all">
            <Upload className={`w-4 h-4 ${uploading ? 'animate-bounce text-primary' : 'text-zinc-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">
              {uploading ? 'Syncing Asset...' : 'Upload New Asset'}
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
          </label>
        </div>
        <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-2">
          {value ? (
            <img src={value} className="w-full h-full object-cover rounded-lg" alt="Preview" />
          ) : (
            <ImageIcon className="w-8 h-8 text-zinc-800" />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductSelector({ label, products, selectedIds, onChange }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = products.filter((p: any) => 
    (typeof p.title === 'string' ? p.title : (p.title?.en || "")).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid: string) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">{label}</label>
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[400px]">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-xs focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
          {filtered.map((product: any) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <div 
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                  <img src={product.image_url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-[11px] font-bold text-white truncate">
                    {typeof product.title === 'string' ? product.title : (product.title?.en || "Untitled Product")}
                  </div>
                  <div className="text-[9px] text-zinc-500">₹{product.price}</div>
                </div>
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-white/10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id: string) => {
          const product = products.find(p => p.id === id);
          if (!product) return null;
          return (
            <div key={id} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
              <span className="text-[9px] font-bold text-primary truncate max-w-[100px]">
                {typeof product.title === 'string' ? product.title : (product.title?.en || "...")}
              </span>
              <button onClick={() => toggleProduct(id)} className="text-primary hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

