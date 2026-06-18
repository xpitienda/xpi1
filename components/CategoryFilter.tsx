'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Todas';
  const currentSearch = searchParams.get('q') || '';
  const [categories, setCategories] = useState<string[]>(['Todas']);

  useEffect(() => {
    fetch('/api/admin/categories', {
      headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
    })
      .then(res => res.json())
      .then(data => setCategories(['Todas', ...data.map((c: any) => c.name)]))
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

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
