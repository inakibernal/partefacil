export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="text-center space-y-6 md:space-y-8">
          {/* Logo principal 100% fiel */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 100 100" 
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {/* Fondo circular azul */}
                <circle cx="50" cy="50" r="48" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2"/>
                
                {/* Documento principal */}
                <rect x="25" y="20" width="35" height="45" fill="white" rx="2"/>
                
                {/* Líneas de texto en el documento */}
                <line x1="30" y1="28" x2="55" y2="28" stroke="#2563eb" strokeWidth="1.5"/>
                <line x1="30" y1="33" x2="50" y2="33" stroke="#2563eb" strokeWidth="1.5"/>
                <line x1="30" y1="38" x2="55" y2="38" stroke="#2563eb" strokeWidth="1.5"/>
                <line x1="30" y1="43" x2="48" y2="43" stroke="#2563eb" strokeWidth="1.5"/>
                
                {/* Checkbox marcado */}
                <rect x="30" y="50" width="6" height="6" fill="#10b981" rx="1"/>
                <path d="M31.5 53 L33 54.5 L36.5 51" stroke="white" strokeWidth="1.5" fill="none"/>
                
                {/* Texto al lado del checkbox */}
                <line x1="40" y1="53" x2="52" y2="53" stroke="#2563eb" strokeWidth="1.5"/>
                
                {/* Documento secundario (efecto múltiples páginas) */}
                <rect x="40" y="35" width="35" height="45" fill="white" rx="2" opacity="0.9"/>
                
                {/* Líneas en documento secundario */}
                <line x1="45" y1="43" x2="70" y2="43" stroke="#2563eb" strokeWidth="1.5"/>
                <line x1="45" y1="48" x2="65" y2="48" stroke="#2563eb" strokeWidth="1.5"/>
                <line x1="45" y1="53" x2="70" y2="53" stroke="#2563eb" strokeWidth="1.5"/>
                <line x1="45" y1="58" x2="63" y2="58" stroke="#2563eb" strokeWidth="1.5"/>
                
                {/* Icono de usuario pequeño */}
                <circle cx="65" cy="67" r="4" fill="#10b981"/>
                <path d="M61 75 Q61 71 65 71 Q69 71 69 75" fill="#10b981"/>
              </svg>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <span className="text-blue-600">Parte Fácil</span>
            <br className="hidden sm:block"/>
            <span className="block mt-2 sm:mt-0 sm:inline"> para Residencias</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            La forma más <span className="font-semibold text-blue-600">simple y rápida</span> de gestionar 
            partes diarios en residencias de mayores. 
            <span className="block mt-2 text-base sm:text-lg md:text-xl">
              De papel a digital en <span className="font-semibold">1 clic</span>
            </span>
          </p>

          {/* Botones principales */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6 md:pt-8 px-4">
            <a
              href="/login"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 md:px-12 rounded-xl text-lg md:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Comenzar Ahora
            </a>
            <a
              href="/caracteristicas"
              className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 md:px-12 rounded-xl text-lg md:text-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              Ver Características
            </a>
          </div>

          {/* Indicador de prueba gratuita */}
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm md:text-base font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            30 días de prueba gratuita
          </div>
        </div>

        {/* Características destacadas */}
        <div className="mt-16 md:mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Parte Fácil?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">
              Diseñado específicamente para residencias de mayores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="text-4xl md:text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Súper Rápido</h3>
              <p className="text-gray-600">
                Partes diarios en <strong>2 minutos</strong> en lugar de 15-20 minutos en papel
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="text-4xl md:text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">En Cualquier Sitio</h3>
              <p className="text-gray-600">
                Funciona en <strong>móvil, tablet y ordenador</strong>. Acceso desde cualquier lugar
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="text-4xl md:text-5xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">PDFs Listos</h3>
              <p className="text-gray-600">
                <strong>1 clic = PDF</strong> profesional para inspecciones oficiales
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial simulado */}
        <div className="mt-16 md:mt-24 px-4">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <div className="text-2xl md:text-3xl mb-6">"</div>
            <p className="text-lg md:text-xl mb-6 leading-relaxed max-w-3xl mx-auto">
              Antes tardábamos 20 minutos en cada parte diario. Ahora, con Parte Fácil, 
              son solo 2 minutos. Nuestro personal puede dedicar más tiempo a los residentes.
            </p>
            <div className="font-semibold">María González</div>
            <div className="text-blue-200">Directora, Residencia San Miguel</div>
          </div>
        </div>

        {/* Call to action final */}
        <div className="mt-16 md:mt-24 text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            ¿Listo para digitalizar tu residencia?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Únete a más de 100 residencias que ya usan Parte Fácil para gestionar sus partes diarios
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 md:px-12 rounded-xl text-lg md:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Empezar Prueba Gratuita
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Sin tarjeta de crédito • 30 días gratis • Soporte incluido
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-xs md:text-sm text-gray-600 leading-relaxed">
            <p className="mb-4">
              © 2025 | <span className="font-semibold">Parte Fácil®</span> es una marca registrada de software para gestión de Partes diarios de Residencias de Mayores
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <a href="/politica-privacidad" className="hover:text-blue-600 transition-colors">
                Política de Privacidad
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="/politica-cookies" className="hover:text-blue-600 transition-colors">
                Política de Cookies
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="/aviso-legal" className="hover:text-blue-600 transition-colors">
                Aviso Legal
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}