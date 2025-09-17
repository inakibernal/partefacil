"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [dni, setDni] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Verificar si ya hay una sesión activa
    if (typeof window !== 'undefined') {
      const sesionActiva = localStorage.getItem('sesion_activa');
      if (sesionActiva) {
        const sesion = JSON.parse(sesionActiva);
        if (sesion.rol === 'director') {
          router.push('/informes');
        } else if (sesion.rol === 'personal') {
          router.push('/nuevo-parte');
        }
      }
    }

    // Limpiar sesión al cerrar pestaña/navegador
    const manejarCierrePagina = () => {
      localStorage.removeItem('sesion_activa');
    };

    window.addEventListener('beforeunload', manejarCierrePagina);
    
    return () => {
      window.removeEventListener('beforeunload', manejarCierrePagina);
    };
  }, [router]);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    if (!isClient) return;

    try {
      // Verificar credenciales de directores
      const directores = JSON.parse(localStorage.getItem('directores_sistema') || '[]');
      const director = directores.find(d => d.dni === dni && d.contrasena === contrasena && d.estado === 'activo');
      
      if (director) {
        // Actualizar último acceso del director
        const directoresActualizados = directores.map(d => 
          d.id === director.id ? { ...d, ultimo_acceso: new Date().toISOString() } : d
        );
        localStorage.setItem('directores_sistema', JSON.stringify(directoresActualizados));

        const sesion = {
          rol: 'director',
          usuario: `${director.nombre} ${director.apellidos}`,
          directorId: director.id,
          email: director.email,
          fechaLogin: new Date().toISOString()
        };
        localStorage.setItem('sesion_activa', JSON.stringify(sesion));
        router.push('/informes');
        return;
      }

      // Verificar credenciales del personal
      const personal = JSON.parse(localStorage.getItem('personal_data') || '[]');
      const trabajador = personal.find(p => p.dni === dni && p.contrasena === contrasena);
      
      if (trabajador) {
        const sesion = {
          rol: 'personal',
          usuario: `${trabajador.nombre} ${trabajador.apellidos}`,
          personalId: trabajador.id,
          residenciaId: trabajador.residencia_id,
          fechaLogin: new Date().toISOString()
        };
        localStorage.setItem('sesion_activa', JSON.stringify(sesion));
        router.push('/nuevo-parte');
        return;
      }

      // Si no se encontraron credenciales válidas
      setError('DNI o contraseña incorrectos');
      
    } catch (error) {
      setError('Error en el sistema. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return (
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '60px 40px', 
        borderRadius: '10px', 
        maxWidth: '500px', 
        width: '90%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid #e9ecef'
      }}>
        
        {/* Logo/Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', color: '#2c3e50', margin: '0 0 10px 0' }}>
            ParteFácil
          </h1>
          <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>
            Acceso para directores y personal
          </p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={manejarLogin}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '8px', 
              color: '#333' 
            }}>
              DNI
            </label>
            <input 
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value.toUpperCase())}
              placeholder="Introduce tu DNI"
              required
              style={{ 
                width: '100%', 
                padding: '15px', 
                fontSize: '16px', 
                border: '2px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '8px', 
              color: '#333' 
            }}>
              Contraseña
            </label>
            <input 
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
              style={{ 
                width: '100%', 
                padding: '15px', 
                fontSize: '16px', 
                border: '2px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24',
              border: '1px solid #f5c6cb',
              borderRadius: '5px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={cargando || !dni || !contrasena}
            style={{ 
              width: '100%', 
              padding: '15px', 
              fontSize: '18px', 
              backgroundColor: cargando ? '#ccc' : '#2c3e50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Volver a Home */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a 
            href="/"
            style={{ 
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
