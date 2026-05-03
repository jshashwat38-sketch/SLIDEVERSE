"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

  const [fetchError, setFetchError] = useState<string | null>(null);
  const isLoaded = useRef(false);
  const [previewScale, setPreviewScale] = useState(0.4);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;
    loadData();

    // Initial scale calculation
    const handleResize = () => {
      const availableWidth = window.innerWidth - 64 - 256; // aside widths
      if (availableWidth < 1000) {
        setPreviewScale(Math.max(0.2, (availableWidth - 100) / 1440));
      } else {
        setPreviewScale(0.25);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const sections = useMemo(() => [
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
  ], []);

  if (!appearance) return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090B]">
      <LogoLoader />
    </div>
  );

  console.log("AppearancePage: Rendering core UI...");

  return (
    <TopLevelErrorBoundary>
      <div className="absolute inset-0 flex flex-col bg-[#09090B] overflow-hidden text-zinc-300 font-sans z-[100]">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">
            Homepage <span className="text-primary">Visual Editor</span>
          </h1>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => { setPreviewMode("desktop"); setPreviewScale(0.4); }}
              className={`p-2 rounded-lg transition-all ${previewMode === "desktop" ? "bg-primary text-black" : "hover:text-white"}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { setPreviewMode("mobile"); setPreviewScale(0.85); }}
              className={`p-2 rounded-lg transition-all ${previewMode === "mobile" ? "bg-primary text-black" : "hover:text-white"}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5"
            title="Refresh System"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
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
        <aside className="w-60 border-r border-white/5 bg-black/20 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-4">
            <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-4">Page Architecture</h3>
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
                    className={`group flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-white/[0.01] border-white/5 hover:border-white/10 text-zinc-500"
                    }`}
                    onClick={() => setActiveSection(id)}
                  >
                    <GripVertical className="w-3 h-3 text-zinc-800 group-hover:text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing" />
                    <config.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider flex-1 truncate">{config.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleVisibility(id); }}
                      className={`p-1 rounded-md transition-all ${isVisible ? "text-primary hover:text-primary-hover" : "text-zinc-800 hover:text-zinc-600"}`}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        </aside>

        {/* Center: Editor Canvas */}
        <main className="flex-1 flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar relative">
          <div className="p-6 md:p-10 max-w-4xl mx-auto w-full pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shrink-0">
                    {(() => {
                      const Icon = sections.find(s => s.id === activeSection)?.icon || Settings;
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
                      {sections.find(s => s.id === activeSection)?.name}
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">System Configuration Layer v2.0</p>
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


              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed Bottom Action Bar for Editor */}
          <div className="sticky bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-3xl border-t border-white/10 flex items-center justify-between z-40">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-black font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? "Archiving..." : "Save Draft"}
              </button>
              <button 
                onClick={handleRevert}
                disabled={isReverting}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black text-[9px] uppercase tracking-[0.15em] transition-all border border-white/5"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Auto-save Enabled</span>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Live Preview Screen */}
        <aside className="w-[420px] border-l border-white/5 bg-black/40 relative overflow-hidden shrink-0 flex flex-col">
          <div className="h-12 bg-black/40 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Real-time Preview</span>
              <button 
                onClick={() => setPreviewScale(previewMode === "desktop" ? 0.4 : 0.8)}
                className="p-1.5 rounded-md hover:bg-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest border border-white/5 transition-all"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0.3" 
                max="1.0" 
                step="0.05" 
                value={previewScale} 
                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[8px] font-black text-primary uppercase w-8">{Math.round(previewScale * 100)}%</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-[#09090B] custom-scrollbar">
            <div 
              className={`transition-all duration-300 border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl bg-background origin-top`}
              style={{ 
                width: previewMode === "desktop" ? "1440px" : "375px",
                height: previewMode === "desktop" ? "2500px" : "812px",
                transform: `scale(${previewScale || 0.6})`,
                minWidth: previewMode === "desktop" ? "1440px" : "375px",
              }}
            >
                {fetchError ? (
                  <div className="p-20 text-center">
                    <div className="text-primary text-4xl mb-4 font-black italic uppercase">System Alert</div>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">{fetchError}</p>
                  </div>
                ) : (
                  <div className="h-full w-full pointer-events-none">
                    <PreviewErrorBoundary>
                      <HomeClient 
                        initialAppearance={appearance} 
                        initialProducts={products} 
                        initialReviews={reviews} 
                        isEditor={true} 
                      />
                    </PreviewErrorBoundary>
                  </div>
                )}
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

// Top Level Error Boundary
class TopLevelErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-12 text-center">
          <div className="max-w-xl">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Kernel Panic</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] leading-relaxed mb-10">
              A critical rendering exception has occurred in the CMS core. The system has been halted to prevent data corruption.
            </p>
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl mb-10 text-left">
              <p className="text-[10px] font-mono text-red-400 break-all">{this.state.error?.toString()}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
            >
              Reboot Terminal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Error Boundary for Preview
class PreviewErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 text-center bg-black/40 h-full flex flex-col items-center justify-center border border-primary/20 rounded-3xl m-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <X className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Preview Interrupted</h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest max-w-xs">The current draft configuration has caused a rendering exception. Please adjust your settings or revert to the last stable state.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-6 py-2 bg-primary text-black text-[8px] font-black uppercase tracking-widest rounded-lg"
          >
            Attempt Restoration
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function EditorField({ label, value, onChange, type = "text", rows = 3 }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">{label}</label>
      {type === "textarea" ? (
        <textarea 
          rows={rows}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-primary transition-all resize-none"
        />
      ) : (
        <input 
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-primary transition-all"
        />
      )}
    </div>
  );
}

    <div className="space-y-3">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">{label}</label>
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          <input 
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-[9px] font-mono focus:outline-none focus:border-primary transition-all"
            placeholder="Remote Asset URL..."
          />
          <label className="cursor-pointer group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-all">
            <Upload className={`w-3.5 h-3.5 ${uploading ? 'animate-bounce text-primary' : 'text-zinc-500'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">
              {uploading ? 'Archiving...' : 'Upload Local'}
            </span>
            <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
          </label>
        </div>
        <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
          {value ? (
            <img src={value} className="w-full h-full object-cover rounded-lg" alt="Preview" />
          ) : (
            <ImageIcon className="w-6 h-6 text-zinc-800" />
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

