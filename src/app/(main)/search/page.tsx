"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getProducts } from "@/actions/productActions";
import { getCategories } from "@/actions/adminActions";
import { ProductCard } from "@/components/products/ProductCards";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getProducts(), getCategories()]).then(([customProducts, allCategories]) => {
      // Filter custom products based on search
      const filteredProducts = query 
        ? customProducts.filter((p: any) => 
            p.title.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
          )
        : customProducts;
        
      setProducts(filteredProducts);
      
      // Filter categories
      const filteredCategories = query
        ? allCategories.filter((c: any) => 
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query)
          )
        : allCategories;
        
      setCategories(filteredCategories);
      setIsLoading(false);
    });
  }, [query]);

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4 p-8">Loading results...</div>;
  }

  const hasResults = products.length > 0 || categories.length > 0;

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 py-12">
      <header className="mb-16 bg-[#09090B] p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/5 relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Neural Search Interface</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter italic uppercase">
            {query ? (
              <>Search Results for <span className="text-primary">"{query}"</span></>
            ) : (
              <>All <span className="text-primary">Vault</span> Entries</>
            )}
          </h1>
          <p className="text-zinc-500 max-w-2xl text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-widest italic">
            Found {products.length + categories.length} calibrated architectural assets.
          </p>
        </div>
      </header>

      {!hasResults && (
        <div className="bg-white/[0.02] p-20 rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Null Search Yield</h2>
          <p className="text-zinc-500 max-w-md mx-auto text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed italic">
            We couldn't find any products or categories matching your calibrated query. Try adjusting your parameters.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12 px-4">
            <div className="w-8 h-[1px] bg-primary/50" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Matched Acquisitions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-12 px-4">
            <div className="w-8 h-[1px] bg-primary/50" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Matched Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map(c => (
              <ProductCard 
                key={c.id} 
                {...c} 
                title={typeof c.title === 'object' && c.title !== null ? (c.title.en || (Object.values(c.title)[0] as string) || "") : (c.title || "")}
                description={typeof c.description === 'object' && c.description !== null ? (c.description.en || (Object.values(c.description)[0] as string) || "") : (c.description || "")}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
