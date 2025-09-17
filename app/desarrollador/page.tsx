"use client"
import React, { useState, useEffect } from 'react';

const PanelDesarrollador = () => {
  const [directores, setDirectores] = useState([]);
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [datosFormulario, setDatosFormulario] = useState({});
  const [directorSeleccionado, setDirectorSeleccionado] = useState(null);
  const [totalResidencias, setTotalResidencias] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    cargarDirectores();
    cargarEstadisticas();
  }, []);

  const cargarDirectores = () => {
    if (typeof window !== 'undefined') {
      const directoresData = JSON.parse(localStorage.getItem('directores_sistema') || '[]');
      setDirectores(directoresData);
    }
  };

  const cargarEstadisticas = () => {
    if (typeof window !== 'undefined') {
      const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
      setTotalResidencias(residencias.length);
    }
  };

  const formularioDirector = [
    { campo: 'nombre', label: '¿Nombre del director?', tipo: 'text', req: true },
    { campo: 'apellidos', label: '¿Apellidos completos?', tipo: 'text', req: true },
    { campo: 'dni', label: '¿DNI del director?', tipo: 'text', placeholder: '12345678A', req: true },
    { campo: 'email', label: '¿Email corporativo?', tipo: 'email', req: true },
    { campo: 'telefono', label: '¿Teléfono de contacto?', tipo: 'tel', req: true },
    { campo: 'fecha_nacimiento', label: '¿Fecha de nacimiento?', tipo: 'date', req: true },
    { campo: 'direccion', label: '¿Dirección personal?', tipo: 'text', req: true },
    { campo: 'ciudad', label: '¿Ciudad de residencia?', tipo: 'text', req: true },
    { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
    { campo: 'titulo_profesional', label: '¿Título profesional?', tipo: 'text', placeholder: 'Ej: Licenciado en Medicina', req: true },
    { campo: 'experiencia', label: '¿Años de experiencia en gestión de residencias?', tipo: 'number', min: '0', req: true },
    { campo: 'contrasena', label: '¿Contraseña temporal para acceso?', tipo: 'password', req: true },
    { campo: 'confirmar_contrasena', label: '¿Confirmar contraseña?', tipo: 'password', req: true }
  ];

  const siguientePaso = () => {
    const campoActual = formularioDirector[pasoActual];
    
    // Validación especial para confirmar contraseña
    if (campoActual.campo === 'confirmar_contrasena') {
      if (datosFormulario.contrasena !== datosFormulario.confirmar_contrasena) {
        alert('Las contraseñas no coinciden');
        return;
      }
    }

    if (pasoActual < formularioDirector.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      guardarDirector();
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  const guardarDirector = () => {
    const nuevoDirector = {
      id: Date.now(),
      ...datosFormulario,
      fecha_creacion: new Date().toISOString(),
      estado: 'activo',
      residencias_asignadas: [],
      ultimo_acceso: null
    };

    // Eliminar confirmación de contraseña del objeto final
    delete nuevoDirector.confirmar_contrasena;

    const directoresActualizados = [...directores, nuevoDirector];
    setDirectores(directoresActualizados);
    localStorage.setItem('directores_sistema', JSON.stringify(directoresActualizados));

    setFormularioActivo(false);
    setPasoActual(0);
    setDatosFormulario({});
    
    alert(`Director ${nuevoDirector.nombre} ${nuevoDirector.apellidos} creado correctamente.\nEmail: ${nuevoDirector.email}\nContraseña temporal asignada.`);
  };

  const eliminarDirector = (id) => {
    if (confirm('¿Estás seguro de eliminar este director? Se eliminarán también todas sus residencias y datos asociados.')) {
      const directoresActualizados = directores.filter(d => d.id !== id);
      setDirectores(directoresActualizados);
      localStorage.setItem('directores_sistema', JSON.stringify(directoresActualizados));
      
      // También eliminar sus residencias y datos asociados
      eliminarDatosDirector(id);
      cargarEstadisticas(); // Recargar estadísticas
    }
  };

  const eliminarDatosDirector = (directorId) => {
    if (typeof window !== 'undefined') {
      // Eliminar residencias del director
      const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
      const residenciasFiltradas = residencias.filter(r => r.director_id !== directorId);
      localStorage.setItem('residencias_sistema', JSON.stringify(residenciasFiltradas));

      // Eliminar personal del director
      const personal = JSON.parse(localStorage.getItem('personal_data') || '[]');
      const personalFiltrado = personal.filter(p => p.director_id !== directorId);
      localStorage.setItem('personal_data', JSON.stringify(personalFiltrado));

      // Eliminar residentes del director
      const residentes = JSON.parse(localStorage.getItem('residentes_data') || '[]');
      const residentesFiltrados = residentes.filter(r => r.director_id !== directorId);
      localStorage.setItem('residentes_data', JSON.stringify(residentesFiltrados));
    }
  };

  const resetearContrasena = (director) => {
    const nuevaContrasena = prompt(`Ingresa la nueva contraseña para ${director.nombre} ${director.apellidos}:`);
    if (nuevaContrasena && nuevaContrasena.length >= 6) {
      const directoresActualizados = directores.map(d => 
        d.id === director.id ? { ...d, contrasena: nuevaContrasena } : d
      );
      setDirectores(directoresActualizados);
      localStorage.setItem('directores_sistema', JSON.stringify(directoresActualizados));
      alert('Contraseña actualizada correctamente');
    } else if (nuevaContrasena) {
      alert('La contraseña debe tener al menos 6 caracteres');
    }
  };

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return (
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Cargando...</div>
      </div>
    );
  }

  // Formulario tipo typeform
  if (formularioActivo) {
    const campoActual = formularioDirector[pasoActual];
    
    return (
      <div style={{ 
        backgroundColor: '#2c3e50', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '60px 40px', 
          borderRadius: '10px', 
          maxWidth: '600px', 
          width: '90%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {pasoActual + 1} de {formularioDirector.length}
            </div>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '2px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                width: `${((pasoActual + 1) / formularioDirector.length) * 100}%`, 
                height: '100%', 
                backgroundColor: '#2c3e50',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '30px', lineHeight: '1.3' }}>
            {campoActual.label}
            {campoActual.req && <span style={{ color: '#e74c3c' }}> *</span>}
          </h2>

          <div style={{ marginBottom: '40px' }}>
            <input 
              type={campoActual.tipo}
              value={datosFormulario[campoActual.campo] || ''}
              onChange={(e) => setDatosFormulario({...datosFormulario, [campoActual.campo]: e.target.value})}
              placeholder={campoActual.placeholder || ''}
              min={campoActual.min || ''}
              style={{ 
                width: '100%', 
                padding: '15px', 
                fontSize: '18px', 
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
            {pasoActual > 0 ? (
              <button 
                onClick={pasoAnterior}
                style={{ 
                  padding: '15px 30px', 
                  fontSize: '16px', 
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Anterior
              </button>
            ) : (
              <button 
                onClick={() => setFormularioActivo(false)}
                style={{ 
                  padding: '15px 30px', 
                  fontSize: '16px', 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            )}
            
            <button 
              onClick={siguientePaso}
              disabled={campoActual.req && !datosFormulario[campoActual.campo]}
              style={{ 
                padding: '15px 30px', 
                fontSize: '16px', 
                backgroundColor: (campoActual.req && !datosFormulario[campoActual.campo]) ? '#ccc' : '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (campoActual.req && !datosFormulario[campoActual.campo]) ? 'not-allowed' : 'pointer'
              }}
            >
              {pasoActual === formularioDirector.length - 1 ? 'Crear Director' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Panel de Desarrollador</h1>
          <p style={{ margin: '0', opacity: 0.8 }}>Gestión de directores del sistema</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 10px 0' }}>Total Directores</h3>
            <p style={{ fontSize: '32px', color: '#2c3e50', margin: '0', fontWeight: 'bold' }}>{directores.length}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 10px 0' }}>Directores Activos</h3>
            <p style={{ fontSize: '32px', color: '#28a745', margin: '0', fontWeight: 'bold' }}>
              {directores.filter(d => d.estado === 'activo').length}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 10px 0' }}>Total Residencias</h3>
            <p style={{ fontSize: '32px', color: '#007bff', margin: '0', fontWeight: 'bold' }}>
              {totalResidencias}
            </p>
          </div>
        </div>

        {/* Gestión de Directores */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', margin: '0' }}>Gestión de Directores</h2>
            <button 
              onClick={() => setFormularioActivo(true)}
              style={{ 
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              + Crear Director
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            {directores.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <p style={{ fontSize: '18px', margin: '0' }}>No hay directores registrados</p>
                <p style={{ fontSize: '14px', margin: '10px 0 0 0' }}>Crea el primer director para comenzar</p>
              </div>
            ) : (
              directores.map((director, index) => (
                <div 
                  key={director.id} 
                  style={{ 
                    padding: '20px',
                    borderBottom: index < directores.length - 1 ? '1px solid #e9ecef' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setDirectorSeleccionado(directorSeleccionado === director.id ? null : director.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 5px 0' }}>
                        {director.nombre} {director.apellidos}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                        {director.email} • DNI: {director.dni} • {director.experiencia} años experiencia
                      </p>
                      <p style={{ fontSize: '12px', color: '#28a745', margin: '5px 0 0 0' }}>
                        Estado: {director.estado} • Creado: {new Date(director.fecha_creacion).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div style={{ fontSize: '18px', color: '#333' }}>
                      {directorSeleccionado === director.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {directorSeleccionado === director.id && (
                    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 15px 0' }}>Información Completa</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div><strong>Teléfono:</strong> {director.telefono}</div>
                        <div><strong>Ciudad:</strong> {director.ciudad}</div>
                        <div><strong>Código Postal:</strong> {director.codigo_postal}</div>
                        <div><strong>Título:</strong> {director.titulo_profesional}</div>
                        <div><strong>Dirección:</strong> {director.direccion}</div>
                        <div><strong>Residencias:</strong> {director.residencias_asignadas.length}</div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetearContrasena(director); }}
                          style={{ 
                            padding: '8px 16px',
                            fontSize: '14px',
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Resetear Contraseña
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); eliminarDirector(director.id); }}
                          style={{ 
                            padding: '8px 16px',
                            fontSize: '14px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar Director
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelDesarrollador;
