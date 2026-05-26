"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, ArrowLeft, Filter, X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  is_active: boolean
}

const CATEGORIES = [
  "Todos",
  "Jeans",
  "Camisetas",
  "Vestidos",
  "Accesorios",
  "Zapatos",
]

// Demo products for when API is not available
const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Jean Skinny Tiro Alto Premium",
    description: "Jean de alta calidad con corte skinny y tiro alto",
    price: 89900,
    image_url: "/images/jean-skinny.jpeg",
    category: "Jeans",
    stock: 15,
    is_active: true,
  },
  {
    id: 2,
    name: "Jean Clasico Azul",
    description: "Jean clasico en tono azul oscuro",
    price: 79900,
    image_url: "/images/jean-c2.jpg",
    category: "Jeans",
    stock: 20,
    is_active: true,
  },
  {
    id: 3,
    name: "Jean Mom Fit",
    description: "Jean estilo mom fit con cintura alta",
    price: 94900,
    image_url: "/images/jean-c3.png",
    category: "Jeans",
    stock: 12,
    is_active: true,
  },
  {
    id: 4,
    name: "Jean Wide Leg",
    description: "Jean de pierna ancha moderno",
    price: 99900,
    image_url: "/images/jean-c4.png",
    category: "Jeans",
    stock: 8,
    is_active: true,
  },
  {
    id: 5,
    name: "Jean Boyfriend",
    description: "Jean estilo boyfriend relajado",
    price: 84900,
    image_url: "/images/jean-c5.png",
    category: "Jeans",
    stock: 18,
    is_active: true,
  },
  {
    id: 6,
    name: "Jean Cargo",
    description: "Jean cargo con bolsillos laterales",
    price: 104900,
    image_url: "/images/jean-c6.png",
    category: "Jeans",
    stock: 10,
    is_active: true,
  },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart, itemCount } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setProducts(data)
            setFilteredProducts(data)
          } else {
            setProducts(DEMO_PRODUCTS)
            setFilteredProducts(DEMO_PRODUCTS)
          }
        } else {
          setProducts(DEMO_PRODUCTS)
          setFilteredProducts(DEMO_PRODUCTS)
        }
      } catch {
        setProducts(DEMO_PRODUCTS)
        setFilteredProducts(DEMO_PRODUCTS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = products

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "Todos") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    setFilteredProducts(result)
  }, [searchQuery, selectedCategory, products])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    })
    showToast(`${product.name} agregado al carrito`, "success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Volver</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-bold text-purple-800">
              Catalogo
            </h1>

            <Link
              href="/cart"
              className="relative p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-purple-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 transition-colors md:hidden"
            >
              <Filter className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {/* Category Filters - Desktop */}
          <div className="hidden md:flex gap-2 mt-4 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="md:hidden bg-white border-t border-purple-100 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-purple-800">Categorias</span>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-purple-600" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setShowFilters(false)
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-purple-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-purple-100 rounded w-3/4" />
                  <div className="h-4 bg-purple-100 rounded w-1/2" />
                  <div className="h-10 bg-purple-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-purple-600">
              Intenta con otra busqueda o categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300"
              >
                <div className="aspect-square relative overflow-hidden bg-purple-50">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-purple-900 text-sm sm:text-base line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-green-600 mb-3">
                    {formatPrice(product.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button - Mobile */}
      {itemCount > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-6 right-6 md:hidden flex items-center gap-2 px-5 py-3 rounded-full bg-green-600 text-white font-semibold shadow-lg shadow-green-300 hover:bg-green-700 transition-all z-50"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Ver Carrito ({itemCount})</span>
        </Link>
      )}
    </div>
  )
}
