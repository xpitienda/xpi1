"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, ArrowLeft, SlidersHorizontal, X, Plus } from "lucide-react"
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

// Mock products for preview
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
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart, itemCount } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    // Simulate loading then show demo products
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Volver</span>
            </Link>

            <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              Catalogo
            </h1>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-colors md:hidden ${
                showFilters 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground text-sm">Categorias</span>
              <button onClick={() => setShowFilters(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="w-4 h-4 text-muted-foreground" />
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
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <Link 
            href="/vender"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            + Vender producto
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse"
              >
                <div className="aspect-[4/5] bg-secondary" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-5 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground text-sm">
              Intenta con otra busqueda o categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-secondary">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {/* Quick add button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs rounded-full font-medium border border-border">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-base font-semibold text-accent">
                    {formatPrice(product.price)}
                  </p>
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
          className="fixed bottom-6 right-6 md:hidden flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/30 hover:shadow-xl transition-all z-50"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Ver Carrito ({itemCount})</span>
        </Link>
      )}
    </div>
  )
}
