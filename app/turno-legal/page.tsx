'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerConfiguracionActiva, validarCamposSegunCCAA, CampoLegal } from '@/lib/ccaaConfig';

// Datos de residentes simplificados para el ejemplo
const RESIDENTES_EJEMPLO = [
  { id: 1, nombre: "Juan Pérez", habitacion: "101", edad: 78, diabetico: true },
  { id: 2, nombre: "María López", habitacion: "102", edad: 82, diabetico: true },
  { id: 3, nombre: "Carlos Ruiz", habitacion: "103", edad: 75, diabetico: false }
];

export default function TurnoLegal() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [residenteActual, setResidenteActual] = useState(0);
  const [configuracion, setConfiguracion] = useState(obtenerConfiguracionActiva());
  const [datosFormulario, setDatosFormulario] = useState<any>({});
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([]);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(usuarioData);
    if (user.tipo !== 'personal') {
      router.push('/login');
      return;
    }
    setUsuario(user);

    // Cargar configuración CCAA actualizada
    setConfiguracion(obtenerConfiguracionActiva());

    // Inicializar datos del formulario
    inicializarDatosFormulario();
  }, [router]);

  const inicializarDatosFormulario = () => {
    const datosIniciales: any = {};
    RESIDENTES_EJEMPLO.forEach(residente => {
      datosIniciales[residente.id] = {};
      
      // Inicializar campos base con valores por defecto
      configuracion.campos_base.forEach(campo => {
        datosIniciales[residente.id][campo.id] = obtenerValorPorDefecto(campo);
      });
      
      // Inicializar campos CCAA
      configuracion.campos_ccaa.forEach(campo => {
        datosIniciales[residente.id][campo.id] = obtenerValorPorDefecto(campo);
      });
    });
    setDatosFormulario(datosIniciales);
  };

  const obtenerValorPorDefecto = (campo: CampoLegal) => {
    switch (campo.tipo) {
      case 'select':
        return campo.opciones?.[0] || '';
      case 'checkbox':
        return false;
      case 'number':
        return '';
      case 'time':
        return '';
      case 'date':
        return new Date().toISOString().split('T')[0];
      default:
        return '';
    }
  };

  const actualizarCampo = (residenteId: number, campoId: string, valor: any) => {
    setDatosFormulario((prev: any) => ({
      ...prev,
      [residenteId]: {
        ...prev[residenteId],
        [campoId]: valor
      }
    }));
    
    // Limpiar errores de validación para este campo
    setErroresValidacion(prev => 
      prev.filter(error => !error.includes(campoId))
    );
  };

  const renderizarCampo = (campo: CampoLegal, residenteId: number) => {
    const valor = datosFormulario[residenteId]?.[campo.id] || '';
    const esObligatorio = campo.obligatorio;
    const residente = RESIDENTES_EJEMPLO.find(r => r.id === residenteId);

    // Lógica especial para campos condicionales
    let mostrarCampo = true;
    if (campo.id === 'constantes_glucemia' && !residente?.diabetico) {
      mostrarCampo = false;
    }

    if (!mostrarCampo) return null;

    const baseClasses = `w-full p-2 border rounded-lg ${
      esObligatorio ? 'border-red-300' : 'border-gray-300'
    } focus:ring-2 focus:ring-blue-500`;

    return (
      <div key={campo.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {campo.nombre}
          {esObligatorio && <span className="text-red-500 ml-1">*</span>}
          {campo.id === 'constantes_glucemia' && residente?.diabetico && (
            <span className="text-orange-600 ml-1">(Diabético - Obligatorio)</span>
          )}
        </label>
        
        {campo.tipo === 'select' && (
          <select
            value={valor}
            onChange={(e) => actualizarCampo(residenteId, campo.id, e.target.value)}
            className={baseClasses}
            required={esObligatorio}
          >
            {campo.opciones?.map(opcion => (
              <option key={opcion} value={opcion}>
                {opcion.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        )}

        {campo.tipo === 'text' && (
          <input
            type="text"
            value={valor}
            onChange={(e) => actualizarCampo(residenteId, campo.id, e.target.value)}
            className={baseClasses}
            placeholder={campo.descripcion}
            required={esObligatorio}
          />
        )}

        {campo.tipo === 'number' && (
          <input
            type="number"
            value={valor}
            onChange={(e) => actualizarCampo(residenteId, campo.id, e.target.value)}
            className={baseClasses}
            placeholder={campo.descripcion}
            step="0.1"
            required={esObligatorio}
          />
        )}

        {campo.tipo === 'time' && (
          <input
            type="time"
            value={valor}
            onChange={(e) => actualizarCampo(residenteId, campo.id, e.target.value)}
            className={baseClasses}
            required={esObligatorio}
          />
        )}

        {campo.tipo === 'textarea' && (
          <textarea
            value={valor}
            onChange={(e) => actualizarCampo(residenteId, campo.id, e.target.value)}
            className={baseClasses}
            placeholder={campo.descripcion}
            rows={3}
            required={esObligatorio}
          />
        )}

        {campo.tipo === 'checkbox' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={valor}
              onChange={(e) => actualizarCampo(residenteId, campo.id, e.target.checked)}
              className="mr-2"
              required={esObligatorio}
            />
            <span className="text-sm text-gray-600">{campo.descripcion}</span>
          </div>
        )}

        <p className="text-xs text-gray-500">{campo.descripcion}</p>
      </div>
    );
  };

  const validarFormulario = () => {
    const errores: string[] = [];
    RESIDENTES_EJEMPLO.forEach(residente => {
      const datosResidente = datosFormulario[residente.id] || {};
      const erroresResidente = validarCamposSegunCCAA(datosResidente);
      
      erroresResidente.forEach(error => {
        errores.push(`${residente.nombre}: ${error}`);
      });

      // Validación especial para diabéticos
      if (residente.diabetico && !datosResidente.constantes_glucemia) {
        errores.push(`${residente.nombre}: Glucemia obligatoria (es diabético)`);
      }
    });
    
    setErroresValidacion(errores);
    return errores.length === 0;
  };

  const finalizarTurno = async () => {
    if (!validarFormulario()) {
      alert('Hay campos obligatorios sin completar. Revisa los errores marcados.');
      return;
    }

    setFinalizando(true);

    const parteLegal = {
      fecha: new Date().toISOString().split('T')[0],
      turno: obtenerTurno(),
      personal_responsable: usuario.nombre,
      centro: usuario.centro,
      residentes_data: datosFormulario,
      configuracion_activa: {
        campos_base: configuracion.campos_base.length,
        campos_ccaa: configuracion.campos_ccaa.length,
        ccaa_activas: configuracion.ccaa_activas
      },
      cumple_boe: true,
      cumple_ccaa: configuracion.ccaa_activas.length > 0,
      timestamp: new Date().toISOString()
    };

    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 2000));

    const partesGuardados = JSON.parse(localStorage.getItem('partes_legales_ccaa') || '[]');
    partesGuardados.push({
      id: Date.now(),
      ...parteLegal
    });
    localStorage.setItem('partes_legales_ccaa', JSON.stringify(partesGuardados));

    alert(`Turno finalizado correctamente.
Cumple normativa estatal + ${configuracion.ccaa_activas.length} CCAA
Total: ${configuracion.campos_base.length + configuracion.campos_ccaa.length} campos validados
CCAA activas: ${configuracion.ccaa_activas.join(', ')}`);

    setFinalizando(false);
  };

  const obtenerTurno = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 14) return 'Mañana';
    if (hora >= 14 && hora < 22) return 'Tarde';
    return 'Noche';
  };

  const agruparCamposPorCategoria = (campos: CampoLegal[]) => {
    return campos.reduce((grupos, campo) => {
      if (!grupos[campo.categoria]) {
        grupos[campo.categoria] = [];
      }
      grupos[campo.categoria].push(campo);
      return grupos;
    }, {} as Record<string, CampoLegal[]>);
  };

  if (!usuario) return <div>Cargando...</div>;

  const residente = RESIDENTES_EJEMPLO[residenteActual];
  const camposBase = agruparCamposPorCategoria(configuracion.campos_base);
  const camposCCAA = agruparCamposPorCategoria(configuracion.campos_ccaa);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Parte Legal - Cumplimiento Normativo
            </h1>
            <p className="text-sm text-gray-600">
              Turno {obtenerTurno()} • {new Date().toLocaleDateString('es-ES')} • {usuario.nombre}
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="text-blue-600 font-bold">
              {residenteActual + 1} de {RESIDENTES_EJEMPLO.length}
            </div>
            <div className="text-gray-500">
              {configuracion.campos_base.length + configuracion.campos_ccaa.length} campos activos
            </div>
          </div>
        </div>

        {/* Configuración activa */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            BOE Estatal ({configuracion.campos_base.length} campos)
          </span>
          {configuracion.ccaa_activas.map(ccaa => (
            <span key={ccaa} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {ccaa}
            </span>
          ))}
        </div>
      </div>

      {/* Navegación residentes */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setResidenteActual(Math.max(0, residenteActual - 1))}
            disabled={residenteActual === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Anterior
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">{residente.nombre}</h2>
            <p className="text-sm text-gray-600">
              Habitación {residente.habitacion} • {residente.edad} años
              {residente.diabetico && <span className="text-orange-600 ml-2">• Diabético</span>}
            </p>
          </div>
          
          <button
            onClick={() => setResidenteActual(Math.min(RESIDENTES_EJEMPLO.length - 1, residenteActual + 1))}
            disabled={residenteActual === RESIDENTES_EJEMPLO.length - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Errores de validación */}
      {erroresValidacion.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-semibold mb-2">Errores de Validación:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {erroresValidacion.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulario - Campos Base Estatales */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          Campos Obligatorios Estatales (BOE)
          <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {configuracion.campos_base.length} campos
          </span>
        </h3>
        
        {Object.entries(camposBase).map(([categoria, campos]) => (
          <div key={categoria} className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3 bg-blue-50 p-2 rounded">
              {categoria}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campos.map(campo => renderizarCampo(campo, residente.id))}
            </div>
          </div>
        ))}
      </div>

      {/* Formulario - Campos CCAA (si hay activas) */}
      {configuracion.campos_ccaa.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            Campos Autonómicos Activos
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {configuracion.campos_ccaa.length} campos
            </span>
          </h3>
          
          {Object.entries(camposCCAA).map(([categoria, campos]) => (
            <div key={categoria} className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3 bg-green-50 p-2 rounded">
                {categoria}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campos.map(campo => renderizarCampo(campo, residente.id))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón finalizar turno */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center">
          <button
            onClick={finalizarTurno}
            disabled={finalizando}
            className={`w-full p-4 rounded-xl text-lg font-bold transition-all duration-200 ${
              finalizando
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-95'
            }`}
          >
            {finalizando ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Validando y generando parte legal...
              </div>
            ) : (
              <>
                FINALIZAR TURNO LEGAL
                <div className="text-sm font-normal mt-1 opacity-90">
                  Validará {configuracion.campos_base.length + configuracion.campos_ccaa.length} campos normativos
                </div>
              </>
            )}
          </button>
          
          <div className="mt-4 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-blue-800">Estatal</div>
                <div className="text-blue-600">{configuracion.campos_base.length} campos BOE</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-green-800">Autonómico</div>
                <div className="text-green-600">{configuracion.campos_ccaa.length} campos CCAA</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-semibold text-purple-800">Total</div>
                <div className="text-purple-600">
                  {configuracion.campos_base.length + configuracion.campos_ccaa.length} campos activos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}