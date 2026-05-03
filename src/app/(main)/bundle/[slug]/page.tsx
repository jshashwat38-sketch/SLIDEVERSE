export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import BundleDetailClient from "./BundleDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

async function getBundleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("title->>slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching bundle:", error);
    return null;
  }
  
  // Verify it's a bundle
  if (!data.title?.is_bundle) return null;

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bundle = await getBundleBySlug(params.slug);
  if (!bundle) return { title: "Bundle Not Found | Slideverse" };

  return {
    title: `${bundle.title.en || "Premium Bundle"} | Slideverse`,
    description: bundle.title.short_description || "Premium presentation templates bundle.",
  };
}

export default async function BundlePage({ params }: Props) {
  const bundle = await getBundleBySlug(params.slug);

  if (!bundle) {
    notFound();
  }

  return <BundleDetailClient bundle={bundle} />;
}
