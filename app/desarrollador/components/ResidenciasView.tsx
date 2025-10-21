"use client";
import React from "react";

export default function ResidenciasView({
  residencias,
  directores,
  onRecargarDatos,
  onMostrarFicha,
  onIniciarFormulario,
  onEliminar,
}: {
  residencias: any[];
  directores: any[];
  onRecargarDatos: () => void;
  onMostrarFicha: (residencia: any) => void;
  onIniciarFormulario: (tipo: string, elemento?: any) => void;
  onEliminar: (residencia: any) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '24px', margin: '0' }}>Gestión de Residencias</h2>
        <button 
          onClick={() => onIniciarFormulario('residencia')}
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Crear Residencia
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {residencias.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No hay residencias registradas</p>
          </div>
        ) : (
          residencias.map((residencia, index) => {
            const director = directores.find(d => d.id == residencia.director_id);
            const ocupacion = Math.round((residencia.plazas_ocupadas / residencia.total_plazas) * 100);
            
            return (
              <div key={residencia.id} style={{ padding: '20px', borderBottom: index < residencias.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{residencia.nombre}</h3>
                    <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0', wordBreak: 'break-word' }}>
                      {residencia.direccion}, {residencia.poblacion}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', margin: '0 0 5px 0' }}>
                      CIF: {residencia.cif}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                      Director: {director ? `${director.nombre} ${director.apellidos}` : 'Sin asignar'}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                      Ocupación: {residencia.plazas_ocupadas}/{residencia.total_plazas} ({ocupacion}%)
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => onMostrarFicha(residencia)}
                      style={{ flex: '1 1 auto', minWidth: '80px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Ver
                    </button>
                    <button 
                      onClick={() => onIniciarFormulario('residencia', residencia)}
                      style={{ flex: '1 1 auto', minWidth: '80px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => onEliminar(residencia)}
                      style={{ flex: '1 1 auto', minWidth: '80px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
