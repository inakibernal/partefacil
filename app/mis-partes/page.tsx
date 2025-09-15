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

export default function MisPartesPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [misPartes, setMisPartes] = useState<ParteDiario[]>([])
  const [filteredPartes, setFilteredPartes] = useState<ParteDiario[]>([])
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [centroFiltro, setCentroFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar autenticación al cargar
  useEffect(() => {
    const usuarioData = getUsuarioSesion()
    if (usuarioData) {
      setUsuario(usuarioData)
      setLoading(false)
    }
  }, [])

  // Cargar MIS partes del sessionStorage
  useEffect(() => {
    if (!usuario) return

    const partesGuardados = sessionStorage.getItem("informes_diarios")
    if (partesGuardados) {
      const data = JSON.parse(partesGuardados)
      
      // Filtrar solo los partes creados por este usuario
      const partesDelUsuario = data.filter((parte: ParteDiario) => 
        parte.creadoPor === usuario.dni
      )
      
      setMisPartes(partesDelUsuario)
      setFilteredPartes(partesDelUsuario)
    }
  }, [usuario])

  // Filtrar partes cuando cambien los filtros
  useEffect(() => {
    let resultado = [...misPartes]

    if (fechaDesde) {
      resultado = resultado.filter(parte => parte.fecha >= fechaDesde)
    }

    if (fechaHasta) {
      resultado = resultado.filter(parte => parte.fecha <= fechaHasta)
    }

    if (centroFiltro) {
      resultado = resultado.filter(parte => 
        parte.centro.toLowerCase().includes(centroFiltro.toLowerCase())
      )
    }

    setFilteredPartes(resultado)
  }, [misPartes, fechaDesde, fechaHasta, centroFiltro])

  // Cerrar sesión
  const handleCerrarSesion = () => {
    cerrarSesion()
  }

  // Ir a crear nuevo parte
  const crearNuevoParte = () => {
    router.push("/nuevo-parte")
  }

  // Obtener centros únicos de mis partes
  const centrosUnicos = [...new Set(misPartes.map(parte => parte.centro))].sort()

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatearFechaHora = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Función para generar PDF individual
  const generarPDFIndividual = (parte: ParteDiario) => {
    try {
      const { generarPDFIndividual: generarPDF } = require("@/lib/pdfGenerator")
      generarPDF(parte)
    } catch (error) {
      console.error("Error al generar PDF:", error)
      alert("Error al generar el PDF. Inténtalo de nuevo.")
    }
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFechaDesde("")
    setFechaHasta("")
    setCentroFiltro("")
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
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        
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
              👩‍⚕️ {usuario.nombre}
            </h3>
            <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
              Personal de atención - {usuario.residencias.join(", ")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={crearNuevoParte}
              style={{
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
              }}
            >
              ➕ Nuevo parte
            </button>
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

        {/* Encabezado */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "10px", color: "#333" }}>
            📋 Mis Partes Diarios
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Historial de partes creados por ti - {misPartes.length} partes totales
          </p>
        </div>

        {/* Filtros */}
        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "25px", 
          borderRadius: "12px",
          marginBottom: "25px",
          border: "1px solid #dee2e6"
        }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>🔍 Filtros de búsqueda</h3>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "15px",
            marginBottom: "15px"
          }}>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                📅 Desde:
              </label>
              <input 
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                📅 Hasta:
              </label>
              <input 
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                🏢 Centro:
              </label>
              <select 
                value={centroFiltro}
                onChange={(e) => setCentroFiltro(e.target.value)}
                style={{ 
                  padding: "10px", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px", 
                  width: "100%"
                }}
              >
                <option value="">Todos mis centros</option>
                {centrosUnicos.map(centro => (
                  <option key={centro} value={centro}>{centro}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={limpiarFiltros}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🗑️ Limpiar filtros
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "15px",
          marginBottom: "25px"
        }}>
          <div style={{ 
            backgroundColor: "#e7f3ff", 
            padding: "20px", 
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #b3d9ff"
          }}>
            <h3 style={{ margin: "0", color: "#0066cc", fontSize: "24px" }}>{misPartes.length}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#0066cc" }}>Partes totales</p>
          </div>
          <div style={{ 
            backgroundColor: "#d4edda", 
            padding: "20px", 
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #c3e6cb"
          }}>
            <h3 style={{ margin: "0", color: "#155724", fontSize: "24px" }}>{filteredPartes.length}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#155724" }}>Filtrados</p>
          </div>
          <div style={{ 
            backgroundColor: "#fff3cd", 
            padding: "20px", 
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #ffeaa7"
          }}>
            <h3 style={{ margin: "0", color: "#856404", fontSize: "24px" }}>{centrosUnicos.length}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#856404" }}>Centros</p>
          </div>
        </div>

        {/* Lista de partes */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "12px",
          border: "1px solid #dee2e6",
          overflow: "hidden"
        }}>
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "15px", 
            borderBottom: "1px solid #dee2e6"
          }}>
            <h3 style={{ margin: 0, color: "#333" }}>
              📋 Mis partes encontrados: {filteredPartes.length}
            </h3>
          </div>

          {filteredPartes.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>📭 No tienes partes que coincidan con los filtros</p>
              {misPartes.length === 0 ? (
                <div>
                  <p>¡Aún no has creado ningún parte!</p>
                  <button
                    onClick={crearNuevoParte}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "10px"
                    }}
                  >
                    ➕ Crear mi primer parte
                  </button>
                </div>
              ) : (
                <p>Prueba a ajustar los criterios de búsqueda</p>
              )}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Fecha</th>
                    <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Centro</th>
                    <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Residentes</th>
                    <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Medicación</th>
                    <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Creado</th>
                    <th style={{ padding: "15px", textAlign: "center", borderBottom: "1px solid #dee2e6" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartes
                    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
                    .map((parte) => (
                    <tr key={parte.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "15px", fontWeight: "bold" }}>
                        {formatearFecha(parte.fecha)}
                      </td>
                      <td style={{ padding: "15px" }}>{parte.centro}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>{parte.numeroResidentes}</td>
                      <td style={{ padding: "15px" }}>
                        {parte.medicacionAdministrada ? "✅ Sí" : "❌ No"}
                      </td>
                      <td style={{ padding: "15px", fontSize: "14px", color: "#666" }}>
                        {formatearFechaHora(parte.fechaCreacion)}
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button 
                          onClick={() => generarPDFIndividual(parte)}
                          style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#007bff", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          📄 PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div style={{ 
          marginTop: "30px", 
          padding: "20px", 
          backgroundColor: "#e7f3ff", 
          borderRadius: "8px",
          border: "1px solid #b3d9ff"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#0066cc" }}>💡 Información:</h3>
          <ul style={{ margin: "0", paddingLeft: "20px", color: "#0066cc" }}>
            <li>📋 <strong>Solo ves tus partes:</strong> Los partes creados por ti aparecen aquí</li>
            <li>📄 <strong>Generar PDF:</strong> Haz clic en "PDF" para descargar cada parte</li>
            <li>🔍 <strong>Filtros:</strong> Usa las fechas para buscar partes específicos</li>
            <li>📈 <strong>Ordenación:</strong> Los partes más recientes aparecen primero</li>
          </ul>
        </div>
      </div>
    </SessionProtection>
  )
}