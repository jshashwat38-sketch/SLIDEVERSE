import { getProducts } from "@/actions/productActions";
import { getAppearance, getReviews } from "@/actions/adminActions";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  // Fetch data on the server for instant rendering
  const [featuredProducts, appearance, reviews] = await Promise.all([
    getProducts(),
    getAppearance(),
    getReviews()
  ]);

  return (
    <HomeClient 
      initialAppearance={appearance}
      initialProducts={featuredProducts}
      initialReviews={reviews}
    />
  );
}
