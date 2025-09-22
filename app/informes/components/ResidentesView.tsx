"use client";
import React, { useState } from "react";

export default function ResidentesView({
  residentes,
  residencias,
  onRecargarDatos,
}: {
  residentes: any[];
  residencias: any[];
  onRecargarDatos: () => void;
}) {
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({});
  const [editando, setEditando] = useState(null);
  const [fichaVisible, setFichaVisible] = useState(null);

  const campos = [
    { campo: 'dni', label: '¿DNI del residente?', tipo: 'text', req: true },
    { campo: 'nombre', label: '¿Nombre?', tipo: 'text', req: true },
    { campo: 'apellidos', label: '¿Apellidos?', tipo: 'text', req: true },
    { campo: 'fecha_nacimiento', label: '¿Fecha de nacimiento?', tipo: 'date', req: true },
    { campo: 'edad', label: '¿Edad?', tipo: 'number', req: true },
    { campo: 'numero_historia', label: '¿Número de historia/expediente?', tipo: 'text', req: true },
    { campo: 'fecha_ingreso', label: '¿Fecha de ingreso en la clínica?', tipo: 'date', req: true },
    { campo: 'grado_dependencia', label: '¿Grado de dependencia?', tipo: 'select_dependencia', req: true },
    { campo: 'alergias', label: '¿Alergias?', tipo: 'textarea', req: false },
    { campo: 'medicacion_habitual', label: '¿Medicación habitual?', tipo: 'textarea', req: false },
    { campo: 'contacto_emergencia', label: '¿Contacto de emergencia (nombre)?', tipo: 'text', req: true },
    { campo: 'telefono_emergencia', label: '¿Teléfono de emergencia?', tipo: 'tel', req: true },
    { campo: 'parentesco', label: '¿Parentesco?', tipo: 'select_parentesco', req: true },
    { campo: 'estado_salud', label: '¿Estado de salud?', tipo: 'textarea', req: false },
    { campo: 'observaciones', label: '¿Observaciones?', tipo: 'textarea', req: false },
    { campo: 'residencia_id', label: '¿Residencia?', tipo: 'select', req: true }
  ];

  const iniciarFormulario = (residente = null) => {
    setFormularioActivo(true);
    setPaso(0);
    setEditando(residente);
    setDatos(residente ? { ...residente } : {});
  };

  const guardarResidente = () => {
    const nuevoResidente = {
      ...datos,
      id: editando ? editando.id : Date.now(),
      fecha_creacion: editando ? editando.fecha_creacion : new Date().toISOString(),
      fecha_modificacion: new Date().toISOString()
    };

    const todosResidentes = JSON.parse(localStorage.getItem('residentes_data') || '[]');
    const residentesActualizados = editando 
      ? todosResidentes.map(r => r.id === editando.id ? nuevoResidente : r)
      : [...todosResidentes, nuevoResidente];

    localStorage.setItem('residentes_data', JSON.stringify(residentesActualizados));
    setFormularioActivo(false);
    onRecargarDatos();
  };

  const eliminarResidente = (residente) => {
    if (!confirm(`¿Estás seguro de eliminar el residente "${residente.nombre} ${residente.apellidos}"?`)) return;
    const motivo = prompt('¿Por qué motivo se elimina este residente?', '');
    if (!motivo) return;
    if (!confirm(`ATENCIÓN: Se eliminará el residente por: "${motivo}". ¿Confirmas?`)) return;
    
    const todosResidentes = JSON.parse(localStorage.getItem('residentes_data') || '[]');
    const residentesActualizados = todosResidentes.filter(r => r.id !== residente.id);
    localStorage.setItem('residentes_data', JSON.stringify(residentesActualizados));
    onRecargarDatos();
  };

  const mostrarFicha = (residente) => {
    const residencia = residencias.find(r => r.id == residente.residencia_id);
    setFichaVisible({ ...residente, residenciaInfo: residencia });
  };

  if (formularioActivo) {
    const campoActual = campos[paso];
    return (
      <div style={{ backgroundColor: '#28a745', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '60px 40px', borderRadius: '10px', maxWidth: '600px', width: '90%' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {editando ? 'Editando' : 'Creando'} residente • {paso + 1} de {campos.length}
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }}>
              <div style={{ width: `${((paso + 1) / campos.length) * 100}%`, height: '100%', backgroundColor: '#28a745', borderRadius: '2px' }}></div>
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
            ) : campoActual.tipo === 'select_dependencia' ? (
              <select 
                value={datos[campoActual.campo] || ''} 
                onChange={(e) => setDatos({...datos, [campoActual.campo]: e.target.value})} 
                style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
              >
                <option value="">Seleccionar grado...</option>
                <option value="I">Grado I</option>
                <option value="II">Grado II</option>
                <option value="III">Grado III</option>
              </select>
            ) : campoActual.tipo === 'select_parentesco' ? (
              <select 
                value={datos[campoActual.campo] || ''} 
                onChange={(e) => setDatos({...datos, [campoActual.campo]: e.target.value})} 
                style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
              >
                <option value="">Seleccionar parentesco...</option>
                <option value="Hijo/a">Hijo/a</option>
                <option value="Cónyuge">Cónyuge</option>
                <option value="Hermano/a">Hermano/a</option>
                <option value="Nieto/a">Nieto/a</option>
                <option value="Otro">Otro</option>
              </select>
            ) : campoActual.tipo === 'textarea' ? (
              <textarea 
                value={datos[campoActual.campo] || ''} 
                onChange={(e) => setDatos({...datos, [campoActual.campo]: e.target.value})} 
                style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px', minHeight: '120px' }} 
              />
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
                  guardarResidente();
                }
              }} 
              disabled={campoActual.req && !datos[campoActual.campo]} 
              style={{ padding: '15px 30px', backgroundColor: (campoActual.req && !datos[campoActual.campo]) ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}
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
            <p><strong>Fecha Nacimiento:</strong> {new Date(fichaVisible.fecha_nacimiento).toLocaleDateString()}</p>
            <p><strong>Edad:</strong> {fichaVisible.edad} años</p>
            <p><strong>Nº Historia:</strong> {fichaVisible.numero_historia}</p>
            <p><strong>Fecha Ingreso:</strong> {new Date(fichaVisible.fecha_ingreso).toLocaleDateString()}</p>
            <p><strong>Grado Dependencia:</strong> {fichaVisible.grado_dependencia}</p>
            <p><strong>Alergias:</strong> {fichaVisible.alergias || 'Ninguna'}</p>
            <p><strong>Medicación:</strong> {fichaVisible.medicacion_habitual || 'Ninguna'}</p>
            <p><strong>Contacto Emergencia:</strong> {fichaVisible.contacto_emergencia}</p>
            <p><strong>Teléfono Emergencia:</strong> {fichaVisible.telefono_emergencia}</p>
            <p><strong>Parentesco:</strong> {fichaVisible.parentesco}</p>
            <p><strong>Estado Salud:</strong> {fichaVisible.estado_salud || 'No especificado'}</p>
            <p><strong>Observaciones:</strong> {fichaVisible.observaciones || 'Ninguna'}</p>
            <p><strong>Residencia:</strong> {fichaVisible.residenciaInfo?.nombre || 'Sin asignar'}</p>
            {fichaVisible.fecha_modificacion && <p><strong>Última modificación:</strong> {new Date(fichaVisible.fecha_modificacion).toLocaleString()}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Residentes ({residentes.length})</h2>
      <button
        onClick={() => iniciarFormulario()}
        style={{
          padding: "12px 24px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        + Agregar Residente
      </button>

      <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
        {residentes.map((residente: any, index: number) => (
          <div
            key={residente.id}
            style={{
              padding: "20px",
              borderBottom: index < residentes.length - 1 ? "1px solid #e9ecef" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>
                  {residente.nombre} {residente.apellidos}
                </h3>
                <p style={{ margin: 0, color: "#666" }}>
                  DNI: {residente.dni} • Historia: {residente.numero_historia} • Grado {residente.grado_dependencia}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => mostrarFicha(residente)}
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
                  onClick={() => iniciarFormulario(residente)}
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
                  onClick={() => eliminarResidente(residente)}
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
        {residentes.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            <p style={{ fontSize: 18, margin: 0 }}>No hay residentes registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
