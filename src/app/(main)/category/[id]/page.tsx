import { getProducts } from "@/actions/productActions";
import { getCategories } from "@/actions/adminActions";
import { notFound } from "next/navigation";
import CategoryClientPage from "@/components/products/CategoryClientPage";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat: any) => ({
    id: cat.id.replace('cat-', '')
  }));
}

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  const foundCategory = categories.find((c: any) => c.id === id || c.id === `cat-${id}`);
  if (!foundCategory) {
    notFound();
  }

  const filteredProducts = allProducts.filter((p: any) => p.category_id === foundCategory.id || p.category_id === id);

  return (
    <CategoryClientPage category={foundCategory} products={filteredProducts} id={id} />
  );
}
