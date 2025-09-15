export default function CondicionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Condiciones del Servicio
          </h1>
          <p className="text-xl text-gray-600">
            Última actualización: 15 de septiembre de 2025
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar Parte Fácil, usted acepta estar legalmente vinculado por estos términos y condiciones. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descripción del Servicio</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Parte Fácil es una plataforma digital diseñada para la gestión de partes diarios en residencias de mayores. 
              El servicio incluye:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Creación y gestión de partes diarios</li>
              <li>Generación de informes en PDF</li>
              <li>Sistema de usuarios con diferentes roles</li>
              <li>Almacenamiento seguro de datos</li>
              <li>Funcionalidades de búsqueda y filtrado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registro y Cuentas de Usuario</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>3.1 Elegibilidad:</strong> Para utilizar Parte Fácil, debe ser mayor de 18 años y tener 
                autoridad legal para representar a la residencia de mayores.
              </p>
              <p>
                <strong>3.2 Información de la cuenta:</strong> Debe proporcionar información precisa y completa 
                durante el registro y mantenerla actualizada.
              </p>
              <p>
                <strong>3.3 Seguridad:</strong> Es responsable de mantener la confidencialidad de sus credenciales 
                de acceso y de todas las actividades que ocurran bajo su cuenta.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Uso Aceptable</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>Usted se compromete a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utilizar el servicio únicamente para fines legales y autorizados</li>
                <li>No interferir con el funcionamiento del servicio</li>
                <li>No intentar acceder a datos de otras residencias</li>
                <li>Cumplir con todas las leyes y regulaciones aplicables</li>
                <li>Mantener la confidencialidad de los datos de residentes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacidad y Protección de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              El manejo de datos personales se rige por nuestra Política de Privacidad, que forma parte integral 
              de estos términos. Nos comprometemos a cumplir con el RGPD y todas las leyes de protección de datos aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Facturación y Pagos</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>6.1 Tarifa:</strong> El servicio se factura mensualmente a 49€ por residencia, IVA incluido.
              </p>
              <p>
                <strong>6.2 Facturación:</strong> Los pagos se procesarán automáticamente cada mes en la fecha 
                de su suscripción inicial.
              </p>
              <p>
                <strong>6.3 Cancelación:</strong> Puede cancelar su suscripción en cualquier momento. 
                No se proporcionan reembolsos por períodos parciales.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disponibilidad del Servicio</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos esforzamos por mantener un 99.9% de disponibilidad, pero no garantizamos que el servicio 
              esté disponible sin interrupciones. Podemos realizar mantenimientos programados con previo aviso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>8.1 Nuestros derechos:</strong> Parte Fácil y todo su contenido son propiedad de nuestra empresa 
                y están protegidos por las leyes de propiedad intelectual.
              </p>
              <p>
                <strong>8.2 Sus datos:</strong> Usted mantiene todos los derechos sobre los datos que introduce 
                en la plataforma.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 leading-relaxed">
              En la máxima medida permitida por la ley, nuestra responsabilidad total hacia usted no excederá 
              el monto pagado por el servicio en los 12 meses anteriores al evento que dio lugar a la reclamación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Terminación</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos suspender o terminar su acceso al servicio si viola estos términos. Usted puede 
              terminar su cuenta en cualquier momento contactándonos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modificaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos 
              los cambios significativos con al menos 30 días de antelación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Ley Aplicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Estos términos se rigen por las leyes de España. Cualquier disputa se resolverá en los 
              tribunales españoles competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Para cualquier pregunta sobre estos términos, puede contactarnos en:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@partefacil.com<br/>
                <strong>Teléfono:</strong> +34 900 123 456<br/>
                <strong>Dirección:</strong> Calle Principal 123, 28001 Madrid, España
              </p>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}