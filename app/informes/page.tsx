"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ResidenciasView from "../desarrollador/components/ResidenciasView";
import TrabajadoresView from "../desarrollador/components/TrabajadoresView";
import ResidentesView from "../desarrollador/components/ResidentesView";
import FichaModal from "../desarrollador/components/FichaModal";
import PartesView from "./components/PartesView";
import PapeleraView from '../desarrollador/components/PapeleraView';
import ImportExportView from './components/ImportExportView';

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
  const [formularioActivo, setFormularioActivo] = useState<string | false>(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [datosFormulario, setDatosFormulario] = useState<any>({});
  const [editandoElemento, setEditandoElemento] = useState<any>(null);
  const [empresasDisponibles, setEmpresasDisponibles] = useState<any[]>([]);

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
	const { data: empresasData } = await supabase.rpc('obtener_empresas_disponibles');
      setEmpresasDisponibles(empresasData || []);

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

// ============================================
  // FUNCIONES DE FORMULARIOS (copiado de desarrollador)
  // ============================================
  
  const formularios = {
    director: [
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
      { campo: 'empresas_asignadas', label: '¿Empresas asignadas?', tipo: 'select_empresas_multiple', req: false },
      { campo: 'contrasena', label: '¿Contraseña temporal para acceso?', tipo: 'password', req: true },
      { campo: 'confirmar_contrasena', label: '¿Confirmar contraseña?', tipo: 'password', req: true }
    ],
    residencia: [
      { campo: 'nombre', label: '¿Nombre de la residencia?', tipo: 'text', req: true },
      { campo: 'direccion', label: '¿Dirección completa?', tipo: 'text', req: true },
      { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
      { campo: 'poblacion', label: '¿Población?', tipo: 'text', req: true },
      { campo: 'telefono_fijo', label: '¿Teléfono fijo?', tipo: 'tel', req: true },
      { campo: 'telefono_movil', label: '¿Teléfono móvil?', tipo: 'tel', req: false },
      { campo: 'email', label: '¿Email de contacto?', tipo: 'email', req: true },
      { campo: 'total_plazas', label: '¿Total de plazas disponibles?', tipo: 'number', min: '1', req: true },
      { campo: 'plazas_ocupadas', label: '¿Plazas actualmente ocupadas?', tipo: 'number', min: '0', req: true },
      { campo: 'cif', label: '¿CIF de la residencia?', tipo: 'text', placeholder: 'A12345678', req: true },
      { campo: 'numero_licencia', label: '¿Número de licencia?', tipo: 'text', req: true },
      { campo: 'director_id', label: '¿Director responsable?', tipo: 'select_director', req: true },
      { campo: 'empresa_facturacion_id', label: '¿A qué empresa se facturará?', tipo: 'select_empresa', req: false }
    ],
    trabajador: [
      { campo: 'nombre', label: '¿Nombre del trabajador?', tipo: 'text', req: true },
      { campo: 'apellidos', label: '¿Apellidos completos?', tipo: 'text', req: true },
      { campo: 'dni', label: '¿DNI del trabajador?', tipo: 'text', placeholder: '12345678A', req: true },
      { campo: 'email', label: '¿Email de contacto?', tipo: 'email', req: true },
      { campo: 'telefono', label: '¿Teléfono móvil?', tipo: 'tel', req: true },
      { campo: 'fecha_nacimiento', label: '¿Fecha de nacimiento?', tipo: 'date', req: true },
      { campo: 'direccion', label: '¿Dirección personal?', tipo: 'text', req: true },
      { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
      { campo: 'ciudad', label: '¿Ciudad de residencia?', tipo: 'text', req: true },
      { campo: 'titulacion', label: '¿Titulación profesional?', tipo: 'text', placeholder: 'Ej: Auxiliar de Enfermería', req: true },
      { campo: 'numero_colegiado', label: '¿Número de colegiado? (opcional)', tipo: 'text', req: false },
      { campo: 'turno', label: '¿Turno de trabajo?', tipo: 'select_turno', req: false },
      { campo: 'residencia_id', label: '¿Residencia asignada?', tipo: 'select_residencia', req: true },
      { campo: 'fecha_inicio', label: '¿Fecha de inicio?', tipo: 'date', req: true },
      { campo: 'contrasena', label: '¿Contraseña temporal para acceso?', tipo: 'password', req: true },
      { campo: 'confirmar_contrasena', label: '¿Confirmar contraseña?', tipo: 'password', req: true }
    ],
    residente: [
      { campo: 'nombre', label: '¿Nombre del residente?', tipo: 'text', req: true },
      { campo: 'apellidos', label: '¿Apellidos completos?', tipo: 'text', req: true },
      { campo: 'dni', label: '¿DNI del residente?', tipo: 'text', placeholder: '12345678A', req: true },
      { campo: 'fecha_nacimiento', label: '¿Fecha de nacimiento?', tipo: 'date', req: true },
      { campo: 'telefono', label: '¿Teléfono de contacto?', tipo: 'tel', req: false },
      { campo: 'direccion', label: '¿Dirección anterior?', tipo: 'text', req: true },
      { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
      { campo: 'ciudad', label: '¿Ciudad de origen?', tipo: 'text', req: true },
      { campo: 'grado_dependencia', label: '¿Grado de dependencia?', tipo: 'select_dependencia', req: true },
      { campo: 'residencia_id', label: '¿Residencia asignada?', tipo: 'select_residencia', req: true },
      { campo: 'fecha_ingreso', label: '¿Fecha de ingreso?', tipo: 'date', req: true },
      { campo: 'contacto_emergencia_nombre', label: '¿Nombre del contacto de emergencia?', tipo: 'text', req: true },
      { campo: 'contacto_emergencia_telefono', label: '¿Teléfono del contacto de emergencia?', tipo: 'tel', req: true },
      { campo: 'contacto_emergencia_parentesco', label: '¿Parentesco del contacto?', tipo: 'text', placeholder: 'Ej: Hijo/a, Hermano/a', req: true },
      { campo: 'observaciones_medicas', label: '¿Observaciones médicas? (opcional)', tipo: 'textarea', req: false }
    ]
  };

  const iniciarFormulario = (tipo: string, elemento: any = null) => {
    setFormularioActivo(tipo);
    setPasoActual(0);
    
    if (elemento) {
      setEditandoElemento(elemento);
      setDatosFormulario({ ...elemento });
    } else {
      setEditandoElemento(null);
      // Pre-asignar director_id si está creando residencia
      if (tipo === 'residencia') {
        setDatosFormulario({ director_id: directorId });
      } else {
        setDatosFormulario({});
      }
    }
  };

  const siguientePaso = () => {
    const formulario = formularios[formularioActivo as keyof typeof formularios];
    const campoActual = formulario[pasoActual];
    
    // Validaciones específicas
    if (campoActual.campo === 'confirmar_contrasena') {
      if (datosFormulario.contrasena !== datosFormulario.confirmar_contrasena) {
        alert('Las contraseñas no coinciden');
        return;
      }
    }

    if (campoActual.campo === 'plazas_ocupadas') {
      const totalPlazas = parseInt(datosFormulario.total_plazas) || 0;
      const plazasOcupadas = parseInt(datosFormulario.plazas_ocupadas) || 0;
      if (plazasOcupadas > totalPlazas) {
        alert('Las plazas ocupadas no pueden ser mayores que el total de plazas');
        return;
      }
    }

    if (pasoActual < formulario.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      guardarFormulario();
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

const guardarFormulario = async () => {
    // ============================================
    // TRABAJADORES
    // ============================================
    if (formularioActivo === 'trabajador') {
      if (editandoElemento) {
        // EDITAR trabajador existente
        try {
          const { data, error } = await supabase.rpc('actualizar_usuario', {
            p_usuario_id: directorId,
            p_rol_ejecutor: 'director',
            p_id: editandoElemento.id,
            p_nombre: datosFormulario.nombre,
            p_apellidos: datosFormulario.apellidos,
            p_dni: datosFormulario.dni,
            p_telefono: datosFormulario.telefono || '',
            p_fecha_nacimiento: datosFormulario.fecha_nacimiento || null,
            p_direccion: datosFormulario.direccion || null,
            p_ciudad: datosFormulario.ciudad || null,
            p_codigo_postal: datosFormulario.codigo_postal || null,
            p_titulo_profesional: null,
            p_experiencia: null,
            p_titulacion: datosFormulario.titulacion || null,
            p_numero_colegiado: datosFormulario.numero_colegiado || null,
            p_turno: datosFormulario.turno || null,
            p_fecha_inicio: datosFormulario.fecha_inicio || null
          });

          if (error) throw error;
          if (data && !data.success) throw new Error(data.error);

          alert('✅ Trabajador actualizado correctamente');
        } catch (error: any) {
          alert(`❌ Error: ${error.message}`);
          return;
        }
      } else {
        // CREAR trabajador nuevo
        try {
          const password = datosFormulario.contrasena;
          const response = await fetch('https://pwryrzmniqjrhikspqoz.supabase.co/functions/v1/create-user', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` 
            },
            body: JSON.stringify({
              email: datosFormulario.email,
              password,
              nombre: datosFormulario.nombre,
              apellidos: datosFormulario.apellidos,
              dni: datosFormulario.dni,
              rol: 'trabajador',
              telefono: datosFormulario.telefono,
              fecha_nacimiento: datosFormulario.fecha_nacimiento,
              direccion: datosFormulario.direccion,
              codigo_postal: datosFormulario.codigo_postal,
              ciudad: datosFormulario.ciudad,
              titulacion: datosFormulario.titulacion,
              numero_colegiado: datosFormulario.numero_colegiado || null,
              turno: datosFormulario.turno || null,
              fecha_inicio: datosFormulario.fecha_inicio,
              residencia_id: datosFormulario.residencia_id
            })
          });
          const result = await response.json();
          if (!result.success) { 
            alert(`❌ Error: ${result.error}`); 
            return; 
          }
          alert('✅ Trabajador creado correctamente');
        } catch (error) { 
          alert('❌ Error de conexión'); 
          return;
        }
      }
      
      setFormularioActivo(false);
      setPasoActual(0);
      setDatosFormulario({});
      setEditandoElemento(null);
      directorId && cargarTodosDatos(directorId);
    }

    // ============================================
    // RESIDENTES
    // ============================================
    if (formularioActivo === 'residente') {
      if (editandoElemento) {
        // EDITAR residente existente
        try {
          const { data, error } = await supabase.rpc('actualizar_residente', {
            p_usuario_id: directorId,
            p_rol_ejecutor: 'director',
            p_id: editandoElemento.id,
            p_nombre: datosFormulario.nombre,
            p_apellidos: datosFormulario.apellidos,
            p_dni: datosFormulario.dni,
            p_fecha_nacimiento: datosFormulario.fecha_nacimiento,
            p_telefono: datosFormulario.telefono || null,
            p_direccion: datosFormulario.direccion,
            p_codigo_postal: datosFormulario.codigo_postal,
            p_ciudad: datosFormulario.ciudad,
            p_grado_dependencia: datosFormulario.grado_dependencia,
            p_residencia_id: datosFormulario.residencia_id,
            p_fecha_ingreso: datosFormulario.fecha_ingreso,
            p_contacto_emergencia_nombre: datosFormulario.contacto_emergencia_nombre,
            p_contacto_emergencia_telefono: datosFormulario.contacto_emergencia_telefono,
            p_contacto_emergencia_parentesco: datosFormulario.contacto_emergencia_parentesco,
            p_observaciones_medicas: datosFormulario.observaciones_medicas || null
          });

          if (error) throw error;
          if (data && !data.success) throw new Error(data.error);

          alert('✅ Residente actualizado correctamente');
        } catch (error: any) {
          alert(`❌ Error: ${error.message}`);
          return;
        }
      } else {
        // CREAR residente nuevo
        try {
          const { data, error } = await supabase.rpc('crear_residente', {
            p_nombre: datosFormulario.nombre,
            p_apellidos: datosFormulario.apellidos,
            p_dni: datosFormulario.dni,
            p_fecha_nacimiento: datosFormulario.fecha_nacimiento,
            p_telefono: datosFormulario.telefono || null,
            p_direccion: datosFormulario.direccion,
            p_codigo_postal: datosFormulario.codigo_postal,
            p_ciudad: datosFormulario.ciudad,
            p_grado_dependencia: datosFormulario.grado_dependencia,
            p_residencia_id: datosFormulario.residencia_id,
            p_fecha_ingreso: datosFormulario.fecha_ingreso,
            p_contacto_emergencia_nombre: datosFormulario.contacto_emergencia_nombre,
            p_contacto_emergencia_telefono: datosFormulario.contacto_emergencia_telefono,
            p_contacto_emergencia_parentesco: datosFormulario.contacto_emergencia_parentesco,
            p_observaciones_medicas: datosFormulario.observaciones_medicas || null
          });

          if (error) throw error;
          if (data && !data.success) throw new Error(data.error);

          alert('✅ Residente creado correctamente');
        } catch (error: any) {
          alert(`❌ Error: ${error.message}`);
          return;
        }
      }

      setFormularioActivo(false);
      setPasoActual(0);
      setDatosFormulario({});
      setEditandoElemento(null);
      directorId && cargarTodosDatos(directorId);
    }

    // ============================================
    // RESIDENCIAS
    // ============================================
    if (formularioActivo === 'residencia') {
      if (editandoElemento) {
        // EDITAR residencia existente
        try {
          const { data, error } = await supabase.rpc('actualizar_residencia', {
            p_usuario_id: directorId,
            p_rol_ejecutor: 'director',
            p_id: editandoElemento.id,
            p_nombre: datosFormulario.nombre,
            p_direccion: datosFormulario.direccion,
            p_codigo_postal: datosFormulario.codigo_postal,
            p_poblacion: datosFormulario.poblacion,
            p_telefono_fijo: datosFormulario.telefono_fijo,
            p_telefono_movil: datosFormulario.telefono_movil || null,
            p_email: datosFormulario.email,
            p_total_plazas: parseInt(datosFormulario.total_plazas),
            p_plazas_ocupadas: parseInt(datosFormulario.plazas_ocupadas),
            p_cif: datosFormulario.cif,
            p_numero_licencia: datosFormulario.numero_licencia,
            p_director_id: directorId,
            p_empresa_facturacion_id: datosFormulario.empresa_facturacion_id || null
          });

          if (error) throw error;
          if (data && !data.success) throw new Error(data.error);

          alert('✅ Residencia actualizada correctamente');
        } catch (error: any) {
          alert(`❌ Error: ${error.message}`);
          return;
        }
      } else {
        // CREAR residencia nueva
        try {
          const { data, error } = await supabase.rpc('crear_residencia', {
            p_nombre: datosFormulario.nombre,
            p_direccion: datosFormulario.direccion,
            p_codigo_postal: datosFormulario.codigo_postal,
            p_poblacion: datosFormulario.poblacion,
            p_telefono_fijo: datosFormulario.telefono_fijo,
            p_telefono_movil: datosFormulario.telefono_movil || null,
            p_email: datosFormulario.email,
            p_total_plazas: parseInt(datosFormulario.total_plazas),
            p_plazas_ocupadas: parseInt(datosFormulario.plazas_ocupadas),
            p_cif: datosFormulario.cif,
            p_numero_licencia: datosFormulario.numero_licencia,
            p_director_id: directorId,
            p_empresa_id: null,
            p_empresa_facturacion_id: datosFormulario.empresa_facturacion_id || null
          });

          if (error) throw error;
          if (data && !data.success) throw new Error(data.error);

          alert('✅ Residencia creada correctamente');
        } catch (error: any) {
          alert(`❌ Error: ${error.message}`);
          return;
        }
      }

      setFormularioActivo(false);
      setPasoActual(0);
      setDatosFormulario({});
      setEditandoElemento(null);
      directorId && cargarTodosDatos(directorId);
    }
  };

const eliminarElemento = async (elemento: any, tipo: string) => {
    const nombres: Record<string, string> = {
      trabajador: `trabajador "${elemento.nombre} ${elemento.apellidos}"`,
      residente: `residente "${elemento.nombre} ${elemento.apellidos}"`,
      residencia: `residencia "${elemento.nombre}"`
    };
    
    if (!confirm(`¿Estás seguro de eliminar el ${nombres[tipo]}?`)) return;
    
    try {
      const { data, error } = await supabase.rpc('mover_a_papelera', {
        p_tipo_entidad: tipo,
        p_entidad_id: elemento.id,
        p_eliminado_por: directorId,
        p_eliminado_por_rol: 'director'
      });
      
      if (error) throw error;
      
      if (data?.success) {
        alert(`✅ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado y enviado a papelera`);
        directorId && cargarTodosDatos(directorId);
      } else {
        alert('❌ Error al eliminar elemento');
      }
    } catch (error: any) {
      console.error('Error eliminando:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };


  const renderCampoFormulario = (campo: any) => {
    const valor = datosFormulario[campo.campo] || '';

    if (campo.tipo === 'select_director') {
      return (
        <select 
          value={valor} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="">Seleccionar director...</option>
          {directores.map((director: any) => (
            <option key={director.id} value={director.id}>
              {director.nombre} {director.apellidos} ({director.dni})
            </option>
          ))}
        </select>
      );
    }

    if (campo.tipo === 'select_empresa') {
      return (
        <select 
          value={valor} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="">Sin empresa asignada</option>
          {empresasDisponibles.map((empresa: any) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre} - {empresa.cif}
            </option>
          ))}
        </select>
      );
    }

    if (campo.tipo === 'select_residencia') {
      return (
        <select 
          value={valor} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="">Seleccionar residencia...</option>
          {residencias.map((residencia: any) => (
            <option key={residencia.id} value={residencia.id}>
              {residencia.nombre} - {residencia.poblacion}
            </option>
          ))}
        </select>
      );
    }

    if (campo.tipo === 'select_turno') {
      return (
        <select 
          value={valor} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="">Seleccionar turno...</option>
          <option value="no_aplica">NO APLICA</option>
          <option value="mañana">Mañana (07:00 - 15:00)</option>
          <option value="tarde">Tarde (15:00 - 23:00)</option>
          <option value="noche">Noche (23:00 - 07:00)</option>
          <option value="rotativo">Rotativo</option>
          <option value="partido">Partido</option>
        </select>
      );
    }

    if (campo.tipo === 'select_dependencia') {
      return (
        <select 
          value={valor} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="">Seleccionar grado...</option>
          <option value="grado_i">Grado I - Dependencia moderada</option>
          <option value="grado_ii">Grado II - Dependencia severa</option>
          <option value="grado_iii">Grado III - Gran dependencia</option>
          <option value="sin_dependencia">Sin dependencia reconocida</option>
        </select>
      );
    }

    if (campo.tipo === 'textarea') {
      return (
        <textarea
          value={valor}
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})}
          placeholder={campo.placeholder || ''}
          rows={4}
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '18px', 
            border: '2px solid #ddd',
            borderRadius: '8px',
            resize: 'vertical'
          }}
        />
      );
    }

    return (
      <input 
        type={campo.tipo}
        value={valor}
        onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})}
        placeholder={campo.placeholder || ''}
        min={campo.min || ''}
        style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '18px', 
          border: '2px solid #ddd',
          borderRadius: '8px'
        }}
      />
    );
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
            { id: 'papelera', label: 'Papelera', icon: '🗑️'},
            { id: 'importexport', label: 'Import/Export', icon: '📊' }
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
            onIniciarFormulario={iniciarFormulario}
            onEliminar={(r) => eliminarElemento(r, 'residencia')}
          />
        )}

        {vistaActual === 'trabajadores' && (
          <TrabajadoresView
            personal={trabajadores}
            residencias={residencias}
            directores={directores}
            onRecargarDatos={() => directorId && cargarTodosDatos(directorId)}
            onMostrarFicha={(t) => mostrarFicha(t, 'trabajador')}
            onIniciarFormulario={iniciarFormulario}
            onEliminar={(t) => eliminarElemento(t, 'trabajador')}
          />
        )}

        {vistaActual === 'residentes' && (
          <ResidentesView
            residentes={residentes}
            residencias={residencias}
            onRecargarDatos={() => directorId && cargarTodosDatos(directorId)}
            onMostrarFicha={(r) => mostrarFicha(r, 'residente')}
            onIniciarFormulario={iniciarFormulario}
            onEliminar={(r) => eliminarElemento(r, 'residente')}
          />
        )}

	{vistaActual === 'partes' && (
          <PartesView
            directorId={directorId!}
            residencias={residencias}
            trabajadores={trabajadores}
          />
        )}

	{vistaActual === 'papelera' && directorId && (
          <PapeleraView
            usuarioId={directorId}
            rol="director"
            onRecargar={() => directorId && cargarTodosDatos(directorId)}
          />
        )}
	{vistaActual === 'importexport' && (
          <ImportExportView
            directorId={directorId!}
            residencias={residencias}
            trabajadores={trabajadores}
            residentes={residentes}
            onRecargar={() => directorId && cargarTodosDatos(directorId)}
          />
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
{/* Formulario paso a paso */}
      {formularioActivo && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#2c3e50', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 2000, fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ 
            backgroundColor: 'white', padding: '60px 40px', borderRadius: '10px', maxWidth: '600px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                {editandoElemento ? 'Editando' : 'Creando'} {formularioActivo} • {pasoActual + 1} de {formularios[formularioActivo as keyof typeof formularios].length}
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px', marginBottom: '20px' }}>
                <div style={{ 
                  width: `${((pasoActual + 1) / formularios[formularioActivo as keyof typeof formularios].length) * 100}%`, 
                  height: '100%', backgroundColor: '#2c3e50',
                  borderRadius: '2px', transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '30px', lineHeight: '1.3' }}>
              {formularios[formularioActivo as keyof typeof formularios][pasoActual].label}
              {formularios[formularioActivo as keyof typeof formularios][pasoActual].req && <span style={{ color: '#e74c3c' }}> *</span>}
            </h2>

            <div style={{ marginBottom: '40px' }}>
              {renderCampoFormulario(formularios[formularioActivo as keyof typeof formularios][pasoActual])}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
              {pasoActual > 0 ? (
                <button onClick={pasoAnterior} style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Anterior
                </button>
              ) : (
                <button onClick={() => setFormularioActivo(false)} style={{ padding: '15px 30px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              )}
              
              <button 
                onClick={siguientePaso}
                disabled={formularios[formularioActivo as keyof typeof formularios][pasoActual].req && !datosFormulario[formularios[formularioActivo as keyof typeof formularios][pasoActual].campo]}
                style={{ 
                  padding: '15px 30px', fontSize: '16px', 
                  backgroundColor: (formularios[formularioActivo as keyof typeof formularios][pasoActual].req && !datosFormulario[formularios[formularioActivo as keyof typeof formularios][pasoActual].campo]) ? '#ccc' : '#2c3e50',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: (formularios[formularioActivo as keyof typeof formularios][pasoActual].req && !datosFormulario[formularios[formularioActivo as keyof typeof formularios][pasoActual].campo]) ? 'not-allowed' : 'pointer'
                }}
              >
                {pasoActual === formularios[formularioActivo as keyof typeof formularios].length - 1 ? (editandoElemento ? 'Actualizar' : 'Crear') : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
