"use client";
import React from "react";

export default function ResidentesView({
  residentes,
  residencias,
  onRecargarDatos,
  onMostrarFicha,
  onIniciarFormulario,
  onEliminar,
}: {
  residentes: any[];
  residencias: any[];
  onRecargarDatos: () => void;
  onMostrarFicha: (residente: any) => void;
  onIniciarFormulario: (tipo: string, elemento?: any) => void;
  onEliminar: (residente: any) => void;
}) {
  const agruparPorResidencia = () => {
     const grupos: Record<string, any> = {};
    
    residentes.forEach(residente => {
      const residenciaId = residente.residencia_id || 'sin_asignar';
      if (!grupos[residenciaId]) {
        grupos[residenciaId] = {
          residencia: residencias.find(r => r.id == residenciaId),
          residentes: []
        };
      }
      grupos[residenciaId].residentes.push(residente);
    });

    return grupos;
  };

  const calcularEdad = (fechaNacimiento: any) => {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const gruposResidencia = agruparPorResidencia();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', margin: '0' }}>Gestión de Residentes</h2>
        <button 
          onClick={() => onIniciarFormulario('residente')}
          style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Crear Residente
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>{residentes.length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total residentes</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{Object.keys(gruposResidencia).length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Residencias con usuarios</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {residentes.filter(r => r.estado === 'activo').length}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Residentes activos</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
            {residentes.length > 0 ? Math.round(residentes.reduce((sum, r) => sum + calcularEdad(r.fecha_nacimiento), 0) / residentes.length) : 0}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Edad promedio</div>
        </div>
      </div>
      
      {residentes.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No hay residentes registrados</p>
          <p style={{ fontSize: '14px', margin: '0' }}>Comienza registrando el primer residente del sistema</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(gruposResidencia).map(([residenciaId, grupo]: [string, any]) => (
            <div key={residenciaId} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #dee2e6' }}>
                <h3 style={{ fontSize: '18px', margin: '0', color: '#2c3e50' }}>
                  🏠 {grupo.residencia ? grupo.residencia.nombre : 'Sin residencia asignada'}
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                    ({grupo.residentes.length} residente{grupo.residentes.length !== 1 ? 's' : ''})
                  </span>
                </h3>
                {grupo.residencia && (
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                    📍 {grupo.residencia.direccion}, {grupo.residencia.poblacion}
                  </p>
                )}
              </div>
              
              <div>
                {grupo.residentes.map((residente: any, index: number) => {
                  const esUltimo = index === grupo.residentes.length - 1;
                  const edad = calcularEdad(residente.fecha_nacimiento);
                  
                  return (
                    <div key={residente.id} style={{ padding: '20px', borderBottom: esUltimo ? 'none' : '1px solid #f1f3f4' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#2c3e50' }}>
                            {residente.nombre} {residente.apellidos}
                            <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>({edad} años)</span>
                            {residente.estado !== 'activo' && (
                              <span style={{ 
                                fontSize: '12px', 
                                color: '#dc3545',
                                backgroundColor: '#f8d7da',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                marginLeft: '10px'
                              }}>
                                {residente.estado}
                              </span>
                            )}
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
                            <div><strong>DNI:</strong> {residente.dni}</div>
                            <div><strong>Teléfono:</strong> {residente.telefono || 'No disponible'}</div>
                            <div><strong>Grado dependencia:</strong> {residente.grado_dependencia}</div>
                            <div><strong>Fecha ingreso:</strong> {new Date(residente.fecha_ingreso).toLocaleDateString('es-ES')}</div>
                          </div>

                          {residente.contacto_emergencia_nombre && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                              <strong>Contacto emergencia:</strong> {residente.contacto_emergencia_nombre} - {residente.contacto_emergencia_telefono}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                          <button 
                            onClick={() => onMostrarFicha(residente)}
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
                            onClick={() => onIniciarFormulario('residente', residente)}
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
                            onClick={() => onEliminar(residente)}
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
