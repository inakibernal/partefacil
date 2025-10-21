"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { generarPDFConsolidado, exportarAExcel } from '../utils/exportadores';
import { PDFGenerator } from '../../../app/utils/pdfGenerator';

interface PartesViewProps {
  directorId: string;
  residencias: any[];
  trabajadores: any[];
}

export default function PartesView({ directorId, residencias, trabajadores }: PartesViewProps) {
  const [partes, setPartes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    residencia_id: '',
    trabajador_id: '',
    solo_incidencias: false
  });
  const [parteSeleccionado, setParteSeleccionado] = useState<any | null>(null);

  useEffect(() => {
    cargarPartes();
  }, [filtros]);

  const cargarPartes = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.rpc('obtener_partes_director', {
        p_director_id: directorId,
        p_fecha_desde: filtros.fecha_desde || null,
        p_fecha_hasta: filtros.fecha_hasta || null,
        p_residencia_id: filtros.residencia_id || null,
        p_trabajador_id: filtros.trabajador_id || null,
        p_solo_incidencias: filtros.solo_incidencias
      });

      setPartes(data || []);
    } catch (error) {
      console.error('Error cargando partes:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    cargarPartes();
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_desde: '',
      fecha_hasta: '',
      residencia_id: '',
      trabajador_id: '',
      solo_incidencias: false
    });
    setTimeout(() => cargarPartes(), 100);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>📋 Partes Diarios</h2>
      </div>

      {/* Filtros */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', color: '#2c3e50', marginBottom: '20px' }}>🔍 Filtros</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Desde:</label>
            <input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Hasta:</label>
            <input
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Residencia:</label>
            <select
              value={filtros.residencia_id}
              onChange={(e) => setFiltros({...filtros, residencia_id: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="">Todas las residencias</option>
              {residencias.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Trabajador:</label>
            <select
              value={filtros.trabajador_id}
              onChange={(e) => setFiltros({...filtros, trabajador_id: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="">Todos los trabajadores</option>
              {trabajadores.map(t => (
                <option key={t.id} value={t.id}>{t.nombre} {t.apellidos}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filtros.solo_incidencias}
              onChange={(e) => setFiltros({...filtros, solo_incidencias: e.target.checked})}
              style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px' }}>Solo partes con incidencias</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={aplicarFiltros}
            style={{ flex: '1 1 auto', minWidth: '120px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
          >
            Aplicar Filtros
          </button>
          <button
            onClick={limpiarFiltros}
            style={{ flex: '1 1 auto', minWidth: '120px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
          >
            Limpiar
          </button>
          <button
            onClick={() => generarPDFConsolidado(partes, filtros)}
            disabled={partes.length === 0}
            style={{ 
              flex: '1 1 auto',
              minWidth: '120px',
              padding: '10px 20px', 
              backgroundColor: partes.length > 0 ? '#dc3545' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: partes.length > 0 ? 'pointer' : 'not-allowed', 
              fontSize: '14px' 
            }}
          >
            📄 Generar PDF
          </button>
          <button
            onClick={() => exportarAExcel(partes, filtros)}
            disabled={partes.length === 0}
            style={{ 
              flex: '1 1 auto',
              minWidth: '120px',
              padding: '10px 20px', 
              backgroundColor: partes.length > 0 ? '#28a745' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: partes.length > 0 ? 'pointer' : 'not-allowed', 
              fontSize: '14px' 
            }}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      {/* Listado de partes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '10px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#666' }}>Cargando partes...</p>
        </div>
      ) : partes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
          <h3 style={{ fontSize: '20px', color: '#666', marginBottom: '10px' }}>No hay partes</h3>
          <p style={{ color: '#999' }}>No se encontraron partes con los filtros aplicados</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {partes.map(parte => (
            <div key={parte.id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${parte.residentes_con_incidencias > 0 ? '#dc3545' : '#28a745'}`
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#2c3e50', margin: '0 0 10px 0', wordBreak: 'break-word' }}>
                    Parte del {new Date(parte.fecha).toLocaleDateString('es-ES')} - {parte.hora || 'Sin hora'}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                    <div><strong>🏢 Residencia:</strong> {parte.residencia_nombre}</div>
                    <div><strong>👤 Trabajador:</strong> {parte.trabajador_nombre}</div>
                    <div><strong>👥 Total residentes:</strong> {parte.total_residentes}</div>
                    <div style={{ color: parte.residentes_con_incidencias > 0 ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
                      <strong>⚠️ Con incidencias:</strong> {parte.residentes_con_incidencias}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setParteSeleccionado(parte)}
                    style={{ flex: '1 1 auto', minWidth: '100px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const { data } = await supabase.rpc('obtener_parte_completo', {
                          p_parte_id: parte.id
                        });
                        
                        if (data) {
                          const parteParaPDF = {
                            ...parte,
                            residentes_detalle: (data.residentes || []).map((r: any) => ({
                              nombre: r.residente_nombre?.split(' ')[0] || '',
                              apellidos: r.residente_nombre?.split(' ').slice(1).join(' ') || '',
                              dni: r.residente_dni,
                              edad: 0,
                              datos_parte: {
                                alimentacion_desayuno: r.comida_desayuno,
                                alimentacion_comida: r.comida_almuerzo,
                                alimentacion_cena: r.comida_cena,
                                higiene_personal: r.higiene_observaciones,
                                medicacion_administrada: r.medicacion_administrada ? 'completa' : 'no',
                                medicacion_observaciones: r.medicacion_observaciones,
                                estado_animico: r.estado_animo,
                                actividades: r.actividades_realizadas,
                                incidencias: r.descripcion_incidencia,
                                observaciones_generales: r.observaciones_generales,
                                movilidad: r.movilidad,
                                sueno: r.sueno,
                                hidratacion: r.hidratacion,
                                estado_piel: r.estado_piel,
                                control_esfinteres: r.control_esfinteres,
                                cambios_posturales: r.cambios_posturales,
                                temperatura: r.temperatura,
                                tension_arterial: r.tension_arterial,
                                glucemia: r.glucemia,
                                visita_medico: r.visita_medico,
                                visitas_familiares: r.visitas_familiares,
                                estado_conciencia: r.estado_general
                              }
                            }))
                          };
                          
                          PDFGenerator.generarParteDiario(parteParaPDF);
                        }
                      } catch (error) {
                        console.error('Error generando PDF:', error);
                        alert('Error al generar el PDF');
                      }
                    }}
                    style={{ flex: '1 1 auto', minWidth: '100px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    PDF
                  </button>
                  <button
                    onClick={async (e) => {
                      e.currentTarget.disabled = true;
                      e.currentTarget.textContent = '⏳ Eliminando...';
                      
                      if (!confirm('¿Eliminar este parte? Se moverá a la papelera por 100 días.')) {
                        e.currentTarget.disabled = false;
                        e.currentTarget.textContent = '🗑️ Eliminar';
                        return;
                      }
                      
                      try {
                        const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
                        const { data } = await supabase.rpc('mover_a_papelera', {
                          p_tipo_entidad: 'parte',
                          p_entidad_id: parte.id,
                          p_eliminado_por: sesion.usuarioId,
                          p_eliminado_por_rol: 'director'
                        });
                        
                        if (data?.success) {
                          alert('Parte movido a papelera');
                          cargarPartes();
                        } else {
                          alert('Error al eliminar parte');
                          e.currentTarget.disabled = false;
                          e.currentTarget.textContent = '🗑️ Eliminar';
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        alert('Error al eliminar');
                        e.currentTarget.disabled = false;
                        e.currentTarget.textContent = '🗑️ Eliminar';
                      }
                    }}
                    style={{ flex: '1 1 auto', minWidth: '100px', padding: '10px 16px', fontSize: '14px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        Total de partes: <strong>{partes.length}</strong>
      </div>

      {/* Modal Ver Detalles */}
      {parteSeleccionado && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0, wordBreak: 'break-word' }}>Parte del {new Date(parteSeleccionado.fecha).toLocaleDateString('es-ES')}</h2>
              <button
                onClick={() => setParteSeleccionado(null)}
                style={{
                  padding: '8px 16px',
                  fontSize: '18px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ wordBreak: 'break-word' }}><strong>Residencia:</strong> {parteSeleccionado.residencia_nombre}</p>
              <p style={{ wordBreak: 'break-word' }}><strong>Trabajador:</strong> {parteSeleccionado.trabajador_nombre}</p>
              <p><strong>Fecha y hora:</strong> {new Date(parteSeleccionado.fecha).toLocaleDateString('es-ES')} a las {parteSeleccionado.hora || 'Sin hora'}</p>
              <p><strong>Total residentes:</strong> {parteSeleccionado.total_residentes}</p>
              <p><strong>Con incidencias:</strong> {parteSeleccionado.residentes_con_incidencias}</p>
            </div>

            <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
              Detalles completos disponibles en el PDF consolidado
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
