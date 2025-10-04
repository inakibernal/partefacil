export default function TarifaUnicaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tarifa Única
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparencia total en precios. Una única tarifa que incluye todo lo que necesitas para gestionar tu residencia.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">49€</div>
            <div className="text-2xl text-gray-700 mb-2">por residencia/mes</div>
            <div className="text-gray-500">IVA incluido</div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">✅ Incluido en la tarifa:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Usuarios ilimitados (directores y personal)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Partes diarios ilimitados
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Generación de PDFs profesionales
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Informes mensuales automáticos
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Soporte técnico incluido
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Actualizaciones automáticas
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Backup de datos en la nube
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">❌ Sin costes ocultos:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Sin coste de instalación
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Sin coste por usuario adicional
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Sin coste por volumen de datos
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Sin coste de migración
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Descuentos disponibles:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="font-semibold text-blue-700">Pago anual</div>
                <div className="text-2xl font-bold text-blue-600">10% descuento</div>
                <div className="text-sm text-gray-600">529€/año (en lugar de 588€)</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="font-semibold text-green-700">5+ residencias</div>
                <div className="text-2xl font-bold text-green-600">15% descuento</div>
                <div className="text-sm text-gray-600">Contacta para precio especial</div>
              </div>
            </div>
          </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">¿Necesitas más información?</p>
          <a href="/contacto" className="text-blue-600 hover:text-blue-700 font-semibold">
            Contacta con nuestro equipo →
          </a>
        </div>
      </div>
    </div>
    </div>
  )
}
