"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Upload, Package, Tag, FileText, DollarSign, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "General", label: "General", icon: "📦" },
  { value: "Ropa", label: "Ropa", icon: "👕" },
  { value: "Tecnologia", label: "Tecnologia", icon: "💻" },
  { value: "Hogar", label: "Hogar", icon: "🏠" },
  { value: "Deportes", label: "Deportes", icon: "⚽" },
];

export default function VenderPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "General",
    archivo: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, archivo: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    if (!formData.archivo) {
      setMensaje({ type: "error", text: "Debes seleccionar una imagen." });
      setLoading(false);
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append("file", formData.archivo);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || "Error subiendo imagen");

      const saveRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nombre,
          description: formData.descripcion,
          price: Number(formData.precio),
          category: formData.categoria,
          image_url: uploadData.url,
          stock: 1,
          is_active: 1
        }),
      });

      if (!saveRes.ok) throw new Error("Error guardando producto");

      setMensaje({ type: "success", text: "Producto publicado con exito!" });
      setFormData({ nombre: "", descripcion: "", precio: "", categoria: "General", archivo: null });
      setImagePreview(null);

    } catch (error: any) {
      setMensaje({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 50%, #2d1b4e 100%)" }}>
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ 
                background: "rgba(45, 27, 78, 0.5)",
                border: "1px solid rgba(107, 63, 160, 0.5)"
              }}
            >
              <Tag className="w-8 h-8" style={{ color: "#00d4aa" }} />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-white">Vende tu </span>
              <span style={{ color: "#00d4aa" }}>producto</span>
            </h1>
            <p className="text-gray-400">
              Publica gratis y llega a miles de compradores
            </p>
          </div>

          {/* Message Alert */}
          {mensaje && (
            <div 
              className="flex items-center gap-3 p-4 rounded-xl mb-6"
              style={{
                background: mensaje.type === "success" ? "rgba(0, 212, 170, 0.2)" : "rgba(239, 68, 68, 0.2)",
                color: mensaje.type === "success" ? "#00d4aa" : "#f87171",
                border: `1px solid ${mensaje.type === "success" ? "rgba(0, 212, 170, 0.3)" : "rgba(239, 68, 68, 0.3)"}`
              }}
            >
              {mensaje.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="font-medium">{mensaje.text}</p>
            </div>
          )}

          {/* Form Card */}
          <form 
            onSubmit={handleSubmit} 
            className="backdrop-blur-sm rounded-2xl overflow-hidden"
            style={{ 
              background: "rgba(26, 10, 46, 0.8)",
              border: "1px solid rgba(107, 63, 160, 0.3)"
            }}
          >
            
            {/* Image Upload Section */}
            <div 
              className="p-6"
              style={{ 
                background: "rgba(45, 27, 78, 0.2)",
                borderBottom: "1px solid rgba(107, 63, 160, 0.3)"
              }}
            >
              <label className="block text-sm font-semibold text-white mb-3">
                <Upload className="w-4 h-4 inline-block mr-2" />
                Foto del producto
              </label>
              
              <div className="relative">
                {imagePreview ? (
                  <div 
                    className="relative w-full aspect-video rounded-xl overflow-hidden"
                    style={{ background: "rgba(45, 27, 78, 0.3)" }}
                  >
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, archivo: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label 
                    className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer transition-all"
                    style={{ borderColor: "rgba(107, 63, 160, 0.5)" }}
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Haz clic o arrastra una imagen</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-5">
              
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Package className="w-4 h-4" />
                  Nombre del producto
                </label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all" 
                  style={{ 
                    background: "rgba(45, 27, 78, 0.3)",
                    border: "1px solid rgba(107, 63, 160, 0.3)"
                  }}
                  placeholder="Ej: Zapatillas deportivas Nike" 
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Tag className="w-4 h-4" />
                  Categoria
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, categoria: cat.value })}
                      className="p-3 rounded-xl border-2 transition-all text-center"
                      style={{
                        borderColor: formData.categoria === cat.value ? "#00d4aa" : "rgba(107, 63, 160, 0.3)",
                        background: formData.categoria === cat.value ? "rgba(0, 212, 170, 0.2)" : "transparent",
                        color: formData.categoria === cat.value ? "#00d4aa" : "#9ca3af"
                      }}
                    >
                      <span className="text-xl block mb-1">{cat.icon}</span>
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <FileText className="w-4 h-4" />
                  Descripcion
                </label>
                <textarea 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all resize-none" 
                  style={{ 
                    background: "rgba(45, 27, 78, 0.3)",
                    border: "1px solid rgba(107, 63, 160, 0.3)"
                  }}
                  placeholder="Describe el estado, caracteristicas, medidas, etc." 
                  rows={4} 
                />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <DollarSign className="w-4 h-4" />
                  Precio (COP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <input 
                    type="number" 
                    name="precio" 
                    value={formData.precio} 
                    onChange={handleInputChange} 
                    required 
                    min="0"
                    step="100"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all" 
                    style={{ 
                      background: "rgba(45, 27, 78, 0.3)",
                      border: "1px solid rgba(107, 63, 160, 0.3)"
                    }}
                    placeholder="0" 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div 
              className="p-6"
              style={{ 
                background: "rgba(45, 27, 78, 0.2)",
                borderTop: "1px solid rgba(107, 63, 160, 0.3)"
              }}
            >
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                style={{ 
                  background: "linear-gradient(90deg, #00d4aa 0%, #00a896 100%)",
                  boxShadow: "0 4px 15px rgba(0, 212, 170, 0.3)"
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Publicar Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
