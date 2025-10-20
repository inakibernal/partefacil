"use client";
import React, { useState } from "react";

type TipoElemento = "director" | "residencia" | "trabajador" | "residente" | "empresa";

interface FichaModalProps {
  elemento: any;
  tipo: TipoElemento;
  onCerrar: () => void;
  residenciasDelDirector?: any[]; // Nueva prop opcional
}

const colores = {
  director: '#2c3e50',
  residencia: '#007bff',
  trabajador: '#28a745',
  residente: '#6f42c1',
  empresa: '#17a2b8'
};

const calcularEdad = (fechaNacimiento: string) => {
  const today = new Date();
  const birthDate = new Date(fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export default function FichaModal({ elemento, tipo, onCerrar, residenciasDelDirector }: FichaModalProps) {
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
          {tipo === 'director' && <FichaDirector elemento={elemento} residencias={residenciasDelDirector || []} />}
          {tipo === 'trabajador' && <FichaTrabajador elemento={elemento} />}
          {tipo === 'residencia' && <FichaResidencia elemento={elemento} />}
          {tipo === 'residente' && <FichaResidente elemento={elemento} />}
          {tipo === 'empresa' && <FichaEmpresa elemento={elemento} />}
        </div>
      </div>
    </div>
  );
}

// Componentes específicos por tipo
function FichaDirector({ elemento, residencias }: { elemento: any; residencias: any[] }) {
  const [resetandoPassword, setResetandoPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');

  const resetearPassword = async () => {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!confirm(`¿Resetear la contraseña del director ${elemento.nombre} ${elemento.apellidos}?\n\nNueva contraseña: ${nuevaPassword}`)) {
      return;
    }

    try {
      const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
      
      const response = await fetch('https://pwryrzmniqjrhikspqoz.supabase.co/functions/v1/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          userId: sesion.usuarioId,
          rolEjecutor: sesion.rol || 'superadmin',
          targetUserId: elemento.id,
          nuevaPassword: nuevaPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Contraseña actualizada correctamente para ${elemento.nombre} ${elemento.apellidos}`);
        setResetandoPassword(false);
        setNuevaPassword('');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión al resetear contraseña');
    }
  };

  return (
    <>
      <Seccion titulo="👤 Información Personal">
        <Campo label="Nombre completo" valor={`${elemento.nombre} ${elemento.apellidos}`} span />
        <Campo label="DNI" valor={elemento.dni} />
        <Campo label="Email" valor={elemento.email} />
        <Campo label="Teléfono" valor={elemento.telefono} />
        <Campo label="Fecha nacimiento" valor={elemento.fecha_nacimiento ? new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES') : '-'} />
        <Campo label="Edad" valor={elemento.fecha_nacimiento ? `${calcularEdad(elemento.fecha_nacimiento)} años` : '-'} />
      </Seccion>
      
      <Seccion titulo="📍 Dirección">
        <Campo label="Dirección" valor={elemento.direccion || '-'} span />
        <Campo label="Ciudad" valor={elemento.ciudad || '-'} />
        <Campo label="Código postal" valor={elemento.codigo_postal || '-'} />
      </Seccion>

      <Seccion titulo="💼 Información Profesional">
        <Campo label="Título profesional" valor={elemento.titulo_profesional || '-'} />
        <Campo label="Años de experiencia" valor={elemento.experiencia || '-'} />
        <Campo label="Rol" valor={elemento.rol} />
      </Seccion>

      <Seccion titulo="🔐 Acceso al Sistema">
        <Campo label="ID de usuario" valor={elemento.id} span />
        <Campo label="Email de acceso" valor={elemento.email} />
        <div style={{ gridColumn: '1 / -1' }}>
          <strong style={{ display: 'block', fontSize: 13, color: '#666', marginBottom: 4 }}>Contraseña:</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, color: '#333' }}>🔒 [ENCRIPTADA - No visible]</span>
            <button
              onClick={() => setResetandoPassword(!resetandoPassword)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {resetandoPassword ? 'Cancelar' : '🔄 Resetear contraseña'}
            </button>
          </div>
          
          {resetandoPassword && (
            <div style={{ marginTop: 10, padding: 12, backgroundColor: '#fff3cd', borderRadius: 6 }}>
              <input
                type="text"
                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  marginBottom: 8,
                  border: '1px solid #ddd',
                  borderRadius: 4
                }}
              />
              <button
                onClick={resetearPassword}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Confirmar nuevo password
              </button>
            </div>
          )}
        </div>
        <Campo label="Fecha creación" valor={elemento.created_at ? new Date(elemento.created_at).toLocaleString('es-ES') : '-'} />
      </Seccion>

      {residencias && residencias.length > 0 && (
        <Seccion titulo="🏢 Residencias Asignadas">
          <div style={{ gridColumn: '1 / -1' }}>
            {residencias.map(res => (
              <div key={res.id} style={{ 
                padding: 12, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 6, 
                marginBottom: 8 
              }}>
                <strong>{res.nombre}</strong> - {res.poblacion}
              </div>
            ))}
          </div>
        </Seccion>
      )}
    </>
  );
}

function FichaTrabajador({ elemento }: { elemento: any }) {
  const [resetandoPassword, setResetandoPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');

  const turnos: Record<string, string> = {
    mañana: 'Mañana (07:00 - 15:00)',
    tarde: 'Tarde (15:00 - 23:00)',
    noche: 'Noche (23:00 - 07:00)',
    rotativo: 'Rotativo',
    partido: 'Partido',
    no_aplica: 'No aplica'
  };

  const resetearPassword = async () => {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!confirm(`¿Resetear la contraseña del trabajador ${elemento.nombre} ${elemento.apellidos}?\n\nNueva contraseña: ${nuevaPassword}`)) {
      return;
    }

    try {
      const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
      
      const response = await fetch('https://pwryrzmniqjrhikspqoz.supabase.co/functions/v1/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          userId: sesion.usuarioId,
          rolEjecutor: sesion.rol || 'superadmin',
          targetUserId: elemento.id,
          nuevaPassword: nuevaPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Contraseña actualizada correctamente para ${elemento.nombre} ${elemento.apellidos}`);
        setResetandoPassword(false);
        setNuevaPassword('');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión al resetear contraseña');
    }
  };

  return (
    <>
      <Seccion titulo="👤 Información Personal">
        <Campo label="Nombre completo" valor={`${elemento.nombre} ${elemento.apellidos}`} span />
        <Campo label="DNI" valor={elemento.dni} />
        <Campo label="Email" valor={elemento.email} />
        <Campo label="Teléfono" valor={elemento.telefono} />
        <Campo label="Fecha nacimiento" valor={elemento.fecha_nacimiento ? new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES') : '-'} />
        <Campo label="Edad" valor={elemento.fecha_nacimiento ? `${calcularEdad(elemento.fecha_nacimiento)} años` : '-'} />
      </Seccion>

      <Seccion titulo="📍 Dirección">
        <Campo label="Dirección" valor={elemento.direccion || '-'} span />
        <Campo label="Ciudad" valor={elemento.ciudad || '-'} />
        <Campo label="Código postal" valor={elemento.codigo_postal || '-'} />
      </Seccion>

      <Seccion titulo="💼 Información Laboral">
        <Campo label="Titulación" valor={elemento.titulacion || '-'} />
        <Campo label="Número colegiado" valor={elemento.numero_colegiado || 'No especificado'} />
        <Campo label="Turno" valor={elemento.turno ? (turnos[elemento.turno] || elemento.turno) : 'No especificado'} />
        <Campo label="Fecha inicio" valor={elemento.fecha_inicio ? new Date(elemento.fecha_inicio).toLocaleDateString('es-ES') : '-'} />
        <Campo label="Rol" valor={elemento.rol} />
      </Seccion>

      <Seccion titulo="🔐 Acceso al Sistema">
        <Campo label="ID de usuario" valor={elemento.id} span />
        <Campo label="Email de acceso" valor={elemento.email} />
        <div style={{ gridColumn: '1 / -1' }}>
          <strong style={{ display: 'block', fontSize: 13, color: '#666', marginBottom: 4 }}>Contraseña:</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, color: '#333' }}>🔒 [ENCRIPTADA - No visible]</span>
            <button
              onClick={() => setResetandoPassword(!resetandoPassword)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              {resetandoPassword ? 'Cancelar' : '🔄 Resetear contraseña'}
            </button>
          </div>
          
          {resetandoPassword && (
            <div style={{ marginTop: 10, padding: 12, backgroundColor: '#fff3cd', borderRadius: 6 }}>
              <input
                type="text"
                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  marginBottom: 8,
                  border: '1px solid #ddd',
                  borderRadius: 4
                }}
              />
              <button
                onClick={resetearPassword}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Confirmar nuevo password
              </button>
            </div>
          )}
        </div>
        <Campo label="Fecha creación" valor={elemento.created_at ? new Date(elemento.created_at).toLocaleString('es-ES') : '-'} />
      </Seccion>
    </>
  );
}

function FichaResidencia({ elemento }: { elemento: any }) {
  return (
    <>
      <Seccion titulo="ℹ️ Información General">
        <Campo label="Nombre" valor={elemento.nombre} span />
        <Campo label="CIF" valor={elemento.cif} />
        <Campo label="Número licencia" valor={elemento.numero_licencia} />
        <Campo label="Email" valor={elemento.email} />
        <Campo label="Estado" valor={elemento.estado || 'activa'} />
      </Seccion>

      <Seccion titulo="📍 Ubicación">
        <Campo label="Dirección" valor={elemento.direccion} span />
        <Campo label="Población" valor={elemento.poblacion} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      <Seccion titulo="📞 Contacto">
        <Campo label="Teléfono fijo" valor={elemento.telefono_fijo} />
        <Campo label="Teléfono móvil" valor={elemento.telefono_movil || 'No especificado'} />
      </Seccion>

      <Seccion titulo="🏨 Capacidad">
        <Campo label="Total plazas" valor={elemento.total_plazas} />
        <Campo label="Plazas ocupadas" valor={elemento.plazas_ocupadas} />
        <Campo label="Plazas disponibles" valor={elemento.total_plazas - elemento.plazas_ocupadas} />
        <Campo label="Ocupación" valor={`${Math.round((elemento.plazas_ocupadas / elemento.total_plazas) * 100)}%`} />
      </Seccion>

      <Seccion titulo="🏢 Gestión">
        <Campo label="ID Director" valor={elemento.director_id} />
        <Campo label="ID Empresa" valor={elemento.empresa_id || 'No asignada'} />
        <Campo label="ID Empresa Facturación" valor={elemento.empresa_facturacion_id || 'No asignada'} />
        <Campo label="Fecha creación" valor={elemento.created_at ? new Date(elemento.created_at).toLocaleString('es-ES') : '-'} />
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
      <Seccion titulo="👤 Información Personal">
        <Campo label="Nombre completo" valor={`${elemento.nombre} ${elemento.apellidos}`} span />
        <Campo label="DNI" valor={elemento.dni} />
        <Campo label="Teléfono" valor={elemento.telefono || 'No disponible'} />
        <Campo label="Fecha nacimiento" valor={new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES')} />
        <Campo label="Edad" valor={`${calcularEdad(elemento.fecha_nacimiento)} años`} />
      </Seccion>

      <Seccion titulo="📍 Dirección de Origen">
        <Campo label="Dirección anterior" valor={elemento.direccion} span />
        <Campo label="Ciudad" valor={elemento.ciudad} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      <Seccion titulo="🏥 Información de Dependencia">
        <Campo label="Grado" valor={grados[elemento.grado_dependencia] || elemento.grado_dependencia} span />
        <Campo label="Fecha ingreso" valor={new Date(elemento.fecha_ingreso).toLocaleDateString('es-ES')} />
        <Campo label="Días en residencia" valor={Math.floor((new Date().getTime() - new Date(elemento.fecha_ingreso).getTime()) / (1000 * 60 * 60 * 24))} />
        <Campo label="Estado" valor={elemento.estado || 'activo'} />
      </Seccion>

      {elemento.contacto_emergencia_nombre && (
        <Seccion titulo="📞 Contacto de Emergencia">
          <Campo label="Nombre" valor={elemento.contacto_emergencia_nombre} />
          <Campo label="Teléfono" valor={elemento.contacto_emergencia_telefono} />
          <Campo label="Parentesco" valor={elemento.contacto_emergencia_parentesco} />
        </Seccion>
      )}

      {elemento.observaciones_medicas && (
        <div style={{ marginTop: 16, padding: 12, background: '#fff3cd', borderRadius: 8, border: '1px solid #ffc107' }}>
          <strong style={{ display: 'block', marginBottom: 8, color: '#856404' }}>📋 Observaciones Médicas:</strong>
          <p style={{ margin: 0, color: '#856404' }}>{elemento.observaciones_medicas}</p>
        </div>
      )}

      <Seccion titulo="ℹ️ Información del Sistema">
        <Campo label="ID Residente" valor={elemento.id} span />
        <Campo label="ID Residencia" valor={elemento.residencia_id} />
        <Campo label="Fecha creación" valor={elemento.created_at ? new Date(elemento.created_at).toLocaleString('es-ES') : '-'} />
        <Campo label="Creado por" valor={elemento.creado_por || 'Sistema'} />
      </Seccion>
    </>
  );
}

function FichaEmpresa({ elemento }: { elemento: any }) {
  const formasPago: Record<string, string> = {
    transferencia: 'Transferencia bancaria',
    domiciliacion: 'Domiciliación bancaria',
    tarjeta: 'Tarjeta de crédito',
    efectivo: 'Efectivo'
  };

  return (
    <>
      <Seccion titulo="🏢 Información de la Empresa">
        <Campo label="Nombre" valor={elemento.nombre} span />
        <Campo label="CIF" valor={elemento.cif} />
        <Campo label="Email facturación" valor={elemento.email_facturacion} />
        <Campo label="Teléfono" valor={elemento.telefono} />
        <Campo label="Estado" valor={elemento.estado || 'activa'} />
      </Seccion>

      <Seccion titulo="📍 Dirección Fiscal">
        <Campo label="Dirección" valor={elemento.direccion} span />
        <Campo label="Ciudad" valor={elemento.ciudad} />
        <Campo label="Código postal" valor={elemento.codigo_postal} />
      </Seccion>

      {(elemento.contacto_nombre || elemento.contacto_telefono) && (
        <Seccion titulo="👤 Persona de Contacto">
          <Campo label="Nombre" valor={elemento.contacto_nombre || '-'} />
          <Campo label="Teléfono" valor={elemento.contacto_telefono || '-'} />
        </Seccion>
      )}

      <Seccion titulo="💰 Información de Facturación">
        <Campo label="Forma de pago" valor={formasPago[elemento.forma_pago] || elemento.forma_pago || 'Transferencia bancaria'} />
        <Campo label="Días vencimiento" valor={`${elemento.dias_vencimiento || '30'} días`} />
        {elemento.dia_facturacion && <Campo label="Día facturación mensual" valor={`Día ${elemento.dia_facturacion}`} />}
        {elemento.descuento_porcentaje > 0 && <Campo label="Descuento aplicado" valor={`${elemento.descuento_porcentaje}%`} />}
        {elemento.iban && <Campo label="IBAN" valor={elemento.iban} span />}
      </Seccion>

      {elemento.notas && (
        <div style={{ marginTop: 16, padding: 12, background: '#f8f9fa', borderRadius: 8 }}>
          <strong style={{ display: 'block', marginBottom: 8 }}>📋 Notas:</strong>
          <p style={{ margin: 0, color: '#666' }}>{elemento.notas}</p>
        </div>
      )}

      <Seccion titulo="ℹ️ Información del Sistema">
        <Campo label="ID Empresa" valor={elemento.id} span />
        <Campo label="Fecha creación" valor={elemento.created_at ? new Date(elemento.created_at).toLocaleString('es-ES') : '-'} />
        <Campo label="Creado por" valor={elemento.creado_por || 'Sistema'} />
      </Seccion>
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
