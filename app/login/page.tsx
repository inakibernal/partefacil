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
      setError('DNI y contraseña son obligatorios');
      return;
    }

    setCargando(true);
    setError('');

    try {
      // 1. Obtener email desde DNI usando función segura
      const { data: emailData, error: errorEmail } = await supabase.rpc(
        'obtener_email_por_dni',
        { dni_input: dni }
      );

      if (errorEmail || !emailData) {
        setError('DNI no encontrado');
        setCargando(false);
        return;
      }

      // 2. Autenticar con Supabase
      const { data: authData, error: errorAuth } = await supabase.auth.signInWithPassword({
        email: emailData,
        password: contrasena,
      });

      if (errorAuth) {
        setError('Contraseña incorrecta');
        setCargando(false);
        return;
      }

      // 3. Obtener datos completos del usuario
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (errorUsuario || !usuario) {
        setError('Error al cargar datos del usuario');
        setCargando(false);
        return;
      }

      // 4. Guardar sesión
      const sesion = {
        usuarioId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
      };
      localStorage.setItem('sesion_activa', JSON.stringify(sesion));

      // 5. Redirigir según rol
      if (usuario.rol === 'superadmin') {
        router.push('/desarrollador');
      } else if (usuario.rol === 'director') {
        router.push('/informes');
      } else if (usuario.rol === 'trabajador') {
        router.push('/nuevo-parte');
      }
    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', maxWidth: '400px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Iniciar Sesión</h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DNI:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && iniciarSesion()}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
            placeholder="Introduce tu DNI"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && iniciarSesion()}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
            placeholder="Introduce tu contraseña"
          />
        </div>

        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
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

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px', fontSize: '14px' }}>
          <strong>Usuarios de prueba:</strong>
          <br />• Superadmin: 12345678Z / Ander.2020
          <br />• Trabajador: 11111111A / password123
        </div>
      </div>
    </div>
  );
}
