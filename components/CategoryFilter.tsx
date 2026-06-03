'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const categories = ['Todas', 'Ropa', 'Tecnologia', 'Deportes', 'Hogar', 'Accesorios'];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Todas';
  const currentSearch = searchParams.get('q') || '';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== 'Todas') params.set('category', category);
    if (currentSearch) params.set('q', currentSearch);
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
            currentCategory === cat
              ? 'bg-[#2E7D32] text-white'
              : 'bg-white text-[#5D4037] border-2 border-[#2E7D32]/30 hover:border-[#2E7D32] hover:text-[#2E7D32]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
