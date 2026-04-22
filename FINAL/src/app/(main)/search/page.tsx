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
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {query ? `Search results for "${query}"` : "All Products & Categories"}
        </h1>
        <p className="text-gray-600">
          Found {products.length + categories.length} results.
        </p>
      </header>

      {!hasResults && (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
          <p className="text-gray-600 mb-8">We couldn't find any products or categories matching your search.</p>
        </div>
      )}

      {products.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(c => (
              <ProductCard 
                key={c.id} 
                {...c} 
                title={typeof c.title === 'object' ? (c.title.en || Object.values(c.title)[0] as string) : c.title}
                description={typeof c.description === 'object' ? (c.description.en || Object.values(c.description)[0] as string) : c.description}
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
