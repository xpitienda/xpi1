"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X, Loader2, CheckCircle } from "lucide-react"
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

    try {
      let imageUrl = "/placeholder.svg"

      // If there's an image, upload to R2 first
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.url
        }
      }

      // Create product in database
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          image_url: imageUrl,
          category,
          stock: parseInt(stock),
          is_active: true,
        }),
      })

      if (res.ok) {
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
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        showToast("Error al publicar el producto", "error")
      }
    } catch {
      showToast("Error de conexion. Intenta de nuevo.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </Link>
          <h1 className="flex-1 text-center text-xl font-bold text-purple-800 pr-12">
            Vender Producto
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">Producto publicado exitosamente!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-purple-800 mb-2">
              Imagen del Producto
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-purple-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full aspect-video max-w-xs mx-auto cursor-pointer">
                <div className="h-full border-2 border-dashed border-purple-300 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-purple-700">
                      Subir imagen
                    </p>
                    <p className="text-sm text-purple-500">
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
            <label className="block text-sm font-semibold text-purple-800 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Jean Skinny Tiro Alto"
              className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-purple-800 mb-2">
              Descripcion
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu producto..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-purple-800 mb-2">
                Precio (COP) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="89900"
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-purple-800 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-purple-800 mb-2">
              Categoria *
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-purple-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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

        <p className="text-center text-sm text-purple-500 mt-6">
          Tu producto aparecera en el catalogo una vez publicado
        </p>
      </main>
    </div>
  )
}
