import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { supabase } from '../../../lib/supabase';

// Función auxiliar para obtener detalle completo de los partes
const obtenerPartesCompletos = async (partesIds: string[]) => {
  const partesCompletos = [];
  
  for (const id of partesIds) {
    const { data } = await supabase.rpc('obtener_parte_completo', {
      p_parte_id: id
    });
    if (data) partesCompletos.push(data);
  }
  
  return partesCompletos;
};

export const generarPDFConsolidado = async (partes: any[], filtros: any) => {
  // Obtener detalle completo de todos los partes
  const partesCompletos = await obtenerPartesCompletos(partes.map(p => p.id));
  
  const doc = new jsPDF();
  let currentPage = 1;
  
  // PÁGINA 1: RESUMEN
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('INFORME DE PARTES DIARIOS', 105, 22, { align: 'center' });
  doc.setFont(undefined, 'normal');
  
  doc.setFontSize(10);
  let y = 35;
  doc.text('Filtros aplicados:', 14, y);
  y += 6;
  
  if (filtros.fecha_desde) {
    doc.text(`Desde: ${new Date(filtros.fecha_desde).toLocaleDateString('es-ES')}`, 20, y);
    y += 5;
  }
  if (filtros.fecha_hasta) {
    doc.text(`Hasta: ${new Date(filtros.fecha_hasta).toLocaleDateString('es-ES')}`, 20, y);
    y += 5;
  }
  if (filtros.residencia_id && partes.length > 0) {
    doc.text(`Residencia: ${partes[0].residencia_nombre}`, 20, y);
    y += 5;
  }
  if (filtros.trabajador_id && partes.length > 0) {
    doc.text(`Trabajador: ${partes[0].trabajador_nombre}`, 20, y);
    y += 5;
  }
  if (filtros.solo_incidencias) {
    doc.text('Solo partes con incidencias', 20, y);
    y += 5;
  }
  
  y += 10;
  const totalIncidencias = partes.reduce((sum, p) => sum + (p.residentes_con_incidencias || 0), 0);
  const totalResidentes = partesCompletos.reduce((sum, p) => sum + (p.residentes?.length || 0), 0);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('RESUMEN GENERAL:', 14, y);
  y += 8;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Total de partes: ${partes.length}`, 20, y);
  y += 6;
  doc.text(`Total de registros de residentes: ${totalResidentes}`, 20, y);
  y += 6;
  doc.text(`Total de incidencias reportadas: ${totalIncidencias}`, 20, y);
  y += 15;
  
  // Tabla resumen de partes
  const tableData = partes.map(parte => [
    new Date(parte.fecha).toLocaleDateString('es-ES'),
    parte.residencia_nombre,
    parte.trabajador_nombre,
    parte.total_residentes.toString(),
    parte.residentes_con_incidencias.toString()
  ]);
  
  autoTable(doc, {
    startY: y,
    head: [['Fecha', 'Residencia', 'Trabajador', 'Residentes', 'Incidencias']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], fontStyle: 'bold' },
    columnStyles: {
      4: { halign: 'center', textColor: [220, 53, 69], fontStyle: 'bold' }
    }
  });
  
  // PÁGINAS SIGUIENTES: DETALLE COMPLETO DE CADA PARTE
  partesCompletos.forEach((parte, parteIndex) => {
    doc.addPage();
    currentPage++;
    
    // Encabezado
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`PARTE DIARIO ${parteIndex + 1} DE ${partesCompletos.length}`, 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(parte.fecha).toLocaleDateString('es-ES')} - ${parte.hora || 'Sin hora'}`, 105, 25, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    let yPos = 45;
    
    // Información general
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('INFORMACIÓN GENERAL', 14, yPos);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    yPos += 6;
    
    doc.text(`Residencia: ${parte.residencia_nombre}`, 14, yPos);
    yPos += 5;
    doc.text(`Dirección: ${parte.residencia_direccion || 'N/A'}`, 14, yPos);
    yPos += 5;
    doc.text(`Trabajador: ${parte.trabajador_nombre} (${parte.trabajador_dni || 'N/A'})`, 14, yPos);
    yPos += 5;
    doc.text(`Titulación: ${parte.trabajador_titulacion || 'N/A'}`, 14, yPos);
    yPos += 10;
    
    // Estadísticas
    doc.setFont(undefined, 'bold');
    doc.text('ESTADÍSTICAS DEL PARTE', 14, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 6;
    doc.text(`Total residentes: ${parte.total_residentes}`, 14, yPos);
    yPos += 5;
    
    if (parte.residentes_con_incidencias > 0) {
      doc.setTextColor(220, 53, 69);
      doc.setFont(undefined, 'bold');
    }
    doc.text(`Residentes con incidencias: ${parte.residentes_con_incidencias}`, 14, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    yPos += 10;
    
    // Detalle de cada residente
    if (parte.residentes && parte.residentes.length > 0) {
      parte.residentes.forEach((residente: any, index: number) => {
        // Verificar si necesitamos nueva página
        if (yPos > 250) {
          doc.addPage();
          currentPage++;
          yPos = 20;
          doc.setFontSize(10);
          doc.text(`Parte ${parteIndex + 1} (continuación)`, 14, yPos);
          yPos += 10;
        }
        
        // Encabezado del residente
        doc.setFillColor(240, 240, 240);
        doc.rect(12, yPos - 4, 186, 8, 'F');
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${residente.residente_nombre}`, 14, yPos);
        
        if (residente.tiene_incidencia) {
          doc.setTextColor(220, 53, 69);
          doc.text('⚠ INCIDENCIA', 170, yPos);
          doc.setTextColor(0, 0, 0);
        }
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        yPos += 8;
        
        // Datos básicos
        doc.text(`DNI: ${residente.residente_dni || 'N/A'}`, 14, yPos);
        doc.text(`Habitación: ${residente.residente_habitacion || 'N/A'}`, 70, yPos);
        doc.text(`Dependencia: ${residente.grado_dependencia || 'N/A'}`, 130, yPos);
        yPos += 5;
        
        doc.text(`Estado general: ${residente.estado_general || 'N/A'}`, 14, yPos);
        doc.text(`Estado ánimo: ${residente.estado_animo || 'N/A'}`, 70, yPos);
        yPos += 6;
        
        // Incidencia
        if (residente.tiene_incidencia) {
          doc.setFont(undefined, 'bold');
          doc.setTextColor(220, 53, 69);
          doc.text(`INCIDENCIA (${residente.tipo_incidencia || 'No especificado'}):`, 14, yPos);
          doc.setFont(undefined, 'normal');
          yPos += 4;
          const incidenciaLines = doc.splitTextToSize(residente.descripcion_incidencia || 'Sin descripción', 180);
          doc.text(incidenciaLines, 14, yPos);
          yPos += (incidenciaLines.length * 4) + 2;
          doc.setTextColor(0, 0, 0);
        }
        
        // Alimentación
        doc.setFont(undefined, 'bold');
        doc.text('Alimentación:', 14, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 4;
        doc.text(`Desayuno: ${residente.comida_desayuno || 'N/A'}`, 20, yPos);
        doc.text(`Almuerzo: ${residente.comida_almuerzo || 'N/A'}`, 70, yPos);
        yPos += 4;
        doc.text(`Merienda: ${residente.comida_merienda || 'N/A'}`, 20, yPos);
        doc.text(`Cena: ${residente.comida_cena || 'N/A'}`, 70, yPos);
        yPos += 6;
        
        // Higiene
        doc.setFont(undefined, 'bold');
        doc.text('Higiene:', 14, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 4;
        doc.text(`Realizada: ${residente.higiene_realizada ? 'Sí' : 'No'}`, 20, yPos);
        yPos += 4;
        if (residente.higiene_observaciones) {
          const higieneLines = doc.splitTextToSize(`Obs: ${residente.higiene_observaciones}`, 180);
          doc.text(higieneLines, 20, yPos);
          yPos += (higieneLines.length * 4);
        }
        yPos += 2;
        
        // Medicación
        doc.setFont(undefined, 'bold');
        doc.text('Medicación:', 14, yPos);
        doc.setFont(undefined, 'normal');
        yPos += 4;
        doc.text(`Administrada: ${residente.medicacion_administrada ? 'Sí' : 'No'}`, 20, yPos);
        yPos += 4;
        if (residente.medicacion_observaciones) {
          const medLines = doc.splitTextToSize(`Obs: ${residente.medicacion_observaciones}`, 180);
          doc.text(medLines, 20, yPos);
          yPos += (medLines.length * 4);
        }
        yPos += 2;
        
        // Actividades
        if (residente.actividades_realizadas) {
          doc.setFont(undefined, 'bold');
          doc.text('Actividades:', 14, yPos);
          doc.setFont(undefined, 'normal');
          yPos += 4;
          const actLines = doc.splitTextToSize(residente.actividades_realizadas, 180);
          doc.text(actLines, 20, yPos);
          yPos += (actLines.length * 4) + 2;
        }
        
        // Observaciones generales
        if (residente.observaciones_generales) {
          doc.setFont(undefined, 'bold');
          doc.text('Observaciones:', 14, yPos);
          doc.setFont(undefined, 'normal');
          yPos += 4;
          const obsLines = doc.splitTextToSize(residente.observaciones_generales, 180);
          doc.text(obsLines, 20, yPos);
          yPos += (obsLines.length * 4);
        }
        // Campos adicionales
        if (residente.movilidad || residente.sueno || residente.hidratacion) {
          doc.setFont(undefined, 'bold');
          doc.text('Otros datos:', 14, yPos);
          doc.setFont(undefined, 'normal');
          yPos += 4;
          if (residente.movilidad) {
            doc.text(`Movilidad: ${residente.movilidad}`, 20, yPos);
            yPos += 4;
          }
          if (residente.sueno) {
            doc.text(`Sueño: ${residente.sueno}`, 20, yPos);
            yPos += 4;
          }
          if (residente.hidratacion) {
            doc.text(`Hidratación: ${residente.hidratacion}`, 20, yPos);
            yPos += 4;
          }
          if (residente.estado_piel) {
            doc.text(`Estado piel: ${residente.estado_piel}`, 20, yPos);
            yPos += 4;
          }
          if (residente.control_esfinteres) {
            doc.text(`Control esfínteres: ${residente.control_esfinteres}`, 20, yPos);
            yPos += 4;
          }
          if (residente.temperatura && residente.temperatura !== '-') {
            doc.text(`Temperatura: ${residente.temperatura}`, 20, yPos);
            yPos += 4;
          }
          if (residente.tension_arterial && residente.tension_arterial !== '-') {
            doc.text(`Tensión arterial: ${residente.tension_arterial}`, 20, yPos);
            yPos += 4;
          }
          if (residente.glucemia && residente.glucemia !== '-') {
            doc.text(`Glucemia: ${residente.glucemia}`, 20, yPos);
            yPos += 4;
          }
          yPos += 2;
        }

        yPos += 8; // Espacio entre residentes
      });
    }
    
    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generado el ${new Date().toLocaleString('es-ES')} | Página ${currentPage}`, 105, 285, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  });
  
  // Descargar
  const fecha = new Date().toISOString().split('T')[0];
  doc.save(`partes-consolidado-completo-${fecha}.pdf`);
};

export const exportarAExcel = async (partes: any[], filtros: any) => {
  // Obtener detalle completo
  const partesCompletos = await obtenerPartesCompletos(partes.map(p => p.id));
  
  const wb = XLSX.utils.book_new();
  
  // HOJA 1: RESUMEN
  const totalIncidencias = partes.reduce((sum, p) => sum + (p.residentes_con_incidencias || 0), 0);
  const totalResidentes = partesCompletos.reduce((sum, p) => sum + (p.residentes?.length || 0), 0);
  
  const resumen = [{
    'Total Partes': partes.length,
    'Total Registros Residentes': totalResidentes,
    'Total Incidencias': totalIncidencias,
    'Período Desde': filtros.fecha_desde ? new Date(filtros.fecha_desde).toLocaleDateString('es-ES') : 'Todos',
    'Período Hasta': filtros.fecha_hasta ? new Date(filtros.fecha_hasta).toLocaleDateString('es-ES') : 'Todos',
    'Residencia': filtros.residencia_id ? partes[0]?.residencia_nombre : 'Todas',
    'Solo Incidencias': filtros.solo_incidencias ? 'Sí' : 'No'
  }];
  
  const wsResumen = XLSX.utils.json_to_sheet(resumen);
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
// HOJA 2: DETALLE COMPLETO (FORMATO VERTICAL - 1 FILA POR CAMPO)
  const datosCompletos: any[] = [];
  
  partesCompletos.forEach(parte => {
    if (parte.residentes && parte.residentes.length > 0) {
      parte.residentes.forEach((res: any) => {
        const baseInfo = {
          'Fecha Parte': new Date(parte.fecha).toLocaleDateString('es-ES'),
          'Hora': parte.hora || 'Sin hora',
          'Residencia': parte.residencia_nombre,
          'Trabajador': parte.trabajador_nombre,
          'Residente': res.residente_nombre,
          'DNI Residente': res.residente_dni || 'N/A',
          'Habitación': res.residente_habitacion || 'N/A'
        };
        
// Crear una fila por cada campo del residente
        const campos = [
          { campo: 'Grado Dependencia', valor: res.grado_dependencia || 'N/A' },
          { campo: 'Estado General', valor: res.estado_general || 'N/A' },
          { campo: 'Estado Ánimo', valor: res.estado_animo || 'N/A' },
          { campo: 'Tiene Incidencia', valor: res.tiene_incidencia ? 'SÍ' : 'No' },
          { campo: 'Tipo Incidencia', valor: res.tipo_incidencia || '' },
          { campo: 'Descripción Incidencia', valor: res.descripcion_incidencia || '' },
          { campo: 'Desayuno', valor: res.comida_desayuno || 'N/A' },
          { campo: 'Almuerzo', valor: res.comida_almuerzo || 'N/A' },
          { campo: 'Cena', valor: res.comida_cena || 'N/A' },
          { campo: 'Higiene Realizada', valor: res.higiene_realizada ? 'Sí' : 'No' },
          { campo: 'Observaciones Higiene', valor: res.higiene_observaciones || '' },
          { campo: 'Medicación Administrada', valor: res.medicacion_administrada ? 'Sí' : 'No' },
          { campo: 'Observaciones Medicación', valor: res.medicacion_observaciones || '' },
          { campo: 'Actividades Realizadas', valor: res.actividades_realizadas || '' },
          { campo: 'Observaciones Generales', valor: res.observaciones_generales || '' },
          { campo: 'Movilidad', valor: res.movilidad || 'N/A' },
          { campo: 'Sueño', valor: res.sueno || 'N/A' },
          { campo: 'Hidratación', valor: res.hidratacion || 'N/A' },
          { campo: 'Estado Piel', valor: res.estado_piel || 'N/A' },
          { campo: 'Control Esfínteres', valor: res.control_esfinteres || 'N/A' },
          { campo: 'Cambios Posturales', valor: res.cambios_posturales || 'N/A' },
          { campo: 'Temperatura', valor: res.temperatura || 'N/A' },
          { campo: 'Tensión Arterial', valor: res.tension_arterial || 'N/A' },
          { campo: 'Glucemia', valor: res.glucemia || 'N/A' },
          { campo: 'Visita Médico', valor: res.visita_medico || 'N/A' },
          { campo: 'Visitas Familiares', valor: res.visitas_familiares || 'N/A' }
        ];
        
        // Agregar una fila por cada campo
        campos.forEach(c => {
          datosCompletos.push({
            ...baseInfo,
            'Campo': c.campo,
            'Valor': c.valor
          });
        });
      });
    }
  });
  
  const wsCompleto = XLSX.utils.json_to_sheet(datosCompletos);
  wsCompleto['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 10 }, // Hora
    { wch: 25 }, // Residencia
    { wch: 25 }, // Trabajador
    { wch: 25 }, // Residente
    { wch: 12 }, // DNI
    { wch: 12 }, // Habitación
    { wch: 25 }, // Campo
    { wch: 50 }  // Valor
  ];
  XLSX.utils.book_append_sheet(wb, wsCompleto, 'Detalle Completo');
    
  // Descargar
  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `partes-consolidado-completo-${fecha}.xlsx`);
};

