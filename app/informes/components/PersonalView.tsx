"use client";
import React, { useState } from "react";

export default function PersonalView({
  personal,
  residencias,
  onRecargarDatos,
}: {
  personal: any[];
  residencias: any[];
  onRecargarDatos: () => void;
}) {
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({});
  const [editando, setEditando] = useState(null);
  const [fichaVisible, setFichaVisible] = useState(null);

  const campos = [
    { campo: 'dni', label: '¿DNI del trabajador?', tipo: 'text', req: true },
    { campo: 'nombre', label: '¿Nombre?', tipo: 'text', req: true },
    { campo: 'apellidos', label: '¿Apellidos?', tipo: 'text', req: true },
    { campo: 'telefono', label: '¿Teléfono?', tipo: 'tel', req: true },
    { campo: 'email', label: '¿Email?', tipo: 'email', req: true },
    { campo: 'fecha_nacimiento', label: '¿Fecha nacimiento?', tipo: 'date', req: true },
    { campo: 'direccion', label: '¿Dirección?', tipo: 'text', req: true },
    { campo: 'poblacion', label: '¿Población?', tipo: 'text', req: true },
    { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
    { campo: 'fecha_alta', label: '¿Fecha alta en clínica?', tipo: 'date', req: true },
    { campo: 'titulacion', label: '¿Titulación?', tipo: 'text', req: true },
    { campo: 'numero_colegiado', label: '¿Número colegiado?', tipo: 'text', req: true },
    { campo: 'residencia_id', label: '¿Residencia asignada?', tipo: 'select', req: true },
    { campo: 'contrasena', label: '¿Contraseña de acceso?', tipo: 'password', req: true }
  ];

  const iniciarFormulario = (trabajador = null) => {
    setFormularioActivo(true);
    setPaso(0);
    setEditando(trabajador);
    setDatos(trabajador ? { ...trabajador } : {});
  };

  const guardarPersonal = () => {
    const nuevoPersonal = {
      ...datos,
      id: editando ? editando.id : Date.now(),
      fecha_creacion: editando ? editando.fecha_creacion : new Date().toISOString(),
      fecha_modificacion: new Date().toISOString()
    };

    const todoPersonal = JSON.parse(localStorage.getItem('personal_data') || '[]');
    const personalActualizado = editando 
      ? todoPersonal.map(p => p.id === editando.id ? nuevoPersonal : p)
      : [...todoPersonal, nuevoPersonal];

    localStorage.setItem('personal_data', JSON.stringify(personalActualizado));
    setFormularioActivo(false);
    onRecargarDatos();
  };

  const eliminarPersonal = (trabajador) => {
    if (!confirm(`¿Enviar personal a papelera?`)) return;
    
    const todoPersonal = JSON.parse(localStorage.getItem('personal_data') || '[]');
    const personalActualizado = todoPersonal.filter(p => p.id !== trabajador.id);
    localStorage.setItem('personal_data', JSON.stringify(personalActualizado));
    onRecargarDatos();
  };

  const mostrarFicha = (trabajador) => {
    const residencia = residencias.find(r => r.id == trabajador.residencia_id);
    setFichaVisible({ ...trabajador, residenciaInfo: residencia });
  };

  if (formularioActivo) {
    const campoActual = campos[paso];
    return (
      <div style={{ backgroundColor: '#4a90e2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '60px 40px', borderRadius: '10px', maxWidth: '600px', width: '90%' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {editando ? 'Editando' : 'Creando'} personal • {paso + 1} de {campos.length}
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }}>
              <div style={{ width: `${((paso + 1) / campos.length) * 100}%`, height: '100%', backgroundColor: '#4a90e2', borderRadius: '2px' }}></div>
            </div>
          </div>
          <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>{campoActual.label}</h2>
          <div style={{ marginBottom: '40px' }}>
            {campoActual.tipo === 'select' ? (
              <select 
                value={datos[campoActual.campo] || ''} 
                onChange={(e) => setDatos({...datos, [campoActual.campo]: e.target.value})} 
                style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
              >
                <option value="">Seleccionar residencia...</option>
                {residencias.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            ) : (
              <input 
                type={campoActual.tipo} 
                value={datos[campoActual.campo] || ''} 
                onChange={(e) => setDatos({...datos, [campoActual.campo]: e.target.value})} 
                style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }} 
              />
            )}
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
                  guardarPersonal();
                }
              }} 
              disabled={campoActual.req && !datos[campoActual.campo]} 
              style={{ padding: '15px 30px', backgroundColor: (campoActual.req && !datos[campoActual.campo]) ? '#ccc' : '#4a90e2', color: 'white', border: 'none', borderRadius: '8px' }}
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
            <h2>{fichaVisible.nombre} {fichaVisible.apellidos}</h2>
            <button onClick={() => setFichaVisible(null)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 15px' }}>× Cerrar</button>
          </div>
          <div style={{ padding: '20px' }}>
            <p><strong>DNI:</strong> {fichaVisible.dni}</p>
            <p><strong>Email:</strong> {fichaVisible.email}</p>
            <p><strong>Teléfono:</strong> {fichaVisible.telefono}</p>
            <p><strong>Dirección:</strong> {fichaVisible.direccion}</p>
            <p><strong>Población:</strong> {fichaVisible.poblacion}</p>
            <p><strong>Código Postal:</strong> {fichaVisible.codigo_postal}</p>
            <p><strong>Fecha Alta:</strong> {fichaVisible.fecha_alta ? new Date(fichaVisible.fecha_alta).toLocaleDateString() : 'No especificada'}</p>
            <p><strong>Titulación:</strong> {fichaVisible.titulacion}</p>
            <p><strong>Nº Colegiado:</strong> {fichaVisible.numero_colegiado}</p>
            <p><strong>Residencia:</strong> {fichaVisible.residenciaInfo?.nombre || 'Sin asignar'}</p>
            <p><strong>Contraseña:</strong> {fichaVisible.contrasena}</p>
            {fichaVisible.fecha_modificacion && <p><strong>Última modificación:</strong> {new Date(fichaVisible.fecha_modificacion).toLocaleString()}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Personal ({personal.length})</h2>
      <button
        onClick={() => iniciarFormulario()}
        style={{
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        + Agregar Personal
      </button>

      <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
        {personal.map((trabajador: any, index: number) => (
          <div
            key={trabajador.id}
            style={{
              padding: "20px",
              borderBottom: index < personal.length - 1 ? "1px solid #e9ecef" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>
                  {trabajador.nombre} {trabajador.apellidos}
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                  DNI: {trabajador.dni} • Email: {trabajador.email}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => mostrarFicha(trabajador)}
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
                  onClick={() => iniciarFormulario(trabajador)}
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
                  onClick={() => eliminarPersonal(trabajador)}
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
        {personal.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            <p style={{ fontSize: 18, margin: 0 }}>No hay personal registrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
