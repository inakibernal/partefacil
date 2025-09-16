"use client"

import React, { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import {
  getAllResidentes,
  getRegistrosResidentePorFecha,
  guardarRegistroActividad,
  actividadesPredefinidas,
  calcularEdad,
  getIniciales,
  type Residente,
  type RegistroActividad
} from "@/lib/residentManager"

export default function ResidenteIndividualPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const residenteId = params.id as string
  const fechaParam = searchParams.get('fecha')
  
  const [residente, setResidente] = useState<Residente | null>(null)
  const [registros, setRegistros] = useState<RegistroActividad[]>([])
  const [fecha, setFecha] = useState(fechaParam || new Date().toISOString().split('T')[0])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoRegistro, setNuevoRegistro] = useState({
    tipo: 'medicacion' as keyof typeof actividadesPredefinidas,
    subtipo: '',
    descripcion: '',
    observaciones: '',
    estado: 'realizado' as 'realizado' | 'pendiente' | 'no_realizado',
    urgente: false
  })
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null)
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
    setUsuarioLogueado(JSON.parse(usuarioData))

    // Cargar datos del residente
    const residentes = getAllResidentes()
    const residenteEncontrado = residentes.find(r => r.id === residenteId)
    setResidente(residenteEncontrado || null)
  }, [residenteId])

  useEffect(() => {
    if (residenteId) {
      const registrosDelDia = getRegistrosResidentePorFecha(residenteId, fecha)
      setRegistros(registrosDelDia)
    }
  }, [residenteId, fecha])

  const handleSubmitRegistro = (e: React.FormEvent) => {
    e.preventDefault()
    
    const registro: RegistroActividad = {
      id: Date.now().toString(),
      residenteId,
      fecha,
      hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
      tipo: nuevoRegistro.tipo,
      subtipo: nuevoRegistro.subtipo,
      descripcion: nuevoRegistro.descripcion || actividadesPredefinidas[nuevoRegistro.tipo][0],
      observaciones: nuevoRegistro.observaciones,
      estado: nuevoRegistro.estado,
      realizadoPor: usuarioLogueado?.nombre || '',
      urgente: nuevoRegistro.urgente,
      fechaCreacion: new Date().toISOString()
    }

    guardarRegistroActividad(registro)
    setRegistros([...registros, registro])
    
    // Limpiar formulario
    setNuevoRegistro({
      tipo: 'medicacion',
      subtipo: '',
      descripcion: '',
      observaciones: '',
      estado: 'realizado',
      urgente: false
    })
    setMostrarFormulario(false)
  }

  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'medicacion': return '💊'
      case 'comida': return '🍽️'
      case 'higiene': return '🧼'
      case 'actividad': return '🏃‍♂️'
      case 'incidencia': return '⚠️'
      case 'visita': return '👥'
      default: return '📝'
    }
  }

  const getColorPorEstado = (estado: string) => {
    switch (estado) {
      case 'realizado': return 'bg-green-100 text-green-800 border-green-200'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'no_realizado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!residente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Residente no encontrado</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la información del residente.</p>
          <a href="/residentes" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Volver a la lista de residentes
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'py-4' : 'py-8'}`}>
      <div className={`container mx-auto px-3 sm:px-4 md:px-6 ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}>
        
        {/* Header del residente */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center justify-center ${
                isMobile ? 'w-12 h-12 text-base' : 'w-16 h-16 text-lg'
              }`}>
                {getIniciales(residente.nombre, residente.apellidos)}
              </div>
              
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {residente.nombre} {residente.apellidos}
                </h1>
                <div className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
                  Habitación {residente.habitacion} • {calcularEdad(residente.fechaNacimiento)} años
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                  {residente.centro}
                </div>
              </div>
            </div>
            
            <a 
              href="/residentes" 
              className={`text-blue-600 hover:text-blue-700 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}
            >
              ← Volver
            </a>
          </div>
        </div>

        {/* Control de fecha */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
          <div className="flex items-center justify-between">
            <div>
              <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Fecha del registro
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}
              />
            </div>
            
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors ${
                isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-base'
              }`}
            >
              + Nuevo Registro
            </button>
          </div>
        </div>

        {/* Formulario de nuevo registro */}
        {mostrarFormulario && (
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
            <h3 className={`font-semibold text-gray-900 mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Nuevo Registro de Actividad
            </h3>
            
            <form onSubmit={handleSubmitRegistro} className={`space-y-${isMobile ? '3' : '4'}`}>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div>
                  <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    Tipo de actividad
                  </label>
                  <select
                    value={nuevoRegistro.tipo}
                    onChange={(e) => setNuevoRegistro({
                      ...nuevoRegistro, 
                      tipo: e.target.value as keyof typeof actividadesPredefinidas,
                      subtipo: '',
                      descripcion: ''
                    })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isMobile ? 'text-sm' : 'text-base'
                    }`}
                  >
                    <option value="medicacion">Medicación</option>
                    <option value="comida">Comida</option>
                    <option value="higiene">Higiene</option>
                    <option value="actividad">Actividad</option>
                    <option value="incidencia">Incidencia</option>
                    <option value="visita">Visita</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    Actividad específica
                  </label>
                  <select
                    value={nuevoRegistro.subtipo}
                    onChange={(e) => setNuevoRegistro({...nuevoRegistro, subtipo: e.target.value})}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isMobile ? 'text-sm' : 'text-base'
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    {actividadesPredefinidas[nuevoRegistro.tipo].map(actividad => (
                      <option key={actividad} value={actividad}>{actividad}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                  Descripción personalizada (opcional)
                </label>
                <input
                  type="text"
                  value={nuevoRegistro.descripcion}
                  onChange={(e) => setNuevoRegistro({...nuevoRegistro, descripcion: e.target.value})}
                  placeholder="Describe la actividad realizada..."
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                  Observaciones
                </label>
                <textarea
                  value={nuevoRegistro.observaciones}
                  onChange={(e) => setNuevoRegistro({...nuevoRegistro, observaciones: e.target.value})}
                  placeholder="Observaciones adicionales..."
                  rows={isMobile ? 2 : 3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}
                />
              </div>

              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div>
                  <label className={`block font-medium text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    Estado
                  </label>
                  <select
                    value={nuevoRegistro.estado}
                    onChange={(e) => setNuevoRegistro({...nuevoRegistro, estado: e.target.value as any})}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isMobile ? 'text-sm' : 'text-base'
                    }`}
                  >
                    <option value="realizado">Realizado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="no_realizado">No realizado</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nuevoRegistro.urgente}
                      onChange={(e) => setNuevoRegistro({...nuevoRegistro, urgente: e.target.checked})}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 rounded"
                    />
                    <span className={`ml-2 text-red-700 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                      Urgente
                    </span>
                  </label>
                </div>
              </div>

              <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-4'}`}>
                <button
                  type="submit"
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors ${
                    isMobile ? 'py-2 text-sm' : 'px-4 py-2 text-base'
                  }`}
                >
                  Guardar Registro
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className={`bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors ${
                    isMobile ? 'py-2 text-sm' : 'px-4 py-2 text-base'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de registros del día */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className={`p-4 md:p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl`}>
            <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
              Registros del {new Date(fecha).toLocaleDateString('es-ES')}
            </h3>
          </div>

          {registros.length === 0 ? (
            <div className={`text-center ${isMobile ? 'p-8' : 'p-12'}`}>
              <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} mb-4`}>📝</div>
              <h3 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Sin registros
              </h3>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
                No hay registros para este día. Haz clic en "Nuevo Registro" para añadir el primero.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {registros
                .sort((a, b) => b.hora.localeCompare(a.hora))
                .map((registro) => (
                <div key={registro.id} className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`${isMobile ? 'text-xl' : 'text-2xl'}`}>
                        {getIconoPorTipo(registro.tipo)}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`flex items-center space-x-3 mb-2 ${isMobile ? 'flex-col items-start space-y-1 space-x-0' : ''}`}>
                          <h4 className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {registro.subtipo || registro.descripcion}
                          </h4>
                          <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {registro.hora}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                            getColorPorEstado(registro.estado)
                          }`}>
                            {registro.estado === 'realizado' && 'Realizado'}
                            {registro.estado === 'pendiente' && 'Pendiente'}
                            {registro.estado === 'no_realizado' && 'No realizado'}
                          </span>
                          {registro.urgente && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Urgente
                            </span>
                          )}
                        </div>
                        
                        {registro.observaciones && (
                          <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {registro.observaciones}
                          </p>
                        )}
                        
                        <div className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
                          Por: {registro.realizadoPor}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}