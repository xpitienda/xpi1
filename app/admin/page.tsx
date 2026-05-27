'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { 
  Shield, LogOut, ShoppingBag, Plus, ShoppingCart, 
  Trash2, Package, DollarSign, Edit, X, Check,
  AlertCircle
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, logout } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Verificar autenticación
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    // Cargar productos
    fetchProducts();
  }, [isAdmin, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        showNotification('success', 'Producto eliminado correctamente');
      } else {
        showNotification('error', 'Error al eliminar el producto');
      }
    } catch (error) {
      showNotification('error', 'Error de conexion');
    }
    setDeleteConfirm(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]">
      
      {/* Header */}
      <header className="bg-[#1a0a2e]/95 backdrop-blur-sm border-b border-xpi-green/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_XpiTienda_sin_Fondo-removebg-preview-yVgQmLAPvivdFeznsaVzvVQlE2Y1zE.png"
                alt="XPI Tienda"
                width={120}
                height={50}
                className="object-contain"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 text-[#00FF41]">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Super Administrador</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar Sesion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl flex items-center gap-2 animate-slideIn ${
          notification.type === 'success' 
            ? 'bg-xpi-green/90 text-white' 
            : 'bg-red-500/90 text-white'
        }`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Panel de </span>
            <span className="text-xpi-green">Control</span>
          </h1>
          <p className="text-gray-400">Gestiona tu tienda desde aqui</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          {/* Ver Catalogo */}
          <button
            onClick={() => router.push('/catalog')}
            className="group p-6 bg-[#2d1b4e]/80 rounded-2xl border-2 border-[#6B2D8B]/40 hover:border-xpi-green transition-all hover:shadow-lg hover:shadow-xpi-green/20"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B2D8B] to-[#4a1f61] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">Ver Catalogo</h3>
            <p className="text-gray-400 text-sm">Explorar productos</p>
          </button>

          {/* Vender Productos */}
          <button
            onClick={() => router.push('/vender')}
            className="group p-6 bg-[#2d1b4e]/80 rounded-2xl border-2 border-[#6B2D8B]/40 hover:border-xpi-green transition-all hover:shadow-lg hover:shadow-xpi-green/20"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-xpi-green to-[#22A84A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">Agregar Producto</h3>
            <p className="text-gray-400 text-sm">Publicar nuevo</p>
          </button>

          {/* Carrito de Compras */}
          <button
            onClick={() => router.push('/cart')}
            className="group p-6 bg-[#2d1b4e]/80 rounded-2xl border-2 border-[#6B2D8B]/40 hover:border-xpi-green transition-all hover:shadow-lg hover:shadow-xpi-green/20"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22A84A] to-xpi-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">Carrito</h3>
            <p className="text-gray-400 text-sm">Ver compras</p>
          </button>

          {/* Estadisticas */}
          <div className="p-6 bg-[#2d1b4e]/80 rounded-2xl border-2 border-xpi-green/40">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B2D8B] to-xpi-green flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">Total Productos</h3>
            <p className="text-3xl font-bold text-xpi-green">{products.length}</p>
          </div>
        </div>

        {/* Products Management */}
        <div className="bg-[#2d1b4e]/60 rounded-2xl border-2 border-[#6B2D8B]/30 overflow-hidden">
          <div className="p-6 border-b border-[#6B2D8B]/30 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-xpi-green" />
              Gestionar Productos
            </h2>
            <button
              onClick={() => router.push('/vender')}
              className="px-4 py-2 bg-xpi-green hover:bg-xpi-green-dark text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-xpi-green/30 border-t-xpi-green rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No hay productos en el catalogo</p>
              <button
                onClick={() => router.push('/vender')}
                className="px-6 py-3 bg-xpi-green text-white rounded-xl font-medium hover:bg-xpi-green-dark transition-colors"
              >
                Agregar primer producto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a0a2e]/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Producto</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 hidden sm:table-cell">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Precio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B2D8B]/20">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#1a0a2e]/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#1a0a2e]"
                          />
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="px-3 py-1 bg-[#6B2D8B]/30 text-[#a855f7] rounded-full text-sm">
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-xpi-green">
                          ${Number(product.price).toLocaleString('es-CO')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {deleteConfirm === product.id ? (
                            <>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
