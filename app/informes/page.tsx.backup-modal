"use client"
import React, { useState, useEffect } from 'react';
import { SistemaPapelera } from '../utils/sistema.js';
import PersonalView from "./components/PersonalView";
import ResidenciasView from "./components/ResidenciasView";
import ResidentesView from "./components/ResidentesView";
import PartesView from "./components/PartesView";
import ExcelView from "./components/ExcelView";
import PapeleraView from "./components/PapeleraView";

const DashboardDirector = () => {
  // Estados principales
  const [vistaActual, setVistaActual] = useState('partes');
  const [datos, setDatos] = useState({
    partes: [], residentes: [], personal: [], residencias: [], papelera: []
  });
  const [sesion, setSesion] = useState({ activa: null, director: null });
  
  // Estados del buscador
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState({ sugerencias: [], principales: [], mostrar: false, indice: -1 });
  const [fichaVisible, setFichaVisible] = useState(null);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = () => {
    const sesionData = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
    if (sesionData.rol !== 'director' || !sesionData.directorId) {
      window.location.href = '/login';
      return;
    }
    
    const directores = JSON.parse(localStorage.getItem('directores_sistema') || '[]');
    const director = directores.find(d => d.id === sesionData.directorId);
    setSesion({ activa: sesionData, director });
    cargarDatos(sesionData.directorId);
  };

  const cargarDatos = (directorId) => {
    const todasResidencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
    const residenciasDir = todasResidencias.filter(r => Number(r.director_id) === Number(directorId));
    const idsResidencias = residenciasDir.map(r => Number(r.id));
    
    setDatos({
      partes: JSON.parse(localStorage.getItem('partes_completos') || '[]'),
      residencias: residenciasDir,
      personal: JSON.parse(localStorage.getItem('personal_data') || '[]')
        .filter((p, i, arr) => idsResidencias.includes(Number(p.residencia_id)) && 
                 arr.findIndex(item => item.id === p.id) === i),
      residentes: JSON.parse(localStorage.getItem('residentes_data') || '[]')
        .filter(r => idsResidencias.includes(Number(r.residencia_id))),
      papelera: SistemaPapelera.obtenerPapelera()
    });
  };

  // Configuración de búsqueda
  const tiposBusqueda = {
    parte: { color: '#fd7e14', icon: '📋', campos: ['residente_nombre', 'observaciones', 'trabajador_nombre'] },
    residencia: { color: '#007bff', icon: '🏢', campos: ['nombre', 'cif', 'poblacion', 'direccion'] },
    trabajador: { color: '#28a745', icon: '👨‍⚕️', campos: ['nombre', 'apellidos', 'dni', 'email', 'titulacion', 'turno'] },
    residente: { color: '#6f42c1', icon: '👥', campos: ['nombre', 'apellidos', 'dni', 'grado_dependencia'] }
  };

  const buscarGlobal = (termino) => {
    if (!termino.trim()) return [];
    const terminoLower = termino.toLowerCase();
    const resultados = [];

    Object.entries(datos).forEach(([key, items]) => {
      if (key === 'papelera') return;
      const tipo = key === 'partes' ? 'parte' : key.slice(0, -1); // partes -> parte, residencias -> residencia
      const config = tiposBusqueda[tipo];
      if (!config) return;

      items.forEach(item => {
        const coincidencias = config.campos.filter(campo => {
          const valor = campo.includes('_') ? item[campo] : 
                       campo === 'nombre' || campo === 'apellidos' ? 
                       `${item.nombre || ''} ${item.apellidos || ''}` : item[campo];
          return valor?.toString().toLowerCase().includes(terminoLower);
        });

        if (coincidencias.length > 0) {
          const residencia = datos.residencias.find(r => r.id == item.residencia_id);
          resultados.push({
            id: item.id, tipo, elemento: item, coincidencias,
            nombre: item.residente_nombre || item.nombre || `${item.nombre} ${item.apellidos || ''}`,
            subtitulo: tipo === 'parte' ? 
              `Parte diario • ${new Date(item.fecha).toLocaleDateString('es-ES')} • ${item.trabajador_nombre}` :
              `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} • ${residencia?.nombre || item.poblacion || 'Sin residencia'}`,
            icono: config.icon,
            color: config.color
          });
        }
      });
    });

    return resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  };

  const manejarBusqueda = {
    cambio: (valor) => {
      setBusqueda(valor);
      const sugerencias = valor.trim() ? buscarGlobal(valor).slice(0, 8) : [];
      setResultados({ ...resultados, sugerencias, mostrar: false, indice: -1 });
    },
    
    tecla: (e) => {
      const { sugerencias, indice } = resultados;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setResultados({ ...resultados, indice: indice < sugerencias.length - 1 ? indice + 1 : indice });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setResultados({ ...resultados, indice: indice > 0 ? indice - 1 : -1 });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        indice >= 0 && sugerencias[indice] ? 
          manejarBusqueda.seleccionar(sugerencias[indice]) : 
          manejarBusqueda.ejecutar();
      } else if (e.key === 'Escape') {
        setResultados({ sugerencias: [], principales: [], mostrar: false, indice: -1 });
      }
    },
    
    seleccionar: (sugerencia) => {
      setBusqueda(sugerencia.nombre);
      setResultados({ sugerencias: [], principales: [sugerencia], mostrar: true, indice: -1 });
    },
    
    ejecutar: () => {
      if (!busqueda.trim()) return;
      const principales = buscarGlobal(busqueda);
      setResultados({ sugerencias: [], principales, mostrar: true, indice: -1 });
    },
    
    limpiar: () => {
      setBusqueda('');
      setResultados({ sugerencias: [], principales: [], mostrar: false, indice: -1 });
    }
  };

  const mostrarFicha = (elemento, tipo) => {
    const residencia = datos.residencias.find(r => r.id == elemento.residencia_id);
    setFichaVisible({ elemento, tipo, residencia });
  };

  const utils = {
    edad: (fecha) => {
      if (!fecha) return 'N/A';
      const hoy = new Date();
      const nac = new Date(fecha);
      let edad = hoy.getFullYear() - nac.getFullYear();
      const mes = hoy.getMonth() - nac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
      return edad;
    },
    
    dependencia: (grado) => {
      const grados = {
        'grado_i': 'Grado I - Dependencia moderada',
        'grado_ii': 'Grado II - Dependencia severa',
        'grado_iii': 'Grado III - Gran dependencia',
        'sin_dependencia': 'Sin dependencia reconocida'
      };
      return grados[grado] || grado;
    }
  };

  const estadisticas = [
    { label: 'Mis Residencias', count: datos.residencias.length, color: '#007bff', icon: '🏢' },
    { label: 'Mi Personal', count: datos.personal.length, color: '#28a745', icon: '👨‍⚕️' },
    { label: 'Mis Residentes', count: datos.residentes.length, color: '#6f42c1', icon: '👥' },
    { label: 'Partes Hoy', count: datos.partes.filter(p => new Date(p.fecha).toDateString() === new Date().toDateString()).length, color: '#fd7e14', icon: '📋' }
  ];

  const pestanas = [
    { id: 'partes', label: 'Partes Diarios', icon: '📋' },
    { id: 'residencias', label: 'Residencias', icon: '🏢' },
    { id: 'residentes', label: 'Residentes', icon: '👥' },
    { id: 'personal', label: 'Personal', icon: '👨‍⚕️' },
    { id: 'excel', label: 'Excel', icon: '📊' },
    { id: 'papelera', label: 'Papelera', icon: '🗑️' }
  ];

  const recargar = () => cargarDatos(sesion.activa.directorId);
  const restaurar = (id) => SistemaPapelera.restaurar(id) && (recargar(), alert('Elemento restaurado'));

  // Render del modal de ficha
  if (fichaVisible) {
    const { elemento, tipo, residencia } = fichaVisible;
    const config = tiposBusqueda[tipo] || {};
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', maxWidth: '800px', width: '90%', maxHeight: '90%', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ backgroundColor: config.color || '#666', color: 'white', padding: '20px', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>
                {elemento.nombre || elemento.residente_nombre || 'Sin nombre'} {elemento.apellidos || ''}
              </h2>
              <p style={{ margin: '0', opacity: 0.8 }}>
                {tipo === 'parte' ? 'Parte Diario' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                {tipo === 'residente' && elemento.fecha_nacimiento && ` • ${utils.edad(elemento.fecha_nacimiento)} años`}
              </p>
            </div>
            <button onClick={() => setFichaVisible(null)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 15px', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#2c3e50', margin: '0 0 15px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>
                {tipo === 'parte' ? '📋 Información del Parte' : 'Información Básica'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                {tipo === 'parte' ? (
                  <>
                    <div><strong>Fecha:</strong> {new Date(elemento.fecha).toLocaleDateString('es-ES')}</div>
                    <div><strong>Turno:</strong> {elemento.turno || 'N/A'}</div>
                    <div><strong>Residente:</strong> {elemento.residente_nombre}</div>
                    <div><strong>Trabajador:</strong> {elemento.trabajador_nombre}</div>
                  </>
                ) : (
                  <>
                    <div><strong>DNI:</strong> {elemento.dni || 'N/A'}</div>
                    {elemento.email && <div><strong>Email:</strong> {elemento.email}</div>}
                    {elemento.telefono && <div><strong>Teléfono:</strong> {elemento.telefono}</div>}
                    {elemento.titulacion && <div><strong>Titulación:</strong> {elemento.titulacion}</div>}
                    {elemento.turno && <div><strong>Turno:</strong> {elemento.turno}</div>}
                    {elemento.grado_dependencia && <div><strong>Dependencia:</strong> {utils.dependencia(elemento.grado_dependencia)}</div>}
                    {elemento.total_plazas && <div><strong>Plazas:</strong> {elemento.plazas_ocupadas || 0}/{elemento.total_plazas}</div>}
                  </>
                )}
              </div>
            </div>

            {tipo === 'parte' && elemento.observaciones && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', color: '#2c3e50', margin: '0 0 15px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>📝 Observaciones</h3>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ margin: '0', lineHeight: '1.5' }}>{elemento.observaciones}</p>
                </div>
              </div>
            )}

            {residencia && (
              <div>
                <h3 style={{ fontSize: '18px', color: '#2c3e50', margin: '0 0 15px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '8px' }}>🏠 Residencia</h3>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{residencia.nombre}</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>📍 {residencia.direccion}, {residencia.poblacion}</p>
                </div>
              </div>
            )}
          </div>
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
            <p style={{ margin: '0', opacity: 0.8 }}>
              {sesion.director ? `${sesion.director.nombre} ${sesion.director.apellidos}` : 'Cargando...'}
            </p>
          </div>
          <button onClick={() => (localStorage.removeItem('sesion_activa'), window.location.href = '/login')} 
                  style={{ padding: '12px 20px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {estadisticas.map(stat => (
            <div key={stat.label} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{stat.icon}</div>
              <h3 style={{ fontSize: '16px', color: '#333', margin: '0 0 10px 0' }}>{stat.label}</h3>
              <p style={{ fontSize: '32px', color: stat.color, margin: '0', fontWeight: 'bold' }}>{stat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 20px' }}>
        <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" value={busqueda} onChange={(e) => manejarBusqueda.cambio(e.target.value)} onKeyDown={manejarBusqueda.tecla}
                     placeholder="Buscar en mis partes, residencias, personal o residentes..."
                     style={{ width: '100%', padding: '15px 50px 15px 15px', fontSize: '16px', border: '2px solid #e9ecef', borderRadius: '8px', outline: 'none' }}
                     onFocus={(e) => e.target.style.borderColor = '#007bff'} onBlur={(e) => e.target.style.borderColor = '#e9ecef'} />
              {busqueda && <button onClick={manejarBusqueda.limpiar} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '18px', color: '#6c757d', cursor: 'pointer' }}>✕</button>}
            </div>
            <button onClick={manejarBusqueda.ejecutar} disabled={!busqueda.trim()} 
                    style={{ padding: '15px 25px', backgroundColor: busqueda.trim() ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: busqueda.trim() ? 'pointer' : 'not-allowed' }}>
              🔍 Buscar
            </button>
          </div>

          {/* Sugerencias */}
          {resultados.sugerencias.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: '20px', right: '20px', backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '300px', overflowY: 'auto' }}>
              {resultados.sugerencias.map((sugerencia, index) => (
                <div key={`${sugerencia.tipo}-${sugerencia.id}`} onClick={() => manejarBusqueda.seleccionar(sugerencia)}
                     style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: index < resultados.sugerencias.length - 1 ? '1px solid #f8f9fa' : 'none', backgroundColor: index === resultados.indice ? '#f8f9fa' : 'transparent', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{sugerencia.icono}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: sugerencia.color }}>{sugerencia.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{sugerencia.subtitulo}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#999' }}>Coincide: {sugerencia.coincidencias.join(', ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!resultados.mostrar && !resultados.sugerencias.length && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '15px', fontSize: '14px' }}>
            💡 Busca partes diarios, residencias, personal o residentes. Usa ↑↓ para navegar y Enter para seleccionar
          </div>
        )}
      </div>

      {/* Resultados */}
      {resultados.mostrar && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 30px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', margin: '0', color: '#2c3e50' }}>
                🔍 Resultados: "{busqueda}" <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>({resultados.principales.length} resultado{resultados.principales.length !== 1 ? 's' : ''})</span>
              </h3>
              <button onClick={manejarBusqueda.limpiar} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>✕ Limpiar</button>
            </div>

            {resultados.principales.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No se encontraron resultados</h3>
                <p style={{ fontSize: '14px', margin: '0' }}>Prueba con otros términos</p>
              </div>
            ) : (
              resultados.principales.map((resultado, index) => (
                <div key={`${resultado.tipo}-${resultado.id}`} style={{ padding: '20px', borderBottom: index < resultados.principales.length - 1 ? '1px solid #f1f3f4' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>{resultado.icono}</span>
                      <h4 style={{ fontSize: '18px', margin: '0 10px 0 0', color: resultado.color }}>{resultado.nombre}</h4>
                      <span style={{ fontSize: '12px', backgroundColor: resultado.color, color: 'white', padding: '2px 8px', borderRadius: '12px' }}>{resultado.tipo}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>{resultado.subtitulo}</div>
                    <div style={{ fontSize: '12px', color: '#28a745' }}>✓ Coincidencias: {resultado.coincidencias.join(', ')}</div>
                  </div>
                  <button onClick={() => mostrarFicha(resultado.elemento, resultado.tipo)} 
                          style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Ver ficha
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      {!resultados.mostrar && (
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #dee2e6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>
            {pestanas.map(item => (
              <button key={item.id} onClick={() => setVistaActual(item.id)} 
                      style={{ padding: '15px 20px', border: 'none', backgroundColor: vistaActual === item.id ? '#e9ecef' : 'transparent', cursor: 'pointer', borderBottom: vistaActual === item.id ? '3px solid #007bff' : '3px solid transparent' }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {!resultados.mostrar && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          {vistaActual === 'partes' && <PartesView partesGuardados={datos.partes} onVerFicha={(parte) => mostrarFicha(parte, 'parte')} />}
          {vistaActual === 'residencias' && <ResidenciasView residencias={datos.residencias} sesionActiva={sesion.activa} onRecargarDatos={recargar} />}
          {vistaActual === 'residentes' && <ResidentesView residentes={datos.residentes} residencias={datos.residencias} onRecargarDatos={recargar} />}
          {vistaActual === 'personal' && <PersonalView personal={datos.personal} residencias={datos.residencias} onRecargarDatos={recargar} />}
          {vistaActual === 'excel' && <ExcelView sesionActiva={sesion.activa} residencias={datos.residencias} personal={datos.personal} residentes={datos.residentes} onRecargarDatos={recargar} />}
          {vistaActual === 'papelera' && <PapeleraView papelera={datos.papelera} onRestaurar={restaurar} />}
        </div>
      )}
    </div>
  );
};

export default DashboardDirector;
