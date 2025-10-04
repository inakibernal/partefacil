"use client";
import React from "react";

type TipoElemento = "director" | "residencia" | "trabajador" | "residente";

interface FichaModalProps {
  elemento: any;
  tipo: TipoElemento;
  onCerrar: () => void;
}

const colores = {
  director: '#2c3e50',
  residencia: '#007bff',
  trabajador: '#28a745',
  residente: '#6f42c1'
};

const calcularEdad = (fechaNacimiento: string) => {
  const today = new Date();
  const birthDate = new Date(fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export default function FichaModal({ elemento, tipo, onCerrar }: FichaModalProps) {
console.log('Elemento recibido:', elemento);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
    }}>
      <div style={{
        width: 'min(900px, 96vw)', background: '#fff', borderRadius: 12,
        overflow: 'auto', maxHeight: '90vh', boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{
          background: colores[tipo], color: 'white', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>{elemento.nombre} {elemento.apellidos || ''}</h2>
            <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: 14 }}>Ficha de {tipo}</p>
          </div>
          <button onClick={onCerrar} style={{
            background: '#dc3545', color: 'white', border: 'none',
            borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 16
          }}>✕ Cerrar</button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {tipo === 'director' && <FichaDirector elemento={elemento} />}
          {tipo === 'trabajador' && <FichaTrabajador elemento={elemento} />}
          {tipo === 'residencia' && <FichaResidencia elemento={elemento} />}
          {tipo === 'residente' && <FichaResidente elemento={elemento} />}
        </div>
      </div>
    </div>
  );
}

// Componentes específicos por tipo
function FichaDirector({ elemento }: { elemento: any }) {
  return (
    <>
      <Seccion titulo="Información Personal">
        <Campo label="DNI" valor={elemento.dni} />
        <Campo label="Email" valor={elemento.email} />
        <Campo label="Teléfono" valor={elemento.telefono} />
        <Campo label="Fecha nacimiento" valor={elemento.fecha_nacimiento ? new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES') : '-'} />
        <Campo label="Edad" valor={elemento.fecha_nacimiento ? `${calcularEdad(elemento.fecha_nacimiento)} años` : '-'} />
      </Seccion>
      
      <Seccion titulo="Dirección">
        <Campo label="Dirección" valor={elemento.direccion} span />
        <Campo label="Ciudad" valor={elemento.ciudad} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      <Seccion titulo="Información Profesional">
        <Campo label="Título profesional" valor={elemento.titulo_profesional} />
        <Campo label="Años de experiencia" valor={elemento.experiencia} />
      </Seccion>
    </>
  );
}

function FichaTrabajador({ elemento }: { elemento: any }) {
  const turnos: Record<string, string> = {
    mañana: 'Mañana (07:00 - 15:00)',
    tarde: 'Tarde (15:00 - 23:00)',
    noche: 'Noche (23:00 - 07:00)',
    rotativo: 'Rotativo',
    partido: 'Partido',
    no_aplica: 'No aplica'
  };

  return (
    <>
      <Seccion titulo="Información Personal">
        <Campo label="DNI" valor={elemento.dni} />
        <Campo label="Email" valor={elemento.email} />
        <Campo label="Teléfono" valor={elemento.telefono} />
        <Campo label="Fecha nacimiento" valor={elemento.fecha_nacimiento ? new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES') : '-'} />
        <Campo label="Edad" valor={elemento.fecha_nacimiento ? `${calcularEdad(elemento.fecha_nacimiento)} años` : '-'} />
      </Seccion>

      <Seccion titulo="Dirección">
        <Campo label="Dirección" valor={elemento.direccion} span />
        <Campo label="Ciudad" valor={elemento.ciudad} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      <Seccion titulo="Información Laboral">
        <Campo label="Titulación" valor={elemento.titulacion} />
        <Campo label="Número colegiado" valor={elemento.numero_colegiado || 'No especificado'} />
        <Campo label="Turno" valor={turnos[elemento.turno] || elemento.turno} />
        <Campo label="Fecha inicio" valor={elemento.fecha_inicio ? new Date(elemento.fecha_inicio).toLocaleDateString('es-ES') : '-'} />
      </Seccion>
    </>
  );
}

function FichaResidencia({ elemento }: { elemento: any }) {
  return (
    <>
      <Seccion titulo="Información General">
        <Campo label="CIF" valor={elemento.cif} />
        <Campo label="Número licencia" valor={elemento.numero_licencia} />
        <Campo label="Email" valor={elemento.email} />
      </Seccion>

      <Seccion titulo="Ubicación">
        <Campo label="Dirección" valor={elemento.direccion} span />
        <Campo label="Población" valor={elemento.poblacion} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      <Seccion titulo="Contacto">
        <Campo label="Teléfono fijo" valor={elemento.telefono_fijo} />
        <Campo label="Teléfono móvil" valor={elemento.telefono_movil || 'No especificado'} />
      </Seccion>

      <Seccion titulo="Capacidad">
        <Campo label="Total plazas" valor={elemento.total_plazas} />
        <Campo label="Plazas ocupadas" valor={elemento.plazas_ocupadas} />
        <Campo label="Plazas disponibles" valor={elemento.total_plazas - elemento.plazas_ocupadas} />
        <Campo label="Ocupación" valor={`${Math.round((elemento.plazas_ocupadas / elemento.total_plazas) * 100)}%`} />
      </Seccion>
    </>
  );
}

function FichaResidente({ elemento }: { elemento: any }) {
  const grados: Record<string, string> = {
    grado_i: 'Grado I - Dependencia moderada',
    grado_ii: 'Grado II - Dependencia severa',
    grado_iii: 'Grado III - Gran dependencia',
    sin_dependencia: 'Sin dependencia reconocida'
  };

  return (
    <>
      <Seccion titulo="Información Personal">
        <Campo label="DNI" valor={elemento.dni} />
        <Campo label="Teléfono" valor={elemento.telefono || 'No disponible'} />
        <Campo label="Fecha nacimiento" valor={new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES')} />
        <Campo label="Edad" valor={`${calcularEdad(elemento.fecha_nacimiento)} años`} />
      </Seccion>

      <Seccion titulo="Dirección de Origen">
        <Campo label="Dirección anterior" valor={elemento.direccion} span />
        <Campo label="Ciudad" valor={elemento.ciudad} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      <Seccion titulo="Información de Dependencia">
        <Campo label="Grado" valor={grados[elemento.grado_dependencia] || elemento.grado_dependencia} span />
        <Campo label="Fecha ingreso" valor={new Date(elemento.fecha_ingreso).toLocaleDateString('es-ES')} />
        <Campo label="Días en residencia" valor={Math.floor((new Date().getTime() - new Date(elemento.fecha_ingreso).getTime()) / (1000 * 60 * 60 * 24))} />
      </Seccion>

      {elemento.contacto_emergencia_nombre && (
        <Seccion titulo="Contacto de Emergencia">
          <Campo label="Nombre" valor={elemento.contacto_emergencia_nombre} />
          <Campo label="Teléfono" valor={elemento.contacto_emergencia_telefono} />
          <Campo label="Parentesco" valor={elemento.contacto_emergencia_parentesco} />
        </Seccion>
      )}

      {elemento.observaciones_medicas && (
        <div style={{ marginTop: 16, padding: 12, background: '#fff3cd', borderRadius: 8, border: '1px solid #ffc107' }}>
          <strong style={{ display: 'block', marginBottom: 8, color: '#856404' }}>Observaciones Médicas:</strong>
          <p style={{ margin: 0, color: '#856404' }}>{elemento.observaciones_medicas}</p>
        </div>
      )}
    </>
  );
}

// Componentes auxiliares
function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, color: '#333', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #e9ecef' }}>
        {titulo}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Campo({ label, valor, span }: { label: string; valor: any; span?: boolean }) {
  return (
    <div style={span ? { gridColumn: '1 / -1' } : {}}>
      <strong style={{ display: 'block', fontSize: 13, color: '#666', marginBottom: 4 }}>{label}:</strong>
      <span style={{ fontSize: 15, color: '#333' }}>{valor || '-'}</span>
    </div>
  );
}
