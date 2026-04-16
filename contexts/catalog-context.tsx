"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface CatalogImage {
  id: string
  url: string
  name: string
  uploadedAt: Date
}

interface CatalogContextType {
  images: CatalogImage[]
  addImage: (image: CatalogImage) => void
  removeImage: (id: string) => void
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<CatalogImage[]>([])

  const addImage = (image: CatalogImage) => {
    setImages((prev) => [...prev, image])
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <CatalogContext.Provider value={{ images, addImage, removeImage }}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (context === undefined) {
    throw new Error("useCatalog must be used within a CatalogProvider")
  }
  return context
}
