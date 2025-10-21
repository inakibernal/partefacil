// @ts-nocheck
"use client";
export const dynamic = 'force-dynamic';
import FichaModal from "./components/FichaModal";
import React, { useState, useEffect } from 'react';
import { SistemaGestion, SistemaPapelera, inicializarSistema } from '../utils/sistema.js';
import { supabase } from '../../lib/supabase';
import DirectoresView from "./components/DirectoresView";
import ResidenciasView from "./components/ResidenciasView";
import TrabajadoresView from "./components/TrabajadoresView";
import ResidentesView from "./components/ResidentesView";
import EmpresasView from "./components/EmpresasView";
import PapeleraView from "./components/PapeleraView";
import CrearUsuarioModal from "./components/CrearUsuarioModal";
import ResponsiveNav from "../components/ResponsiveNav";

const PanelDesarrollador = () => {
  const [vistaActual, setVistaActual] = useState('directores');
  const [directores, setDirectores] = useState([]);
  const [residencias, setResidencias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [residentes, setResidentes] = useState([]);
  const [papelera, setPapelera] = useState([]);
  const [formularioActivo, setFormularioActivo] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [datosFormulario, setDatosFormulario] = useState({});
  const [fichaVisible, setFichaVisible] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [editandoElemento, setEditandoElemento] = useState(null);
  const [modalCrearVisible, setModalCrearVisible] = useState<'trabajador' | 'director' | null>(null);
  const [empresasDisponibles, setEmpresasDisponibles] = useState([]);
  
  // Estados del buscador
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [indiceSugerencia, setIndiceSugerencia] = useState(-1);

useEffect(() => {
    setIsClient(true);
    verificarSesion();
  }, []);

const verificarSesion = () => {
  const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
  
  if (sesion.rol !== 'superadmin' || !sesion.usuarioId) {
    window.location.href = '/login';
    return;
  }

  inicializarSistema();
  cargarTodosDatos();
};

const cargarTodosDatos = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Cargar usuarios (directores, trabajadores) desde Supabase
      const { data: usuariosData } = await supabase.rpc('obtener_todos_usuarios_admin');
      const usuarios = usuariosData || [];

      // Separar por rol
	const directoresData = usuarios.filter(u => u.rol === 'director' && u.estado === 'activo');
	const personalData = usuarios.filter(u => u.rol === 'trabajador' && u.estado === 'activo');  
      // Cargar residencias desde Supabase
      const { data: residenciasData } = await supabase.rpc('obtener_residencias_admin');
  
      // Cargar empresas desde Supabase
      const { data: empresasData2 } = await supabase.rpc('obtener_empresas_admin');
      setEmpresas(empresasData2 || []);
  
      // Cargar residentes desde Supabase
      const { data: residentesData } = await supabase.rpc('obtener_residentes_admin');
  
      // Cargar empresas para selector
      const { data: empresasData } = await supabase.rpc('obtener_empresas_disponibles');
      setEmpresasDisponibles(empresasData2 || []);

      setDirectores(directoresData);  
      setResidencias(residenciasData || []);
      setPersonal(personalData);
      setResidentes(residentesData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }
};

  // Función de búsqueda global
  const buscarGlobal = (termino: any) => {
    if (!termino.trim()) {
      setSugerencias([]);
      return [];
    }

    const terminoLower = termino.toLowerCase();
    const resultados: any[] = [];

    // Buscar en directores
    directores.forEach((director: any) => {
      const nombreCompleto = `${director.nombre} ${director.apellidos}`.toLowerCase();
      const coincidencias = [];
      
      if (nombreCompleto.includes(terminoLower)) coincidencias.push('nombre');
      if (director.dni?.toLowerCase().includes(terminoLower)) coincidencias.push('DNI');
      if (director.email?.toLowerCase().includes(terminoLower)) coincidencias.push('email');
      if (director.telefono?.includes(terminoLower)) coincidencias.push('teléfono');
      
      if (coincidencias.length > 0) {
        resultados.push({
          id: director.id,
          tipo: 'director',
          elemento: director,
          nombre: `${director.nombre} ${director.apellidos}`,
          subtitulo: `Director • DNI: ${director.dni}`,
          coincidencias: coincidencias,
          icono: '👨‍💼',
          color: '#2c3e50'
        });
      }
    });

    // Buscar en residencias
    residencias.forEach((residencia: any) => {
      const coincidencias = [];
      
      if (residencia.nombre?.toLowerCase().includes(terminoLower)) coincidencias.push('nombre');
      if (residencia.cif?.toLowerCase().includes(terminoLower)) coincidencias.push('CIF');
      if (residencia.poblacion?.toLowerCase().includes(terminoLower)) coincidencias.push('población');
      if (residencia.direccion?.toLowerCase().includes(terminoLower)) coincidencias.push('dirección');
      
      if (coincidencias.length > 0) {
        resultados.push({
          id: residencia.id,
          tipo: 'residencia',
          elemento: residencia,
          nombre: residencia.nombre,
          subtitulo: `Residencia • ${residencia.poblacion} • CIF: ${residencia.cif}`,
          coincidencias: coincidencias,
          icono: '🏢',
          color: '#007bff'
        });
      }
    });

    // Buscar en trabajadores
personal.forEach((trabajador: any) => {
      const nombreCompleto = `${trabajador.nombre} ${trabajador.apellidos}`.toLowerCase();
      const coincidencias = [];
      
      if (nombreCompleto.includes(terminoLower)) coincidencias.push('nombre');
      if (trabajador.dni?.toLowerCase().includes(terminoLower)) coincidencias.push('DNI');
      if (trabajador.email?.toLowerCase().includes(terminoLower)) coincidencias.push('email');
      if (trabajador.titulacion?.toLowerCase().includes(terminoLower)) coincidencias.push('titulación');
      
      if (coincidencias.length > 0) {
	const residencia = residencias.find((r: any) => r.id == trabajador.residencia_id);
        resultados.push({
          id: trabajador.id,
          tipo: 'trabajador',
          elemento: trabajador,
          nombre: `${trabajador.nombre} ${trabajador.apellidos}`,
          subtitulo: `Trabajador • ${trabajador.titulacion} • ${residencia?.nombre || 'Sin residencia'}`,
          coincidencias: coincidencias,
          icono: '👥',
          color: '#28a745'
        });
      }
    });

    // Buscar en residentes
    residentes.forEach(residente => {
      const nombreCompleto = `${residente.nombre} ${residente.apellidos}`.toLowerCase();
      const coincidencias = [];
      
      if (nombreCompleto.includes(terminoLower)) coincidencias.push('nombre');
      if (residente.dni?.toLowerCase().includes(terminoLower)) coincidencias.push('DNI');
      if (residente.grado_dependencia?.toLowerCase().includes(terminoLower)) coincidencias.push('grado dependencia');
      
      if (coincidencias.length > 0) {
        const residencia = residencias.find(r => r.id == residente.residencia_id);
        resultados.push({
          id: residente.id,
          tipo: 'residente',
          elemento: residente,
          nombre: `${residente.nombre} ${residente.apellidos}`,
          subtitulo: `Residente • ${residencia?.nombre || 'Sin residencia'} • ${residente.grado_dependencia}`,
          coincidencias: coincidencias,
          icono: '🧓',
          color: '#6f42c1'
        });
      }
    });

    return resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  };

  // Manejar cambios en el buscador
  const manejarCambioBusqueda = (valor) => {
    setBusqueda(valor);
    setIndiceSugerencia(-1);
    
    if (valor.trim()) {
      const resultados = buscarGlobal(valor);
      setSugerencias(resultados.slice(0, 8)); // Máximo 8 sugerencias
      setMostrandoResultados(false);
    } else {
      setSugerencias([]);
      setMostrandoResultados(false);
      setResultadosBusqueda([]);
    }
  };

  // Manejar teclas en el buscador
  const manejarTeclaBusqueda = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndiceSugerencia(prev => 
        prev < sugerencias.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndiceSugerencia(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (indiceSugerencia >= 0 && sugerencias[indiceSugerencia]) {
        seleccionarSugerencia(sugerencias[indiceSugerencia]);
      } else if (busqueda.trim()) {
        ejecutarBusqueda();
      }
    } else if (e.key === 'Escape') {
      setSugerencias([]);
      setIndiceSugerencia(-1);
      setMostrandoResultados(false);
    }
  };

  // Seleccionar sugerencia
  const seleccionarSugerencia = (sugerencia) => {
    setBusqueda(sugerencia.nombre);
    setSugerencias([]);
    setIndiceSugerencia(-1);
    setResultadosBusqueda([sugerencia]);
    setMostrandoResultados(true);
  };

  // Ejecutar búsqueda
  const ejecutarBusqueda = () => {
    if (!busqueda.trim()) {
      setMostrandoResultados(false);
      setResultadosBusqueda([]);
      return;
    }
    
    const resultados = buscarGlobal(busqueda);
    setResultadosBusqueda(resultados);
    setMostrandoResultados(true);
    setSugerencias([]);
    setIndiceSugerencia(-1);
  };

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setBusqueda('');
    setSugerencias([]);
    setMostrandoResultados(false);
    setResultadosBusqueda([]);
    setIndiceSugerencia(-1);
  };

  // Solo incluyo las definiciones de formularios que necesito
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
    ],
    empresa: [
      { campo: 'nombre', label: '¿Nombre de la empresa?', tipo: 'text', req: true },
      { campo: 'cif', label: '¿CIF de la empresa?', tipo: 'text', placeholder: 'B12345678', req: true },
      { campo: 'email_facturacion', label: '¿Email de facturación?', tipo: 'email', req: true },
      { campo: 'direccion', label: '¿Dirección fiscal?', tipo: 'text', req: true },
      { campo: 'codigo_postal', label: '¿Código postal?', tipo: 'text', req: true },
      { campo: 'ciudad', label: '¿Ciudad?', tipo: 'text', req: true },
      { campo: 'telefono', label: '¿Teléfono de contacto?', tipo: 'tel', req: true },
      { campo: 'contacto_nombre', label: '¿Persona de contacto? (opcional)', tipo: 'text', req: false },
      { campo: 'contacto_telefono', label: '¿Teléfono del contacto? (opcional)', tipo: 'tel', req: false },
      { campo: 'notas', label: '¿Notas adicionales? (opcional)', tipo: 'textarea', req: false },
      { campo: 'iban', label: '¿IBAN para domiciliación? (opcional)', tipo: 'text', placeholder: 'ES00 0000 0000 0000 0000 0000', req: false },
      { campo: 'dia_facturacion', label: '¿Día de facturación mensual? (1-28)', tipo: 'number', min: '1', max: '28', req: false },
      { campo: 'forma_pago', label: '¿Forma de pago?', tipo: 'select_forma_pago', req: false },
      { campo: 'dias_vencimiento', label: '¿Días de vencimiento del pago?', tipo: 'number', min: '0', placeholder: '30', req: false },
      { campo: 'descuento_porcentaje', label: '¿Descuento aplicado (%)? (opcional)', tipo: 'number', min: '0', max: '100', step: '0.01', req: false }
    ]
  };

  // Funciones genericas de manejo
  const mostrarFicha = (elemento, tipo) => {
    let fichaData = { elemento, tipo };
    
    if (tipo === 'director') {
      const residenciasDelDirector = residencias.filter(r => r.director_id === elemento.id);
      fichaData.residencias = residenciasDelDirector;
    } else if (tipo === 'residencia') {
      const director = directores.find(d => d.id == elemento.director_id);
      const personalResidencia = personal.filter(p => p.residencia_id === elemento.id);
      const residentesResidencia = residentes.filter(r => r.residencia_id === elemento.id);
      fichaData.director = director;
      fichaData.personal = personalResidencia;
      fichaData.residentes = residentesResidencia;
    } else if (tipo === 'trabajador') {
      const residencia = residencias.find(r => r.id == elemento.residencia_id);
      const director = residencia ? directores.find(d => d.id == residencia.director_id) : null;
      fichaData.residencia = residencia;
      fichaData.director = director;
    } else if (tipo === 'residente') {
      const residencia = residencias.find(r => r.id == elemento.residencia_id);
      fichaData.residencia = residencia;
    }

    setFichaVisible(fichaData);
  };

  const calcularEdad = (fechaNacimiento) => {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatearGradoDependencia = (grado) => {
    const grados = {
      'grado_i': 'Grado I - Dependencia moderada',
      'grado_ii': 'Grado II - Dependencia severa', 
      'grado_iii': 'Grado III - Gran dependencia',
      'sin_dependencia': 'Sin dependencia reconocida'
    };
    return grados[grado] || grado;
  };

  const iniciarFormulario = (tipo, elemento = null) => {
    setFormularioActivo(tipo);
    setPasoActual(0);
    
    if (elemento) {
      setEditandoElemento(elemento);
      setDatosFormulario({ ...elemento });
    } else {
      setEditandoElemento(null);
      setDatosFormulario({});
    }
  };

  const siguientePaso = () => {
    const formulario = formularios[formularioActivo];
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
// Si está editando director o trabajador, usar función RPC de actualización
if ((formularioActivo === 'director' || formularioActivo === 'trabajador') && editandoElemento) {
      try {
        const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
        
        const { data, error } = await supabase.rpc('actualizar_usuario', {
          p_usuario_id: sesion.usuarioId,
          p_rol_ejecutor: sesion.rol || 'superadmin',
          p_id: editandoElemento.id,
          p_nombre: datosFormulario.nombre,
          p_apellidos: datosFormulario.apellidos,
          p_dni: datosFormulario.dni,
          p_telefono: datosFormulario.telefono || '',
          p_fecha_nacimiento: datosFormulario.fecha_nacimiento || null,
          p_direccion: datosFormulario.direccion || null,
          p_ciudad: datosFormulario.ciudad || null,
          p_codigo_postal: datosFormulario.codigo_postal || null,
          p_titulo_profesional: datosFormulario.titulo_profesional || null,
          p_experiencia: datosFormulario.experiencia ? parseInt(datosFormulario.experiencia) : null,
          p_titulacion: datosFormulario.titulacion || null,
          p_numero_colegiado: datosFormulario.numero_colegiado || null,
          p_turno: datosFormulario.turno || null,
          p_fecha_inicio: datosFormulario.fecha_inicio || null
        });

        if (error) throw error;
        
        if (data && !data.success) {
          alert(`${data.error}`);
          return;
        }

        alert(`✅ ${formularioActivo === 'director' ? 'Director' : 'Trabajador'} actualizado correctamente`);
        setFormularioActivo(false);
        setPasoActual(0);
        setDatosFormulario({});
        setEditandoElemento(null);
        cargarTodosDatos();
        return;
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al actualizar');
        return;
      }
    }

    if ((formularioActivo === 'director' || formularioActivo === 'trabajador') && !editandoElemento) {
      try {
        const payload = {
          email: datosFormulario.email,
          password: datosFormulario.contrasena,
          nombre: datosFormulario.nombre,
          apellidos: datosFormulario.apellidos,
          dni: datosFormulario.dni,
          rol: formularioActivo,
          telefono: datosFormulario.telefono || '',
          empresas: datosFormulario.empresas_ids || [],
          residencia_id: datosFormulario.residencia_id || null,         
          fecha_nacimiento: datosFormulario.fecha_nacimiento || null,
          direccion: datosFormulario.direccion || null,
          ciudad: datosFormulario.ciudad || null,
          codigo_postal: datosFormulario.codigo_postal || null,
          titulo_profesional: datosFormulario.titulo_profesional || null,
          experiencia: datosFormulario.experiencia ? parseInt(datosFormulario.experiencia) : null,
          titulacion: datosFormulario.titulacion || null,
          numero_colegiado: datosFormulario.numero_colegiado || null,
          turno: datosFormulario.turno || null,
          fecha_inicio: datosFormulario.fecha_inicio || null
        };
        const response = await fetch('https://pwryrzmniqjrhikspqoz.supabase.co/functions/v1/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!data.success) { 
          alert(`❌ Error: ${data.error}`); 
          return; 
        }
        alert(`✅ ${formularioActivo === 'director' ? 'Director' : 'Trabajador'} creado correctamente`);
        setFormularioActivo(false); 
        setPasoActual(0); 
        setDatosFormulario({}); 
        setEditandoElemento(null); 
        cargarTodosDatos(); 
        return;
      } catch (error) { 
        alert('❌ Error de conexión'); 
        return; 
      }
    }

// EDITAR residencia existente
if (formularioActivo === 'residencia' && editandoElemento) {
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
    
    const { data, error } = await supabase.rpc('actualizar_residencia', {
      p_usuario_id: sesion.usuarioId,
      p_rol_ejecutor: sesion.rol || 'superadmin',
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
      p_director_id: datosFormulario.director_id,
      p_empresa_facturacion_id: datosFormulario.empresa_facturacion_id || null
    });

    if (error) throw error;
    if (data && !data.success) throw new Error(data.error);

    alert('✅ Residencia actualizada correctamente');
    setFormularioActivo(false);
    setPasoActual(0);
    setDatosFormulario({});
    setEditandoElemento(null);
    cargarTodosDatos();
    return;
  } catch (error: any) {
    console.error('Error:', error);
    alert('❌ Error al actualizar: ' + error.message);
    return;
  }
}

// CREAR residencia nueva
if (formularioActivo === 'residencia' && !editandoElemento) {
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
    
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
      p_director_id: datosFormulario.director_id,
      p_empresa_id: null,
      p_empresa_facturacion_id: datosFormulario.empresa_facturacion_id || null
    });

    if (error) throw error;
    if (data && !data.success) throw new Error(data.error);

    alert('✅ Residencia creada correctamente');
    setFormularioActivo(false);
    setPasoActual(0);
    setDatosFormulario({});
    setEditandoElemento(null);
    cargarTodosDatos();
    return;
  } catch (error: any) {
    console.error('Error:', error);
    alert('❌ Error al crear: ' + error.message);
    return;
  }
}

// Si es empresa nueva, usar RPC
if (formularioActivo === 'empresa' && editandoElemento) {
      try {
        const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
        
        const { data, error } = await supabase.rpc('actualizar_empresa', {
          p_usuario_id: sesion.usuarioId,
          p_rol_ejecutor: sesion.rol || 'superadmin',
          p_id: editandoElemento.id,
          p_nombre: datosFormulario.nombre,
          p_cif: datosFormulario.cif,
          p_email_facturacion: datosFormulario.email_facturacion,
          p_direccion: datosFormulario.direccion,
          p_codigo_postal: datosFormulario.codigo_postal,
          p_ciudad: datosFormulario.ciudad,
          p_telefono: datosFormulario.telefono,
          p_contacto_nombre: datosFormulario.contacto_nombre || null,
          p_contacto_telefono: datosFormulario.contacto_telefono || null,
          p_notas: datosFormulario.notas || null,
          p_iban: datosFormulario.iban || null,
          p_dia_facturacion: datosFormulario.dia_facturacion ? parseInt(datosFormulario.dia_facturacion) : null,
          p_forma_pago: datosFormulario.forma_pago || 'transferencia',
          p_dias_vencimiento: datosFormulario.dias_vencimiento ? parseInt(datosFormulario.dias_vencimiento) : 30,
          p_descuento_porcentaje: datosFormulario.descuento_porcentaje ? parseFloat(datosFormulario.descuento_porcentaje) : 0
        });

        if (error) throw error;
        
        if (data && !data.success) {
          alert(`${data.error}`);
          return;
        }

        alert('✅ Empresa actualizada correctamente');
        setFormularioActivo(false);
        setPasoActual(0);
        setDatosFormulario({});
        setEditandoElemento(null);
        cargarTodosDatos();
        return;
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al actualizar empresa');
        return;
      }
    }

    // Si está editando empresa, usar RPC de actualización
    if (formularioActivo === 'empresa' && editandoElemento) {
      try {
        const { data, error } = await supabase.rpc('actualizar_empresa', {
          p_id: editandoElemento.id,
          p_nombre: datosFormulario.nombre,
          p_cif: datosFormulario.cif,
          p_email_facturacion: datosFormulario.email_facturacion,
          p_direccion: datosFormulario.direccion,
          p_codigo_postal: datosFormulario.codigo_postal,
          p_ciudad: datosFormulario.ciudad,
          p_telefono: datosFormulario.telefono,
          p_contacto_nombre: datosFormulario.contacto_nombre || null,
          p_contacto_telefono: datosFormulario.contacto_telefono || null,
          p_notas: datosFormulario.notas || null,
          p_iban: datosFormulario.iban || null,
          p_dia_facturacion: datosFormulario.dia_facturacion ? parseInt(datosFormulario.dia_facturacion) : null,
          p_forma_pago: datosFormulario.forma_pago || 'transferencia',
          p_dias_vencimiento: datosFormulario.dias_vencimiento ? parseInt(datosFormulario.dias_vencimiento) : 30,
          p_descuento_porcentaje: datosFormulario.descuento_porcentaje ? parseFloat(datosFormulario.descuento_porcentaje) : 0
        });

        if (error) throw error;
        
        if (data && !data.success) {
          alert(`❌ ${data.error}`);
          return;
        }

        alert('✅ Empresa actualizada correctamente');
        setFormularioActivo(false);
        setPasoActual(0);
        setDatosFormulario({});
        setEditandoElemento(null);
        cargarTodosDatos();
        return;
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al actualizar empresa');
        return;
      }
    }

// EDITAR residente existente
if (formularioActivo === 'residente' && editandoElemento) {
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
    
    const { data, error } = await supabase.rpc('actualizar_residente', {
      p_usuario_id: sesion.usuarioId,
      p_rol_ejecutor: sesion.rol || 'superadmin',
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
    setFormularioActivo(false);
    setPasoActual(0);
    setDatosFormulario({});
    setEditandoElemento(null);
    cargarTodosDatos();
    return;
  } catch (error: any) {
    console.error('Error:', error);
    alert('❌ Error al actualizar: ' + error.message);
    return;
  }
}

// CREAR residente nuevo
if (formularioActivo === 'residente' && !editandoElemento) {
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
    setFormularioActivo(false);
    setPasoActual(0);
    setDatosFormulario({});
    setEditandoElemento(null);
    cargarTodosDatos();
    return;
  } catch (error: any) {
    console.error('Error:', error);
    alert('❌ Error al crear: ' + error.message);
    return;
  }
}
};

const eliminarElemento = async (elemento: any, tipo: string) => {
  const nombres: Record<string, string> = {
    director: `director "${elemento.nombre} ${elemento.apellidos}"`,
    residencia: `residencia "${elemento.nombre}"`,
    trabajador: `trabajador "${elemento.nombre} ${elemento.apellidos}"`,
    residente: `residente "${elemento.nombre} ${elemento.apellidos}"`,
    empresa: `empresa "${elemento.nombre}"`
  };
  
  if (!confirm(`¿Estás seguro de eliminar el ${nombres[tipo]}?`)) return;
  
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');
    
    console.log('Intentando eliminar:', {
      tipo,
      entidad_id: elemento.id,
      usuario: sesion.usuarioId
    });
    
const { data, error } = await supabase.rpc('mover_a_papelera', {
  p_tipo_entidad: tipo,
  p_entidad_id: elemento.id,  // ← SIN .toString()
  p_eliminado_por: sesion.usuarioId,  // ← SIN .toString()
  p_eliminado_por_rol: sesion.rol || 'superadmin'
});    
    console.log('Respuesta RPC:', { data, error });
    
if (error) {
      console.error('Error de Supabase COMPLETO:', JSON.stringify(error, null, 2));
      throw error;
    }
    
    if (data?.success) {
      alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado y enviado a papelera`);
      cargarTodosDatos();
      
      if (mostrandoResultados && busqueda) {
        setTimeout(() => {
          const nuevosResultados = buscarGlobal(busqueda);
          setResultadosBusqueda(nuevosResultados);
        }, 100);
      }
    } else {
      alert('Error al eliminar elemento');
    }
  } catch (error) {
    console.error('Error eliminando:', error);
    alert('Error al eliminar elemento');
  }
};

  const restaurarElemento = (elementoId) => {
    if (SistemaPapelera.restaurar(elementoId)) {
      cargarTodosDatos();
      alert('Elemento restaurado correctamente');
    } else {
      alert('Error al restaurar el elemento');
    }
  };

  const renderCampoFormulario = (campo) => {
    const valor = datosFormulario[campo.campo] || '';

    if (campo.tipo === 'select_director') {
      return (
        <select 
          value={valor} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="">Seleccionar director...</option>
          {directores.map(director => (
            <option key={director.id} value={director.id}>
              {director.nombre} {director.apellidos} ({director.dni})
            </option>
          ))}
        </select>
      );
    }
    if (campo.tipo === 'select_residencias_multiple') {
      return (
        <select 
          multiple
          size={4}
          value={datosFormulario.residencias_ids || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setDatosFormulario({...datosFormulario, residencias_ids: selected});
          }}
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          {residencias.map(residencia => (
            <option key={residencia.id} value={residencia.id}>
              {residencia.nombre} - {residencia.poblacion || residencia.ciudad}
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
          {empresasDisponibles.map(empresa => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre} - {empresa.cif}
            </option>
          ))}
        </select>
      );
    }
    if (campo.tipo === 'select_forma_pago') {
      return (
        <select 
          value={valor || 'transferencia'} 
          onChange={(e) => setDatosFormulario({...datosFormulario, [campo.campo]: e.target.value})} 
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="transferencia">Transferencia bancaria</option>
          <option value="domiciliacion">Domiciliación bancaria</option>
          <option value="tarjeta">Tarjeta de crédito</option>
          <option value="efectivo">Efectivo</option>
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
          {residencias.map(residencia => (
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

    if (campo.tipo === 'select_empresas_multiple') {
      return (
        <select 
          multiple
          size={4}
          value={datosFormulario.empresas_ids || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setDatosFormulario({...datosFormulario, empresas_ids: selected});
          }}
          style={{ width: '100%', padding: '15px', fontSize: '18px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          {empresasDisponibles.map(empresa => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </select>
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

  if (!isClient) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Cargando...</div>
      </div>
    );
  }

  // Modal de ficha universal mejorado
  if (fichaVisible) {
    const { elemento, tipo, residencia } = fichaVisible;
    const colores = {
      director: '#2c3e50',
      residencia: '#007bff',
      trabajador: '#28a745',
      residente: '#6f42c1'
    };
    
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '10px', maxWidth: '800px', width: '90%', maxHeight: '90%',
          overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            backgroundColor: colores[tipo], color: 'white', padding: '20px', borderRadius: '10px 10px 0 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>
                {elemento.nombre} {elemento.apellidos || ''}
              </h2>
              <p style={{ margin: '0', opacity: 0.8 }}>
                Ficha completa del {tipo}
                {tipo === 'residente' && ` • ${calcularEdad(elemento.fecha_nacimiento)} años`}
              </p>
            </div>
            <button 
              onClick={() => setFichaVisible(null)}
              style={{
                backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px',
                padding: '10px 15px', cursor: 'pointer', fontSize: '16px'
              }}
            >
              ✕ Cerrar
            </button>
          </div>
          
          <div style={{ padding: '30px' }}>
            {/* Datos del residente */}
            {tipo === 'residente' && (
              <>
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 20px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                    👤 Información Personal
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div><strong>DNI:</strong> {elemento.dni}</div>
                    <div><strong>Edad:</strong> {calcularEdad(elemento.fecha_nacimiento)} años</div>
                    <div><strong>Fecha nacimiento:</strong> {new Date(elemento.fecha_nacimiento).toLocaleDateString('es-ES')}</div>
                    <div><strong>Teléfono:</strong> {elemento.telefono || 'No disponible'}</div>
                    <div><strong>Ciudad origen:</strong> {elemento.ciudad}</div>
                    <div><strong>Código postal:</strong> {elemento.codigo_postal}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Dirección anterior:</strong> {elemento.direccion}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 20px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                    🏥 Información de Dependencia
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div><strong>Grado dependencia:</strong> {formatearGradoDependencia(elemento.grado_dependencia)}</div>
                    <div><strong>Fecha ingreso:</strong> {new Date(elemento.fecha_ingreso).toLocaleDateString('es-ES')}</div>
                    <div>
                      <strong>Estado:</strong> 
                      <span style={{ 
                        color: elemento.estado === 'activo' ? '#28a745' : '#dc3545',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                      }}>
                        {elemento.estado}
                      </span>
                    </div>
                    <div><strong>Días en residencia:</strong> {Math.floor((new Date() - new Date(elemento.fecha_ingreso)) / (1000 * 60 * 60 * 24))} días</div>
                  </div>
                </div>

                {elemento.contacto_emergencia_nombre && (
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 20px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                      📞 Contacto de Emergencia
                    </h3>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        <div><strong>Nombre:</strong> {elemento.contacto_emergencia_nombre}</div>
                        <div><strong>Teléfono:</strong> {elemento.contacto_emergencia_telefono}</div>
                        <div><strong>Parentesco:</strong> {elemento.contacto_emergencia_parentesco}</div>
                      </div>
                    </div>
                  </div>
                )}

                {residencia && (
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 20px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                      🏠 Residencia Asignada
                    </h3>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                        {residencia.nombre}
                      </h4>
                      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                        📍 {residencia.direccion}, {residencia.poblacion}<br />
                        📞 {residencia.telefono_fijo} • ✉️ {residencia.email}
                      </p>
                    </div>
                  </div>
                )}

                {elemento.observaciones_medicas && (
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 20px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                      📋 Observaciones Médicas
                    </h3>
                    <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
                      <p style={{ margin: '0', color: '#856404' }}>{elemento.observaciones_medicas}</p>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', color: '#2c3e50', margin: '0 0 20px 0', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                    ℹ️ Información del Sistema
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px', color: '#666' }}>
                    <div><strong>Creado por:</strong> {elemento.creado_por || 'Sistema'}</div>
                    <div><strong>Fecha creación:</strong> {new Date(elemento.fecha_creacion).toLocaleDateString('es-ES')}</div>
                    {elemento.fecha_modificacion && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Última modificación:</strong> {new Date(elemento.fecha_modificacion).toLocaleString('es-ES')}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
{fichaVisible && (
  <FichaModal
    elemento={fichaVisible.elemento}
    tipo={fichaVisible.tipo}
    onCerrar={() => setFichaVisible(null)}
  />
)}

          </div>
        </div>
      </div>
    );
  }

  // Formulario paso a paso
  if (formularioActivo) {
    const formulario = formularios[formularioActivo];
    const campoActual = formulario[pasoActual];
    
    return (
      <div style={{ 
        backgroundColor: '#2c3e50', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          backgroundColor: 'white', padding: '60px 40px', borderRadius: '10px', maxWidth: '600px', width: '90%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {editandoElemento ? 'Editando' : 'Creando'} {formularioActivo} • {pasoActual + 1} de {formulario.length}
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px', marginBottom: '20px' }}>
              <div style={{ 
                width: `${((pasoActual + 1) / formulario.length) * 100}%`, height: '100%', backgroundColor: '#2c3e50',
                borderRadius: '2px', transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '30px', lineHeight: '1.3' }}>
            {campoActual.label}
            {campoActual.req && <span style={{ color: '#e74c3c' }}> *</span>}
          </h2>

          <div style={{ marginBottom: '40px' }}>
            {renderCampoFormulario(campoActual)}
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
              disabled={campoActual.req && !datosFormulario[campoActual.campo]}
              style={{ 
                padding: '15px 30px', fontSize: '16px', 
                backgroundColor: (campoActual.req && !datosFormulario[campoActual.campo]) ? '#ccc' : '#2c3e50',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: (campoActual.req && !datosFormulario[campoActual.campo]) ? 'not-allowed' : 'pointer'
              }}
            >
              {pasoActual === formulario.length - 1 ? (editandoElemento ? 'Actualizar' : 'Crear') : 'Siguiente'}
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>🔧 Panel de Desarrollador</h1>
              <p style={{ margin: '0', opacity: 0.8 }}>Gestión completa del sistema</p>
            </div>
            <button 
              onClick={() => {
                if (confirm('¿Seguro que deseas cerrar sesión?')) {
                  localStorage.removeItem('sesion_activa');
                  window.location.href = '/login';
                }
              }}
              style={{ 
                padding: '12px 20px', 
                fontSize: '14px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[
            { label: 'Directores', count: directores.length, color: '#2c3e50' },
	    { label: 'Empresas', count: empresas.length, color: '#17a2b8' },            
	    { label: 'Residencias', count: residencias.length, color: '#007bff' },
            { label: 'Trabajadores', count: personal.length, color: '#28a745' },
            { label: 'Residentes', count: residentes.length, color: '#6f42c1' },
            { label: 'En Papelera', count: papelera.length, color: '#dc3545' }
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', color: '#333', margin: '0 0 10px 0' }}>{stat.label}</h3>
              <p style={{ fontSize: '32px', color: stat.color, margin: '0', fontWeight: 'bold' }}>{stat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buscador Global */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 20px' }}>
        <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => manejarCambioBusqueda(e.target.value)}
                onKeyDown={manejarTeclaBusqueda}
                placeholder="Buscar directores, residencias, trabajadores o residentes... (por nombre, DNI, email, etc.)"
                style={{
                  width: '100%',
                  padding: '15px 50px 15px 15px',
                  fontSize: '16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
              
              {busqueda && (
                <button
                  onClick={limpiarBusqueda}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    color: '#6c757d',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              onClick={ejecutarBusqueda}
              disabled={!busqueda.trim()}
              style={{
                padding: '15px 25px',
                backgroundColor: busqueda.trim() ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: busqueda.trim() ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap'
              }}
            >
              🔍 Buscar
            </button>
          </div>

          {/* Sugerencias */}
          {sugerencias.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '20px',
              right: '20px',
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              zIndex: 100,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {sugerencias.map((sugerencia, index) => (
                <div
                  key={`${sugerencia.tipo}-${sugerencia.id}`}
                  onClick={() => seleccionarSugerencia(sugerencia)}
                  style={{
                    padding: '12px 15px',
                    cursor: 'pointer',
                    borderBottom: index < sugerencias.length - 1 ? '1px solid #f8f9fa' : 'none',
                    backgroundColor: index === indiceSugerencia ? '#f8f9fa' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{sugerencia.icono}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: sugerencia.color }}>{sugerencia.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{sugerencia.subtitulo}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#999' }}>
                    Coincide: {sugerencia.coincidencias.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones de búsqueda */}
        {!mostrandoResultados && !sugerencias.length && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '15px', fontSize: '14px' }}>
            💡 Escribe para buscar por nombre, DNI, email, teléfono, etc. Usa las flechas ↑↓ para navegar y Enter para seleccionar
          </div>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {mostrandoResultados && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 30px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #dee2e6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', margin: '0', color: '#2c3e50' }}>
                  🔍 Resultados de búsqueda: "{busqueda}"
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                    ({resultadosBusqueda.length} resultado{resultadosBusqueda.length !== 1 ? 's' : ''})
                  </span>
                </h3>
                <button
                  onClick={limpiarBusqueda}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕ Limpiar
                </button>
              </div>
            </div>

            {resultadosBusqueda.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No se encontraron resultados</h3>
                <p style={{ fontSize: '14px', margin: '0' }}>Prueba con otros términos de búsqueda</p>
              </div>
            ) : (
              resultadosBusqueda.map((resultado, index) => (
                <div key={`${resultado.tipo}-${resultado.id}`} style={{ 
                  padding: '20px', 
                  borderBottom: index < resultadosBusqueda.length - 1 ? '1px solid #f1f3f4' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px', marginRight: '10px' }}>{resultado.icono}</span>
                        <h4 style={{ 
                          fontSize: '18px', 
                          margin: '0 10px 0 0', 
                          color: resultado.color
                        }}>
                          {resultado.nombre}
                        </h4>
                        <span style={{
                          fontSize: '12px',
                          backgroundColor: resultado.color,
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {resultado.tipo}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        {resultado.subtitulo}
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#28a745' }}>
                        ✓ Coincidencias encontradas en: {resultado.coincidencias.join(', ')}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                      <button 
                        onClick={() => mostrarFicha(resultado.elemento, resultado.tipo)}
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '14px', 
                          backgroundColor: '#17a2b8', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '5px', 
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => iniciarFormulario(resultado.tipo, resultado.elemento)}
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '14px', 
                          backgroundColor: '#007bff', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '5px', 
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => eliminarElemento(resultado.elemento, resultado.tipo)}
                        style={{ 
                          padding: '8px 16px', 
                          fontSize: '14px', 
                          backgroundColor: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '5px', 
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

{/* Navigation */}
      {!mostrandoResultados && (
        <ResponsiveNav
          items={[
            { id: 'directores', label: 'Directores', icon: '👨‍💼' },
            { id: 'empresas', label: 'Empresas', icon: '🏢' },
            { id: 'residencias', label: 'Residencias', icon: '🏢' },
            { id: 'trabajadores', label: 'Trabajadores', icon: '👥' },
            { id: 'residentes', label: 'Residentes', icon: '🧓' },
            { id: 'papelera', label: 'Papelera', icon: '🗑️' }
          ]}
          vistaActual={vistaActual}
          onCambiarVista={setVistaActual}
        />
      )}


      {/* Content */}
      {!mostrandoResultados && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          {vistaActual === 'directores' && (
            <DirectoresView
              directores={directores}
              onRecargarDatos={cargarTodosDatos}
              onMostrarFicha={(d) => mostrarFicha(d, 'director')}
    	      onIniciarFormulario={(tipo, elemento) => iniciarFormulario(tipo, elemento)}
              onEliminar={(d) => eliminarElemento(d, 'director')}
            />
          )}
          {vistaActual === 'empresas' && (
            <EmpresasView
              empresas={empresas}
              onRecargarDatos={cargarTodosDatos}
              onMostrarFicha={(e) => mostrarFicha(e, 'empresa')}
              onIniciarFormulario={iniciarFormulario}
              onEliminar={(e) => eliminarElemento(e, 'empresa')}
            />
          )}

          {vistaActual === 'residencias' && (
            <ResidenciasView
              residencias={residencias}
              directores={directores}
              onRecargarDatos={cargarTodosDatos}
              onMostrarFicha={(r) => mostrarFicha(r, 'residencia')}
              onIniciarFormulario={iniciarFormulario}
              onEliminar={(r) => eliminarElemento(r, 'residencia')}
            />
          )}

          {vistaActual === 'trabajadores' && (
            <TrabajadoresView
	    key={personal.length}
	    personal={personal}
	    residencias={residencias}
	    directores={directores}
	    onRecargarDatos={cargarTodosDatos}
	    onMostrarFicha={(t) => mostrarFicha(t, 'trabajador')}
	    onIniciarFormulario={(tipo, elemento) => iniciarFormulario(tipo, elemento)}
	    onEliminar={(t) => eliminarElemento(t, 'trabajador')}
            />
          )}

          {vistaActual === 'residentes' && (
            <ResidentesView
              residentes={residentes}
              residencias={residencias}
              onRecargarDatos={cargarTodosDatos}
              onMostrarFicha={(r) => mostrarFicha(r, 'residente')}
            onIniciarFormulario={(tipo, elemento) => iniciarFormulario(tipo, elemento)}
              onEliminar={(r) => eliminarElemento(r, 'residente')}
            />
          )}
	{vistaActual === 'papelera' && (
            <PapeleraView  
              usuarioId={JSON.parse(localStorage.getItem('sesion_activa') || '{}').usuarioId || ''}
              rol="superadmin"
              onRecargar={cargarTodosDatos}
            />
          )}
        </div>
      )}

      {/* Modal de Ficha Detallada */}
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
	{modalCrearVisible && (
        <CrearUsuarioModal
          rolPorDefecto={modalCrearVisible}
          onClose={() => setModalCrearVisible(null)}
          onSuccess={() => cargarTodosDatos()}
        />
      )}
	{modalCrearVisible && (
        <CrearUsuarioModal
          rolPorDefecto={modalCrearVisible}
          onClose={() => setModalCrearVisible(null)}
          onSuccess={() => cargarTodosDatos()}
        />
      )}
    </div>
  );
};

export default PanelDesarrollador;
