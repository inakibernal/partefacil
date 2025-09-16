'use client';

import { useState, useEffect } from 'react';
import { CAMPOS_BASE_ESTATAL, CONFIGURACIONES_CCAA, obtenerConfiguracionActiva } from '@/lib/ccaaConfig';

export default function AdminCCAAConfig() {
  const [configuracionActual, setConfiguracionActual] = useState(obtenerConfiguracionActiva());
  const [configuracionesCCAA, setConfiguracionesCCAA] = useState(CONFIGURACIONES_CCAA);
  const [mostrarDetalles, setMostrarDetalles] = useState<{[key: string]: boolean}>({});

  const toggleCCAA = (codigoCCAA: string) => {
    setConfiguracionesCCAA(prev => 
      prev.map(ccaa => 
        ccaa.codigo === codigoCCAA 
          ? { ...ccaa, activa: !ccaa.activa }
          : ccaa
      )
    );
    
    // Actualizar configuración actual
    setConfiguracionActual(obtenerConfiguracionActiva());
    
    // Guardar en localStorage
    localStorage.setItem('ccaa_config', JSON.stringify(configuracionesCCAA));
  };

  const toggleDetalles = (codigoCCAA: string) => {
    setMostrarDetalles(prev => ({
      ...prev,
      [codigoCCAA]: !prev[codigoCCAA]
    }));
  };

  useEffect(() => {
    // Cargar configuración guardada
    const configGuardada = localStorage.getItem('ccaa_config');
    if (configGuardada) {
      setConfiguracionesCCAA(JSON.parse(configGuardada));
    }
  }, []);

  const totalCamposActivos = configuracionActual.campos_base.length + configuracionActual.campos_ccaa.length;
  const ccaaActivas = configuracionesCCAA.filter(ccaa => ccaa.activa);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuración Comunidades Autónomas
          </h1>
          <p className="text-gray-600">
            Activa/desactiva módulos normativos según tus ventas por CCAA
          </p>
          
          {/* Resumen actual */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{CAMPOS_BASE_ESTATAL.length}</div>
              <div className="text-sm text-blue-700">Campos Base Estatal</div>
              <div className="text-xs text-blue-600">Siempre activos</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{ccaaActivas.length}</div>
              <div className="text-sm text-green-700">CCAA Activas</div>
              <div className="text-xs text-green-600">{configuracionActual.campos_ccaa.length} campos adicionales</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalCamposActivos}</div>
              <div className="text-sm text-purple-700">Total Campos Activos</div>
              <div className="text-xs text-purple-600">En el formulario</div>
            </div>
          </div>
        </div>

        {/* CCAA Activas */}
        {ccaaActivas.length > 0 && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              CCAA Actualmente Activas
            </h3>
            <div className="flex flex-wrap gap-2">
              {ccaaActivas.map(ccaa => (
                <span key={ccaa.codigo} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {ccaa.nombre} (+{ccaa.campos_adicionales.length} campos)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lista de todas las CCAA */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Configuración por Comunidad Autónoma
          </h2>
          
          <div className="space-y-4">
            {configuracionesCCAA.map(ccaa => (
              <div key={ccaa.codigo} className={`border rounded-lg p-4 transition-all ${
                ccaa.activa ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
              }`}>
                
                {/* Header CCAA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      ccaa.activa ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ccaa.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {ccaa.campos_adicionales.length} campos adicionales
                        {ccaa.ratios_especiales && ` • Ratios especiales`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Botón ver detalles */}
                    <button
                      onClick={() => toggleDetalles(ccaa.codigo)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {mostrarDetalles[ccaa.codigo] ? 'Ocultar' : 'Ver'} Detalles
                    </button>
                    
                    {/* Toggle activar/desactivar */}
                    <button
                      onClick={() => toggleCCAA(ccaa.codigo)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        ccaa.activa ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ccaa.activa ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Detalles CCAA (colapsables) */}
                {mostrarDetalles[ccaa.codigo] && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Campos Adicionales:</h4>
                    <div className="grid gap-3">
                      {ccaa.campos_adicionales.map(campo => (
                        <div key={campo.id} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">{campo.nombre}</h5>
                              <p className="text-sm text-gray-600 mt-1">{campo.descripcion}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  campo.obligatorio 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {campo.obligatorio ? 'Obligatorio' : 'Opcional'}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {campo.tipo}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                  {campo.categoria}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Ratios especiales */}
                    {ccaa.ratios_especiales && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Requisitos Especiales:</h4>
                        <div className="bg-yellow-50 p-3 rounded">
                          {ccaa.ratios_especiales.personal_adicional && (
                            <p className="text-sm">
                              • Personal adicional: +{ccaa.ratios_especiales.personal_adicional * 100}%
                            </p>
                          )}
                          {ccaa.ratios_especiales.documentacion_extra && (
                            <p className="text-sm">
                              • Documentación extra: {ccaa.ratios_especiales.documentacion_extra.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vista previa formulario */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Vista Previa Formulario
          </h2>
          <p className="text-gray-600 mb-4">
            Así se verá el formulario de parte diario con la configuración actual:
          </p>
          
          {/* Campos base */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              Campos Base Estatal 
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {CAMPOS_BASE_ESTATAL.length} campos
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAMPOS_BASE_ESTATAL.slice(0, 9).map(campo => (
                <div key={campo.id} className="border p-3 rounded bg-blue-50">
                  <div className="font-medium text-sm text-gray-900">{campo.nombre}</div>
                  <div className="text-xs text-gray-600">{campo.categoria}</div>
                  {campo.obligatorio && (
                    <span className="text-xs text-red-600">*Obligatorio</span>
                  )}
                </div>
              ))}
              {CAMPOS_BASE_ESTATAL.length > 9 && (
                <div className="border p-3 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    +{CAMPOS_BASE_ESTATAL.length - 9} campos más...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Campos CCAA */}
          {configuracionActual.campos_ccaa.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                Campos Autonómicos Activos
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {configuracionActual.campos_ccaa.length} campos
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {configuracionActual.campos_ccaa.map(campo => (
                  <div key={campo.id} className="border p-3 rounded bg-green-50">
                    <div className="font-medium text-sm text-gray-900">{campo.nombre}</div>
                    <div className="text-xs text-gray-600">{campo.categoria}</div>
                    {campo.obligatorio && (
                      <span className="text-xs text-red-600">*Obligatorio</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones de Configuración</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => {
                const todasActivas = configuracionesCCAA.map(ccaa => ({ ...ccaa, activa: true }));
                setConfiguracionesCCAA(todasActivas);
                localStorage.setItem('ccaa_config', JSON.stringify(todasActivas));
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Activar Todas las CCAA
            </button>
            
            <button 
              onClick={() => {
                const ningunaActiva = configuracionesCCAA.map(ccaa => ({ ...ccaa, activa: false }));
                setConfiguracionesCCAA(ningunaActiva);
                localStorage.setItem('ccaa_config', JSON.stringify(ningunaActiva));
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Desactivar Todas las CCAA
            </button>
            
            <button 
              onClick={() => {
                const config = {
                  campos_base: configuracionActual.campos_base.length,
                  campos_ccaa: configuracionActual.campos_ccaa.length,
                  ccaa_activas: configuracionActual.ccaa_activas,
                  fecha_exportacion: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'configuracion_ccaa.json';
                a.click();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Exportar Configuración
            </button>
          </div>
        </div>

        {/* Información legal */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Información Legal
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Campos Base Estatal:</strong> Obligatorios según BOE-A-2022-13580 en toda España</p>
            <p>• <strong>Campos Autonómicos:</strong> Específicos de cada CCAA, solo actívelos tras confirmar venta</p>
            <p>• <strong>Validación:</strong> El sistema validará automáticamente según configuración activa</p>
            <p>• <strong>Auditorías:</strong> Los campos activos serán requeridos en inspecciones oficiales</p>
          </div>
        </div>
      </div>
    </div>
  );
}