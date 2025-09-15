"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Usuario {
  dni: string
  nombre: string
  tipo: string
  residencias: string[]
  fechaLogin: string
}

interface SessionProtectionProps {
  children: React.ReactNode
  requiredRole?: 'director' | 'personal' | 'any'
}

export default function SessionProtection({ children, requiredRole = 'any' }: SessionProtectionProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sesión al cargar
    const verificarSesion = () => {
      try {
        const usuarioData = sessionStorage.getItem("usuario_logueado")
        
        if (!usuarioData) {
          console.log("No hay sesión, redirigiendo al login")
          router.push('/')
          return
        }

        const userData = JSON.parse(usuarioData)
        console.log("Usuario encontrado:", userData)

        // Verificar rol requerido
        if (requiredRole !== 'any' && userData.tipo !== requiredRole) {
          console.log("Rol incorrecto, redirigiendo")
          if (userData.tipo === 'director') {
            router.push('/informes')
          } else {
            router.push('/nuevo-parte')
          }
          return
        }

        setUsuario(userData)
        setLoading(false)
      } catch (error) {
        console.error("Error verificando sesión:", error)
        router.push('/')
      }
    }

    verificarSesion()
  }, [router, requiredRole])

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

  return <>{children}</>
}