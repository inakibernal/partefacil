"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    // Verificar usuario logueado
    try {
      const usuarioData = sessionStorage.getItem("usuario_logueado")
      if (usuarioData) {
        setUsuarioLogueado(JSON.parse(usuarioData))
      }
    } catch (error) {
      console.log("Error al verificar usuario:", error)
    }
  }, [])

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario_logueado")
    setUsuarioLogueado(null)
    window.location.href = "/"
  }

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y menú izquierda */}
          <div className="flex items-center">
            {/* Logo con menú desplegable */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                {/* Logo SVG simplificado */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                
                <span>Parte Fácil</span>
                
                {/* Flecha del dropdown */}
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menú desplegable */}
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

          {/* Usuario logueado o botón iniciar sesión */}
          <div className="flex items-center space-x-4">
            {usuarioLogueado ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{usuarioLogueado.nombre}</div>
                  <div className="text-xs text-gray-500 capitalize">{usuarioLogueado.tipo}</div>
                </div>
                <button
                  onClick={cerrarSesion}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
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