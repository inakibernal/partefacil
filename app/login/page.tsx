"use client";
import React, { useState } from 'react';

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!dni || !contrasena) {
      setError('DNI y contraseña son obligatorios');
      return;
    }

    setCargando(true);
    setError('');

    try {
      // Buscar en directores
      const directores = JSON.parse(localStorage.getItem('directores_sistema') || '[]');
      const director = directores.find(d => d.dni === dni && d.contrasena === contrasena);
      
      if (director) {
        const sesion = {
          rol: 'director',
          directorId: director.id,
          dni: director.dni,
          nombre: director.nombre,
          apellidos: director.apellidos,
          email: director.email
        };
        localStorage.setItem('sesion_activa', JSON.stringify(sesion));
        window.location.href = '/informes';
        return;
      }

      // Buscar en personal
      const personal = JSON.parse(localStorage.getItem('personal_data') || '[]');
      const empleado = personal.find(p => p.dni === dni && p.contrasena === contrasena);
      
      if (empleado) {
        // Obtener info de la residencia del empleado
        const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
        const residencia = residencias.find(r => r.id == empleado.residencia_id);
        
        const sesion = {
          rol: 'personal',
          personalId: empleado.id,
          dni: empleado.dni,
          nombre: empleado.nombre,
          apellidos: empleado.apellidos,
          email: empleado.email,
          titulacion: empleado.titulacion,
          residenciaId: empleado.residencia_id,
          residenciaNombre: residencia?.nombre || 'Sin residencia'
        };
        localStorage.setItem('sesion_activa', JSON.stringify(sesion));
        window.location.href = '/nuevo-parte';
        return;
      }

      setError('DNI o contraseña incorrectos');
    } catch (error) {
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
            cursor: cargando ? 'not-allowed' : 'pointer'
          }}
        >
          {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px', fontSize: '14px' }}>
          <strong>Tipos de acceso:</strong>
          <br />• <strong>Directores:</strong> Acceden al panel de gestión completo
          <br />• <strong>Personal:</strong> Acceden a partes diarios de su residencia
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a href="/desarrollador" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
            Acceso desarrollador
          </a>
        </div>
      </div>
    </div>
  );
}
