'use client';

import { useState, useEffect } from 'react';
import { CONFIGURACIONES_CCAA, CAMPOS_BASE_ESTATAL } from '@/lib/ccaaConfig';

export default function DashboardComercial() {
  const [configuracionesCCAA, setConfiguracionesCCAA] = useState(CONFIGURACIONES_CCAA);
  const [ventasSimuladas, setVentasSimuladas] = useState([
    { ccaa: 'AN', cliente: 'Residencia San José (Sevilla)', fecha: '2024-01-15', precio: 49, estado: 'activo' },
    { ccaa: 'MD', cliente: 'Residencia Los Olivos (Madrid)', fecha: '2024-02-20', precio: 49, estado: 'activo' },
    { ccaa: 'CT', cliente: 'Residència Barcelona Centre', fecha: '2024-03-10', precio: 49, estado: 'pendiente' }
  ]);

  useEffect(() => {
    // Cargar configuración guardada
    const configGuardada = localStorage.getItem('ccaa_config');
    if (configGuardada) {
      setConfiguracionesCCAA(JSON.parse(configGuardada));
    }
  }, []);

  const ccaaActivas = configuracionesCCAA.filter(ccaa => ccaa.activa);
  const ccaaInactivas = configuracionesCCAA.filter(ccaa => !ccaa.activa);
  
  const ventasActivas = ventasSimuladas.filter(venta => venta.estado === 'activo');
  const ingresosMensuales = ventasActivas.length * 49;

  const simularVenta = (codigoCCAA: string) => {
    const ccaa = CONFIGURACIONES_CCAA.find(c => c.codigo === codigoCCAA);
    if (!ccaa) return;

    const nuevaVenta = {
      ccaa: codigoCCAA,
      cliente: `Residencia Demo (${ccaa.nombre})`,
      fecha: new Date().toISOString().split('T')[0],
      precio: 49,
      estado: 'activo'
    };

    setVentasSimuladas(prev => [...prev, nuevaVenta]);

    // Activar automáticamente la CCAA
    const nuevasConfiguraciones = configuracionesCCAA.map(c => 
      c.codigo === codigoCCAA ? { ...c, activa: true } : c
    );
    setConfiguracionesCCAA(nuevasConfiguraciones);
    localStorage.setItem('ccaa_config', JSON.stringify(nuevasConfiguraciones));

    alert(`Venta simulada para ${ccaa.nombre}!\nCCAA activada automáticamente\n+49€/mes de ingresos`);
  };

  const obtenerIconoCCAA = (codigo: string) => {
    const iconos: Record<string,string> = {
      'AN': '🌅', 'CT': '🏛️', 'PV': '🏔️', 'MD': '🏛️', 'CL': '🏰',
      'VC': '🍊', 'GA': '🌊', 'AS': '⛰️', 'CB': '🏔️', 'MU': '🌶️',
      'EX': '🌳', 'AR': '🏺', 'RI': '🍷', 'NA': '🏔️', 'IB': '🏝️',
      'CN': '🌴', 'CE': '🏛️', 'ML': '🏛️'
    };
    return iconos[codigo] || '🏛️';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Comercial - Parte Fácil
          </h1>
          <p className="text-gray-600">
            Estado de ventas y configuración por Comunidades Autónomas
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-green-600">{ingresosMensuales}€</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">🏛️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CCAA Activas</p>
                <p className="text-2xl font-bold text-blue-600">{ccaaActivas.length}/17</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">🏥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold text-purple-600">{ventasActivas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Campos Activos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {CAMPOS_BASE_ESTATAL.length + ccaaActivas.reduce((sum, ccaa) => sum + ccaa.campos_adicionales.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa comercial CCAA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* CCAA Activas (Con ventas) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              CCAA con Ventas Activas
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {ccaaActivas.length} activas
              </span>
            </h2>
            
            {ccaaActivas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl">🎯</span>
                <p className="mt-2">No hay CCAA activas aún</p>
                <p className="text-sm">Simula una venta para activar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ccaaActivas.map(ccaa => {
                  const ventaCCAA = ventasSimuladas.find(v => v.ccaa === ccaa.codigo);
                  return (
                    <div key={ccaa.codigo} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{obtenerIconoCCAA(ccaa.codigo)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{ccaa.nombre}</h3>
                            <p className="text-sm text-gray-600">
                              +{ccaa.campos_adicionales.length} campos • 49€/mes
                            </p>
                            {ventaCCAA && (
                              <p className="text-xs text-green-600">
                                Cliente: {ventaCCAA.cliente}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-bold">ACTIVA</div>
                          <div className="text-xs text-gray-500">
                            {ventaCCAA?.fecha || 'Sin fecha'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CCAA Disponibles (Sin ventas) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              Oportunidades Comerciales
              <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                {ccaaInactivas.length} disponibles
              </span>
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ccaaInactivas.map(ccaa => (
                <div key={ccaa.codigo} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl opacity-50">{obtenerIconoCCAA(ccaa.codigo)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ccaa.nombre}</h3>
                        <p className="text-sm text-gray-600">
                          +{ccaa.campos_adicionales.length} campos adicionales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => simularVenta(ccaa.codigo)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Simular Venta
                      </button>
                      <div className="text-xs text-gray-500 mt-1">
                        +49€/mes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historial de ventas */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Ventas</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CCAA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio/Mes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventasSimuladas.map((venta, index) => {
                  const ccaa = CONFIGURACIONES_CCAA.find(c => c.codigo === venta.ccaa);
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{obtenerIconoCCAA(venta.ccaa)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {ccaa?.nombre || venta.ccaa}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{venta.cliente}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{venta.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{venta.precio}€</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          venta.estado === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          Base: {CAMPOS_BASE_ESTATAL.length} + CCAA: {ccaa?.campos_adicionales.length || 0}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proyección de ingresos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proyección de Ingresos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{ingresosMensuales}€</div>
              <div className="text-sm text-gray-600">Ingresos Mensuales Actuales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{ingresosMensuales * 12}€</div>
              <div className="text-sm text-gray-600">Proyección Anual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{17 * 49}€</div>
              <div className="text-sm text-gray-600">Potencial Máximo/Mes</div>
              <div className="text-xs text-gray-500">(Todas las CCAA)</div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Próximos Objetivos</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Activar {Math.min(3, ccaaInactivas.length)} CCAA más = +{Math.min(3, ccaaInactivas.length) * 49}€/mes</li>
              <li>• Completar todas las CCAA = +{ccaaInactivas.length * 49}€/mes adicionales</li>
              <li>• Potencial mercado: 17 CCAA × múltiples residencias por CCAA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}