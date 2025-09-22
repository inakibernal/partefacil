"use client";
import React, { useState } from "react";

export default function ResidenciasView({
  residencias,
  sesionActiva,
  onRecargarDatos,
}: {
  residencias: any[];
  sesionActiva: any;
  onRecargarDatos: () => void;
}) {
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({});
  const [editando, setEditando] = useState(null);
  const [fichaVisible, setFichaVisible] = useState(null);

  const campos = [
    { campo: 'nombre', label: '¿Nombre de la residencia?', tipo: 'text', req: true },
    { campo: 'direccion', label: '¿Dirección?', tipo: 'text', req: true },
    { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
    { campo: 'poblacion', label: '¿Población?', tipo: 'text', req: true },
    { campo: 'telefono_fijo', label: '¿Teléfono fijo?', tipo: 'tel', req: true },
    { campo: 'telefono_movil', label: '¿Teléfono móvil?', tipo: 'tel', req: false },
    { campo: 'email', label: '¿Email?', tipo: 'email', req: true },
    { campo: 'total_plazas', label: '¿Número total de plazas?', tipo: 'number', req: true },
    { campo: 'plazas_ocupadas', label: '¿Plazas ocupadas actualmente?', tipo: 'number', req: true },
    { campo: 'cif', label: '¿CIF?', tipo: 'text', req: true },
    { campo: 'numero_licencia', label: '¿Número de licencia?', tipo: 'text', req: true },
    { campo: 'dni_director', label: '¿DNI del director/a?', tipo: 'text', req: true },
    { campo: 'nombre_director', label: '¿Nombre del director/a?', tipo: 'text', req: true }
  ];

  const iniciarFormulario = (residencia = null) => {
    setFormularioActivo(true);
    setPaso(0);
    setEditando(residencia);
    setDatos(residencia ? { ...residencia } : {});
  };

  const guardarResidencia = () => {
    const nuevaResidencia = {
      ...datos,
      id: editando ? editando.id : Date.now(),
      director_id: sesionActiva.directorId,
      fecha_creacion: editando ? editando.fecha_creacion : new Date().toISOString(),
      fecha_modificacion: new Date().toISOString()
    };

    const todasResidencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
    const residenciasActualizadas = editando 
      ? todasResidencias.map(r => r.id === editando.id ? nuevaResidencia : r)
      : [...todasResidencias, nuevaResidencia];

    localStorage.setItem('residencias_sistema', JSON.stringify(residenciasActualizadas));
    setFormularioActivo(false);
    onRecargarDatos();
  };

  const eliminarResidencia = (residencia) => {
    if (!confirm(`¿Estás seguro de eliminar la residencia "${residencia.nombre}"?`)) return;
    if (!confirm(`ATENCIÓN: Esta acción enviará la residencia a la papelera. ¿Confirmas?`)) return;
    
    const todasResidencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
    const residenciasActualizadas = todasResidencias.filter(r => r.id !== residencia.id);
    localStorage.setItem('residencias_sistema', JSON.stringify(residenciasActualizadas));
    onRecargarDatos();
  };

  const mostrarFicha = (residencia) => {
    setFichaVisible(residencia);
  };

  if (formularioActivo) {
    const campoActual = campos[paso];
    return (
      <div style={{ backgroundColor: '#6f42c1', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '60px 40px', borderRadius: '10px', maxWidth: '600px', width: '90%' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {editando ? 'Editando' : 'Creando'} residencia • {paso + 1} de {campos.length}
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }}>
              <div style={{ width: `${((paso + 1) / campos.length) * 100}%`, height: '100%', backgroundColor: '#6f42c1', borderRadius: '2px' }}></div>
            </div>
          </div>
          <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>{campoActual.label}</h2>
          <div style={{ marginBottom: '40px' }}>
            <input 
              type={campoActual.tipo} 
              value={datos[campoActual.campo] || ''} 
              onChange={(e) => setDatos({...datos, [campoActual.campo]: e.target.value})} 
              style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {paso > 0 ? (
              <button onClick={() => setPaso(paso - 1)} style={{ padding: '15px 30px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px' }}>Anterior</button>
            ) : (
              <button onClick={() => setFormularioActivo(false)} style={{ padding: '15px 30px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px' }}>Cancelar</button>
            )}
            <button 
              onClick={() => {
                if (paso < campos.length - 1) {
                  setPaso(paso + 1);
                } else {
                  guardarResidencia();
                }
              }} 
              disabled={campoActual.req && !datos[campoActual.campo]} 
              style={{ padding: '15px 30px', backgroundColor: (campoActual.req && !datos[campoActual.campo]) ? '#ccc' : '#6f42c1', color: 'white', border: 'none', borderRadius: '8px' }}
            >
              {paso === campos.length - 1 ? (editando ? 'Actualizar' : 'Crear') : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (fichaVisible) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', maxWidth: '700px', width: '90%', maxHeight: '80%', overflow: 'auto' }}>
          <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <h2>{fichaVisible.nombre}</h2>
            <button onClick={() => setFichaVisible(null)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 15px' }}>× Cerrar</button>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>Dirección:</strong> {fichaVisible.direccion}</p>
            <p><strong>Código Postal:</strong> {fichaVisible.codigo_postal}</p>
            <p><strong>Población:</strong> {fichaVisible.poblacion}</p>
            <p><strong>Teléfono Fijo:</strong> {fichaVisible.telefono_fijo}</p>
            <p><strong>Teléfono Móvil:</strong> {fichaVisible.telefono_movil || 'No especificado'}</p>
            <p><strong>Email:</strong> {fichaVisible.email}</p>
            <p><strong>Plazas:</strong> {fichaVisible.plazas_ocupadas}/{fichaVisible.total_plazas}</p>
            <p><strong>CIF:</strong> {fichaVisible.cif}</p>
            <p><strong>Número de Licencia:</strong> {fichaVisible.numero_licencia}</p>
            <p><strong>DNI Director:</strong> {fichaVisible.dni_director}</p>
            <p><strong>Nombre Director:</strong> {fichaVisible.nombre_director}</p>
            {fichaVisible.fecha_modificacion && <p><strong>Última modificación:</strong> {new Date(fichaVisible.fecha_modificacion).toLocaleString()}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Residencias ({residencias.length})</h2>
      <button
        onClick={() => iniciarFormulario()}
        style={{
          padding: "12px 24px",
          backgroundColor: "#6f42c1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        + Agregar Residencia
      </button>

      <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
        {residencias.map((residencia: any, index: number) => (
          <div
            key={residencia.id}
            style={{
              padding: "20px",
              borderBottom: index < residencias.length - 1 ? "1px solid #e9ecef" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>{residencia.nombre}</h3>
                <p style={{ margin: 0, color: "#666" }}>
                  {residencia.direccion}, {residencia.poblacion} • Plazas:{" "}
                  {residencia.plazas_ocupadas}/{residencia.total_plazas}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => mostrarFicha(residencia)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Ver
                </button>
                <button
                  onClick={() => iniciarFormulario(residencia)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarResidencia(residencia)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        {residencias.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            <p style={{ fontSize: 18, margin: 0 }}>No hay residencias registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
