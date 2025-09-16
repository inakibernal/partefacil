"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = () => {
      try {
        const usuarioData = sessionStorage.getItem("usuario_logueado")
        if (usuarioData) {
          const usuario = JSON.parse(usuarioData)
          setUsuarioLogueado(usuario)
        }
      } catch (error) {
        console.log("Error al verificar usuario:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
    
    // Verificar cada 5 segundos si cambió la sesión
    const interval = setInterval(checkSession, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario_logueado")
    setUsuarioLogueado(null)
    window.location.href = "/"
  }

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-blue-600">Parte Fácil</div>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y menú izquierda */}
          <div className="flex items-center">
            <div className="relative">
              <div className="flex items-center">
                <Link 
                  href="/"
                  className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 mr-2"
                >
                  Parte Fácil
                </Link>
                
                <button
                  onClick={toggleMenu}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {menuAbierto && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <Link 
                    href="/tarifa-unica" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <div className="font-semibold">Tarifa Única</div>
                    <div className="text-sm text-gray-500">Precios transparentes</div>
                  </Link>
                  
                  <Link 
                    href="/caracteristicas" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <div className="font-semibold">Características</div>
                    <div className="text-sm text-gray-500">Funcionalidades</div>
                  </Link>
                  
                  <Link 
                    href="/seguridad" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <div className="font-semibold">Seguridad</div>
                    <div className="text-sm text-gray-500">Protección de datos</div>
                  </Link>
                  
                  <Link 
                    href="/condiciones" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <div className="font-semibold">Condiciones</div>
                    <div className="text-sm text-gray-500">Términos legales</div>
                  </Link>
                  
                  <Link 
                    href="/contacto" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <div className="font-semibold">Contacto</div>
                    <div className="text-sm text-gray-500">Habla con nosotros</div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* LADO DERECHO - Usuario logueado o botón iniciar sesión */}
          <div className="flex items-center space-x-4">
            {usuarioLogueado ? (
              // USUARIO LOGUEADO - Mostrar información y botón cerrar sesión
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{usuarioLogueado.nombre}</div>
                  <div className="text-xs text-gray-500 capitalize">{usuarioLogueado.tipo}</div>
                </div>
                <button
                  onClick={cerrarSesion}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              // USUARIO NO LOGUEADO - Mostrar botón iniciar sesión
              <Link 
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}