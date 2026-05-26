"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/contexts/toast-context"

const WHATSAPP_NUMBER = "573234475311"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const { showToast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast("El carrito esta vacio", "error")
      return
    }

    setIsCheckingOut(true)

    // Build WhatsApp message
    const itemsList = items
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n")

    const message = encodeURIComponent(
      `Hola! Me gustaria hacer el siguiente pedido:\n\n${itemsList}\n\n*Total: ${formatPrice(total)}*\n\nGracias!`
    )

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

    // Open WhatsApp in same window
    window.location.href = whatsappUrl
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/catalog"
              className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Catalogo</span>
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-purple-900 mb-2">
            Tu carrito esta vacio
          </h1>
          <p className="text-purple-600 mb-8">
            Agrega productos desde el catalogo para comenzar tu compra
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            <ShoppingBag className="w-5 h-5" />
            Ir al Catalogo
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Catalogo</span>
          </Link>
          <h1 className="text-xl font-bold text-purple-800">Mi Carrito</h1>
          <button
            onClick={() => {
              clearCart()
              showToast("Carrito vaciado", "info")
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Vaciar
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex gap-4"
            >
              {/* Product Image - Fixed 48x48 */}
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-purple-50">
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-purple-900 text-sm sm:text-base truncate">
                  {item.name}
                </h3>
                {item.category && (
                  <span className="text-xs text-purple-500">{item.category}</span>
                )}
                <p className="font-bold text-green-600 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => {
                    removeFromCart(item.id)
                    showToast("Producto eliminado", "info")
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-semibold text-purple-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
          <h2 className="font-bold text-purple-900 text-lg mb-4">
            Resumen del Pedido
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-purple-600">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} productos)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Envio</span>
              <span className="text-green-600 font-medium">A convenir</span>
            </div>
            <div className="border-t border-purple-100 pt-3 flex justify-between text-lg font-bold">
              <span className="text-purple-900">Total</span>
              <span className="text-green-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-lg shadow-green-200 hover:from-green-600 hover:to-green-700 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-6 h-6" />
          {isCheckingOut ? "Redirigiendo..." : "Completar Pedido por WhatsApp"}
        </button>

        <p className="text-center text-sm text-purple-500 mt-4">
          Seras redirigido a WhatsApp para confirmar tu pedido
        </p>
      </main>
    </div>
  )
}
