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
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            currentCategory === cat
              ? 'bg-xpi-green text-white'
              : 'bg-[#2d1b4e]/80 text-gray-300 border-2 border-xpi-green/30 hover:border-xpi-green hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
