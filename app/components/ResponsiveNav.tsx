"use client";
import React, { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface ResponsiveNavProps {
  items: NavItem[];
  vistaActual: string;
  onCambiarVista: (vista: string) => void;
}

export default function ResponsiveNav({ items, vistaActual, onCambiarVista }: ResponsiveNavProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const itemActual = items.find(item => item.id === vistaActual);

  return (
    <>
      <div className="hidden md:block bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto flex">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onCambiarVista(item.id)}
              className={`
                px-5 py-4 border-none cursor-pointer transition-all
                ${vistaActual === item.id 
                  ? 'bg-gray-100 border-b-4 border-blue-600' 
                  : 'bg-transparent border-b-4 border-transparent hover:bg-gray-50'
                }
              `}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="w-full px-5 py-4 flex items-center justify-between bg-gray-100"
          >
            <span className="font-semibold text-base">
              {itemActual?.icon} {itemActual?.label}
            </span>
            <span className="text-2xl">{menuAbierto ? '✕' : '☰'}</span>
          </button>

          {menuAbierto && (
            <div className="absolute left-0 right-0 bg-white border-b border-gray-300 shadow-lg z-50">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onCambiarVista(item.id);
                    setMenuAbierto(false);
                  }}
                  className={`
                    w-full px-5 py-4 text-left border-none cursor-pointer
                    ${vistaActual === item.id 
                      ? 'bg-blue-50 border-l-4 border-blue-600 font-semibold' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden { display: none !important; }
          .md\\:hidden { display: block !important; }
        }
        @media (min-width: 769px) {
          .md\\:block { display: block !important; }
          .md\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
