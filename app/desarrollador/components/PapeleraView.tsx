"use client";
import React, { useState } from "react";

export default function PapeleraView({
  papelera,
  onRestaurar,
  onRecargarDatos,
}: {
  papelera: any[];
  onRestaurar: (elementoId: string) => void;
  onRecargarDatos: () => void;
}) {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(null);

  // Filtrar elementos válidos (que tengan estructura correcta)
  const elementosValidos = papelera.filter(item => 
    item && 
    item.data && 
    typeof item.data === 'object' && 
    item.data.nombre && 
    item.tipo && 
    item.fecha_eliminacion
  );

  // Estadísticas de la papelera
  const estadisticas = {
    total: elementosValidos.length,
    directores: elementosValidos.filter(item => item.tipo === 'director').length,
    residencias: elementosValidos.filter(item => item.tipo === 'residencia').length,
    trabajadores: elementosValidos.filter(item => item.tipo === 'trabajador').length,
    residentes: elementosValidos.filter(item => item.tipo === 'residente').length,
    ultimos7dias: elementosValidos.filter(item => {
      try {
        const fechaEliminacion = new Date(item.fecha_eliminacion);
        const hace7dias = new Date();
        hace7dias.setDate(hace7dias.getDate() - 7);
        return fechaEliminacion >= hace7dias;
      } catch {
        return false;
      }
    }).length
  };

  // Filtrar elementos de la papelera
  const elementosFiltrados = elementosValidos.filter(item => {
    try {
      // Filtro por tipo
      if (filtroTipo !== 'todos' && item.tipo !== filtroTipo) return false;
      
      // Filtro por fecha
      if (filtroFecha !== 'todos') {
        const fechaEliminacion = new Date(item.fecha_eliminacion);
        const ahora = new Date();
        
        switch (filtroFecha) {
          case 'hoy':
            if (fechaEliminacion.toDateString() !== ahora.toDateString()) return false;
            break;
          case 'semana':
            const hace7dias = new Date();
            hace7dias.setDate(hace7dias.getDate() - 7);
            if (fechaEliminacion < hace7dias) return false;
            break;
          case 'mes':
            const hace30dias = new Date();
            hace30dias.setDate(hace30dias.getDate() - 30);
            if (fechaEliminacion < hace30dias) return false;
            break;
        }
      }
      
      // Filtro por búsqueda
      if (busqueda) {
        const nombreCompleto = `${item.data.nombre || ''} ${item.data.apellidos || ''}`.toLowerCase();
        const dni = (item.data.dni || '').toLowerCase();
        const motivo = (item.motivo || '').toLowerCase();
        const busquedaLower = busqueda.toLowerCase();
        
        if (!nombreCompleto.includes(busquedaLower) && 
            !dni.includes(busquedaLower) && 
            !motivo.includes(busquedaLower)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.warn('Error filtrando elemento de papelera:', error, item);
      return false;
    }
  });

  const eliminarPermanentemente = (elementoId: any) => {
    if (typeof window !== 'undefined') {
      const papeleraActual = JSON.parse(localStorage.getItem('papelera_sistema') || '[]');
      const papeleraActualizada = papeleraActual.filter((item: any) => item.id !== elementoId);
      localStorage.setItem('papelera_sistema', JSON.stringify(papeleraActualizada));
      onRecargarDatos();
      setMostrarConfirmacion(null);
      alert('Elemento eliminado permanentemente');
    }
  };

  const vaciarPapelera = () => {
    if (!confirm('⚠️ ATENCIÓN: Esta acción eliminará PERMANENTEMENTE todos los elementos de la papelera. ¿Estás completamente seguro?')) return;
    
    const confirmacion = prompt('Para confirmar, escribe "ELIMINAR TODO" (en mayúsculas):');
    if (confirmacion !== 'ELIMINAR TODO') {
      alert('Acción cancelada. No se escribió la confirmación correcta.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('papelera_sistema', JSON.stringify([]));
      onRecargarDatos();
      alert('Papelera vaciada completamente');
    }
  };

  const restaurarTodos = () => {
    if (!confirm(`¿Restaurar todos los ${elementosFiltrados.length} elementos filtrados?`)) return;
    
    let restaurados = 0;
    elementosFiltrados.forEach(item => {
      try {
        onRestaurar(item.id);
        restaurados++;
      } catch (error) {
        console.warn('Error restaurando elemento:', error, item);
      }
    });
    
    alert(`${restaurados} elementos restaurados correctamente`);
  };

  const exportarDatos = () => {
    try {
      const datosExport = elementosFiltrados.map(item => ({
        tipo: item.tipo || 'N/A',
        nombre: `${item.data?.nombre || 'Sin nombre'} ${item.data?.apellidos || ''}`.trim(),
        dni: item.data?.dni || 'N/A',
        fecha_eliminacion: item.fecha_eliminacion ? new Date(item.fecha_eliminacion).toLocaleString('es-ES') : 'N/A',
        motivo: item.motivo || 'N/A',
        eliminado_por: item.eliminado_por || 'N/A'
      }));

      const csvContent = [
        ['Tipo', 'Nombre', 'DNI', 'Fecha Eliminación', 'Motivo', 'Eliminado por'],
        ...datosExport.map(item => [
          item.tipo,
          item.nombre,
          item.dni,
          item.fecha_eliminacion,
          item.motivo,
          item.eliminado_por
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `papelera_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exportando datos:', error);
      alert('Error al exportar los datos');
    }
  };

  const obtenerIcono = (tipo: any) => {
    const iconos: Record<string,string> = {
      director: '👨‍💼',
      residencia: '🏢',
      trabajador: '👥',
      residente: '🧓'
    };
    return iconos[tipo] || '📄';
  };

  const obtenerColor = (tipo: any) => {
    const colores: Record<string,string> = {
      director: '#2c3e50',
      residencia: '#007bff',
      trabajador: '#28a745',
      residente: '#6f42c1'
    };
    return colores[tipo] || '#6c757d';
  };

  const formatearNombre = (data: any) => {
    if (!data) return 'Sin datos';
    const nombre = data.nombre || 'Sin nombre';
    const apellidos = data.apellidos || '';
    return `${nombre} ${apellidos}`.trim();
  };

  const formatearFecha = (fecha: any) => {
    try {
      return new Date(fecha).toLocaleString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div>
      {/* Header con acciones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', margin: '0' }}>Papelera del Sistema</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {elementosFiltrados.length > 0 && (
            <>
              <button 
                onClick={restaurarTodos}
                style={{ padding: '10px 16px', fontSize: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ↩️ Restaurar filtrados
              </button>
              <button 
                onClick={exportarDatos}
                style={{ padding: '10px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                📊 Exportar CSV
              </button>
            </>
          )}
          {elementosValidos.length > 0 && (
            <button 
              onClick={vaciarPapelera}
              style={{ padding: '10px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              🗑️ Vaciar papelera
            </button>
          )}
        </div>
      </div>

      {/* Mostrar advertencia si hay elementos inválidos */}
      {papelera.length > elementosValidos.length && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          color: '#856404'
        }}>
          ⚠️ Se encontraron {papelera.length - elementosValidos.length} elementos con datos corruptos que se omitieron de la vista.
        </div>
      )}

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{estadisticas.total}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total elementos</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{estadisticas.directores}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>👨‍💼 Directores</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{estadisticas.residencias}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>🏢 Residencias</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{estadisticas.trabajadores}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>👥 Trabajadores</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>{estadisticas.residentes}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>🧓 Residentes</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>{estadisticas.ultimos7dias}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>📅 Últimos 7 días</div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      {elementosValidos.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>🔍 Buscar:</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, DNI o motivo..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>📂 Tipo:</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="todos">Todos los tipos</option>
                <option value="director">👨‍💼 Directores</option>
                <option value="residencia">🏢 Residencias</option>
                <option value="trabajador">👥 Trabajadores</option>
                <option value="residente">🧓 Residentes</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>📅 Fecha:</label>
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              >
                <option value="todos">Todas las fechas</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
              </select>
            </div>
            
            <div>
              <button
                onClick={() => {
                  setFiltroTipo('todos');
                  setFiltroFecha('todos');
                  setBusqueda('');
                }}
                style={{ 
                  width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', 
                  border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                }}
              >
                🔄 Limpiar filtros
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            Mostrando {elementosFiltrados.length} de {elementosValidos.length} elementos
          </div>
        </div>
      )}

      {/* Lista de elementos */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {elementosFiltrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            {elementosValidos.length === 0 ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗑️</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>La papelera está vacía</h3>
                <p style={{ fontSize: '14px', margin: '0' }}>Los elementos eliminados aparecerán aquí</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No se encontraron resultados</h3>
                <p style={{ fontSize: '14px', margin: '0' }}>Prueba a cambiar los filtros de búsqueda</p>
              </>
            )}
          </div>
        ) : (
          elementosFiltrados.map((item, index) => (
            <div key={item.id || index} style={{ 
              padding: '20px', 
              borderBottom: index < elementosFiltrados.length - 1 ? '1px solid #e9ecef' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>{obtenerIcono(item.tipo)}</span>
                    <h3 style={{ 
                      fontSize: '18px', 
                      margin: '0 10px 0 0', 
                      color: obtenerColor(item.tipo),
                      textTransform: 'capitalize'
                    }}>
                      {item.tipo}: {formatearNombre(item.data)}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      backgroundColor: obtenerColor(item.tipo),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {item.tipo}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    <strong>DNI:</strong> {item.data?.dni || 'N/A'} • 
                    <strong> Eliminado:</strong> {formatearFecha(item.fecha_eliminacion)} •
                    <strong> Por:</strong> {item.eliminado_por || 'Sistema'}
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <strong>Motivo:</strong> {item.motivo || 'Sin motivo especificado'}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                  <button 
                    onClick={() => onRestaurar(item.id)}
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '14px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ↩️ Restaurar
                  </button>
                  <button 
                    onClick={() => setMostrarConfirmacion(item)}
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '14px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🗑️ Eliminar definitivo
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de confirmación de eliminación permanente */}
      {mostrarConfirmacion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
              <h2 style={{ fontSize: '20px', color: '#dc3545', margin: '0 0 10px 0' }}>
                Eliminación Permanente
              </h2>
              <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>
                ¿Estás seguro de que quieres eliminar permanentemente a:
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                {obtenerIcono((mostrarConfirmacion as any)?.tipo)} {formatearNombre((mostrarConfirmacion as any)?.data)}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                {(mostrarConfirmacion as any)?.tipo} • DNI: {(mostrarConfirmacion as any)?.data?.dni || 'N/A'}
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '14px', color: '#856404', margin: '0', textAlign: 'center' }}>
                <strong>⚠️ Esta acción no se puede deshacer.</strong><br />
                El elemento se eliminará permanentemente del sistema.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => setMostrarConfirmacion(null)}
                style={{ 
                  padding: '12px 30px', 
                  fontSize: '16px', 
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => eliminarPermanentemente(mostrarConfirmacion.id)}
                style={{ 
                  padding: '12px 30px', 
                  fontSize: '16px', 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
