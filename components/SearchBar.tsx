// components/SearchBar.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (term.trim()) {
      // Forzar navegación completa
      router.push(`/catalog?q=${encodeURIComponent(term.trim())}`, { scroll: false });
      // Forzar recarga
      setTimeout(() => {
        window.location.href = `/catalog?q=${encodeURIComponent(term.trim())}`;
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          name="search"
          id="search-input"
          placeholder="Buscar productos..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          🔍 Buscar
        </button>
      </div>
    </form>
  );
}