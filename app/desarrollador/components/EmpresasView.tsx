"use client";
import React from "react";

interface EmpresasViewProps {
  empresas: any[];
  onRecargarDatos: () => void;
  onMostrarFicha: (empresa: any) => void;
  onIniciarFormulario: (tipo: string, empresa?: any) => void;
  onEliminar: (empresa: any) => void;
}

export default function EmpresasView({
  empresas,
  onRecargarDatos,
  onMostrarFicha,
  onIniciarFormulario,
  onEliminar
}: EmpresasViewProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '24px', margin: '0' }}>Gestión de Empresas</h2>
        <button 
          onClick={() => onIniciarFormulario('empresa')}
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Crear Empresa
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {empresas.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No hay empresas registradas</p>
          </div>
        ) : (
          empresas.map((empresa, index) => (
            <div key={empresa.id} style={{ padding: '20px', borderBottom: index < empresas.length - 1 ? '1px solid #e9ecef' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{empresa.nombre}</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: '0', wordBreak: 'break-word' }}>
                    {empresa.email_facturacion}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                    CIF: {empresa.cif} • {empresa.ciudad}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => onMostrarFicha(empresa)}
                    style={{ flex: '1 1 auto', minWidth: '80px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Ver
                  </button>
                  <button 
                    onClick={() => onIniciarFormulario('empresa', empresa)}
                    style={{ flex: '1 1 auto', minWidth: '80px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onEliminar(empresa)}
                    style={{ flex: '1 1 auto', minWidth: '80px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
