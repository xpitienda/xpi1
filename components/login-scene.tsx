"use client"

import { useState, useTransition } from "react"
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react"
import { loginAction } from "@/lib/login-action"

interface LoginSceneProps {
  onNavigate: (direction: "next" | "prev") => void
  currentScene: number
}

export function LoginScene({ onNavigate }: LoginSceneProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loggedUser, setLoggedUser] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    startTransition(async () => {
      const result = await loginAction(email, password)
      if (!result.success) {
        setError(result.error || "Credenciales incorrectas")
        return
      }
      setSuccess(true)
      setLoggedUser(result.user?.nombre || result.user?.email || "Usuario")
      setTimeout(() => onNavigate("next"), 1400)
    })
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">

      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
        <span className="text-purple-400">Iniciar</span>{" "}
        <span className="text-green-300">Sesion</span>
      </h1>

      {/* Neon rotating border wrapper */}
      <div className="login-card-wrapper relative w-full max-w-md">
        <div className="login-neon-ring absolute -inset-[2px] rounded-2xl z-0" />
        <div className="login-neon-blur absolute -inset-[6px] rounded-2xl z-0" />

        {/* Card body */}
        <div className="relative z-10 rounded-2xl bg-[#0d0620] border border-purple-900/60 p-8 md:p-10">

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-900/80 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-900/60">
              <ShieldCheck className="w-8 h-8 text-green-300" />
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-green-300" />
              </div>
              <p className="text-green-300 text-xl font-semibold">
                Bienvenido, {loggedUser}
              </p>
              <p className="text-purple-300 text-sm mt-2">Accediendo a la tienda...</p>
              <div className="mt-4 flex justify-center">
                <span className="w-5 h-5 border-2 border-green-400/30 border-t-green-300 rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-2">
                <p className="text-purple-300 text-sm">
                  Ingresa con tu correo registrado
                </p>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-purple-200">
                  Correo electronico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-3 rounded-xl bg-purple-950/70 border border-purple-600/40 text-white placeholder-purple-500/50 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-purple-200">
                  Contrasena
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-purple-950/70 border border-purple-600/40 text-white placeholder-purple-500/50 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/25 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-green-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar" : "Mostrar"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200
                  bg-gradient-to-r from-purple-700 via-purple-600 to-green-700
                  hover:from-purple-600 hover:via-purple-500 hover:to-green-600
                  shadow-lg shadow-purple-900/60
                  disabled:opacity-60 disabled:cursor-not-allowed
                  active:scale-[0.98]"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Ingresar
                  </span>
                )}
              </button>

              <p className="text-purple-500/60 text-xs text-center pt-1">
                Ingresa con tu correo registrado en el sistema
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
