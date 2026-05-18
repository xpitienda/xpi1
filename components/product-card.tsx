"use client"

import Image from "next/image"
import { Heart, ShoppingCart, Plus, Upload } from "lucide-react"
import { useState, useRef } from "react"
import { useCatalog } from "@/contexts/catalog-context"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  discount?: number
  isPlaceholder?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  discount,
  isPlaceholder = false,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedName, setUploadedName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addImage } = useCatalog()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setUploadedImage(imageUrl)
        setUploadedName(file.name)
        
        // Add to catalog
        addImage({
          id: `${id}-${Date.now()}`,
          url: imageUrl,
          name: file.name,
          uploadedAt: new Date(),
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    if (isPlaceholder && !uploadedImage) {
      fileInputRef.current?.click()
    }
  }

  if (isPlaceholder && !uploadedImage) {
    return (
      <div
        onClick={handleClick}
        className="group relative bg-white rounded-xl overflow-hidden border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all duration-300 aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-purple-200"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
          <Upload className="w-8 h-8 text-purple-500 group-hover:text-purple-700" />
        </div>
        <p className="text-purple-700 font-medium">Agregar Producto</p>
        <p className="text-purple-500 text-sm mt-1">Haz clic para subir imagen</p>
      </div>
    )
  }

  const displayImage = uploadedImage || image
  const displayName = uploadedName || name

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-purple-400"
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-green-50">
        <Image
          src={displayImage}
          alt={displayName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />

        {/* Add to Cart Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-purple-900/60 to-transparent transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button className="w-full py-3 bg-white text-purple-900 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-purple-50">
        <h3 className="font-medium text-purple-900 mb-2 line-clamp-2">{displayName}</h3>
        {price > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-purple-800">
              ${price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-sm text-purple-400 line-through">
                ${originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        )}
        {uploadedImage && (
          <p className="text-green-600 text-sm mt-1">Agregado al catalogo</p>
        )}
      </div>
    </div>
  )
}
