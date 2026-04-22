"use client";

import { use, useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCards";
import { getProducts } from "@/actions/productActions";
import { getCategories } from "@/actions/adminActions";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const [category, setCategory] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const categoryId = `cat-${id}`;
      const [categories, allProducts] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      
      const foundCategory = categories.find((c: any) => c.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        setCategoryProducts(allProducts.filter((p: any) => p.categoryId === categoryId));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    notFound();
    return null;
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto px-4">
      <header className="mb-16 bg-[#09090B] p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/5 relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative">
          <div className="w-40 h-40 rounded-[2rem] overflow-hidden shrink-0 border border-white/10 shadow-2xl group-hover:border-primary/50 transition-all duration-500">
            <img 
              src={category.imageUrl || "/placeholder-category.png"} 
              alt={typeof category.title === 'object' && category.title !== null ? ((category.title as any).en || "") : (category.title || "")} 
              className="w-full h-full object-cover transition-all duration-700" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
              }}
            />
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Elite Category Segment</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter italic uppercase">
              {typeof category.title === 'object' && category.title !== null ? ((category.title as any).en || "") : (category.title || "Unknown")} <span className="text-primary/50">Assets</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl text-sm font-medium leading-relaxed uppercase tracking-widest italic">
              {typeof category.description === 'object' && category.description !== null ? ((category.description as any).en || "") : (category.description || "")}
            </p>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-12 px-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-[1px] bg-primary/50" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {categoryProducts.length > 0 ? "Available Acquisitions" : "No Assets Staged"}
            </h2>
          </div>
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            {categoryProducts.length} Results
          </div>
        </div>
        
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
            {categoryProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.02] p-20 rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
            <h3 className="text-2xl font-black text-white mb-4 uppercase italic italic tracking-tighter">Vault Entry Pending</h3>
            <p className="text-zinc-500 max-w-md mx-auto text-xs font-bold uppercase tracking-widest leading-relaxed">
              Our curators are currently vetting new {typeof category.title === 'object' && category.title !== null ? ((category.title as any).en || "") : (category.title || "")} assets. check back shortly for deployment.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
