"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function PoliticaPrivacidadPage() {
  const router = useRouter()

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
        <button
          onClick={volverInicio}
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
          Volver al inicio
        </button>
      </header>

      {/* Contenido principal */}
      <main style={{ 
        flex: 1,
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        marginTop: "20px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "32px", 
          color: "#333", 
          marginBottom: "30px",
          borderBottom: "3px solid #007bff",
          paddingBottom: "10px"
        }}>
          Política de Privacidad
        </h1>

        <div style={{ lineHeight: "1.6", color: "#555" }}>
          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            1. Información que recopilamos
          </h2>
          <p>
            Parte Fácil recopila únicamente la información necesaria para el funcionamiento del servicio:
          </p>
          <ul>
            <li>Datos de identificación del personal (DNI y nombre completo)</li>
            <li>Información de los partes diarios creados</li>
            <li>Datos de las residencias asignadas</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            2. Uso de la información
          </h2>
          <p>
            Los datos recopilados se utilizan exclusivamente para:
          </p>
          <ul>
            <li>Gestionar el acceso al sistema según el rol del usuario</li>
            <li>Generar informes y partes diarios</li>
            <li>Mantener un registro de actividades para auditorías</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            3. Almacenamiento de datos
          </h2>
          <p>
            Todos los datos se almacenan localmente en el navegador del usuario mediante sessionStorage. 
            No se transmiten datos a servidores externos ni se comparten con terceros.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            4. Seguridad
          </h2>
          <p>
            Parte Fácil implementa medidas de seguridad para proteger los datos:
          </p>
          <ul>
            <li>Autenticación mediante DNI y contraseña</li>
            <li>Sesiones que expiran automáticamente por inactividad</li>
            <li>Datos que se eliminan al cerrar el navegador</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            5. Derechos del usuario
          </h2>
          <p>
            Los usuarios tienen derecho a:
          </p>
          <ul>
            <li>Acceder a sus datos personales</li>
            <li>Rectificar información incorrecta</li>
            <li>Eliminar sus datos del sistema</li>
            <li>Limitar el procesamiento de sus datos</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            6. Contacto
          </h2>
          <p>
            Para cualquier consulta sobre esta política de privacidad, puede contactarnos a través de 
            los canales oficiales de su residencia.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            7. Cambios en la política
          </h2>
          <p>
            Esta política puede actualizarse ocasionalmente. Los cambios serán notificados a través 
            del sistema antes de su entrada en vigor.
          </p>

          <p style={{ 
            marginTop: "40px", 
            padding: "20px", 
            backgroundColor: "#e7f3ff", 
            borderRadius: "8px",
            fontStyle: "italic"
          }}>
            Última actualización: 15 de septiembre de 2025
          </p>
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