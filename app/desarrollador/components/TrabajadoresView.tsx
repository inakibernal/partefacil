"use client";
import React from "react";

export default function TrabajadoresView({
  personal,
  residencias,
  directores,
  onRecargarDatos,
  onMostrarFicha,
  onIniciarFormulario,
  onEliminar,
}: {
  personal: any[];
  residencias: any[];
  directores: any[];
  onRecargarDatos: () => void;
  onMostrarFicha: (trabajador: any) => void;
  onIniciarFormulario: (tipo: string, elemento?: any) => void;
  onEliminar: (trabajador: any) => void;
}) {
  const agruparPorResidencia = () => {
    const grupos: Record<string, any> = {};
    
    personal.forEach(trabajador => {
      const residenciaId = trabajador.residencia_id || 'sin_asignar';
      if (!grupos[residenciaId]) {
        grupos[residenciaId] = {
          residencia: residencias.find(r => r.id == residenciaId),
          trabajadores: []
        };
      }
      grupos[residenciaId].trabajadores.push(trabajador);
    });

    return grupos;
  };

  const gruposResidencia = agruparPorResidencia();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', margin: '0' }}>Gestión de Trabajadores</h2>
        <button 
          onClick={() => onIniciarFormulario('trabajador')}
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Crear Trabajador
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{personal.length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total trabajadores</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{Object.keys(gruposResidencia).length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Residencias con personal</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
            {personal.filter(p => p.titulacion && (p.titulacion.toLowerCase().includes('enferm') || p.titulacion.toLowerCase().includes('médic'))).length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Personal sanitario</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
            {personal.filter(p => p.estado === 'activo').length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Trabajadores activos</div>
        </div>
      </div>
      
      {personal.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No hay trabajadores registrados</p>
          <p style={{ fontSize: '14px', margin: '0' }}>Comienza creando el primer trabajador del sistema</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(gruposResidencia).map(([residenciaId, grupo]: [string, any]) => (
            <div key={residenciaId} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #dee2e6' }}>
                <h3 style={{ fontSize: '18px', margin: '0', color: '#2c3e50' }}>
                  🏢 {grupo.residencia ? grupo.residencia.nombre : 'Sin residencia asignada'}
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                    ({grupo.trabajadores.length} trabajador{grupo.trabajadores.length !== 1 ? 'es' : ''})
                  </span>
                </h3>
                {grupo.residencia && (
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                    📍 {grupo.residencia.direccion}, {grupo.residencia.poblacion}
                  </p>
                )}
              </div>
              
              <div>
                {grupo.trabajadores.map((trabajador: any, index: number) => {
                  const esUltimo = index === grupo.trabajadores.length - 1;
                  
                  return (
                    <div key={trabajador.id} style={{ padding: '20px', borderBottom: esUltimo ? 'none' : '1px solid #f1f3f4' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#2c3e50' }}>
                            {trabajador.nombre} {trabajador.apellidos}
                            {trabajador.estado !== 'activo' && (
                              <span style={{ 
                                fontSize: '12px', 
                                color: '#dc3545',
                                backgroundColor: '#f8d7da',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                marginLeft: '10px'
                              }}>
                                {trabajador.estado}
                              </span>
                            )}
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
                            <div><strong>DNI:</strong> {trabajador.dni}</div>
                            <div><strong>Email:</strong> {trabajador.email}</div>
                            <div><strong>Teléfono:</strong> {trabajador.telefono}</div>
                            <div><strong>Titulación:</strong> {trabajador.titulacion}</div>
                            <div><strong>Turno:</strong> {trabajador.turno}</div>
                            <div><strong>Salario:</strong> {trabajador.salario ? `€${trabajador.salario}` : 'No especificado'}</div>
                          </div>

                          {trabajador.fecha_inicio && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                              <strong>Fecha de inicio:</strong> {new Date(trabajador.fecha_inicio).toLocaleDateString('es-ES')}
                              {trabajador.fecha_fin && (
                                <span> • <strong>Fecha fin:</strong> {new Date(trabajador.fecha_fin).toLocaleDateString('es-ES')}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                          <button 
                            onClick={() => onMostrarFicha(trabajador)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '13px', 
                              backgroundColor: '#17a2b8', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Ver ficha
                          </button>
                          <button 
                            onClick={() => onIniciarFormulario('trabajador', trabajador)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '13px', 
                              backgroundColor: '#007bff', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => onEliminar(trabajador)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '13px', 
                              backgroundColor: '#dc3545', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
