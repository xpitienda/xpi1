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

    // Redirect to WhatsApp in same window
    window.location.href = whatsappUrl
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href="/catalog"
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Catalogo</span>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Tu carrito esta vacio
          </h1>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
            Agrega productos desde el catalogo para comenzar tu compra
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Ir al Catalogo
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/catalog"
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Catalogo</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Mi Carrito</h1>
          <button
            onClick={() => {
              clearCart()
              showToast("Carrito vaciado", "info")
            }}
            className="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors"
          >
            Vaciar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl p-4 border border-border flex gap-4"
            >
              {/* Product Image - Fixed 48x48px */}
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
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
                <h3 className="font-medium text-foreground text-sm truncate">
                  {item.name}
                </h3>
                {item.category && (
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                )}
                <p className="font-semibold text-accent text-sm mt-1">
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
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-medium text-foreground text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-5 border border-border mb-6">
          <h2 className="font-semibold text-foreground mb-4">
            Resumen del Pedido
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} productos)</span>
              <span className="text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envio</span>
              <span className="text-accent font-medium">A convenir</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-accent text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button - WhatsApp */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full py-4 rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-5 h-5" />
          {isCheckingOut ? "Redirigiendo a WhatsApp..." : "Finalizar Compra por WhatsApp"}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Seras redirigido a WhatsApp para confirmar tu pedido
        </p>
      </main>
    </div>
  )
}
