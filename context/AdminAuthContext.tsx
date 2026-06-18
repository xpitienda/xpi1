'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (clave: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Credenciales del super administrador
const ADMIN_CLAVE = 'xpitienda';
const ADMIN_PASSWORD = '15321767';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar si hay sesiÃ³n guardada
    const adminSession = localStorage.getItem('xpi_admin_session');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (clave: string, password: string): boolean => {
    // Limpiar espacios y convertir a minúsculas para mayor tolerancia
    const claveLimpia = clave.trim().toLowerCase();
    const passwordLimpia = password.trim();
    
    console.log('Login intent:', { clave: claveLimpia, password: passwordLimpia });
    
    if (claveLimpia === ADMIN_CLAVE.toLowerCase() && passwordLimpia === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('xpi_admin_session', 'true');
      console.log('Login exitoso');
      return true;
    }
    console.log('Login fallido');
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('xpi_admin_session');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
