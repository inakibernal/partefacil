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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>🏢 Empresas</h2>
        <button
          onClick={() => onIniciarFormulario('empresa')}
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Crear Empresa
        </button>
      </div>

      {empresas.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏢</div>
          <h3 style={{ fontSize: '24px', color: '#666', margin: '0 0 15px 0' }}>No hay empresas registradas</h3>
          <p style={{ fontSize: '16px', color: '#999', marginBottom: '30px' }}>Crea la primera empresa para comenzar</p>
          <button
            onClick={() => onIniciarFormulario('empresa')}
            style={{ padding: '12px 30px', fontSize: '16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            + Crear Primera Empresa
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {empresas.map(empresa => (
            <div key={empresa.id} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '2px solid #e9ecef' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 5px 0' }}>{empresa.nombre}</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>CIF: {empresa.cif}</p>
                </div>
                <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  ACTIVA
                </span>
              </div>

              <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div><strong>📍 Dirección:</strong> {empresa.direccion}, {empresa.ciudad} ({empresa.codigo_postal})</div>
                <div><strong>📞 Teléfono:</strong> {empresa.telefono}</div>
                <div><strong>✉️ Email:</strong> {empresa.email_facturacion}</div>
                {empresa.contacto_nombre && (
                  <div><strong>👤 Contacto:</strong> {empresa.contacto_nombre}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => onMostrarFicha(empresa)}
                  style={{ flex: 1, padding: '10px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Ver
                </button>
                <button 
                  onClick={() => onIniciarFormulario('empresa', empresa)}
                  style={{ flex: 1, padding: '10px', fontSize: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => onEliminar(empresa)}
                  style={{ flex: 1, padding: '10px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
