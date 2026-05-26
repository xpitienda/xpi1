// components/CategoryFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const categories = ['Todas', 'General', 'Ropa', 'Tecnologia', 'Hogar', 'Deportes'];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Todas';
  const currentSearch = searchParams.get('q') || '';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    
    if (category !== 'Todas') {
      params.set('category', category);
    }
    
    if (currentSearch) {
      params.set('q', currentSearch);
    }
    
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentCategory === cat
              ? 'bg-xpi-green text-white shadow-lg scale-105'
              : 'bg-xpi-purple-light/30 text-gray-300 border border-xpi-purple-glow/30 hover:border-xpi-green/50 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
