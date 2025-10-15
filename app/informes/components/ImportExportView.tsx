"use client";
import React, { useRef, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import * as XLSX from 'xlsx';

interface ImportExportViewProps {
  directorId: string;
  residencias: any[];
  trabajadores: any[];
  residentes: any[];
  onRecargar: () => void;
}

type Reporte = {
  residencias: { creadas: number; errores: string[] };
  trabajadores: { creados: number; errores: string[]; contraseñas: Array<{email: string; password: string}> };
  residentes: { creados: number; errores: string[] };
};

export default function ImportExportView({
  directorId,
  residencias,
  trabajadores,
  residentes,
  onRecargar
}: ImportExportViewProps) {
  const [procesando, setProcesando] = useState(false);
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // SECCIÓN A: DESCARGAR PLANTILLA
  // ============================================
  const descargarPlantilla = () => {
    const wb = XLSX.utils.book_new();

    const residenciasPlantilla = [{
      nombre: 'Residencia Ejemplo',
      direccion: 'Calle Principal 123',
      codigo_postal: '28001',
      poblacion: 'Madrid',
      telefono_fijo: '911234567',
      telefono_movil: '612345678',
      email: 'contacto@residencia.com',
      total_plazas: 50,
      plazas_ocupadas: 30,
      cif: 'A12345678',
      numero_licencia: 'LIC-2024-001',
      empresa_facturacion_id: ''
    }];

    const trabajadoresPlantilla = [{
      nombre: 'Juan',
      apellidos: 'García López',
      dni: '12345678A',
      email: 'juan.garcia@email.com',
      telefono: '612345678',
      fecha_nacimiento: '1990-01-15',
      direccion: 'Calle Secundaria 45',
      codigo_postal: '28002',
      ciudad: 'Madrid',
      titulacion: 'Auxiliar de Enfermería',
      numero_colegiado: 'COL12345',
      turno: 'mañana',
      residencia_cif: 'A12345678',
      fecha_inicio: '2024-01-01'
    }];

    const residentesPlantilla = [{
      nombre: 'María',
      apellidos: 'Martínez Ruiz',
      dni: '87654321B',
      fecha_nacimiento: '1940-05-20',
      telefono: '623456789',
      direccion: 'Avenida Principal 78',
      codigo_postal: '28003',
      ciudad: 'Madrid',
      grado_dependencia: 'grado_ii',
      residencia_cif: 'A12345678',
      fecha_ingreso: '2024-02-01',
      contacto_emergencia_nombre: 'Pedro Martínez',
      contacto_emergencia_telefono: '634567890',
      contacto_emergencia_parentesco: 'Hijo',
      observaciones_medicas: 'Diabetes tipo 2'
    }];

    const ws1 = XLSX.utils.json_to_sheet(residenciasPlantilla);
    const ws2 = XLSX.utils.json_to_sheet(trabajadoresPlantilla);
    const ws3 = XLSX.utils.json_to_sheet(residentesPlantilla);

    XLSX.utils.book_append_sheet(wb, ws1, 'Residencias');
    XLSX.utils.book_append_sheet(wb, ws2, 'Trabajadores');
    XLSX.utils.book_append_sheet(wb, ws3, 'Residentes');

    XLSX.writeFile(wb, 'plantilla_importacion.xlsx');
  };

// Función para convertir fechas de Excel a YYYY-MM-DD
  const convertirFechaExcel = (valor: any): string | null => {
    if (!valor) return null;
    
    // Si ya es string en formato correcto, retornar
    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return valor;
    }
    
    // Si es número serial de Excel
    if (typeof valor === 'number') {
      // Excel cuenta desde 1900-01-01 (con bug del año 1900)
      const excelEpoch = new Date(1899, 11, 30);
      const fecha = new Date(excelEpoch.getTime() + valor * 86400000);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return null;
  };

  // ============================================
  // SECCIÓN B: IMPORTAR Y PROCESAR
  // ============================================
  const procesarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcesando(true);
    setReporte(null);

    const reporteResultado: Reporte = {
      residencias: { creadas: 0, errores: [] },
      trabajadores: { creados: 0, errores: [], contraseñas: [] },
      residentes: { creados: 0, errores: [] }
    };

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);

      const hojaResidencias = XLSX.utils.sheet_to_json(wb.Sheets['Residencias'] || {}) as any[];
      const hojaTrabajadores = XLSX.utils.sheet_to_json(wb.Sheets['Trabajadores'] || {}) as any[];
      const hojaResidentes = XLSX.utils.sheet_to_json(wb.Sheets['Residentes'] || {}) as any[];

      // ============================================
      // PASO 1: RESIDENCIAS
      // ============================================
      for (let i = 0; i < hojaResidencias.length; i++) {
        const row = hojaResidencias[i];
        try {
          const obligatorios = ['nombre', 'direccion', 'codigo_postal', 'poblacion', 'telefono_fijo', 'email', 'total_plazas', 'plazas_ocupadas', 'cif', 'numero_licencia'];
          const faltantes = obligatorios.filter(c => !row[c]);
          if (faltantes.length > 0) throw new Error(`Campos faltantes: ${faltantes.join(', ')}`);

          const { data: existe } = await supabase.rpc('verificar_residencia_existe', {
            p_cif: row.cif,
            p_director_id: directorId
          });

          if (existe) {
            reporteResultado.residencias.errores.push(`Fila ${i + 2}: CIF ${row.cif} ya existe (omitida)`);
          } else {
            const { data, error } = await supabase.rpc('crear_residencia', {
              p_nombre: row.nombre,
              p_direccion: row.direccion,
              p_codigo_postal: String(row.codigo_postal),
              p_poblacion: row.poblacion,
              p_telefono_fijo: String(row.telefono_fijo),
              p_telefono_movil: row.telefono_movil ? String(row.telefono_movil) : null,
              p_email: row.email,
              p_total_plazas: parseInt(row.total_plazas),
              p_plazas_ocupadas: parseInt(row.plazas_ocupadas),
              p_cif: row.cif,
              p_numero_licencia: row.numero_licencia,
              p_director_id: directorId,
              p_empresa_id: null,
              p_empresa_facturacion_id: row.empresa_facturacion_id || null
            });

            if (error) throw error;
            if (data && !data.success) throw new Error(data.error);
            reporteResultado.residencias.creadas++;
          }
        } catch (err: any) {
          reporteResultado.residencias.errores.push(`Fila ${i + 2}: ${err.message}`);
        }
      }

// ============================================
      // PASO 2: TRABAJADORES
      // ============================================
      for (let i = 0; i < hojaTrabajadores.length; i++) {
        const row = hojaTrabajadores[i];
        try {
          const obligatorios = ['nombre', 'apellidos', 'dni', 'email', 'telefono', 'fecha_nacimiento', 'direccion', 'codigo_postal', 'ciudad', 'titulacion', 'residencia_cif', 'fecha_inicio'];
          const faltantes = obligatorios.filter(c => !row[c]);
          if (faltantes.length > 0) throw new Error(`Campos faltantes: ${faltantes.join(', ')}`);

          // Verificar si el email ya existe
          const { data: usuarioExiste } = await supabase
            .from('usuarios')
            .select('email')
            .eq('email', row.email)
            .single();

          if (usuarioExiste) {
            reporteResultado.trabajadores.errores.push(`Fila ${i + 2}: Email ${row.email} ya existe (omitido)`);
            continue;
          }

          // Obtener ID de residencia
          const { data: residenciaId } = await supabase.rpc('obtener_residencia_por_cif', {
            p_cif: row.residencia_cif,
            p_director_id: directorId
          });

          if (!residenciaId) throw new Error(`No se encontró residencia con CIF: ${row.residencia_cif}`);

          const password = `Temp${Math.floor(Math.random() * 10000)}`;

          const response = await fetch('https://pwryrzmniqjrhikspqoz.supabase.co/functions/v1/create-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              email: row.email,
              password,
              nombre: row.nombre,
              apellidos: row.apellidos,
              dni: row.dni,
              rol: 'trabajador',
              telefono: String(row.telefono),
              fecha_nacimiento: convertirFechaExcel(row.fecha_nacimiento),
              direccion: row.direccion,
              codigo_postal: String(row.codigo_postal),
              ciudad: row.ciudad,
              titulacion: row.titulacion,
              numero_colegiado: row.numero_colegiado || null,
              turno: row.turno || null,
              fecha_inicio: convertirFechaExcel(row.fecha_inicio),
              residencia_id: residenciaId
            })
          });

          const result = await response.json();
          if (!result?.success) throw new Error(result?.error || 'Error creando trabajador');

          reporteResultado.trabajadores.creados++;
          reporteResultado.trabajadores.contraseñas.push({ email: row.email, password });
        } catch (err: any) {
          reporteResultado.trabajadores.errores.push(`Fila ${i + 2}: ${err.message}`);
        }
      }
// ============================================
      // PASO 3: RESIDENTES
      // ============================================
      for (let i = 0; i < hojaResidentes.length; i++) {
        const row = hojaResidentes[i];
        try {
          const obligatorios = ['nombre', 'apellidos', 'dni', 'fecha_nacimiento', 'direccion', 'codigo_postal', 'ciudad', 'grado_dependencia', 'residencia_cif', 'fecha_ingreso', 'contacto_emergencia_nombre', 'contacto_emergencia_telefono', 'contacto_emergencia_parentesco'];
          const faltantes = obligatorios.filter(c => !row[c]);
          if (faltantes.length > 0) throw new Error(`Campos faltantes: ${faltantes.join(', ')}`);

          // Verificar si el DNI ya existe
          const { data: residenteExiste, error: errorBusqueda } = await supabase
            .from('residentes')
            .select('dni')
            .eq('dni', row.dni)
            .maybeSingle();

          if (errorBusqueda && errorBusqueda.code !== 'PGRST116') {
            throw new Error(`Error verificando DNI: ${errorBusqueda.message}`);
          }

          if (residenteExiste) {
            reporteResultado.residentes.errores.push(`Fila ${i + 2}: DNI ${row.dni} ya existe (omitido)`);
            continue;
          }

          // Obtener ID de residencia
          const { data: residenciaId } = await supabase.rpc('obtener_residencia_por_cif', {
            p_cif: row.residencia_cif,
            p_director_id: directorId
          });

          if (!residenciaId) throw new Error(`No se encontró residencia con CIF: ${row.residencia_cif}`);

          const { data, error } = await supabase.rpc('crear_residente', {
            p_nombre: row.nombre,
            p_apellidos: row.apellidos,
            p_dni: row.dni,
            p_fecha_nacimiento: convertirFechaExcel(row.fecha_nacimiento),
            p_telefono: row.telefono ? String(row.telefono) : null,
            p_direccion: row.direccion,
            p_codigo_postal: String(row.codigo_postal),
            p_ciudad: row.ciudad,
            p_grado_dependencia: row.grado_dependencia,
            p_residencia_id: residenciaId,
            p_fecha_ingreso: convertirFechaExcel(row.fecha_ingreso),
            p_contacto_emergencia_nombre: row.contacto_emergencia_nombre,
            p_contacto_emergencia_telefono: String(row.contacto_emergencia_telefono),
            p_contacto_emergencia_parentesco: row.contacto_emergencia_parentesco,
            p_observaciones_medicas: row.observaciones_medicas || null
          });

          if (error) throw error;
          if (data && !data.success) throw new Error(data.error);
          reporteResultado.residentes.creados++;
        } catch (err: any) {
          reporteResultado.residentes.errores.push(`Fila ${i + 2}: ${err.message}`);
        }
      }

      setReporte(reporteResultado);
      setTimeout(() => onRecargar(), 1500);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al procesar archivo');
    } finally {
      setProcesando(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ============================================
  // SECCIÓN C: EXPORTAR
  // ============================================
  const exportarTodo = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(residencias), 'Residencias');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(trabajadores), 'Trabajadores');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(residentes), 'Residentes');
    XLSX.writeFile(wb, `exportacion_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div style={{ display: 'grid', gap: '30px' }}>
      {/* DESCARGAR PLANTILLA */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>📥 Descargar Plantilla</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Descarga la plantilla Excel con el formato correcto.</p>
        <button onClick={descargarPlantilla} style={{ padding: '15px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
          📥 Descargar Plantilla Excel
        </button>
      </div>

      {/* IMPORTAR */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>📤 Importar Datos</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Sube tu archivo Excel completado.</p>

        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={procesarArchivo} disabled={procesando} style={{ display: 'none' }} id="file-upload" />
        <label htmlFor="file-upload" style={{ display: 'inline-block', padding: '15px 30px', backgroundColor: procesando ? '#ccc' : '#28a745', color: 'white', borderRadius: '8px', fontSize: '16px', cursor: procesando ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          {procesando ? '⏳ Procesando...' : '📤 Subir Archivo Excel'}
        </label>

        {reporte && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #28a745' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#28a745' }}>✅ Reporte de Importación</h3>

            <div style={{ marginBottom: '15px' }}>
              <strong>🏢 Residencias:</strong> {reporte.residencias.creadas} creadas
              {reporte.residencias.errores.length > 0 && (
                <div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                  <strong>⚠️ Errores:</strong>
                  {reporte.residencias.errores.map((err, i) => <div key={i} style={{ fontSize: '12px', color: '#856404' }}>• {err}</div>)}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>👥 Trabajadores:</strong> {reporte.trabajadores.creados} creados
              {reporte.trabajadores.contraseñas.length > 0 && (
                <div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '5px' }}>
                  <strong>🔑 Contraseñas generadas:</strong>
                  {reporte.trabajadores.contraseñas.map((t, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#0c5460' }}>• {t.email}: {t.password}</div>
                  ))}
                </div>
              )}
              {reporte.trabajadores.errores.length > 0 && (
                <div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                  <strong>⚠️ Errores:</strong>
                  {reporte.trabajadores.errores.map((err, i) => <div key={i} style={{ fontSize: '12px', color: '#856404' }}>• {err}</div>)}
                </div>
              )}
            </div>

            <div>
              <strong>🧓 Residentes:</strong> {reporte.residentes.creados} creados
              {reporte.residentes.errores.length > 0 && (
                <div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                  <strong>⚠️ Errores:</strong>
                  {reporte.residentes.errores.map((err, i) => <div key={i} style={{ fontSize: '12px', color: '#856404' }}>• {err}</div>)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* EXPORTAR */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>💾 Exportar Datos Actuales</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Exporta todos los datos actuales a un archivo Excel.</p>
        <button onClick={exportarTodo} style={{ padding: '15px 30px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
          💾 Exportar Todo a Excel
        </button>
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          <strong>Datos:</strong> {residencias.length} residencias, {trabajadores.length} trabajadores, {residentes.length} residentes
        </div>
      </div>
    </div>
  );
}
