"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Eye, EyeOff, LogIn, ChevronLeft, ChevronRight } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/catalog");
  };

  const handleAvance = () => {
    router.push("/catalog");
  };

  const handleRetroceso = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 50%, #2d1b4e 100%)" }}>
      {/* Top gradient line */}
      <div className="h-1" style={{ background: "linear-gradient(90deg, transparent, #00d4aa, transparent)" }} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo-xpitienda.png"
            alt="XPI Tienda"
            width={220}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          <span className="text-white">Iniciar </span>
          <span style={{ color: "#00d4aa" }}>Sesion</span>
        </h1>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div 
            className="relative p-[2px] rounded-2xl"
            style={{ background: "linear-gradient(180deg, #6b3fa0 0%, #4a2875 50%, #2d1b4e 100%)" }}
          >
            <div className="rounded-2xl p-8" style={{ background: "rgba(26, 10, 46, 0.95)" }}>
              {/* Shield Icon */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ 
                    background: "linear-gradient(180deg, #2d1b4e, #1a0a2e)",
                    border: "1px solid rgba(107, 63, 160, 0.5)"
                  }}
                >
                  <ShieldCheck className="w-8 h-8" style={{ color: "#00d4aa" }} />
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-center text-gray-400 mb-6">
                Ingresa con tu correo registrado
              </p>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Correo electronico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
                    style={{ 
                      background: "rgba(45, 27, 78, 0.5)",
                      border: "1px solid rgba(107, 63, 160, 0.3)"
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Contrasena
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors pr-12"
                      style={{ 
                        background: "rgba(45, 27, 78, 0.5)",
                        border: "1px solid rgba(107, 63, 160, 0.3)"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{ 
                    background: "linear-gradient(90deg, #00d4aa 0%, #00a896 100%)",
                    boxShadow: "0 4px 15px rgba(0, 212, 170, 0.3)"
                  }}
                >
                  <LogIn className="w-5 h-5" />
                  Ingresar
                </button>
              </form>

              {/* Footer text */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Ingresa con tu correo registrado en el sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pb-8 pt-4">
        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ background: currentPage === 0 ? "#00d4aa" : "#6b3fa0" }}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{ background: currentPage === 1 ? "#00d4aa" : "#6b3fa0" }}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center">
            <button
              onClick={handleRetroceso}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
              style={{ 
                background: "#3b82f6",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
              }}
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </button>
            <span className="text-sm mt-2 font-medium" style={{ color: "#3b82f6" }}>Retroceso</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleAvance}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
              style={{ 
                background: "#f97316",
                boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)"
              }}
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </button>
            <span className="text-sm mt-2 font-medium" style={{ color: "#f97316" }}>Avance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
