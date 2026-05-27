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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-xpi-purple/50 focus:ring-1 focus:ring-xpi-purple/50 transition-colors shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-xpi-purple text-white px-6 py-3 rounded-xl font-medium hover:bg-xpi-purple-dark transition-colors shadow-sm"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
