"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { generarPDFConsolidado, exportarAExcel } from '../utils/exportadores';

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

  useEffect(() => {
    cargarPartes();
  }, []);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>📋 Partes Diarios</h2>
      </div>

      {/* Filtros */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '25px' }}>
        <h3 style={{ fontSize: '18px', color: '#2c3e50', marginBottom: '20px' }}>🔍 Filtros</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
          >
            Aplicar Filtros
          </button>
          <button
            onClick={limpiarFiltros}
            style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
          >
            Limpiar
          </button>
          <button
            onClick={() => generarPDFConsolidado(partes, filtros)}
            disabled={partes.length === 0}
            style={{ 
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', color: '#2c3e50', margin: '0 0 10px 0' }}>
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

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => window.open(`/parte/${parte.id}`, '_blank')}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => alert('Funcionalidad de PDF próximamente')}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    PDF
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
    </div>
  );
}
