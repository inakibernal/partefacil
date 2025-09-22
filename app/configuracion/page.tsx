'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfiguracionPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [currentMode, setCurrentMode] = useState('simple');

  useEffect(() => {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
      router.push('/login');
      return;
    }
    
    setUsuario(JSON.parse(usuarioData));
    const mode = localStorage.getItem('app-mode') || 'simple';
    setCurrentMode(mode);
  }, [router]);

  const cambiarModo = (nuevoModo: 'simple' | 'legal') => {
    localStorage.setItem('app-mode', nuevoModo);
    setCurrentMode(nuevoModo);
  };

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configuración de Modos de Trabajo
          </h1>
          <p className="text-gray-600">
            Elige el modo que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Modo Rápido */}
          <div className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
            currentMode === 'simple' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`} onClick={() => cambiarModo('simple')}>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">⚡</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Modo Rápido</h2>
              {currentMode === 'simple' && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Activo
                </span>
              )}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Interface súper rápida (2-3 minutos)</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>6 controles esenciales por residente</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Sistema OK/Incidencia simple</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Optimizado para uso diario</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">
                <strong>Para:</strong> Personal de turno, uso diario, gestión ágil de residentes
              </p>
            </div>

            {(usuario as any)?.tipo === 'personal' && (
              <div className="mt-3 text-xs text-blue-600">
                → Te llevará a: <strong>/turno-personal</strong>
              </div>
            )}
            {(usuario as any)?.tipo === 'director' && (
              <div className="mt-3 text-xs text-blue-600">
                → Te llevará a: <strong>/informes</strong>
              </div>
            )}
          </div>

          {/* Modo Legal */}
          <div className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
            currentMode === 'legal' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-green-300'
          }`} onClick={() => cambiarModo('legal')}>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">📋</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Modo Legal</h2>
              {currentMode === 'legal' && (
                <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Activo
                </span>
              )}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Cumplimiento normativo completo</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Campos BOE + específicos por CCAA</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Preparado para inspecciones</span>
              </div>
              <div className="flex items-center text-green-600">
                <span className="w-5 h-5 mr-2">✓</span>
                <span>Gestión administrativa avanzada</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">
                <strong>Para:</strong> Auditorías, inspecciones oficiales, cumplimiento legal
              </p>
            </div>

            {(usuario as any)?.tipo === 'personal' && (
              <div className="mt-3 text-xs text-green-600">
                → Te llevará a: <strong>/turno-legal</strong>
              </div>
            )}
            {(usuario as any)?.tipo === 'director' && (
              <div className="mt-3 text-xs text-green-600">
                → Te llevará a: <strong>/admin/dashboard</strong>
              </div>
            )}
          </div>
        </div>

        {/* Comparativa */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comparativa de Modos</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-700">Característica</th>
                  <th className="text-center py-3 text-blue-700">⚡ Rápido</th>
                  <th className="text-center py-3 text-green-700">📋 Legal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-gray-600">Tiempo promedio</td>
                  <td className="text-center py-3 text-blue-600 font-medium">2-3 minutos</td>
                  <td className="text-center py-3 text-green-600 font-medium">5-8 minutos</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-gray-600">Campos por residente</td>
                  <td className="text-center py-3 text-blue-600">6 esenciales</td>
                  <td className="text-center py-3 text-green-600">35+ completos</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-gray-600">Cumplimiento normativo</td>
                  <td className="text-center py-3 text-blue-600">Básico</td>
                  <td className="text-center py-3 text-green-600">100% BOE + CCAA</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-gray-600">Uso recomendado</td>
                  <td className="text-center py-3 text-blue-600">Diario</td>
                  <td className="text-center py-3 text-green-600">Inspecciones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">Modo actual: 
                <span className={`ml-2 ${
                  currentMode === 'simple' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {currentMode === 'simple' ? '⚡ Rápido' : '📋 Legal'}
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Puedes cambiar de modo en cualquier momento desde el navbar
              </p>
            </div>
            
            <div className="space-x-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Volver
              </button>
              <button
                onClick={() => {
                  if ((usuario as any)?.tipo === 'personal') {
                    router.push(currentMode === 'simple' ? '/turno-personal' : '/turno-legal');
                  } else {
                    router.push(currentMode === 'simple' ? '/informes' : '/admin/dashboard');
                  }
                }}
                className={`px-4 py-2 text-white rounded-lg ${
                  currentMode === 'simple' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Ir a mi Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}