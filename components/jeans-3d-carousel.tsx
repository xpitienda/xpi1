"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface JeansCarouselProps {
  images: string[]
}

export function Jeans3DCarousel({ images }: JeansCarouselProps) {
  const [rotation, setRotation] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 30)

    return () => clearInterval(interval)
  }, [isAutoRotating])

  useEffect(() => {
    // Calculate which image should be in front based on rotation
    const segmentAngle = 360 / images.length
    const normalizedRotation = ((rotation % 360) + 360) % 360
    const newIndex = Math.floor(normalizedRotation / segmentAngle) % images.length
    setActiveIndex(newIndex)
  }, [rotation, images.length])

  const handleMouseEnter = () => setIsAutoRotating(false)
  const handleMouseLeave = () => setIsAutoRotating(true)

  const radius = 180
  const itemCount = images.length

  return (
    <div 
      className="relative w-[400px] h-[500px] perspective-[1000px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" />
      </div>

      {/* Platform */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-4 bg-gradient-to-r from-transparent via-stone-300 to-transparent rounded-full blur-sm" />

      {/* 3D Carousel Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-48 h-80"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${-rotation}deg)`,
            transition: isAutoRotating ? "none" : "transform 0.3s ease-out",
          }}
        >
          {images.map((img, index) => {
            const angle = (360 / itemCount) * index
            const isActive = index === activeIndex

            return (
              <div
                key={index}
                className="absolute w-48 h-80 left-0 top-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <div
                  className={`relative w-full h-full rounded-xl overflow-hidden transition-all duration-300 ${
                    isActive ? "shadow-2xl shadow-blue-500/30 scale-105" : "shadow-lg opacity-70"
                  }`}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={`Jean ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                      <span className="text-stone-400 text-sm">Imagen {index + 1}</span>
                    </div>
                  )}

                  {/* Reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setRotation((prev) => prev - 60)}
          className="w-10 h-10 rounded-full bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const targetAngle = (360 / itemCount) * index
                setRotation(targetAngle)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? "bg-blue-500 w-4" : "bg-stone-400"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setRotation((prev) => prev + 60)}
          className="w-10 h-10 rounded-full bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <h3 className="text-xl font-bold text-stone-800">Coleccion Jeans</h3>
        <p className="text-sm text-stone-500">Gira para explorar</p>
      </div>
    </div>
  )
}
