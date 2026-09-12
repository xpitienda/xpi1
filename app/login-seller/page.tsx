'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/seller-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        localStorage.setItem('seller_session', JSON.stringify({
          id: data.seller.id,
          name: data.seller.full_name,
          email: data.seller.email,
          seriesId: data.seller.assigned_series_id
        }));
        
        setTimeout(() => {
          router.push('/seller/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="embossed-login-container">
      <div className="embossed-circle">
        {success ? (
          <div className="success-message">
            <div className="check-icon">✓</div>
            <h2>¡Bienvenido de vuelta!</h2>
            <p>Inicio Exitoso</p>
          </div>
        ) : (
          <>
            <h1 className="login-title">INICIAR SESIÓN</h1>
            
            {error && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="correo@ejemplo.com"
                  className="embossed-input"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="embossed-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="embossed-button"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="login-footer">
        ¿Problemas para ingresar?{' '}
        <a 
          href="https://wa.me/573234475311" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-link"
        >
          Contacta al administrador Wassap (57) 3234475311
        </a>
      </div>

      <style>{`
        .embossed-login-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-image: url('/xpilogo1.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 1rem;
          position: relative;
        }

        .embossed-login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          pointer-events: none;
        }

        .embossed-circle {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%);
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.4),
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 10px 20px rgba(0, 0, 0, 0.2),
            inset 0 -8px 20px rgba(0, 0, 0, 0.1),
            inset 0 8px 20px rgba(255, 255, 255, 0.9),
            0 0 60px rgba(0, 212, 255, 0.4),
            0 0 120px rgba(0, 153, 255, 0.2),
            0 0 180px rgba(0, 102, 255, 0.1),
            inset 0 0 60px rgba(0, 212, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          position: relative;
          z-index: 10;
          animation: float 6s ease-in-out infinite, moonGlow 4s ease-in-out infinite;
        }

        .embossed-circle::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          border-radius: 50%;
          background: transparent;
          box-shadow: 
            0 0 100px rgba(0, 212, 255, 0.3),
            0 0 200px rgba(0, 153, 255, 0.15);
          z-index: -1;
          animation: moonHalo 4s ease-in-out infinite;
        }

        .embossed-circle::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          right: 10%;
          bottom: 10%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes moonGlow {
          0%, 100% {
            box-shadow: 
              0 30px 60px rgba(0, 0, 0, 0.4),
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 10px 20px rgba(0, 0, 0, 0.2),
              inset 0 -8px 20px rgba(0, 0, 0, 0.1),
              inset 0 8px 20px rgba(255, 255, 255, 0.9),
              0 0 60px rgba(0, 212, 255, 0.4),
              0 0 120px rgba(0, 153, 255, 0.2),
              0 0 180px rgba(0, 102, 255, 0.1),
              inset 0 0 60px rgba(0, 212, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 30px 60px rgba(0, 0, 0, 0.4),
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 10px 20px rgba(0, 0, 0, 0.2),
              inset 0 -8px 20px rgba(0, 0, 0, 0.1),
              inset 0 8px 20px rgba(255, 255, 255, 0.9),
              0 0 80px rgba(0, 212, 255, 0.5),
              0 0 140px rgba(0, 153, 255, 0.3),
              0 0 200px rgba(0, 102, 255, 0.2),
              inset 0 0 80px rgba(0, 212, 255, 0.15);
          }
        }

        @keyframes moonHalo {
          0%, 100% {
            box-shadow: 
              0 0 100px rgba(0, 212, 255, 0.3),
              0 0 200px rgba(0, 153, 255, 0.15);
            opacity: 0.7;
          }
          50% {
            box-shadow: 
              0 0 120px rgba(0, 212, 255, 0.4),
              0 0 240px rgba(0, 153, 255, 0.2);
            opacity: 1;
          }
        }

        .login-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #3D1A78;
          margin-bottom: 1.5rem;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
        }

        .error-message {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          margin-bottom: 1rem;
          font-size: 0.75rem;
          text-align: center;
          border: 1px solid rgba(220, 38, 38, 0.3);
        }

        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .input-group {
          width: 100%;
        }

        .embossed-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: linear-gradient(145deg, #d4d4d4, #ffffff);
          border: none;
          border-radius: 2rem;
          font-size: 0.85rem;
          color: #3D1A78;
          outline: none;
          box-shadow: 
            inset 4px 4px 8px rgba(0, 0, 0, 0.1),
            inset -4px -4px 8px rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .embossed-input:focus {
          box-shadow: 
            inset 6px 6px 12px rgba(0, 0, 0, 0.15),
            inset -6px -6px 12px rgba(255, 255, 255, 0.9);
        }

        .embossed-input::placeholder {
          color: #9ca3af;
        }

        .embossed-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(145deg, #d4d4d4, #ffffff);
          border: none;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: bold;
          color: #3D1A78;
          cursor: pointer;
          box-shadow: 
            6px 6px 12px rgba(0, 0, 0, 0.15),
            -6px -6px 12px rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .embossed-button:hover {
          box-shadow: 
            8px 8px 16px rgba(0, 0, 0, 0.2),
            -8px -8px 16px rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        .embossed-button:active {
          box-shadow: 
            inset 4px 4px 8px rgba(0, 0, 0, 0.15),
            inset -4px -4px 8px rgba(255, 255, 255, 0.8);
          transform: translateY(0);
        }

        .embossed-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-message {
          text-align: center;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .check-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(145deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
          font-size: 1.75rem;
          color: white;
          box-shadow: 
            0 10px 30px rgba(16, 185, 129, 0.4),
            inset 0 0 0 2px rgba(255, 255, 255, 0.3);
          animation: checkPop 0.5s ease;
        }

        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .success-message h2 {
          font-size: 1.25rem;
          font-weight: bold;
          color: #3D1A78;
          margin-bottom: 0.5rem;
        }

        .success-message p {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .login-footer {
          margin-top: 2rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          position: relative;
          z-index: 10;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          font-weight: bold;
          max-width: 350px;
          line-height: 1.5;
        }

        .whatsapp-link {
          color: #25D366;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .whatsapp-link:hover {
          color: #128C7E;
          text-shadow: 0 0 10px rgba(37, 211, 102, 0.6);
          transform: scale(1.05);
        }

        @media (max-width: 480px) {
          .embossed-circle {
            width: 280px;
            height: 280px;
            padding: 2rem;
          }

          .login-title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }

          .embossed-input,
          .embossed-button {
            font-size: 0.8rem;
            padding: 0.65rem 0.9rem;
          }

          .login-form {
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}