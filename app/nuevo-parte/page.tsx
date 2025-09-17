"use client"
import React, { useState } from 'react';

const ListaResidentesPersonal = () => {
  const [expandedResident, setExpandedResident] = useState(null);
  const [estadosModificados, setEstadosModificados] = useState(new Set());
  const [partesCompletados, setPartesCompletados] = useState(new Set());
  const [datosFormulario, setDatosFormulario] = useState({});
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({});
  const [seleccionados, setSeleccionados] = useState(new Set());
  const [mostrarMisPartes, setMostrarMisPartes] = useState(false);
  const [misPartes, setMisPartes] = useState([]);
  const [parteActual, setParteActual] = useState({ residentes: {}, fecha: null, completado: false });
  
  // Generar 60 residentes automáticamente
  const residentes = Array.from({length: 60}, (_, i) => {
    const nombres = ["María García López", "José Martínez Ruiz", "Carmen Rodríguez Sánchez", "Antonio Fernández Pérez", "Dolores Jiménez García", "Francisco López Martín", "Ana Moreno González", "Manuel Ruiz Herrera", "Isabel Sánchez Díez", "Pedro Álvarez Torres"];
    return {
      id: i + 1,
      nombre: nombres[i % nombres.length] + ` (${i + 1})`,
      edad: 73 + (i % 15),
      numeroHistoria: `2024-${String(i + 1).padStart(3, '0')}`
    };
  });

  // Cargar mis partes al inicializar
  React.useEffect(() => {
    const partesGuardados = JSON.parse(localStorage.getItem('partes_completos') || '[]');
    setMisPartes(partesGuardados);
    
    // Cargar parte actual si existe
    const parteEnCurso = JSON.parse(localStorage.getItem('parte_actual') || '{"residentes": {}, "fecha": null, "completado": false}');
    setParteActual(parteEnCurso);
    
    // Restaurar estado de completados desde el parte actual
    if (parteEnCurso.residentes) {
      const completados = new Set(Object.keys(parteEnCurso.residentes).map(Number));
      setPartesCompletados(completados);
    }
  }, []);

  // Configuración campos CYL compacta
  const camposCYL = {
    conciencia: {
      titulo: 'Estado de Conciencia',
      descripcion: 'Alerta, normal',
      campos: {
        estado_conciencia: { tipo: 'select', defecto: 'alerta', opciones: ['alerta', 'somnoliento', 'inconsciente'], req: true },
        estado_animico: { tipo: 'select', defecto: 'tranquilo', opciones: ['tranquilo', 'animado', 'apatico', 'inquieto', 'confuso'], req: true },
        tension_arterial: { tipo: 'text', placeholder: '120/80' },
        temperatura: { tipo: 'number', placeholder: '36.5', step: '0.1' },
        glucemia: { tipo: 'number', placeholder: 'mg/dl' }
      }
    },
    alimentacion: {
      titulo: 'Alimentación/Ingesta',
      descripcion: 'Come bien, sin incidencias',
      campos: {
        alimentacion_estado: { tipo: 'select', defecto: 'bien', opciones: ['bien', 'regular', 'poco', 'rechaza', 'ayuda'], req: true },
        observaciones_alimentacion: { tipo: 'textarea', defecto: 'Sin observaciones', req: true },
        incidencias_alimentacion: { tipo: 'textarea', defecto: 'Ninguna', req: true },
        dieta_prescrita: { tipo: 'select', defecto: 'normal', opciones: ['normal', 'diabetica', 'triturada', 'sin_sal', 'blanda'] },
        suplementos: { tipo: 'text', defecto: 'Ninguno' }
      }
    },
    medicacion: {
      titulo: 'Medicación',
      descripcion: 'Según pauta, sin incidencias',
      campos: {
        medicacion_administrada: { tipo: 'textarea', defecto: 'Según pauta médica - Sin incidencias', req: true },
        omisiones_rechazos: { tipo: 'textarea', defecto: 'Ninguna', req: true },
        reacciones_adversas: { tipo: 'textarea', defecto: 'Ninguna', req: true },
        curas_realizadas: { tipo: 'textarea', defecto: 'No procede' }
      }
    },
    higiene: {
      titulo: 'Higiene y Cuidados',
      descripcion: 'Completa, continente',
      campos: {
        higiene_diaria: { tipo: 'select', defecto: 'completa', opciones: ['completa', 'parcial'], req: true },
        control_esfinteres: { tipo: 'select', defecto: 'continente', opciones: ['continente', 'inc_urinaria', 'inc_fecal', 'doble'], req: true },
        cambios_absorbentes: { tipo: 'number', defecto: '0', min: '0', req: true },
        estado_piel: { tipo: 'textarea', defecto: 'Sin alteraciones' },
        cambios_posturales: { tipo: 'textarea', defecto: 'No aplica' }
      }
    },
    movilidad: {
      titulo: 'Movilidad/Actividades',
      descripcion: 'Autónomo, participa',
      campos: {
        movilidad: { tipo: 'select', defecto: 'autonomo', opciones: ['autonomo', 'ayuda_parcial', 'encamado', 'silla'], req: true },
        actividades: { tipo: 'textarea', defecto: 'Participa normalmente', req: true },
        actividades_sociales: { tipo: 'textarea', defecto: 'Sin incidencias' }
      }
    },
    sueno: {
      titulo: 'Sueño y Descanso',
      descripcion: 'Descansa bien',
      campos: {
        sueno_descanso: { tipo: 'textarea', defecto: 'Ha descansado bien', req: true },
        incidencias_nocturnas: { tipo: 'textarea', defecto: 'Ninguna', req: true }
      }
    },
    incidencias: {
      titulo: 'Incidencias',
      descripcion: 'Sin incidencias',
      campos: {
        incidencias_generales: { tipo: 'textarea', defecto: 'Ninguna', req: true },
        visitas_medicas: { tipo: 'textarea', defecto: 'Ninguna', req: true },
        visitas_familiares: { tipo: 'textarea', defecto: 'Ninguna' },
        comunicacion_familia: { tipo: 'checkbox', defecto: false },
        fecha_comunicacion: { tipo: 'datetime-local', dependeDe: 'comunicacion_familia' }
      }
    }
  };

  const getEstado = (id) => {
    if (partesCompletados.has(id)) return { bg: '#d1ecf1', text: '#0c5460', estado: 'Completado', icono: 'ℹ️' };
    if (estadosModificados.has(id)) return { bg: '#fff3cd', text: '#856404', estado: 'Modificado', icono: '⚠️' };
    return { bg: '#d4edda', text: '#155724', estado: 'Normal', icono: '✅' };
  };

  const toggleSeleccion = (residenteId) => {
    setSeleccionados(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(residenteId)) {
        nuevo.delete(residenteId);
      } else {
        nuevo.add(residenteId);
      }
      return nuevo;
    });
  };

  const seleccionarTodos = () => {
    if (seleccionados.size === residentes.length) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(residentes.map(r => r.id)));
    }
  };

  const verificarYCompletarParte = (nuevosCompletados) => {
    if (nuevosCompletados.size === 60) {
      // Parte completo - guardar en "Mis Partes"
      const parteCompleto = {
        fecha: new Date().toISOString(),
        profesional: 'Juan Pérez Martín',
        residencia: 'Residencia San José',
        totalResidentes: 60,
        datosResidentes: parteActual.residentes
      };
      
      const partesExistentes = JSON.parse(localStorage.getItem('partes_completos') || '[]');
      const actualizados = [...partesExistentes, parteCompleto];
      localStorage.setItem('partes_completos', JSON.stringify(actualizados));
      setMisPartes(actualizados);
      
      // Limpiar parte actual
      setParteActual({ residentes: {}, fecha: null, completado: false });
      localStorage.removeItem('parte_actual');
      
      alert(`¡PARTE DIARIO COMPLETO!\n\nSe ha guardado el parte con los 60 residentes.\nTotal de partes completados: ${actualizados.length}`);
      
      return true;
    }
    return false;
  };

  const guardarSeleccionados = () => {
    const nuevosResidentes = {};
    
    seleccionados.forEach(residenteId => {
      const residente = residentes.find(r => r.id === residenteId);
      const datosResidente = {
        nombre: residente.nombre,
        numeroHistoria: residente.numeroHistoria,
        edad: residente.edad,
        fecha: new Date().toISOString(),
        datos: {}
      };
      
      Object.entries(camposCYL).forEach(([_, seccion]) => {
        Object.entries(seccion.campos).forEach(([campoId, config]) => {
          datosResidente.datos[campoId] = config.defecto;
        });
      });
      
      nuevosResidentes[residenteId] = datosResidente;
    });
    
    // Actualizar parte actual
    const parteActualizado = {
      ...parteActual,
      residentes: { ...parteActual.residentes, ...nuevosResidentes },
      fecha: parteActual.fecha || new Date().toISOString()
    };
    
    setParteActual(parteActualizado);
    localStorage.setItem('parte_actual', JSON.stringify(parteActualizado));
    
    const nuevosCompletados = new Set([...partesCompletados, ...seleccionados]);
    setPartesCompletados(nuevosCompletados);
    setSeleccionados(new Set());
    
    // Verificar si se completó el parte
    const seCompleto = verificarYCompletarParte(nuevosCompletados);
    
    if (!seCompleto) {
      alert(`Se guardaron ${seleccionados.size} residentes con valores normales.\nProgreso: ${nuevosCompletados.size}/60 residentes completados.`);
    }
  };

  const handleChange = (residenteId, campoId, valor) => {
    const key = `${residenteId}_${campoId}`;
    setDatosFormulario(prev => ({ ...prev, [key]: valor }));
    
    // Buscar valor por defecto
    let defecto = '';
    Object.values(camposCYL).forEach(seccion => {
      if (seccion.campos[campoId]) defecto = seccion.campos[campoId].defecto || '';
    });
    
    // Actualizar estado
    if (valor !== defecto) {
      setEstadosModificados(prev => new Set([...prev, residenteId]));
    } else {
      setEstadosModificados(prev => { const nuevo = new Set(prev); nuevo.delete(residenteId); return nuevo; });
    }
  };

  const renderCampo = (campoId, config, residenteId) => {
    const key = `${residenteId}_${campoId}`;
    const valor = datosFormulario[key] || config.defecto || '';
    
    if (config.dependeDe && !datosFormulario[`${residenteId}_${config.dependeDe}`]) return null;

    const estilo = { width: '100%', padding: '10px', fontSize: '15px', border: '2px solid #ddd', borderRadius: '5px' };
    
    switch (config.tipo) {
      case 'select':
        return (
          <select value={valor} onChange={(e) => handleChange(residenteId, campoId, e.target.value)} style={estilo}>
            {config.opciones.map(op => <option key={op} value={op}>{op.replace(/_/g, ' ')}</option>)}
          </select>
        );
      case 'textarea':
        return <textarea value={valor} onChange={(e) => handleChange(residenteId, campoId, e.target.value)} style={{...estilo, minHeight: '60px'}} rows="2" />;
      case 'checkbox':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={valor} onChange={(e) => handleChange(residenteId, campoId, e.target.checked)} />
            <span>{valor ? 'Sí' : 'No'}</span>
          </div>
        );
      case 'number':
        return <input type="number" value={valor} onChange={(e) => handleChange(residenteId, campoId, e.target.value)} style={estilo} {...(config.min && {min: config.min})} {...(config.step && {step: config.step})} placeholder={config.placeholder} />;
      case 'datetime-local':
        return <input type="datetime-local" value={valor} onChange={(e) => handleChange(residenteId, campoId, e.target.value)} style={estilo} />;
      default:
        return <input type="text" value={valor} onChange={(e) => handleChange(residenteId, campoId, e.target.value)} style={estilo} placeholder={config.placeholder} />;
    }
  };

  const inicializar = (residenteId) => {
    const valores = {};
    Object.entries(camposCYL).forEach(([_, seccion]) => {
      Object.entries(seccion.campos).forEach(([campoId, config]) => {
        if (config.defecto !== undefined) valores[`${residenteId}_${campoId}`] = config.defecto;
      });
    });
    setDatosFormulario(prev => ({ ...prev, ...valores }));
  };

  const guardar = (residenteId) => {
    const residente = residentes.find(r => r.id === residenteId);
    const datosResidente = { 
      nombre: residente.nombre, 
      numeroHistoria: residente.numeroHistoria,
      edad: residente.edad,
      fecha: new Date().toISOString(), 
      datos: {} 
    };
    
    Object.entries(camposCYL).forEach(([_, seccion]) => {
      Object.entries(seccion.campos).forEach(([campoId, config]) => {
        datosResidente.datos[campoId] = datosFormulario[`${residenteId}_${campoId}`] || config.defecto;
      });
    });
    
    // Actualizar parte actual
    const parteActualizado = {
      ...parteActual,
      residentes: { ...parteActual.residentes, [residenteId]: datosResidente },
      fecha: parteActual.fecha || new Date().toISOString()
    };
    
    setParteActual(parteActualizado);
    localStorage.setItem('parte_actual', JSON.stringify(parteActualizado));
    
    const nuevosCompletados = new Set([...partesCompletados, residenteId]);
    setPartesCompletados(nuevosCompletados);
    
    // Verificar si se completó el parte
    const seCompleto = verificarYCompletarParte(nuevosCompletados);
    
    if (!seCompleto) {
      alert(`Residente guardado: ${residente.nombre}\nProgreso: ${nuevosCompletados.size}/60 residentes completados.`);
    }
    
    setExpandedResident(null);
    setSeccionesAbiertas({});
  };

  if (mostrarMisPartes) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '15px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '28px', color: '#333', margin: '0' }}>Mis Partes Diarios Completos</h1>
              <!-- Botón Cerrar Sesión --><button onClick={() => { localStorage.removeItem('sesion_activa'); window.location.href = '/login'; }} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px' }}>🚪 Cerrar Sesión</button><button 
                onClick={() => setMostrarMisPartes(false)}
                style={{ padding: '12px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                ← Volver a Residentes
              </button>
            </div>
            <p style={{ fontSize: '16px', color: '#666', margin: '10px 0 0 0' }}>
              Total de partes completos realizados: {misPartes.length}
            </p>
            <p style={{ fontSize: '14px', color: '#856404', margin: '5px 0 0 0', fontStyle: 'italic' }}>
              Cada parte representa 60 residentes completados
            </p>
          </div>
          
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {misPartes.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <p style={{ fontSize: '18px', margin: '0' }}>No hay partes completos aún</p>
                <p style={{ fontSize: '14px', margin: '10px 0 0 0' }}>Complete los 60 residentes para generar un parte</p>
              </div>
            ) : (
              misPartes.map((parte, index) => (
                <div key={index} style={{ 
                  padding: '15px 20px', 
                  borderBottom: index < misPartes.length - 1 ? '1px solid #e9ecef' : 'none',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 5px 0' }}>
                        Parte #{index + 1} - {parte.residencia}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                        Fecha: {new Date(parte.fecha).toLocaleString('es-ES')} • Por: {parte.profesional} • {parte.totalResidentes} residentes
                      </p>
                    </div>
                    <div style={{ fontSize: '20px', color: '#28a745' }}>✓</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '15px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Panel fijo del profesional */}
        <div style={{ 
          position: 'sticky', 
          top: '15px', 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '2px solid #28a745',
          zIndex: 1000
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#666' }}>Fecha y Hora:</strong>
              <div style={{ fontSize: '16px', color: '#333' }}>{new Date().toLocaleString('es-ES')}</div>
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#666' }}>Residencia:</strong>
              <div style={{ fontSize: '16px', color: '#333' }}>Residencia San José</div>
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#666' }}>Personal Laboral:</strong>
              <div style={{ fontSize: '16px', color: '#333' }}>Juan Pérez Martín</div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingTop: '15px',
            borderTop: '1px solid #e9ecef'
          }}>
            <div>
              <!-- Botón Cerrar Sesión --><button onClick={() => { localStorage.removeItem('sesion_activa'); window.location.href = '/login'; }} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px' }}>🚪 Cerrar Sesión</button><button 
                onClick={() => setMostrarMisPartes(true)}
                style={{ 
                  padding: '10px 20px', 
                  fontSize: '16px', 
                  backgroundColor: '#6f42c1', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                📋 Mis Partes ({misPartes.length})
              </button>
              <span style={{ fontSize: '16px', color: partesCompletados.size === 60 ? '#28a745' : '#856404', fontWeight: 'bold' }}>
                Progreso: {partesCompletados.size}/60 residentes
                {partesCompletados.size === 60 && ' - ¡PARTE COMPLETO!'}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <!-- Botón Cerrar Sesión --><button onClick={() => { localStorage.removeItem('sesion_activa'); window.location.href = '/login'; }} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px' }}>🚪 Cerrar Sesión</button><button 
                onClick={seleccionarTodos}
                style={{ 
                  padding: '8px 15px', 
                  fontSize: '14px', 
                  backgroundColor: seleccionados.size === residentes.length ? '#dc3545' : '#17a2b8', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                {seleccionados.size === residentes.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
              </button>
              
              {seleccionados.size > 0 && (
                <!-- Botón Cerrar Sesión --><button onClick={() => { localStorage.removeItem('sesion_activa'); window.location.href = '/login'; }} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px' }}>🚪 Cerrar Sesión</button><button 
                  onClick={guardarSeleccionados}
                  style={{ 
                    padding: '8px 15px', 
                    fontSize: '14px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  💾 Guardar {seleccionados.size} Seleccionados
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {residentes.map((residente, index) => {
            const colores = getEstado(residente.id);
            const expandido = expandedResident === residente.id;
            
            return (
              <div key={residente.id}>
                <div 
                  onClick={(e) => {
                    // No expandir si se hace click en el checkbox
                    if (e.target.type === 'checkbox') return;
                    
                    if (expandido) {
                      setExpandedResident(null);
                      setSeccionesAbiertas({});
                    } else {
                      setExpandedResident(residente.id);
                      inicializar(residente.id);
                    }
                  }}
                  style={{ 
                    backgroundColor: colores.bg,
                    borderBottom: index < 59 ? '1px solid #dee2e6' : 'none',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={seleccionados.has(residente.id)}
                      onChange={() => toggleSeleccion(residente.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span style={{ fontSize: '18px' }}>{colores.icono}</span>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: colores.text }}>{residente.nombre}</div>
                      <div style={{ fontSize: '13px', color: colores.text, opacity: 0.8 }}>{residente.edad} años • {residente.numeroHistoria} • {colores.estado}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', color: colores.text }}>{expandido ? '▲' : '▼'}</div>
                </div>

                {expandido && (
                  <div style={{ backgroundColor: '#f8f9fa', padding: '25px' }}>
                    {Object.entries(camposCYL).map(([seccionId, seccion]) => {
                      const seccionKey = `${residente.id}_${seccionId}`;
                      const abierta = seccionesAbiertas[seccionKey];
                      
                      return (
                        <div key={seccionId} style={{ backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '5px', marginBottom: '10px' }}>
                          <div 
                            onClick={() => setSeccionesAbiertas(prev => ({ ...prev, [seccionKey]: !prev[seccionKey] }))}
                            style={{ padding: '12px 15px', cursor: 'pointer', backgroundColor: abierta ? '#f1f3f4' : 'white', display: 'flex', justifyContent: 'space-between' }}
                          >
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{seccion.titulo}</div>
                              <div style={{ fontSize: '14px', color: '#666' }}>{seccion.descripcion}</div>
                            </div>
                            <div style={{ fontSize: '14px', color: abierta ? '#007bff' : '#28a745', fontWeight: 'bold' }}>
                              {abierta ? '▼ Modificar' : '▶ Conforme'}
                            </div>
                          </div>
                          
                          {abierta && (
                            <div style={{ padding: '15px' }}>
                              {Object.entries(seccion.campos).map(([campoId, config]) => (
                                <div key={campoId} style={{ marginBottom: '12px' }}>
                                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: config.req ? '#dc3545' : '#6c757d' }}>
                                    {campoId.replace(/_/g, ' ')} {config.req && '*'}
                                  </label>
                                  {renderCampo(campoId, config, residente.id)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px', paddingTop: '20px', borderTop: '2px solid #dee2e6' }}>
                      <!-- Botón Cerrar Sesión --><button onClick={() => { localStorage.removeItem('sesion_activa'); window.location.href = '/login'; }} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px' }}>🚪 Cerrar Sesión</button><button onClick={() => { setExpandedResident(null); setSeccionesAbiertas({}); }} style={{ padding: '12px 20px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Cerrar
                      </button>
                      <!-- Botón Cerrar Sesión --><button onClick={() => { localStorage.removeItem('sesion_activa'); window.location.href = '/login'; }} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '15px' }}>🚪 Cerrar Sesión</button><button onClick={() => guardar(residente.id)} style={{ padding: '12px 25px', fontSize: '16px', backgroundColor: partesCompletados.has(residente.id) ? '#6f42c1' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {partesCompletados.has(residente.id) ? 'Actualizar' : 'Guardar Residente'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {partesCompletados.size === 60
&& (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center', border: '3px solid #28a745' }}>
            <h3 style={{ fontSize: '24px', color: '#155724', margin: '0 0 8px 0' }}>
              🎉 ¡PARTE DIARIO COMPLETO! 🎉
            </h3>
            <p style={{ fontSize: '18px', color: '#155724', margin: '0' }}>
              Los 60 residentes han sido completados. El parte se ha guardado automáticamente.
            </p>
            <p style={{ fontSize: '16px', color: '#666', margin: '10px 0 0 0' }}>
              Total de partes completos: {misPartes.length}
            </p>
          </div>
        )}

        {partesCompletados.size > 0 && partesCompletados.size < 60 && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'center', border: '1px solid #17a2b8' }}>
            <h3 style={{ fontSize: '20px', color: '#0c5460', margin: '0 0 8px 0' }}>
              Progreso del Parte Actual
            </h3>
            <p style={{ fontSize: '16px', margin: '0' }}>
              {partesCompletados.size}/60 residentes completados. Continúa hasta completar todos para generar 1 parte.
            </p>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e9ecef', 
              borderRadius: '10px', 
              height: '20px', 
              margin: '15px 0',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(partesCompletados.size / 60) * 100}%`, 
                backgroundColor: '#17a2b8', 
                height: '100%',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              {Math.round((partesCompletados.size / 60) * 100)}% completado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaResidentesPersonal;
