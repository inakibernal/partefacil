"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ResidenciasView from "../desarrollador/components/ResidenciasView";
import TrabajadoresView from "../desarrollador/components/TrabajadoresView";
import ResidentesView from "../desarrollador/components/ResidentesView";
import FichaModal from "../desarrollador/components/FichaModal";
import PartesView from "./components/PartesView";

export default function PanelDirector() {
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('estadisticas');
  const [directorId, setDirectorId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [partesPorMes, setPartesPorMes] = useState<any[]>([]);
  const [trabajadoresActivos, setTrabajadoresActivos] = useState<any[]>([]);
  
  // Estados para CRUD
  const [residencias, setResidencias] = useState<any[]>([]);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [residentes, setResidentes] = useState<any[]>([]);
  const [directores, setDirectores] = useState<any[]>([]); // Para selectores
  const [fichaVisible, setFichaVisible] = useState<any>(null);

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
    
    if (sesion.rol !== 'director' || !sesion.usuarioId) {
      window.location.href = '/login';
      return;
    }

    setDirectorId(sesion.usuarioId);
    cargarTodosDatos(sesion.usuarioId);
  };

  const cargarTodosDatos = async (id: string) => {
    try {
      // Estadísticas
      const { data: statsData } = await supabase.rpc('obtener_estadisticas_director', {
        p_director_id: id
      });

      const { data: partesMesData } = await supabase.rpc('obtener_partes_por_mes', {
        p_director_id: id
      });

      const { data: trabajadoresActivosData } = await supabase.rpc('obtener_trabajadores_activos', {
        p_director_id: id
      });

      // Datos CRUD
      const { data: residenciasData } = await supabase.rpc('obtener_residencias_director', {
        p_director_id: id
      });

      const { data: trabajadoresData } = await supabase.rpc('obtener_trabajadores_director', {
        p_director_id: id
      });

      const { data: residentesData } = await supabase.rpc('obtener_residentes_director', {
        p_director_id: id
      });

      // Cargar info del propio director para selectores
      const { data: directorData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      setStats(statsData);
      setPartesPorMes(partesMesData || []);
      setTrabajadoresActivos(trabajadoresActivosData || []);
      setResidencias(residenciasData || []);
      setTrabajadores(trabajadoresData || []);
      setResidentes(residentesData || []);
      setDirectores(directorData ? [directorData] : []);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('sesion_activa');
    window.location.href = '/login';
  };

  const mostrarFicha = (elemento: any, tipo: string) => {
    setFichaVisible({ elemento, tipo });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
          <h2 style={{ fontSize: '24px', color: '#666' }}>Cargando panel...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Panel de Director</h1>
            <p style={{ margin: '0', opacity: 0.8 }}>Gestión completa de residencias</p>
          </div>
          <button 
            onClick={cerrarSesion}
            style={{ padding: '12px 20px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
{[
            { id: 'estadisticas', label: 'Estadísticas', icon: '📊' },
            { id: 'partes', label: 'Partes Diarios', icon: '📋' },
            { id: 'residencias', label: 'Mis Residencias', icon: '🏢' },
            { id: 'trabajadores', label: 'Mi Personal', icon: '👥' },
            { id: 'residentes', label: 'Mis Residentes', icon: '🧓' },
            { id: 'papelera', label: 'Papelera', icon: '🗑️' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setVistaActual(item.id)} 
              style={{ 
                padding: '15px 20px', border: 'none',
                backgroundColor: vistaActual === item.id ? '#e9ecef' : 'transparent', cursor: 'pointer',
                borderBottom: vistaActual === item.id ? '3px solid #007bff' : '3px solid transparent'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {vistaActual === 'estadisticas' && (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderLeft: '4px solid #007bff' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>RESIDENCIAS GESTIONADAS</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>{stats?.residencias_gestionadas || 0}</div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderLeft: '4px solid #28a745' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>TRABAJADORES ACTIVOS</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>{stats?.trabajadores_activos || 0}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Este mes</div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderLeft: '4px solid #fd7e14' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>PARTES DEL MES</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fd7e14' }}>{stats?.total_partes || 0}</div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>INCIDENCIAS DEL MES</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>{stats?.total_incidencias || 0}</div>
              </div>
            </div>

            {/* Gráfica */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '20px' }}>📈 Evolución de Partes (Últimos 6 meses)</h2>
              
              {partesPorMes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No hay datos de partes disponibles
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '300px', padding: '20px 0' }}>
                  {partesPorMes.map((mes, index) => {
                    const maxPartes = Math.max(...partesPorMes.map(m => m.total));
                    const altura = (mes.total / maxPartes) * 100;
                    
                    return (
                      <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
                          {mes.total}
                        </div>
                        <div style={{
                          width: '100%',
                          height: `${altura}%`,
                          backgroundColor: '#007bff',
                          borderRadius: '8px 8px 0 0',
                          minHeight: '20px'
                        }}></div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                          {mes.mes_nombre?.split(' ')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trabajadores activos */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '20px' }}>👨‍⚕️ Trabajadores Más Activos del Mes</h2>
              
              {trabajadoresActivos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No hay trabajadores activos este mes
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {trabajadoresActivos.map((trabajador, index) => (
                    <div key={trabajador.trabajador_id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#007bff'}`
                    }}>
                      <div style={{ fontSize: '24px', marginRight: '15px' }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' }}>
                          {trabajador.nombre} {trabajador.apellidos}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {trabajador.total_partes} parte{trabajador.total_partes !== 1 ? 's' : ''} creado{trabajador.total_partes !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                        {trabajador.total_partes}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {vistaActual === 'residencias' && (
          <ResidenciasView
            residencias={residencias}
            directores={directores}
            onRecargarDatos={() => directorId && cargarTodosDatos(directorId)}
            onMostrarFicha={(r) => mostrarFicha(r, 'residencia')}
            onIniciarFormulario={() => alert('Funcionalidad de crear/editar residencias próximamente')}
            onEliminar={() => alert('Funcionalidad de eliminar próximamente')}
          />
        )}

        {vistaActual === 'trabajadores' && (
          <TrabajadoresView
            personal={trabajadores}
            residencias={residencias}
            directores={directores}
            onRecargarDatos={() => directorId && cargarTodosDatos(directorId)}
            onMostrarFicha={(t) => mostrarFicha(t, 'trabajador')}
            onIniciarFormulario={() => alert('Funcionalidad de crear/editar trabajadores próximamente')}
            onEliminar={() => alert('Funcionalidad de eliminar próximamente')}
          />
        )}

        {vistaActual === 'residentes' && (
          <ResidentesView
            residentes={residentes}
            residencias={residencias}
            onRecargarDatos={() => directorId && cargarTodosDatos(directorId)}
            onMostrarFicha={(r) => mostrarFicha(r, 'residente')}
            onIniciarFormulario={() => alert('Funcionalidad de crear/editar residentes próximamente')}
            onEliminar={() => alert('Funcionalidad de eliminar próximamente')}
          />
        )}
	{vistaActual === 'partes' && (
          <PartesView
            directorId={directorId!}
            residencias={residencias}
            trabajadores={trabajadores}
          />
        )}

        {vistaActual === 'papelera' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '20px' }}>🗑️ Papelera</h2>
            <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗑️</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Papelera vacía</h3>
              <p>Los elementos eliminados aparecerán aquí</p>
            </div>
          </div>
        )}
      </div>
{fichaVisible && (
        <FichaModal
          elemento={fichaVisible.elemento}
          tipo={fichaVisible.tipo}
          onCerrar={() => setFichaVisible(null)}
          residenciasDelDirector={
            fichaVisible.tipo === 'director' 
              ? residencias.filter(r => r.director_id === fichaVisible.elemento.id)
              : undefined
          }
        />
      )}
    </div>
  );
}
