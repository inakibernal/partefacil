export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="text-center space-y-6 md:space-y-8">
          {/* Logo principal - Documento con check */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <svg 
                width="120" 
                height="120" 
                viewBox="0 0 100 100" 
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {/* Documento principal */}
                <rect x="25" y="15" width="45" height="60" fill="#5DADE2" rx="3"/>
                
                {/* Esquina doblada */}
                <path d="M60 15 L60 25 L70 25 Z" fill="#3498DB"/>
                
                {/* Líneas de texto */}
                <rect x="30" y="25" width="25" height="2" fill="white" rx="1"/>
                <rect x="30" y="30" width="30" height="2" fill="white" rx="1"/>
                <rect x="30" y="35" width="20" height="2" fill="white" rx="1"/>
                <rect x="30" y="40" width="28" height="2" fill="white" rx="1"/>
                
                {/* Check verde */}
                <circle cx="40" cy="55" r="8" fill="#27AE60"/>
                <path d="M35 55 L38 58 L45 51" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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
                Partes diarios en <strong>2 minutos</strong> en lugar de 30-35 minutos en papel
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="text-4xl md:text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% adaptado a todo tipo de dispositivos</h3>
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
              Antes tardábamos 35 minutos en cada parte diario. Ahora, con Parte Fácil, 
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
            Empezar Ahora
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Sin tarjeta de crédito • Soporte incluido
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