"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

interface PapeleraViewProps {
  usuarioId: string;
  rol: string;
  onRecargar: () => void;
}

export default function PapeleraView({ usuarioId, rol, onRecargar }: PapeleraViewProps) {
  const [elementos, setElementos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPapelera();
  }, []);

  const cargarPapelera = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.rpc('obtener_papelera', {
        p_usuario_id: usuarioId,
        p_rol: rol
      });

      setElementos(data || []);
    } catch (error) {
      console.error('Error cargando papelera:', error);
    } finally {
      setLoading(false);
    }
  };

  const restaurar = async (elemento: any) => {
    if (!confirm(`¿Restaurar este ${elemento.tipo_entidad}?`)) return;

    try {
      const { data } = await supabase.rpc('restaurar_desde_papelera', {
        p_papelera_id: elemento.id,
        p_restaurado_por: usuarioId
      });

      if (data?.success) {
        alert('Elemento restaurado correctamente');
        cargarPapelera();
        onRecargar();
      } else {
        alert('Error al restaurar: ' + (data?.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error restaurando:', error);
      alert('Error al restaurar el elemento');
    }
  };

  const eliminarDefinitivo = async (elemento: any) => {
    if (!confirm(`⚠️ ELIMINAR DEFINITIVAMENTE este ${elemento.tipo_entidad}?\n\nEsta acción NO se puede deshacer.`)) return;

    try {
      const { data } = await supabase.rpc('eliminar_definitivo', {
        p_papelera_id: elemento.id,
        p_usuario_id: usuarioId
      });

      if (data?.success) {
        alert('Elemento eliminado definitivamente');
        cargarPapelera();
      } else {
        alert('Error: ' + (data?.error || 'No tienes permisos'));
      }
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar definitivamente');
    }
  };

  const getTipoIcon = (tipo: string) => {
    const icons: any = {
      parte: '📋',
      director: '👔',
      trabajador: '👤',
      residencia: '🏢',
      residente: '🧓',
      empresa: '🏪'
    };
    return icons[tipo] || '📦';
  };

  const getNombreEntidad = (elemento: any) => {
    const datos = elemento.datos_originales;
    
    switch (elemento.tipo_entidad) {
      case 'parte':
        return `Parte del ${new Date(datos.fecha).toLocaleDateString('es-ES')}`;
      case 'director':
      case 'trabajador':
        return `${datos.nombre} ${datos.apellidos}`;
      case 'residencia':
        return datos.nombre;
      case 'residente':
        return `${datos.nombre} ${datos.apellidos}`;
      case 'empresa':
        return datos.razon_social || datos.nombre;
      default:
        return 'Elemento';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#666' }}>Cargando papelera...</p>
      </div>
    );
  }

  if (elementos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗑️</div>
        <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>Papelera vacía</h3>
        <p style={{ color: '#999' }}>No hay elementos eliminados</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <strong>ℹ️ Información:</strong> Los elementos permanecen en la papelera durante 100 días antes de ser eliminados automáticamente.
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {elementos.map((elemento) => (
          <div
            key={elemento.id}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${elemento.dias_restantes < 10 ? '#dc3545' : '#ffc107'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', color: '#2c3e50', margin: '0 0 10px 0' }}>
                  {getTipoIcon(elemento.tipo_entidad)} {getNombreEntidad(elemento)}
                </h3>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                  <div><strong>Tipo:</strong> {elemento.tipo_entidad}</div>
                  <div><strong>Eliminado por:</strong> {elemento.eliminado_por_rol}</div>
                  <div><strong>Fecha eliminación:</strong> {new Date(elemento.fecha_eliminacion).toLocaleString('es-ES')}</div>
                  <div style={{ color: elemento.dias_restantes < 10 ? '#dc3545' : '#856404', fontWeight: 'bold' }}>
                    <strong>⏰ Días restantes:</strong> {Math.max(0, elemento.dias_restantes)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                {(rol === 'superadmin' || rol === 'director' || (rol === 'trabajador' && elemento.puede_restaurar)) && elemento.puede_restaurar && (
                  <button
                    onClick={() => restaurar(elemento)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ♻️ Restaurar
                  </button>
                )}

                {rol === 'superadmin' && (
                  <button
                    onClick={() => eliminarDefinitivo(elemento)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Eliminar Definitivo
                  </button>
                )}

                {!elemento.puede_restaurar && rol === 'trabajador' && (
                  <div style={{ 
                    padding: '8px 16px', 
                    fontSize: '12px', 
                    backgroundColor: '#f8f9fa', 
                    color: '#666', 
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    Solo el director puede restaurar
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        Total de elementos: <strong>{elementos.length}</strong>
      </div>
    </div>
  );
}
