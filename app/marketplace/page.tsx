"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Store, Package, Search, Filter } from "lucide-react"

const sampleProducts = [
  {
    id: "1",
    name: "Jean Skinny Tiro Alto Premium",
    price: 89900,
    originalPrice: 119900,
    image: "/images/jean-skinny.jpeg",
    category: "Jeans",
    seller: "XPI Tienda",
  },
  {
    id: "2",
    name: "Jean Classic Fit",
    price: 79900,
    image: "/images/jean-c2.jpg",
    category: "Jeans",
    seller: "XPI Tienda",
  },
  {
    id: "3",
    name: "Jean Bootcut",
    price: 94900,
    image: "/images/jean-c3.png",
    category: "Jeans",
    seller: "XPI Tienda",
  },
  {
    id: "4",
    name: "Jean Relaxed",
    price: 84900,
    image: "/images/jean-c4.png",
    category: "Jeans",
    seller: "XPI Tienda",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const categories = ["Todos", "Jeans", "Camisas", "Accesorios"]

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
              </Link>
              <div className="flex items-center gap-2">
                <Store className="w-6 h-6 text-green-400" />
                <h1 className="text-xl font-bold text-white">XPI Marketplace</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Cart and Sell buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/marketplace/vender"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition-colors"
              >
                <Package className="w-4 h-4" />
                Vender
              </Link>
              <Link
                href="/marketplace/carrito"
                className="relative p-2 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-green-600 p-8 mb-8">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bienvenido al Marketplace
            </h2>
            <p className="text-purple-100 text-lg max-w-xl">
              Encuentra los mejores productos de moda o vende los tuyos en nuestra plataforma
            </p>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-32 h-32 bg-green-400/20 rounded-full blur-2xl" />
        </div>

        {/* Categories Filter */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-purple-400 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="aspect-square relative overflow-hidden bg-slate-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-purple-400 mb-1">{product.seller}</p>
                <h3 className="text-white font-medium mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-slate-500 text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <button className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No se encontraron productos</p>
          </div>
        )}

        {/* Mobile Sell Button */}
        <Link
          href="/marketplace/vender"
          className="sm:hidden fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium shadow-lg shadow-green-500/30 transition-colors"
        >
          <Package className="w-5 h-5" />
          Vender
        </Link>
      </main>
    </div>
  )
}
