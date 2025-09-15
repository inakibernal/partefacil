"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function AvisoLegalPage() {
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
          Aviso Legal
        </h1>

        <div style={{ lineHeight: "1.6", color: "#555" }}>
          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            1. Información general
          </h2>
          <p>
            Parte Fácil es un software de gestión para residencias de mayores que permite 
            la creación y administración de partes diarios de forma digital.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            2. Uso del software
          </h2>
          <p>
            El uso de Parte Fácil está destinado exclusivamente a:
          </p>
          <ul>
            <li>Personal autorizado de residencias de mayores</li>
            <li>Directores y responsables de centros geriátricos</li>
            <li>Actividades relacionadas con la gestión de partes diarios</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            3. Responsabilidades del usuario
          </h2>
          <p>
            Los usuarios se comprometen a:
          </p>
          <ul>
            <li>Utilizar el software de manera responsable y profesional</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Introducir información veraz y actualizada en los partes</li>
            <li>Cumplir con la normativa aplicable en materia de protección de datos</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            4. Limitaciones de responsabilidad
          </h2>
          <p>
            Parte Fácil se proporciona "tal como está" sin garantías de ningún tipo. 
            No nos hacemos responsables de:
          </p>
          <ul>
            <li>Pérdida de datos debido a fallos del navegador o del dispositivo</li>
            <li>Uso indebido del software por parte de usuarios no autorizados</li>
            <li>Decisiones tomadas basándose en la información del sistema</li>
            <li>Interrupciones del servicio por causas técnicas</li>
          </ul>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            5. Propiedad intelectual
          </h2>
          <p>
            Parte Fácil® es una marca registrada. Todos los derechos de autor, 
            marcas comerciales y otros derechos de propiedad intelectual están reservados.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            6. Modificaciones del servicio
          </h2>
          <p>
            Nos reservamos el derecho a modificar, suspender o discontinuar 
            cualquier aspecto del software en cualquier momento sin previo aviso.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            7. Jurisdicción aplicable
          </h2>
          <p>
            Este aviso legal se rige por la legislación española. Cualquier disputa 
            será resuelta por los tribunales competentes de España.
          </p>

          <h2 style={{ color: "#007bff", marginTop: "30px", marginBottom: "15px" }}>
            8. Contacto
          </h2>
          <p>
            Para consultas legales o técnicas relacionadas con Parte Fácil, 
            contacte a través de los canales oficiales de su residencia.
          </p>

          <div style={{ 
            marginTop: "40px", 
            padding: "20px", 
            backgroundColor: "#f8d7da", 
            borderRadius: "8px",
            border: "1px solid #f5c6cb"
          }}>
            <h3 style={{ color: "#721c24", marginTop: 0 }}>Importante</h3>
            <p style={{ color: "#721c24", margin: 0 }}>
              El uso de este software implica la aceptación total de este aviso legal. 
              Si no está de acuerdo con alguno de los términos, debe abstenerse de usar la aplicación.
            </p>
          </div>

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