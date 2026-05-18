"use client"

import { X, Download, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useCatalog } from "@/contexts/catalog-context"

interface CatalogModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CatalogModal({ isOpen, onClose }: CatalogModalProps) {
  const { images, removeImage } = useCatalog()

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = name || "imagen-catalogo.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Modal - full screen */}
      <div className="relative w-screen h-screen bg-green-50 border-2 border-purple-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200 bg-gradient-to-r from-purple-200 to-purple-300">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-purple-800" />
            <h2 className="text-2xl font-bold text-purple-900">Catalogo de Productos</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-purple-800" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {images.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                No hay imagenes en el catalogo
              </h3>
              <p className="text-purple-600">
                Sube imagenes desde los espacios de productos para verlas aqui
              </p>
            </div>
          ) : (
            <>
              <p className="text-purple-700 mb-4">
                {images.length} {images.length === 1 ? "imagen" : "imagenes"} en el catalogo
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-white rounded-xl overflow-hidden shadow-md border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />

                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleDownload(image.url, image.name)}
                          className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 hover:scale-100 transition-all"
                          title="Descargar"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 hover:scale-100 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-green-50">
                      <p className="font-medium text-purple-800 truncate">{image.name}</p>
                      <p className="text-sm text-purple-500">
                        {new Date(image.uploadedAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
