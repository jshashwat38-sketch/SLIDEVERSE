export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import BundleDetailClient from "./BundleDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBundleBySlug(slugOrId: string) {
  // First try by slug
  let { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("title->>slug", slugOrId)
    .maybeSingle();

  // If not found, try by id (in case slug is actually an id)
  if (!data) {
    const { data: dataById, error: errorById } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("id", slugOrId)
      .maybeSingle();
    data = dataById;
    error = errorById;
  }

  if (error || !data) {
    console.error("Error fetching bundle:", error);
    return null;
  }
  
  // Verify it's a bundle
  if (!data.title?.is_bundle) return null;

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) return { title: "Bundle Not Found | Slideverse" };

  return {
    title: `${bundle.title.en || "Premium Bundle"} | Slideverse`,
    description: bundle.title.short_description || "Premium presentation templates bundle.",
  };
}

export default async function BundlePage({ params }: Props) {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  return <BundleDetailClient bundle={bundle} />;
}
