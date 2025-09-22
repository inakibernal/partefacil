"use client";
import React from "react";

interface FichaModalProps {
  elemento: any;
  tipo: 'director' | 'residencia' | 'trabajador' | 'residente';
  onCerrar: () => void;
}

export default function FichaModal({ elemento, tipo, onCerrar }: FichaModalProps) {
  if (!elemento) return null;

  const estilos = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90%',
      overflow: 'auto',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    },
    header: {
      padding: '25px',
      borderRadius: '12px 12px 0 0',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    content: {
      padding: '30px'
    },
    section: {
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '15px',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
      fontSize: '14px'
    },
    field: {
      marginBottom: '10px'
    },
    label: {
      fontWeight: 'bold',
      color: '#495057'
    },
    value: {
      color: '#666',
      marginTop: '2px'
    }
  };

  const getHeaderColor = () => {
    switch (tipo) {
      case 'director': return '#dc3545';
      case 'residencia': return '#007bff';
      case 'trabajador': return '#28a745';
      case 'residente': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getIcon = () => {
    switch (tipo) {
      case 'director': return '👔';
      case 'residencia': return '🏢';
      case 'trabajador': return '👨‍⚕️';
      case 'residente': return '👤';
      default: return '📋';
    }
  };

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return 'No especificada';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  const renderField = (label: string, value: any, formatter?: (val: any) => string) => {
    if (value === undefined || value === null || value === '') return null;
    
    const displayValue = formatter ? formatter(value) : value;
    
    return (
      <div style={estilos.field}>
        <div style={estilos.label}>{label}:</div>
        <div style={estilos.value}>{displayValue}</div>
      </div>
    );
  };

  const renderDirector = () => (
    <>
      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>📋 Datos Personales</h3>
        <div style={estilos.grid}>
          {renderField('Nombre completo', `${elemento.nombre} ${elemento.apellidos}`)}
          {renderField('DNI', elemento.dni)}
          {renderField('Email', elemento.email)}
          {renderField('Teléfono', elemento.telefono)}
          {renderField('Fecha de nacimiento', elemento.fecha_nacimiento, (fecha) => 
            `${new Date(fecha).toLocaleDateString('es-ES')} (${calcularEdad(fecha)})`
          )}
        </div>
      </div>
      
      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🏠 Datos de Residencia</h3>
        <div style={estilos.grid}>
          {renderField('Dirección', elemento.direccion)}
          {renderField('Población', elemento.poblacion)}
          {renderField('Provincia', elemento.provincia)}
          {renderField('Código postal', elemento.codigo_postal)}
          {renderField('Ciudad', elemento.ciudad)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>💼 Datos Profesionales</h3>
        <div style={estilos.grid}>
          {renderField('Titulación', elemento.titulacion)}
          {renderField('Experiencia', elemento.experiencia)}
          {renderField('Número de colegiado', elemento.numero_colegiado)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🔐 Datos del Sistema</h3>
        <div style={estilos.grid}>
          {renderField('ID del sistema', elemento.id)}
          {renderField('Fecha de creación', elemento.fecha_creacion, (fecha) => 
            new Date(fecha).toLocaleString('es-ES')
          )}
          {renderField('Última modificación', elemento.fecha_modificacion, (fecha) => 
            new Date(fecha).toLocaleString('es-ES')
          )}
        </div>
      </div>
    </>
  );

  const renderResidencia = () => (
    <>
      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🏢 Información Básica</h3>
        <div style={estilos.grid}>
          {renderField('Nombre', elemento.nombre)}
          {renderField('CIF', elemento.cif)}
          {renderField('Número de licencia', elemento.numero_licencia)}
          {renderField('Tipo de centro', elemento.tipo_centro)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>📍 Ubicación</h3>
        <div style={estilos.grid}>
          {renderField('Dirección', elemento.direccion)}
          {renderField('Población', elemento.poblacion)}
          {renderField('Provincia', elemento.provincia)}
          {renderField('Código postal', elemento.codigo_postal)}
          {renderField('Comunidad autónoma', elemento.comunidad_autonoma)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>📞 Contacto</h3>
        <div style={estilos.grid}>
          {renderField('Teléfono fijo', elemento.telefono_fijo)}
          {renderField('Teléfono móvil', elemento.telefono_movil)}
          {renderField('Email', elemento.email)}
          {renderField('Página web', elemento.web)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>👥 Capacidad</h3>
        <div style={estilos.grid}>
          {renderField('Total plazas', elemento.total_plazas)}
          {renderField('Plazas ocupadas', elemento.plazas_ocupadas)}
          {renderField('Plazas disponibles', elemento.total_plazas - elemento.plazas_ocupadas)}
          {renderField('Ocupación', `${Math.round((elemento.plazas_ocupadas / elemento.total_plazas) * 100)}%`)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🔐 Datos del Sistema</h3>
        <div style={estilos.grid}>
          {renderField('ID del sistema', elemento.id)}
          {renderField('ID del director', elemento.director_id)}
          {renderField('Fecha de creación', elemento.fecha_creacion, (fecha) => 
            new Date(fecha).toLocaleString('es-ES')
          )}
        </div>
      </div>
    </>
  );

  const renderTrabajador = () => (
    <>
      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>👨‍⚕️ Datos Personales</h3>
        <div style={estilos.grid}>
          {renderField('Nombre completo', `${elemento.nombre} ${elemento.apellidos}`)}
          {renderField('DNI', elemento.dni)}
          {renderField('Email', elemento.email)}
          {renderField('Teléfono', elemento.telefono)}
          {renderField('Fecha de nacimiento', elemento.fecha_nacimiento, (fecha) => 
            `${new Date(fecha).toLocaleDateString('es-ES')} (${calcularEdad(fecha)})`
          )}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🏠 Datos de Residencia</h3>
        <div style={estilos.grid}>
          {renderField('Dirección', elemento.direccion)}
          {renderField('Población', elemento.poblacion)}
          {renderField('Provincia', elemento.provincia)}
          {renderField('Código postal', elemento.codigo_postal)}
          {renderField('Ciudad', elemento.ciudad)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>💼 Datos Profesionales</h3>
        <div style={estilos.grid}>
          {renderField('Titulación', elemento.titulacion)}
          {renderField('Número de colegiado', elemento.numero_colegiado)}
          {renderField('Turno', elemento.turno)}
          {renderField('Fecha de inicio', elemento.fecha_inicio, (fecha) => 
            new Date(fecha).toLocaleDateString('es-ES')
          )}
          {renderField('Salario mensual', elemento.salario, (sal) => `${sal}€`)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🔐 Datos del Sistema</h3>
        <div style={estilos.grid}>
          {renderField('ID del sistema', elemento.id)}
          {renderField('ID residencia asignada', elemento.residencia_id)}
          {renderField('Fecha de creación', elemento.fecha_creacion, (fecha) => 
            new Date(fecha).toLocaleString('es-ES')
          )}
          {renderField('Última modificación', elemento.fecha_modificacion, (fecha) => 
            new Date(fecha).toLocaleString('es-ES')
          )}
        </div>
      </div>
    </>
  );

  const renderResidente = () => (
    <>
      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>👤 Datos Personales</h3>
        <div style={estilos.grid}>
          {renderField('Nombre completo', `${elemento.nombre} ${elemento.apellidos}`)}
          {renderField('DNI', elemento.dni)}
          {renderField('Fecha de nacimiento', elemento.fecha_nacimiento, (fecha) => 
            `${new Date(fecha).toLocaleDateString('es-ES')} (${calcularEdad(fecha)})`
          )}
          {renderField('Teléfono', elemento.telefono)}
          {renderField('Habitación', elemento.habitacion)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🏠 Datos de Residencia Anterior</h3>
        <div style={estilos.grid}>
          {renderField('Dirección', elemento.direccion)}
          {renderField('Población', elemento.poblacion)}
          {renderField('Código postal', elemento.codigo_postal)}
          {renderField('Ciudad', elemento.ciudad)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🏥 Datos Médicos</h3>
        <div style={estilos.grid}>
          {renderField('Grado de dependencia', elemento.grado_dependencia)}
          {renderField('Fecha de ingreso', elemento.fecha_ingreso, (fecha) => 
            new Date(fecha).toLocaleDateString('es-ES')
          )}
          {renderField('Observaciones médicas', elemento.observaciones_medicas)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>📞 Contacto de Emergencia</h3>
        <div style={estilos.grid}>
          {renderField('Nombre', elemento.contacto_emergencia_nombre)}
          {renderField('Teléfono', elemento.contacto_emergencia_telefono)}
          {renderField('Parentesco', elemento.contacto_emergencia_parentesco)}
        </div>
      </div>

      <div style={estilos.section}>
        <h3 style={estilos.sectionTitle}>🔐 Datos del Sistema</h3>
        <div style={estilos.grid}>
          {renderField('ID del sistema', elemento.id)}
          {renderField('ID residencia asignada', elemento.residencia_id)}
          {renderField('Fecha de creación', elemento.fecha_creacion, (fecha) => 
            new Date(fecha).toLocaleString('es-ES')
          )}
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (tipo) {
      case 'director': return renderDirector();
      case 'residencia': return renderResidencia();
      case 'trabajador': return renderTrabajador();
      case 'residente': return renderResidente();
      default: return <div>Tipo no reconocido</div>;
    }
  };

  return (
    <div style={estilos.overlay}>
      <div style={estilos.modal}>
        <div style={{ ...estilos.header, backgroundColor: getHeaderColor() }}>
          <div>
            <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>
              {getIcon()} {elemento.nombre} {elemento.apellidos}
            </h2>
            <p style={{ margin: '0', opacity: 0.9, fontSize: '16px' }}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </p>
          </div>
          <button 
            onClick={onCerrar}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={estilos.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
