import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const generarPDFConsolidado = (partes: any[], filtros: any) => {
  const doc = new jsPDF();
  let currentPage = 1;
  
  // PÁGINA 1: RESUMEN
  doc.setFontSize(18);
  doc.text('Informe de Partes Diarios', 14, 22);
  
  doc.setFontSize(10);
  let y = 32;
  doc.text('Filtros aplicados:', 14, y);
  y += 6;
  
  if (filtros.fecha_desde) {
    doc.text(`Desde: ${new Date(filtros.fecha_desde).toLocaleDateString('es-ES')}`, 14, y);
    y += 5;
  }
  if (filtros.fecha_hasta) {
    doc.text(`Hasta: ${new Date(filtros.fecha_hasta).toLocaleDateString('es-ES')}`, 14, y);
    y += 5;
  }
  if (filtros.residencia_id && partes.length > 0) {
    doc.text(`Residencia: ${partes[0].residencia_nombre}`, 14, y);
    y += 5;
  }
  if (filtros.solo_incidencias) {
    doc.text('Solo partes con incidencias', 14, y);
    y += 5;
  }
  
  y += 5;
  const totalIncidencias = partes.reduce((sum, p) => sum + (p.residentes_con_incidencias || 0), 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('RESUMEN:', 14, y);
  y += 8;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Total de partes: ${partes.length}`, 14, y);
  y += 6;
  doc.text(`Total incidencias: ${totalIncidencias}`, 14, y);
  y += 15;
  
  // Tabla resumen
  const tableData = partes.map(parte => [
    new Date(parte.fecha).toLocaleDateString('es-ES'),
    parte.residencia_nombre,
    parte.trabajador_nombre,
    parte.total_residentes.toString(),
    parte.residentes_con_incidencias.toString()
  ]);
  
  autoTable(doc, {
    startY: y,
    head: [['Fecha', 'Residencia', 'Trabajador', 'Total', 'Incidencias']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // PÁGINAS SIGUIENTES: DETALLE DE CADA PARTE
  partes.forEach((parte, index) => {
    doc.addPage();
    currentPage++;
    
    // Encabezado del parte
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`PARTE ${index + 1} DE ${partes.length}`, 14, 20);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    let yDetail = 35;
    
    doc.text(`Fecha: ${new Date(parte.fecha).toLocaleDateString('es-ES')}`, 14, yDetail);
    yDetail += 7;
    doc.text(`Hora: ${parte.hora || 'Sin especificar'}`, 14, yDetail);
    yDetail += 7;
    doc.text(`Residencia: ${parte.residencia_nombre}`, 14, yDetail);
    yDetail += 7;
    doc.text(`Trabajador: ${parte.trabajador_nombre}`, 14, yDetail);
    yDetail += 10;
    
    // Estadísticas del parte
    doc.setFont(undefined, 'bold');
    doc.text('Estadísticas:', 14, yDetail);
    doc.setFont(undefined, 'normal');
    yDetail += 7;
    doc.text(`Total de residentes atendidos: ${parte.total_residentes}`, 14, yDetail);
    yDetail += 7;
    
    const colorIncidencias = parte.residentes_con_incidencias > 0 ? [220, 53, 69] : [40, 167, 69];
    doc.setTextColor(colorIncidencias[0], colorIncidencias[1], colorIncidencias[2]);
    doc.text(`Residentes con incidencias: ${parte.residentes_con_incidencias}`, 14, yDetail);
    doc.setTextColor(0, 0, 0);
    yDetail += 10;
    
    // Información adicional
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Creado el: ${new Date(parte.created_at).toLocaleString('es-ES')}`, 14, yDetail);
    if (parte.updated_at !== parte.created_at) {
      yDetail += 5;
      doc.text(`Modificado el: ${new Date(parte.updated_at).toLocaleString('es-ES')}`, 14, yDetail);
    }
    doc.setTextColor(0, 0, 0);
    
    // Pie de página
    doc.setFontSize(8);
    doc.text(`Página ${currentPage} de ${partes.length + 1}`, 14, 285);
  });
  
  // Descargar
  const fecha = new Date().toISOString().split('T')[0];
  doc.save(`partes-consolidado-${fecha}.pdf`);
};

export const exportarAExcel = (partes: any[], filtros: any) => {
  // HOJA 1: RESUMEN
  const totalIncidencias = partes.reduce((sum, p) => sum + (p.residentes_con_incidencias || 0), 0);
  const resumen = [{
    'Total Partes': partes.length,
    'Total Incidencias': totalIncidencias,
    'Período Desde': filtros.fecha_desde ? new Date(filtros.fecha_desde).toLocaleDateString('es-ES') : 'Todos',
    'Período Hasta': filtros.fecha_hasta ? new Date(filtros.fecha_hasta).toLocaleDateString('es-ES') : 'Todos',
    'Residencia Filtrada': filtros.residencia_id ? partes[0]?.residencia_nombre : 'Todas',
    'Solo Incidencias': filtros.solo_incidencias ? 'Sí' : 'No'
  }];
  
  const wsResumen = XLSX.utils.json_to_sheet(resumen);
  wsResumen['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 }
  ];
  
  // HOJA 2: LISTADO COMPLETO
  const datosListado = partes.map(parte => ({
    'Fecha': new Date(parte.fecha).toLocaleDateString('es-ES'),
    'Hora': parte.hora || 'Sin hora',
    'Residencia': parte.residencia_nombre,
    'Trabajador': parte.trabajador_nombre,
    'Total Residentes': parte.total_residentes,
    'Con Incidencias': parte.residentes_con_incidencias,
    'Fecha Creación': new Date(parte.created_at).toLocaleDateString('es-ES')
  }));
  
  const wsListado = XLSX.utils.json_to_sheet(datosListado);
  wsListado['!cols'] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];
  
  // HOJA 3: DETALLE POR PARTE
  const datosDetalle: any[] = [];
  partes.forEach((parte, index) => {
    datosDetalle.push({
      'PARTE': `${index + 1} de ${partes.length}`,
      'Fecha': new Date(parte.fecha).toLocaleDateString('es-ES'),
      'Hora': parte.hora || 'Sin hora',
      'Residencia': parte.residencia_nombre,
      'Trabajador': parte.trabajador_nombre,
      'Total Residentes': parte.total_residentes,
      'Residentes con Incidencias': parte.residentes_con_incidencias,
      'Creado': new Date(parte.created_at).toLocaleString('es-ES'),
      'Modificado': new Date(parte.updated_at).toLocaleString('es-ES')
    });
    
    // Línea separadora entre partes
    datosDetalle.push({
      'PARTE': '',
      'Fecha': '',
      'Hora': '',
      'Residencia': '',
      'Trabajador': '',
      'Total Residentes': '',
      'Residentes con Incidencias': '',
      'Creado': '',
      'Modificado': ''
    });
  });
  
  const wsDetalle = XLSX.utils.json_to_sheet(datosDetalle);
  wsDetalle['!cols'] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 10 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 }
  ];
  
  // Crear libro y añadir hojas
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
  XLSX.utils.book_append_sheet(wb, wsListado, 'Listado');
  XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Completo');
  
  // Descargar
  const fecha = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `partes-consolidado-${fecha}.xlsx`);
};
