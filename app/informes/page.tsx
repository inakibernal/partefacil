"use client"

import React, { useState, useEffect, useMemo } from "react"

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
  creadoPor?: string
}

export default function InformesPage() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null)
  const [partes, setPartes] = useState<ParteDiario[]>([])
  const [partesSeleccionados, setPartesSeleccionados] = useState<string[]>([])
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("")
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("")
  const [filtroCentro, setFiltroCentro] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const usuarioData = sessionStorage.getItem("usuario_logueado")
    if (!usuarioData) {
      window.location.href = "/login"
      return
    }

    const usuario = JSON.parse(usuarioData)
    if (usuario.tipo !== "director") {
      window.location.href = "/nuevo-parte"
      return
    }

    setUsuarioLogueado(usuario)

    const partesGuardados = localStorage.getItem("informes_diarios")
    if (partesGuardados) {
      const todosLosPartes = JSON.parse(partesGuardados)
      const partesDelUsuario = todosLosPartes.filter((parte: ParteDiario) => 
        usuario.residencias.includes(parte.centro)
      )
      setPartes(partesDelUsuario)
    }

    setLoading(false)
  }, [])

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const filteredPartes = useMemo(() => {
    return partes.filter(parte => {
      const cumpleFechaDesde = !filtroFechaDesde || parte.fecha >= filtroFechaDesde
      const cumpleFechaHasta = !filtroFechaHasta || parte.fecha <= filtroFechaHasta
      const cumpleCentro = !filtroCentro || parte.centro === filtroCentro
      const cumpleBusqueda = !busqueda || 
        parte.centro.toLowerCase().includes(busqueda.toLowerCase()) ||
        parte.personalTurno.toLowerCase().includes(busqueda.toLowerCase()) ||
        parte.incidencias.toLowerCase().includes(busqueda.toLowerCase())

      return cumpleFechaDesde && cumpleFechaHasta && cumpleCentro && cumpleBusqueda
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }, [partes, filtroFechaDesde, filtroFechaHasta, filtroCentro, busqueda])

  const centrosUnicos = [...new Set(partes.map(p => p.centro))]

  const generarPDFIndividual = (parte: ParteDiario) => {
    try {
      const { generarPDFIndividual: generarPDF } = require("@/lib/pdfGenerator")
      generarPDF(parte)
    } catch (error) {
      console.error("Error al generar PDF:", error)
      alert("❌ Error al generar el PDF. Inténtalo de nuevo.")
    }
  }

  const generarPDFSeleccionados = () => {
    try {
      const partesParaPDF = filteredPartes.filter(p => partesSeleccionados.includes(p.id))
      if (partesParaPDF.length === 0) {
        alert("⚠️ No hay partes seleccionados")
        return
      }
      
      const { generarPDFMultiple } = require("@/lib/pdfGenerator")
      const titulo = `Informe de ${partesParaPDF.length} partes seleccionados`
      generarPDFMultiple(partesParaPDF, titulo)
      
      setPartesSeleccionados([])
    } catch (error) {
      console.error("Error al generar PDF múltiple:", error)
      alert("❌ Error al generar el PDF. Inténtalo de nuevo.")
    }
  }

  const generarPDFMensual = () => {
    try {
      const input = prompt("¿De qué mes quieres el informe?\nFormato: YYYY-MM (ejemplo: 2025-09)")
      if (!input) return
      
      const [año, mes] = input.split('-')
      if (!año || !mes || mes.length !== 2) {
        alert("❌ Formato incorrecto. Usa YYYY-MM (ejemplo: 2025-09)")
        return
      }
      
      const partesMes = partes.filter(p => p.fecha.startsWith(input))
      if (partesMes.length === 0) {
        alert(`❌ No hay partes registrados para ${input}`)
        return
      }
      
      const { generarPDFMensual: generarPDF } = require("@/lib/pdfGenerator")
      generarPDF(partesMes, mes, año)
    } catch (error) {
      console.error("Error al generar PDF mensual:", error)
      alert("❌ Error al generar el PDF. Inténtalo de nuevo.")
    }
  }

  const handleSeleccionarTodos = () => {
    if (partesSeleccionados.length === filteredPartes.length) {
      setPartesSeleccionados([])
    } else {
      setPartesSeleccionados(filteredPartes.map(p => p.id))
    }
  }

  const limpiarFiltros = () => {
    setFiltroFechaDesde("")
    setFiltroFechaHasta("")
    setFiltroCentro("")
    setBusqueda("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Informes</h1>
              <p className="text-gray-600 mt-1">
                {filteredPartes.length} de {partes.length} partes
              </p>
            </div>
            
            {/* Botones de acción principales - móvil optimizado */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={generarPDFSeleccionados}
                disabled={partesSeleccionados.length === 0}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                PDF Seleccionados ({partesSeleccionados.length})
              </button>
              <button
                onClick={generarPDFMensual}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                PDF Mensual
              </button>
            </div>
          </div>
        </div>

        {/* Filtros - Diseño móvil optimizado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-blue-600 text-sm font-medium"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <div className={`space-y-4 ${isMobile && !showFilters ? 'hidden' : ''}`}>
              {/* Búsqueda rápida */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar por centro, personal o incidencias..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Filtros en grid responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                  <input
                    type="date"
                    value={filtroFechaDesde}
                    onChange={(e) => setFiltroFechaDesde(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={filtroFechaHasta}
                    onChange={(e) => setFiltroFechaHasta(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centro</label>
                  <select
                    value={filtroCentro}
                    onChange={(e) => setFiltroCentro(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todos los centros</option>
                    {centrosUnicos.map(centro => (
                      <option key={centro} value={centro}>{centro}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={limpiarFiltros}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista/Tabla responsiva */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header de selección */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={partesSeleccionados.length === filteredPartes.length && filteredPartes.length > 0}
                onChange={handleSeleccionarTodos}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Seleccionar todos ({filteredPartes.length})
              </span>
            </label>
          </div>

          {/* Contenido responsivo */}
          {filteredPartes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay partes</h3>
              <p className="text-gray-500">No se encontraron partes con los filtros aplicados.</p>
            </div>
          ) : (
            <div>
              {/* Vista móvil - Cards */}
              <div className="md:hidden">
                {filteredPartes.map((parte) => (
                  <div key={parte.id} className="border-b border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={partesSeleccionados.includes(parte.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPartesSeleccionados([...partesSeleccionados, parte.id])
                            } else {
                              setPartesSeleccionados(partesSeleccionados.filter(id => id !== parte.id))
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <button
                        onClick={() => generarPDFIndividual(parte)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        PDF
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">{formatearFecha(parte.fecha)}</span>
                        <span className="text-sm text-gray-500">{parte.numeroResidentes} residentes</span>
                      </div>
                      <div className="text-sm font-medium text-blue-600">{parte.centro}</div>
                      <div className="text-sm text-gray-600">{parte.personalTurno}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          parte.medicacionAdministrada 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {parte.medicacionAdministrada ? 'Medicación OK' : 'Medicación NO'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(parte.fechaCreacion).toLocaleString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vista desktop - Tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={partesSeleccionados.length === filteredPartes.length && filteredPartes.length > 0}
                          onChange={handleSeleccionarTodos}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residentes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPartes.map((parte) => (
                      <tr key={parte.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={partesSeleccionados.includes(parte.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPartesSeleccionados([...partesSeleccionados, parte.id])
                              } else {
                                setPartesSeleccionados(partesSeleccionados.filter(id => id !== parte.id))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatearFecha(parte.fecha)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {parte.centro}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {parte.numeroResidentes}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            parte.medicacionAdministrada 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {parte.medicacionAdministrada ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {parte.personalTurno}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(parte.fechaCreacion).toLocaleString('es-ES')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() => generarPDFIndividual(parte)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}