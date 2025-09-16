'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModeSelector() {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState('simple');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }

    // Obtener modo actual
    const mode = localStorage.getItem('app-mode') || 'simple';
    setCurrentMode(mode);
  }, []);

  const cambiarModo = (nuevoModo: 'simple' | 'legal') => {
    localStorage.setItem('app-mode', nuevoModo);
    setCurrentMode(nuevoModo);

    // Redirigir según el modo y tipo de usuario
    if (usuario?.tipo === 'personal') {
      if (nuevoModo === 'simple') {
        router.push('/turno-personal');
      } else {
        router.push('/turno-legal');
      }
    } else if (usuario?.tipo === 'director') {
      if (nuevoModo === 'simple') {
        router.push('/informes');
      } else {
        router.push('/admin/dashboard');
      }
    }
  };

  if (!usuario) return null;

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Modo de trabajo:</span>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => cambiarModo('simple')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentMode === 'simple'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚡ Rápido
            </button>
            <button
              onClick={() => cambiarModo('legal')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentMode === 'legal'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Legal
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          {currentMode === 'simple' ? (
            <div className="text-right">
              <div className="font-medium text-blue-600">Modo Rápido</div>
              <div>Uso diario (2-3 min)</div>
            </div>
          ) : (
            <div className="text-right">
              <div className="font-medium text-green-600">Modo Legal</div>
              <div>Cumplimiento normativo completo</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}