"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  // Nota: usamos "dni" como campo de entrada pero aquí representa el EMAIL.
  const [dni, setDni] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const iniciarSesion = async () => {
    if (cargando) return; // evita doble click
    if (!dni || !contrasena) {
      setError("Email y contraseña son obligatorios");
      return;
    }

    setCargando(true);
    setError("");

    try {
      // 1) Autenticación directa con email (el input "dni" actúa como email)
      const { data: authData, error: errorAuth } = await supabase.auth.signInWithPassword({
        email: dni.trim(),
        password: contrasena,
      });

      if (errorAuth || !authData?.user) {
        setError("Email o contraseña incorrectos");
        return;
      }
// 2) Cargar perfil usando función SECURITY DEFINER (bypass RLS)
console.log('AUTH OK, usando RPC para perfil:', authData.user.id);

const { data: usuarioArray, error: errorUsuario } = await supabase
  .rpc('obtener_perfil_usuario', { user_id: authData.user.id });

const usuario = usuarioArray?.[0];
      if (errorUsuario || !usuario) {
        setError("No se pudo cargar tu perfil");
        return;
      }

      // 3) Guardar sesión mínima (compatibilidad con resto de páginas)
      localStorage.setItem(
        "sesion_activa",
        JSON.stringify({
          usuarioId: usuario.id,
          email: usuario.email,
          rol: usuario.rol,
          dni: usuario.dni,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
        })
      );

      // 4) Redirigir por rol
      if (usuario.rol === "superadmin") {
        router.push("/desarrollador");
      } else if (usuario.rol === "director") {
        router.push("/informes");
      } else {
        router.push("/nuevo-parte"); // trabajador por defecto
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
            Email:
          </label>
          <input
            type="email"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
            }}
            placeholder="Introduce tu email"
            autoComplete="username"
            inputMode="email"
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
          <strong>Usuarios de prueba:</strong>
          <br />• Superadmin: <em>i.benal.a87@gmail.com</em> / <em>SuperAdmin.2025</em>
          <br />• Trabajador: <em>trabajador1@ejemplo.com</em> / <em>Trabajador1.2025</em>
        </div>
      </div>
    </div>
  );
}

