export default function CaracteristicasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Características Destacadas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Parte Fácil está diseñado específicamente para residencias de mayores, con características que simplifican la gestión diaria y mejoran la calidad de atención.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Característica 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Partes Diarios Simplificados</h3>
            <p className="text-gray-600 mb-4">
              Crea partes diarios en menos de 2 minutos. Formulario intuitivo con campos optimizados para residencias de mayores.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Campos que marca la normativa oficial</li>
              <li>• Autocompletado inteligente</li>
              <li>• Guardado automático</li>
            </ul>
          </div>

          {/* Característica 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Usuarios por Roles</h3>
            <p className="text-gray-600 mb-4">
              Sistema de permisos avanzado que distingue entre directores, personal de atención y otros roles.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Acceso diferenciado por rol</li>
              <li>• Múltiples usuarios simultáneos</li>
              <li>• Trazabilidad completa</li>
            </ul>
          </div>

          {/* Característica 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">PDFs Profesionales</h3>
            <p className="text-gray-600 mb-4">
              Genera informes en PDF listos para inspecciones oficiales con formato profesional y toda la información necesaria.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Formato oficial homologado</li>
              <li>• Generación individual o masiva</li>
              <li>• Descarga instantánea</li>
            </ul>
          </div>

          {/* Característica 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informes Mensuales Automáticos</h3>
            <p className="text-gray-600 mb-4">
              Estadísticas mensuales completas con análisis de tendencias, ocupación y eventos relevantes.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Estadísticas automáticas</li>
              <li>• Exportación a PDF</li>
            </ul>
          </div>

          {/* Característica 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Búsqueda y Filtros Avanzados</h3>
            <p className="text-gray-600 mb-4">
              Encuentra cualquier información en segundos con filtros por fecha, centro, personal y tipo de incidencia.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Búsqueda en tiempo real</li>
              <li>• Filtros múltiples</li>
              <li>• Exportación de resultados</li>
            </ul>
          </div>

          {/* Característica 6 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Responsive</h3>
            <p className="text-gray-600 mb-4">
              Funciona perfectamente en cualquier dispositivo: móvil, tablet u ordenador. Acceso desde cualquier lugar.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Diseño adaptable</li>
              <li>• Acceso multiplataforma</li>
              <li>• Sincronización automática</li>
            </ul>
          </div>
        </div>

        {/* Sección de beneficios */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Beneficios para tu Residencia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-6">Para Directores</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <div className="font-semibold">Control total de la residencia</div>
                    <div className="text-gray-600 text-sm">Visión completa de todos los partes y estadísticas</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <div className="font-semibold">Inspecciones sin estrés</div>
                    <div className="text-gray-600 text-sm">PDFs listos en 1 clic para cualquier revisión oficial</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <div className="font-semibold">Gestión multicentro</div>
                    <div className="text-gray-600 text-sm">Administra varias residencias desde una sola plataforma</div>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-6">Para Personal de Atención</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <div className="font-semibold">Menos papeleo, más tiempo para residentes</div>
                    <div className="text-gray-600 text-sm">Partes diarios en 2 minutos en lugar de 30-35 minutos</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <div className="font-semibold">Interfaz super simple</div>
                    <div className="text-gray-600 text-sm">Diseñado para ser usado por cualquier persona, sin formación técnica</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <div className="font-semibold">Acceso desde cualquier dispositivo</div>
                    <div className="text-gray-600 text-sm">Móvil, tablet u ordenador: siempre disponible</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección de comparación */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Antes vs Después de Parte Fácil
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border-l-4 border-red-400">
              <h3 className="font-semibold text-red-600 mb-4 text-lg">❌ Método tradicional (papel)</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• 30-35 minutos por parte diario</li>
                <li>• Riesgo de pérdida de documentos</li>
                <li>• Dificultad para encontrar información</li>
                <li>• Preparación manual para inspecciones</li>
                <li>• Letra ilegible en ocasiones</li>
                <li>• No hay backup automático</li>
                <li>• Difícil generar estadísticas</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border-l-4 border-green-400">
              <h3 className="font-semibold text-green-600 mb-4 text-lg">✅ Con Parte Fácil (digital)</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• 2 minutos por parte diario</li>
                <li>• Información segura en la nube</li>
                <li>• Búsqueda instantánea</li>
                <li>• PDFs listos en 1 clic</li>
                <li>• Texto siempre legible</li>
                <li>• Backup automático 24/7</li>
                <li>• Estadísticas automáticas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
