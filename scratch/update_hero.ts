import { supabase } from "../src/lib/supabase";

async function updateHero() {
  const currentAppearance = {
    hero: {
      title: 'Master the Art of <span class="text-primary neon-text">Presentation Design</span>',
      subtitle: "Elevate your visual storytelling with our curated collection of architectural-grade presentation assets. Experience structural clarity and cinematic impact.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e5381bb6e?auto=format&fit=crop&q=80",
      badge: "THE PROFESSIONAL STANDARD"
    },
    about: {
      title: 'The Digital <span class="text-primary">Atelier</span>',
      description: "We are a specialized laboratory of digital architects, dedicated to engineering the most sophisticated presentation frameworks in the modern era.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
    },
    story: {
      title: `Beyond the <br /> <span class="text-primary">Standard</span>`,
      subtitle: "Elevating professional narratives into cinematic experiences of architectural clarity.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
    },
    site: {
      logo: "/logo.png",
      name: "Slideverse"
    },
    contact: {
      email: "support@slideverse.pro",
      mobile: "+91 99999 99999"
    },
    buttons: {
      primary: { label: "Acquire Now", link: "/#featured" },
      secondary: { label: "Learn More", link: "/#story" }
    }
  };

  const { error } = await supabase
    .from('appearance')
    .upsert({ id: 'global', data: currentAppearance });

  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Hero section updated with styled title and shortened subtitle.");
  }
}

updateHero();
