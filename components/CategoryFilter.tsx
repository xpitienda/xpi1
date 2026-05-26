"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = ["Todas", "General", "Ropa", "Tecnologia", "Hogar", "Deportes"];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "Todas";
  const currentSearch = searchParams.get("q") || "";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    
    if (category !== "Todas") {
      params.set("category", category);
    }
    
    if (currentSearch) {
      params.set("q", currentSearch);
    }
    
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: currentCategory === cat ? "#00d4aa" : "rgba(45, 27, 78, 0.3)",
            color: currentCategory === cat ? "#ffffff" : "#d1d5db",
            border: currentCategory === cat ? "none" : "1px solid rgba(107, 63, 160, 0.3)",
            transform: currentCategory === cat ? "scale(1.05)" : "scale(1)",
            boxShadow: currentCategory === cat ? "0 4px 15px rgba(0, 212, 170, 0.3)" : "none"
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
