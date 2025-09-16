"use client"

import React, { useState, useEffect } from "react"
import { 
  getResidentesPorCentro, 
  getResumenDiario, 
  calcularEdad, 
  getIniciales, 
  inicializarDatos,
  type Residente,
  type ResumenDiarioResidente 
} from "@/lib/residentManager"

export default function ResidentesPage() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null)
  const [residentes, setResidentes] = useState<Residente[]>([])
  const [resumenes, setResumenes] = useState<ResumenDiarioResidente[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0])
  const [centroSeleccionado, setCentroSeleccionado] = useState("")
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    const usuarioData = sessionStorage.getItem("usuario_logueado")
    if (!usuarioData) {
      window.location.href = "/login"
      return
    }

    const usuario = JSON.parse(usuarioData)
    setUsuarioLogueado(usuario)
    
    // Inicializar datos de ejemplo
    inicializarDatos()
    
    // Establecer centro por defecto
    if (usuario.residencias.length === 1) {
      setCentroSeleccionado(usuario.residencias[0])
    } else if (usuario.residencias.length > 1) {
      setCentroSeleccionado(usuario.residencias[0])
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    if (centroSeleccionado) {
      const residentesDelCentro = getResidentesPorCentro(centroSeleccionado)
      setResidentes(residentesDelCentro)
      
      const resumenDelDia = getResumenDiario(fechaSeleccionada, centroSeleccionado)
      setResumenes(resumenDelDia)
    }
  }, [centroSeleccionado, fechaSeleccionada])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'bueno': return 'bg-green-100 text-green-800 border-green-200'
      case 'regular': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'preocupante': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getResumenPorResidente = (residenteId: string) => {
    return resumenes.find(r => r.residenteId === residenteId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando residentes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'py-4' : 'py-8'}`}>
      <div className={`container mx-auto px-3 sm:px-4 md:px-6 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
        
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            Gestión de Residentes
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Control diario por residente individual
          </p>
        </div>

        {/* Controles */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                📅 Fecha
              </label>
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}
              />
            </div>
            
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                🏢 Centro
              </label>
              <select
                value={centroSeleccionado}
                onChange={(e) => setCentroSeleccionado(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}
              >
                {usuarioLogueado?.residencias.map((centro: string) => (
                  <option key={centro} value={centro}>{centro}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-3' : 'p-4'} text-center`}>
            <div className={`font-bold text-blue-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {residentes.length}
            </div>
            <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total residentes</div>
          </div>
          
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-3' : 'p-4'} text-center`}>
            <div className={`font-bold text-green-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {resumenes.filter(r => r.estadoGeneral === 'bueno').length}
            </div>
            <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Estado bueno</div>
          </div>
          
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-3' : 'p-4'} text-center`}>
            <div className={`font-bold text-yellow-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {resumenes.filter(r => r.estadoGeneral === 'regular').length}
            </div>
            <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Estado regular</div>
          </div>
          
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-3' : 'p-4'} text-center`}>
            <div className={`font-bold text-red-600 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {resumenes.filter(r => r.estadoGeneral === 'preocupante').length}
            </div>
            <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Requiere atención</div>
          </div>
        </div>

        {/* Lista de residentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className={`p-4 md:p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl`}>
            <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Residentes del {new Date(fechaSeleccionada).toLocaleDateString('es-ES')}
            </h3>
          </div>

          {residentes.length === 0 ? (
            <div className={`text-center ${isMobile ? 'p-8' : 'p-12'}`}>
              <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} mb-4`}>👥</div>
              <h3 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                No hay residentes
              </h3>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
                No se encontraron residentes para este centro.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {residentes.map((residente) => {
                const resumen = getResumenPorResidente(residente.id)
                return (
                  <div key={residente.id} className={`${isMobile ? 'p-4' : 'p-6'} hover:bg-gray-50 transition-colors`}>
                    <div className="flex items-center justify-between">
                      
                      {/* Información del residente */}
                      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                        {/* Avatar con iniciales */}
                        <div className={`rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center justify-center ${
                          isMobile ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base'
                        }`}>
                          {getIniciales(residente.nombre, residente.apellidos)}
                        </div>
                        
                        <div className="flex-1">
                          <div className={`flex items-center ${isMobile ? 'flex-col items-start space-y-1' : 'space-x-4'}`}>
                            <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                              {residente.nombre} {residente.apellidos}
                            </h3>
                            <div className={`flex items-center space-x-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                              <span>Hab. {residente.habitacion}</span>
                              <span>•</span>
                              <span>{calcularEdad(residente.fechaNacimiento)} años</span>
                            </div>
                          </div>
                          
                          {/* Estado del día */}
                          {resumen && (
                            <div className={`${isMobile ? 'mt-2' : 'mt-2'} flex ${isMobile ? 'flex-col space-y-1' : 'items-center space-x-4'}`}>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                                getEstadoColor(resumen.estadoGeneral)
                              }`}>
                                {resumen.estadoGeneral === 'bueno' && '✅ Bien'}
                                {resumen.estadoGeneral === 'regular' && '⚠️ Regular'}
                                {resumen.estadoGeneral === 'preocupante' && '🚨 Atención'}
                              </span>
                              
                              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                                Medicación: {resumen.medicacionCompleta ? '✅' : '❌'} • 
                                Comidas: {resumen.comidasRealizadas}/{resumen.totalComidas}
                                {resumen.incidencias > 0 && ` • ${resumen.incidencias} incidencias`}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <div className="ml-4">
                        <a
                          href={`/residente/${residente.id}?fecha=${fechaSeleccionada}`}
                          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${
                            isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'
                          }`}
                        >
                          {isMobile ? 'Ver' : 'Gestionar'}
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Botón para añadir nuevo residente */}
        <div className={`text-center ${isMobile ? 'mt-4' : 'mt-6'}`}>
          <a
            href="/residentes/nuevo"
            className={`inline-block bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors ${
              isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'
            }`}
          >
            ➕ Añadir Nuevo Residente
          </a>
        </div>
      </div>
    </div>
  )
}