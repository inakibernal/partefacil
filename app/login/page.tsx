"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Usuarios de prueba
const usuariosValidos = {
  "01234567A": {
    password: "012345",
    nombre: "María García López",
    tipo: "director",
    residencias: ["Residencia San Miguel", "Centro El Rosal"]
  },
  "98765432B": {
    password: "012345", 
    nombre: "Juan Pérez Martín",
    tipo: "personal",
    residencias: ["Residencia San Miguel"]
  },
  "11111111C": {
    password: "012345",
    nombre: "Ana Rodríguez Sanz", 
    tipo: "personal",
    residencias: ["Centro El Rosal"]
  }
}

export default function LoginPage() {
  const [paso, setPaso] = useState(1)
  const [tipoUsuario, setTipoUsuario] = useState("")
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Verificar si ya está logueado
  useEffect(() => {
    const usuarioData = sessionStorage.getItem("usuario_logueado")
    const usuarioLogueado = usuarioData ? JSON.parse(usuarioData) : null
    if (usuarioLogueado) {
      if (usuarioLogueado.tipo === "director") {
        router.push("/informes")
      } else {
        router.push("/nuevo-parte")
      }
    }
  }, [router])

  // Validar formato DNI
  const validarDNI = (dni: string): boolean => {
    const dniRegex = /^[0-9]{8}[A-Z]$/
    return dniRegex.test(dni.toUpperCase())
  }

  // Manejar selección de tipo de usuario
  const handleTipoUsuario = (tipo: string) => {
    setTipoUsuario(tipo)
    setError("")
    setPaso(2)
  }

  // Manejar envío de DNI
  const handleDNI = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!dni.trim()) {
      setError("Por favor, introduce tu DNI")
      return
    }

    if (!validarDNI(dni)) {
      setError("Formato de DNI incorrecto. Debe ser 8 números seguidos de una letra (ej: 12345678A)")
      return
    }

    if (!usuariosValidos[dni.toUpperCase() as keyof typeof usuariosValidos]) {
      setError("DNI no encontrado en el sistema")
      return
    }

    setError("")
    setPaso(3)
  }

  // Manejar login completo
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise(resolve => setTimeout(resolve, 1000))

    const usuario = usuariosValidos[dni.toUpperCase() as keyof typeof usuariosValidos]
    
    if (!usuario) {
      setError("Usuario no encontrado")
      setLoading(false)
      return
    }

    if (usuario.password !== password) {
      setError("Contraseña incorrecta")
      setLoading(false)
      return
    }

    if (usuario.tipo !== tipoUsuario) {
      setError(`Este DNI pertenece a un ${usuario.tipo === 'director' ? 'Director/a' : 'Personal de atención'}, no a ${tipoUsuario === 'director' ? 'Director/a' : 'Personal de atención'}`)
      setLoading(false)
      return
    }

    // Guardar en sessionStorage simple
    sessionStorage.setItem("usuario_logueado", JSON.stringify({
      dni: dni.toUpperCase(),
      nombre: usuario.nombre,
      tipo: usuario.tipo,
      residencias: usuario.residencias,
      fechaLogin: new Date().toISOString()
    }))

    if (usuario.tipo === "director") {
      router.push("/informes")
    } else {
      router.push("/nuevo-parte")
    }

    setLoading(false)
  }

  // Volver atrás
  const volverAtras = () => {
    if (paso === 3) {
      setPassword("")
      setError("")
      setPaso(2)
    } else if (paso === 2) {
      setDni("")
      setError("")
      setPaso(1)
    }
  }

  // Volver al inicio
  const volverInicio = () => {
    router.push("/")
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8f9fa", 
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <button
          onClick={volverInicio}
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
      </header>

      {/* Contenido principal */}
      <main style={{ 
        flex: 1,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "40px"
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "40px", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "450px"
        }}>
          
          {/* Indicador de pasos */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "30px",
            gap: "10px"
          }}>
            {[1, 2, 3].map(num => (
              <div 
                key={num}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: paso >= num ? "#007bff" : "#e9ecef",
                  color: paso >= num ? "white" : "#6c757d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                {num}
              </div>
            ))}
          </div>

          {/* PASO 1: Selección de tipo de usuario */}
          {paso === 1 && (
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center", color: "#333" }}>
                ¿Quién eres?
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <button
                  onClick={() => handleTipoUsuario("director")}
                  style={{
                    padding: "20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                >
                  Director/a
                </button>
                
                <button
                  onClick={() => handleTipoUsuario("personal")}
                  style={{
                    padding: "20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e7e34"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#28a745"}
                >
                  Personal de atención
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Introducir DNI */}
          {paso === 2 && (
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "10px", textAlign: "center", color: "#333" }}>
                Introduce tu DNI
              </h2>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>
                Tipo de usuario: <strong>{tipoUsuario === "director" ? "Director/a" : "Personal de atención"}</strong>
              </p>
              
              <form onSubmit={handleDNI}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    DNI:
                  </label>
                  <input
                    type="text"
                    placeholder="12345678A"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.toUpperCase())}
                    maxLength={9}
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: error ? "2px solid #dc3545" : "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                      textTransform: "uppercase"
                    }}
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={{ 
                    backgroundColor: "#f8d7da", 
                    color: "#721c24", 
                    padding: "12px", 
                    borderRadius: "6px",
                    marginBottom: "20px",
                    border: "1px solid #f5c6cb"
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={volverAtras}
                    style={{
                      flex: 1,
                      padding: "15px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Atrás
                  </button>
                  
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: "15px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PASO 3: Introducir contraseña */}
          {paso === 3 && (
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "10px", textAlign: "center", color: "#333" }}>
                Introduce tu contraseña
              </h2>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>
                DNI: <strong>{dni}</strong>
              </p>
              
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: error ? "2px solid #dc3545" : "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px"
                    }}
                    autoFocus
                  />
                </div>

                {error && (
                  <div style={{ 
                    backgroundColor: "#f8d7da", 
                    color: "#721c24", 
                    padding: "12px", 
                    borderRadius: "6px",
                    marginBottom: "20px",
                    border: "1px solid #f5c6cb"
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={volverAtras}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "15px",
                      backgroundColor: loading ? "#aaa" : "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                  >
                    Atrás
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: "15px",
                      backgroundColor: loading ? "#aaa" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                  >
                    {loading ? "Verificando..." : "Iniciar sesión"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Información de prueba */}
          <div style={{ 
            marginTop: "30px", 
            padding: "15px", 
            backgroundColor: "#e7f3ff", 
            borderRadius: "8px",
            border: "1px solid #b3d9ff"
          }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#0066cc", fontSize: "14px" }}>
              Usuarios de prueba:
            </h4>
            <div style={{ fontSize: "12px", color: "#0066cc" }}>
              <p style={{ margin: "2px 0" }}><strong>Director:</strong> 01234567A / 012345</p>
              <p style={{ margin: "2px 0" }}><strong>Personal:</strong> 98765432B / 012345</p>
              <p style={{ margin: "2px 0" }}><strong>Personal:</strong> 11111111C / 012345</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: "#2c3e50",
        color: "#ecf0f1",
        padding: "20px 40px",
        fontSize: "12px",
        textAlign: "center"
      }}>
        <p style={{ margin: 0 }}>
          © 2025 | Parte Fácil® es una marca registrada de software para gestión de Partes diarios de Residencias de Mayores
        </p>
      </footer>
    </div>
  )
}