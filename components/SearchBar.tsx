'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(term.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="bg-xpi-green text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
