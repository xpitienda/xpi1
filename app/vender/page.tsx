"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X, Loader2, CheckCircle, Camera } from "lucide-react"
import { useToast } from "@/contexts/toast-context"

const CATEGORIES = [
  "Jeans",
  "Camisetas",
  "Vestidos",
  "Accesorios",
  "Zapatos",
  "Otro",
]

export default function VenderPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("1")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { showToast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price || !category) {
      showToast("Por favor completa los campos requeridos", "error")
      return
    }

    setIsSubmitting(true)

    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSuccess(true)
    showToast("Producto publicado exitosamente!", "success")
    
    // Reset form
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setStock("1")
    setImageFile(null)
    setImagePreview(null)
    setIsSubmitting(false)
    
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Inicio</span>
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-foreground pr-16">
            Vender Producto
          </h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        {isSuccess && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3 text-accent animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Producto publicado exitosamente!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Imagen del Producto
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden border border-border bg-secondary">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-card/90 backdrop-blur-sm text-foreground rounded-full border border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full max-w-[200px] mx-auto cursor-pointer">
                <div className="aspect-square border-2 border-dashed border-border rounded-2xl bg-secondary/50 hover:bg-secondary hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground text-sm">
                      Subir imagen
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG hasta 5MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre del Producto <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Jean Skinny Tiro Alto"
              className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripcion
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu producto..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none text-sm"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Precio (COP) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="89900"
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Categoria <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar Producto"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Tu producto aparecera en el catalogo una vez publicado
        </p>
      </main>
    </div>
  )
}
