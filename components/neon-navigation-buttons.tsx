"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NeonNavigationButtonsProps {
  onPrevious?: () => void
  onNext?: () => void
}

export function NeonNavigationButtons({ onPrevious, onNext }: NeonNavigationButtonsProps) {
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (timestamp - lastTimeRef.current >= 30) {
        setRotation((prev) => (prev + 3) % 360)
        lastTimeRef.current = timestamp
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const neonGradient = `conic-gradient(
    from ${rotation}deg,
    #3b82f6 0deg,
    #8b5cf6 60deg,
    #a855f7 120deg,
    #ef4444 180deg,
    #f97316 240deg,
    #3b82f6 300deg,
    #8b5cf6 360deg
  )`

  return (
    <div className="flex items-center gap-6">
      {/* Boton Retroceso - Azul */}
      <button
        onClick={onPrevious}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full transition-transform hover:scale-105 active:scale-95"
        aria-label="Retroceder"
      >
        {/* Neon border animation */}
        <div
          className="absolute inset-0 rounded-full p-[3px]"
          style={{
            background: neonGradient,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-md opacity-70"
            style={{
              background: neonGradient,
            }}
          />
          {/* Inner background */}
          <div className="relative w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
      </button>

      {/* Boton Avance - Naranja */}
      <button
        onClick={onNext}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full transition-transform hover:scale-105 active:scale-95"
        aria-label="Avanzar"
      >
        {/* Neon border animation */}
        <div
          className="absolute inset-0 rounded-full p-[3px]"
          style={{
            background: neonGradient,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-md opacity-70"
            style={{
              background: neonGradient,
            }}
          />
          {/* Inner background */}
          <div className="relative w-full h-full rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/50">
            <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>
      </button>
    </div>
  )
}
