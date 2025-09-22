"use client";
import React, { useState } from "react";

export default function DirectoresView({
  directores,
  onRecargarDatos,
  onMostrarFicha,
  onIniciarFormulario,
  onEliminar,
}: {
  directores: any[];
  onRecargarDatos: () => void;
  onMostrarFicha: (director: any) => void;
  onIniciarFormulario: (tipo: string, elemento?: any) => void;
  onEliminar: (director: any) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', margin: '0' }}>Gestión de Directores</h2>
        <button 
          onClick={() => onIniciarFormulario('director')}
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Crear Director
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {directores.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No hay directores registrados</p>
          </div>
        ) : (
          directores.map((director, index) => (
            <div key={director.id} style={{ padding: '20px', borderBottom: index < directores.length - 1 ? '1px solid #e9ecef' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{director.nombre} {director.apellidos}</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                    {director.email} • DNI: {director.dni} • {director.experiencia} años experiencia
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => onMostrarFicha(director)}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Ver
                  </button>
                  <button 
                    onClick={() => onIniciarFormulario('director', director)}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onEliminar(director)}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
