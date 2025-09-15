"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function PoliticaCookiesPage() {
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
          Política de Cookies
        </h1>

        <div style={{ lineHeight: "1.6", color: "#555" }}>
          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            1. Qué son las cookies
          </h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita 
            un sitio web. Parte Fácil utiliza tecnologías de almacenamiento local en lugar de cookies 
            tradicionales.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            2. Tecnologías utilizadas
          </h2>
          <p>
            Parte Fácil utiliza las siguientes tecnologías de almacenamiento:
          </p>
          <ul>
            <li><strong>SessionStorage:</strong> Para mantener la sesión del usuario activa</li>
            <li><strong>Almacenamiento local del navegador:</strong> Para guardar los datos de los partes diarios</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            3. Finalidad del almacenamiento
          </h2>
          <p>
            Los datos se almacenan únicamente para:
          </p>
          <ul>
            <li>Mantener la sesión de usuario durante el uso de la aplicación</li>
            <li>Guardar temporalmente los partes diarios creados</li>
            <li>Recordar las preferencias de filtros y búsquedas</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            4. Duración del almacenamiento
          </h2>
          <p>
            Los datos almacenados tienen las siguientes duraciones:
          </p>
          <ul>
            <li><strong>Datos de sesión:</strong> Se eliminan automáticamente al cerrar el navegador</li>
            <li><strong>Datos de partes:</strong> Persisten hasta que el usuario los elimine manualmente</li>
            <li><strong>Datos de inactividad:</strong> La sesión expira automáticamente después de 3 minutos sin actividad</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            5. Control del usuario
          </h2>
          <p>
            El usuario puede:
          </p>
          <ul>
            <li>Eliminar todos los datos almacenados borrando los datos del navegador</li>
            <li>Desactivar el almacenamiento local desde la configuración del navegador</li>
            <li>Cerrar sesión manualmente para eliminar los datos de sesión</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            6. Cookies de terceros
          </h2>
          <p>
            Parte Fácil NO utiliza cookies de terceros, servicios de análisis externos, 
            ni herramientas de seguimiento. Toda la información se mantiene localmente 
            en el dispositivo del usuario.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            7. Actualización de esta política
          </h2>
          <p>
            Cualquier cambio en el uso de tecnologías de almacenamiento será comunicado 
            a través de esta página y notificado en la aplicación.
          </p>

          <p style={{ 
            marginTop: "40px", 
            padding: "20px", 
            backgroundColor: "#fff3cd", 
            borderRadius: "8px",
            border: "1px solid #ffeaa7"
          }}>
            <strong>Importante:</strong> Al continuar usando Parte Fácil, acepta el uso de estas 
            tecnologías de almacenamiento según se describe en esta política.
          </p>

          <p style={{ 
            marginTop: "20px", 
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