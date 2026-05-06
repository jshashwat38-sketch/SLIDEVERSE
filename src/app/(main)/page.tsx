export const revalidate = 3600; // Revalidate every hour
import { getProducts } from "@/actions/productActions";
import { getAppearance, getReviews, getCategories } from "@/actions/adminActions";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  // Fetch all data in parallel on the server for instant rendering
  const [featuredProducts, appearance, reviews, categories] = await Promise.all([
    getProducts(),
    getAppearance(),
    getReviews(),
    getCategories()
  ]);

  return (
    <HomeClient 
      initialAppearance={appearance}
      initialProducts={featuredProducts}
      initialReviews={reviews}
      initialCategories={categories}
    />
  );
}
