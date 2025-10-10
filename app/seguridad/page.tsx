export default function SeguridadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Seguridad de la Plataforma
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La seguridad de tus datos es nuestra máxima prioridad. Implementamos las mejores prácticas de la industria para proteger la información de tu residencia.
          </p>
        </div>

        {/* Certificaciones */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Certificaciones y Cumplimiento
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">RGPD</h3>
              <p className="text-gray-700">
                Cumplimiento total del Reglamento General de Protección de Datos de la UE
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-green-900 mb-3">SSL/TLS</h3>
              <p className="text-gray-700">
                Cifrado de extremo a extremo con certificados SSL de 256 bits
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">LOPD</h3>
              <p className="text-gray-700">
                Adaptado a la Ley Orgánica de Protección de Datos española
              </p>
            </div>
          </div>
        </div>

        {/* Medidas de Seguridad */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🔐</span>
              Protección de Datos
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Cifrado AES-256</div>
                  <div className="text-gray-600 text-sm">Todos los datos se cifran tanto en tránsito como en reposo</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Backup automático</div>
                  <div className="text-gray-600 text-sm">Copias de seguridad cada 24 horas en múltiples ubicaciones</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Anonimización</div>
                  <div className="text-gray-600 text-sm">Datos sensibles anonimizados cuando es posible</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Retención controlada</div>
                  <div className="text-gray-600 text-sm">Políticas claras de retención y eliminación de datos</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">👤</span>
              Control de Acceso
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Autenticación multifactor</div>
                  <div className="text-gray-600 text-sm">Verificación en dos pasos disponible</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Roles y permisos</div>
                  <div className="text-gray-600 text-sm">Acceso granular basado en el rol del usuario</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Sesiones seguras</div>
                  <div className="text-gray-600 text-sm">Timeout automático y gestión de sesiones</div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <div className="font-semibold">Auditoría completa</div>
                  <div className="text-gray-600 text-sm">Log de todas las acciones y accesos</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Infraestructura */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Infraestructura Segura
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl mb-3">☁️</div>
              <h4 className="font-semibold mb-2">Nube Europea</h4>
              <p className="text-sm text-gray-600">Servidores ubicados en centros de datos certificados en Europa</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-3xl mb-3">🔥</div>
              <h4 className="font-semibold mb-2">Firewall Avanzado</h4>
              <p className="text-sm text-gray-600">Protección perimetral con detección de intrusos</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold mb-2">Monitoreo 24/7</h4>
              <p className="text-sm text-gray-600">Supervisión continua de la infraestructura</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2">99.9% Uptime</h4>
              <p className="text-sm text-gray-600">Disponibilidad garantizada con redundancia</p>
            </div>
          </div>
        </div>

        {/* Mejores Prácticas */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Recomendaciones para Usuarios
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-blue-600 mb-4">Buenas Prácticas</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Usa contraseñas únicas y complejas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Cierra sesión al finalizar</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>No compartas credenciales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Mantén tu navegador actualizado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Reporta actividad sospechosa</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600 mb-4">Evita Estos Errores</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Acceder desde redes WiFi públicas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Guardar contraseñas en navegadores compartidos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Dejar sesiones abiertas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Compartir pantalla con datos sensibles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
