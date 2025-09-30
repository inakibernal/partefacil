"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

const iniciarSesion = async () => {
    if (!dni || !contrasena) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    setCargando(true);
    setError('');

    try {
      // 1. Autenticar directamente con email (usa DNI como email por ahora)
      const { data: authData, error: errorAuth } = await supabase.auth.signInWithPassword({
        email: dni,  // Por ahora, introduce el email directamente
        password: contrasena,
      });

      if (errorAuth) {
        setError('Email o contraseña incorrectos');
        setCargando(false);
        return;
      }

      // 2. Sesión básica para compatibilidad
      const sesion = {
        usuarioId: authData.user.id,
        email: authData.user.email,
        rol: 'superadmin',  // Temporal, después lo sacamos de la BD
      };
      localStorage.setItem('sesion_activa', JSON.stringify(sesion));

      // 3. Redirigir
      router.push('/desarrollador');
    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };
  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
          Iniciar Sesión
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DNI:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && iniciarSesion()}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
            }}
            placeholder="Introduce tu DNI"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && iniciarSesion()}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
            }}
            placeholder="Introduce tu contraseña"
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={iniciarSesion}
          disabled={cargando}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: cargando ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: cargando ? 'not-allowed' : 'pointer',
          }}
        >
          {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '5px',
            fontSize: '14px',
          }}
        >
          <strong>Tipos de acceso:</strong>
          <br />• <strong>Directores:</strong> Acceden al panel de gestión completo
          <br />• <strong>Personal:</strong> Acceden a partes diarios de su residencia
        </div>
      </div>
    </div>
  );
}
