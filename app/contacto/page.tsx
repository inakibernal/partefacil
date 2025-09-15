"use client"

import { useState } from 'react'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    residencia: '',
    telefono: '',
    tipo: '',
    mensaje: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular envío del formulario
    console.log('Datos del formulario:', formData)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 5000)
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      email: '',
      residencia: '',
      telefono: '',
      tipo: '',
      mensaje: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta sobre Parte Fácil? Nuestro equipo está aquí para ayudarte. 
            Contáctanos y te responderemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Envíanos un mensaje</h2>
            
            {enviado && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                ✅ Mensaje enviado correctamente. Te contactaremos pronto.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residencia/Centro
                  </label>
                  <input
                    type="text"
                    name="residencia"
                    value={formData.residencia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre de tu residencia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de consulta *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="informacion">Información general</option>
                  <option value="demo">Solicitar demostración</option>
                  <option value="precios">Consulta sobre precios</option>
                  <option value="soporte">Soporte técnico</option>
                  <option value="colaboracion">Colaboración/Partnership</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-8">
            {/* Datos de contacto directo */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">📧</div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@partefacil.com</div>
                    <div className="text-sm text-gray-500">Respuesta en menos de 24h</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">📞</div>
                  <div>
                    <div className="font-semibold text-gray-900">Teléfono</div>
                    <div className="text-gray-600">+34 900 123 456</div>
                    <div className="text-sm text-gray-500">Lun-Vie 9:00-18:00</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">📍</div>
                  <div>
                    <div className="font-semibold text-gray-900">Oficina</div>
                    <div className="text-gray-600">Calle Principal 123</div>
                    <div className="text-gray-600">28001 Madrid, España</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios de atención */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Horarios de atención</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Lunes - Viernes</span>
                  <span className="font-semibold text-gray-900">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Sábados</span>
                  <span className="font-semibold text-gray-900">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Domingos</span>
                  <span className="text-gray-500">Cerrado</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Soporte urgente:</strong> Para incidencias críticas fuera del horario comercial, 
                  envía un email a soporte@partefacil.com y te contactaremos lo antes posible.
                </div>
              </div>
            </div>

            {/* FAQ rápido */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preguntas frecuentes</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-700 text-sm">¿Hay período de prueba?</div>
                  <div className="text-gray-600 text-sm">Sí, 30 días gratuitos sin tarjeta de crédito.</div>
                </div>
                
                <div>
                  <div className="font-semibold text-gray-700 text-sm">¿Qué incluye el precio?</div>
                  <div className="text-gray-600 text-sm">Todo: usuarios ilimitados, PDFs, soporte y actualizaciones.</div>
                </div>
                
                <div>
                  <div className="font-semibold text-gray-700 text-sm">¿Es compatible con móviles?</div>
                  <div className="text-gray-600 text-sm">100% responsive. Funciona en cualquier dispositivo.</div>
                </div>
                
                <div>
                  <div className="font-semibold text-gray-700 text-sm">¿Hay instalación?</div>
                  <div className="text-gray-600 text-sm">No. Es 100% web, empiezas a usarlo inmediatamente.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}