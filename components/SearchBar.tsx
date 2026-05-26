"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (term.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(term.trim())}`, { scroll: false });
      setTimeout(() => {
        window.location.href = `/catalog?q=${encodeURIComponent(term.trim())}`;
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="search"
            id="search-input"
            placeholder="Buscar productos..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
            style={{ 
              background: "rgba(45, 27, 78, 0.3)",
              border: "1px solid rgba(107, 63, 160, 0.3)"
            }}
          />
        </div>
        <button
          type="submit"
          className="text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 hover:opacity-90"
          style={{ background: "#f97316" }}
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>
    </form>
  );
}
