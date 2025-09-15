"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SessionProtection from "@/components/SessionProtection"
import { cerrarSesion, getUsuarioSesion } from "@/lib/sessionManager"

interface ParteDiario {
  id: string
  fecha: string
  centro: string
  numeroResidentes: number
  medicacionAdministrada: boolean
  incidencias: string
  menuComida: string
  menuCena: string
  personalTurno: string
  fechaCreacion: string
  creadoPor: string
}

interface Usuario {
  dni: string
  nombre: string
  tipo: string
  residencias: string[]
  fechaLogin: string
}

export default function NuevoPartePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Estados del formulario
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [centro, setCentro] = useState("")
  const [numeroResidentes, setNumeroResidentes] = useState("")
  const [personalTurno, setPersonalTurno] = useState("")
  const [menuComida, setMenuComida] = useState("")
  const [menuCena, setMenuCena] = useState("")
  const [medicacionAdministrada, setMedicacionAdministrada] = useState(false)
  const [incidencias, setIncidencias] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const usuarioData = getUsuarioSesion()
    if (usuarioData) {
      setUsuario(usuarioData)
      
      // Pre-rellenar el centro si el usuario solo tiene una residencia
      if (usuarioData.residencias.length === 1) {
        setCentro(usuarioData.residencias[0])
      }
      
      // Pre-rellenar el personal de turno con el nombre del usuario
      setPersonalTurno(usuarioData.nombre)
      
      setLoading(false)
    }
  }, [])

  // Cerrar sesión
  const handleCerrarSesion = () => {
    cerrarSesion()
  }

  // Ver mis partes (solo para personal)
  const verMisPartes = () => {
    if (usuario?.tipo === "personal") {
      router.push("/mis-partes")
    }
  }

  // Función para guardar en localStorage
  const guardarParte = () => {
    if (!usuario) return

    // Validar campos obligatorios
    if (!centro.trim()) {
      alert("⚠️ El nombre del centro es obligatorio")
      return
    }
    
    if (!numeroResidentes.trim() || isNaN(Number(numeroResidentes))) {
      alert("⚠️ El número de residentes es obligatorio y debe ser un número")
      return
    }

    // Verificar que el usuario puede crear partes para este centro
    if (!usuario.residencias.includes(centro)) {
      alert("⚠️ No tienes permisos para crear partes en este centro")
      return
    }

    // Crear el objeto del parte
    const nuevoParte: ParteDiario = {
      id: Date.now().toString(),
      fecha: fecha,
      centro: centro.trim(),
      numeroResidentes: Number(numeroResidentes),
      personalTurno: personalTurno.trim(),
      menuComida: menuComida.trim(),
      menuCena: menuCena.trim(),
      medicacionAdministrada: medicacionAdministrada,
      incidencias: incidencias.trim(),
      fechaCreacion: new Date().toISOString(),
      creadoPor: usuario.dni
    }

    // Obtener partes existentes del sessionStorage
    const partesExistentes = sessionStorage.getItem("informes_diarios")
    const partes = partesExistentes ? JSON.parse(partesExistentes) : []
    
    // Añadir el nuevo parte
    partes.push(nuevoParte)
    
    // Guardar en sessionStorage
    sessionStorage.setItem("informes_diarios", JSON.stringify(partes))
    
    console.log("✅ Parte guardado:", nuevoParte)
    
    // Mostrar mensaje de éxito
    setShowSuccess(true)
    
    // Limpiar formulario
    limpiarFormulario()
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => setShowSuccess(false), 5000)
  }

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFecha(new Date().toISOString().split("T")[0])
    
    // Solo limpiar centro si el usuario tiene múltiples residencias
    if (usuario && usuario.residencias.length > 1) {
      setCentro("")
    }
    
    setNumeroResidentes("")
    setMenuComida("")
    setMenuCena("")
    setMedicacionAdministrada(false)
    setIncidencias("")
    
    // Mantener el personal de turno con el nombre del usuario
    if (usuario) {
      setPersonalTurno(usuario.nombre)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    guardarParte()
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Verificando sesión...
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  return (
    <SessionProtection requiredRole="any">
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        
        {/* Barra de usuario */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          backgroundColor: "#f8f9fa", 
          padding: "15px 20px", 
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #dee2e6"
        }}>
          <div>
            <h3 style={{ margin: "0", color: "#333" }}>
              {usuario.tipo === "director" ? "👨‍💼" : "👩‍⚕️"} {usuario.nombre}
            </h3>
            <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
              {usuario.tipo === "director" ? "Director/a" : "Personal de atención"} - 
              {usuario.residencias.join(", ")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {usuario.tipo === "personal" && (
              <button
                onClick={verMisPartes}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                📋 Mis partes
              </button>
            )}
            <button
              onClick={handleCerrarSesion}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "10px", color: "#333" }}>
            Nuevo Parte Diario
          </h1>
          <p style={{ color: "#666" }}>
            Registro del control diario de la residencia
          </p>
        </div>
        
        {/* Mensaje de éxito */}
        {showSuccess && (
          <div style={{ 
            backgroundColor: "#d4edda", 
            color: "#155724", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            border: "1px solid #c3e6cb"
          }}>
            ✅ <strong>Parte diario guardado correctamente.</strong> El formulario se ha limpiado para crear un nuevo registro.
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "30px", 
          borderRadius: "12px",
          border: "1px solid #dee2e6"
        }}>
          
          {/* Grid de campos */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px",
            marginBottom: "20px"
          }}>
            
            {/* Fecha */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                📅 Fecha *
              </label>
              <input 
                type="date" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                style={{ 
                  padding: "12px", 
                  border: "2px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%",
                  fontSize: "16px"
                }}
                required
              />
            </div>

            {/* Centro */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                🏢 Centro *
              </label>
              {usuario.residencias.length === 1 ? (
                <input 
                  type="text" 
                  value={centro}
                  readOnly
                  style={{ 
                    padding: "12px", 
                    border: "2px solid #ddd", 
                    borderRadius: "6px", 
                    width: "100%",
                    fontSize: "16px",
                    backgroundColor: "#f8f9fa"
                  }}
                />
              ) : (
                <select
                  value={centro}
                  onChange={(e) => setCentro(e.target.value)}
                  style={{ 
                    padding: "12px", 
                    border: "2px solid #ddd", 
                    borderRadius: "6px", 
                    width: "100%",
                    fontSize: "16px"
                  }}
                  required
                >
                  <option value="">Selecciona una residencia</option>
                  {usuario.residencias.map(residencia => (
                    <option key={residencia} value={residencia}>{residencia}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Número de residentes */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                👥 Nº de residentes presentes *
              </label>
              <input 
                type="number" 
                placeholder="0"
                min="0"
                value={numeroResidentes}
                onChange={(e) => setNumeroResidentes(e.target.value)}
                style={{ 
                  padding: "12px", 
                  border: "2px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%",
                  fontSize: "16px"
                }}
                required
              />
            </div>

            {/* Personal de turno */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                👨‍⚕️ Personal de turno
              </label>
              <input 
                type="text" 
                placeholder="Personal trabajando hoy"
                value={personalTurno}
                onChange={(e) => setPersonalTurno(e.target.value)}
                style={{ 
                  padding: "12px", 
                  border: "2px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Menú comida */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                🍽️ Menú comida
              </label>
              <input 
                type="text" 
                placeholder="Ej: Lentejas, pollo asado, fruta"
                value={menuComida}
                onChange={(e) => setMenuComida(e.target.value)}
                style={{ 
                  padding: "12px", 
                  border: "2px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%",
                  fontSize: "16px"
                }}
              />
            </div>

            {/* Menú cena */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                🥗 Menú cena
              </label>
              <input 
                type="text" 
                placeholder="Ej: Sopa, tortilla, yogur"
                value={menuCena}
                onChange={(e) => setMenuCena(e.target.value)}
                style={{ 
                  padding: "12px", 
                  border: "2px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>

          {/* Medicación administrada */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              💊 Medicación administrada
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input 
                type="checkbox"
                checked={medicacionAdministrada}
                onChange={(e) => setMedicacionAdministrada(e.target.checked)}
                style={{ width: "20px", height: "20px" }}
              />
              <span style={{ fontSize: "16px", color: "#555" }}>
                {medicacionAdministrada ? 
                  "✅ Sí, se administró toda la medicación" : 
                  "❌ Marcar si se administró medicación"
                }
              </span>
            </div>
          </div>

          {/* Incidencias */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              ⚠️ Incidencias
            </label>
            <textarea 
              placeholder="Describe cualquier incidencia ocurrida durante el día (opcional)"
              value={incidencias}
              onChange={(e) => setIncidencias(e.target.value)}
              rows={4}
              style={{ 
                padding: "12px", 
                border: "2px solid #ddd", 
                borderRadius: "6px", 
                width: "100%",
                fontSize: "16px",
                fontFamily: "Arial, sans-serif",
                resize: "vertical"
              }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
            <button 
              type="button"
              onClick={limpiarFormulario}
              disabled={isSubmitting}
              style={{ 
                padding: "12px 24px", 
                backgroundColor: "#6c757d", 
                color: "white", 
                border: "none", 
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              🗑️ Limpiar formulario
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                padding: "12px 24px", 
                backgroundColor: isSubmitting ? "#6c757d" : "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              {isSubmitting ? "Guardando..." : "💾 Guardar Parte"}
            </button>
          </div>
        </form>
      </div>
    </SessionProtection>
  )
}