"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const iniciarSesion = async () => {
    if (cargando) return;
    if (!usuario || !contrasena) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const usuarioTrim = usuario.trim();
      let email = usuarioTrim;

      // Detectar si es DNI o Email
      const esDNI = /^[0-9]{8}[A-Za-z]$/.test(usuarioTrim); // Formato: 12345678A

if (esDNI) {
  // Si es DNI, buscar el email correspondiente usando RPC
  console.log('Detectado DNI:', usuarioTrim);
  
  const { data: emailEncontrado, error: errorBusqueda } = await supabase
    .rpc('obtener_email_por_dni', { p_dni: usuarioTrim.toUpperCase() });

  if (errorBusqueda || !emailEncontrado) {
    console.error('Error buscando DNI:', errorBusqueda);
    setError("DNI no encontrado en el sistema");
    return;
  }

  email = emailEncontrado;
  console.log('Email encontrado para DNI:', email);
}


      // Autenticación con email
      const { data: authData, error: errorAuth } = await supabase.auth.signInWithPassword({
        email: email,
        password: contrasena,
      });

      if (errorAuth || !authData?.user) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      // Cargar perfil usando función SECURITY DEFINER (bypass RLS)
      console.log('AUTH OK, usando RPC para perfil:', authData.user.id);

      const { data: usuarioArray, error: errorUsuario } = await supabase
        .rpc('obtener_perfil_usuario', { user_id: authData.user.id });

      const usuarioPerfil = usuarioArray?.[0];
      
      if (errorUsuario || !usuarioPerfil) {
        setError("No se pudo cargar tu perfil");
        return;
      }

      // Guardar sesión mínima (compatibilidad con resto de páginas)
      localStorage.setItem(
        "sesion_activa",
        JSON.stringify({
          usuarioId: usuarioPerfil.id,
          email: usuarioPerfil.email,
          rol: usuarioPerfil.rol,
          dni: usuarioPerfil.dni,
          nombre: usuarioPerfil.nombre,
          apellidos: usuarioPerfil.apellidos,
        })
      );

      // Redirigir por rol con window.location (más directo)
      if (usuarioPerfil.rol === "superadmin") {
        window.location.href = "/desarrollador";
      } else if (usuarioPerfil.rol === "director") {
        window.location.href = "/informes";
      } else {
        window.location.href = "/nuevo-parte"; // trabajador por defecto
      }
    } catch (e) {
      console.error(e);
      setError("Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") iniciarSesion();
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#2c3e50" }}>
          Iniciar Sesión
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Usuario (DNI o Email):
          </label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
            placeholder="12345678A o tu@email.com"
            autoComplete="username"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
            placeholder="Introduce tu contraseña"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={iniciarSesion}
          disabled={cargando}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: cargando ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: cargando ? "not-allowed" : "pointer",
          }}
        >
          {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e3f2fd",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          <strong>💡 Puedes iniciar sesión con:</strong>
          <br />• Tu <strong>DNI</strong> o tu <strong>Email</strong>
        </div>
      </div>
    </div>
  );
}
