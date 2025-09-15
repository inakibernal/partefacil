"use client"

import React from "react"
import { useRouter } from "next/navigation"

interface NavigationProps {
  usuario?: {
    dni: string
    nombre: string
    tipo: string
    residencias: string[]
  } | null
  showUserInfo?: boolean
}

export default function Navigation({ usuario, showUserInfo = false }: NavigationProps) {
  const router = useRouter()

  const irAInicio = () => {
    router.push("/")
  }

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario_logueado")
    router.push("/")
  }

  const irALogin = () => {
    router.push("/login")
  }

  return (
    <header style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      padding: "15px 40px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    }}>
      {/* Logo izquierda */}
      <button
        onClick={irAInicio}
        style={{
          background: "none",
          border: "none",
          fontSize: "24px", 
          fontWeight: "bold", 
          color: "#007bff",
          cursor: "pointer"
        }}
      >
        Parte Fácil
      </button>

      {/* Información de usuario y botón derecha */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Mostrar info de usuario si está logueado */}
        {showUserInfo && usuario && (
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold", color: "#333" }}>
              {usuario.tipo === "director" ? "👨‍💼" : "👩‍⚕️"} {usuario.nombre}
            </p>
            <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
              {usuario.tipo === "director" ? "Director/a" : "Personal de atención"}
            </p>
          </div>
        )}

        {/* Botón de acción */}
        {usuario ? (
          <button
            onClick={cerrarSesion}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            Cerrar sesión
          </button>
        ) : (
          <button
            onClick={irALogin}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  )
}