import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class PDFGenerator {
  
  // Generar PDF de un parte diario individual
  static generarParteDiario(parte) {
    const doc = new jsPDF();
    
    // Configuración inicial
    doc.setFont('helvetica');
    
    // Header con logo/título
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('PARTE DIARIO DE RESIDENCIA', 20, 25);
    
    // Línea separadora
    doc.setDrawColor(52, 73, 94);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
    
    // Información básica del parte
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const fechaFormateada = new Date(parte.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    let yPos = 45;
    
    // Datos del parte
    doc.text(`Fecha: ${fechaFormateada}`, 20, yPos);
    yPos += 8;
    doc.text(`Hora: ${parte.hora || 'No especificada'}`, 20, yPos);
    yPos += 8;
    doc.text(`Profesional: ${parte.trabajador_nombre}`, 20, yPos);
    yPos += 8;
    doc.text(`DNI Profesional: ${parte.trabajador_dni}`, 20, yPos);
    yPos += 8;
    doc.text(`Residencia: ${parte.residencia_nombre}`, 20, yPos);
    yPos += 8;
    doc.text(`Total Residentes: ${parte.total_residentes}`, 20, yPos);
    yPos += 8;
    doc.text(`Residentes con Incidencias: ${parte.residentes_con_incidencias}`, 20, yPos);
    
    yPos += 15;
    
    // Sección de residentes con incidencias
    if (parte.residentes_con_incidencias > 0 && parte.residentes_detalle) {
      doc.setFontSize(14);
      doc.setTextColor(220, 53, 69);
      doc.text('RESIDENTES CON INCIDENCIAS', 20, yPos);
      yPos += 10;
      
      // Filtrar solo residentes con incidencias
      const residentesConIncidencias = parte.residentes_detalle.filter(residente => {
        return residente.datos_parte && Object.entries(residente.datos_parte).some(([campo, valor]) => {
          // Aquí necesitaríamos los campos estatales para comparar con defecto
          return valor && valor !== 'normal' && valor !== 'completo' && valor !== 'continente' && valor !== 'dispuesto' && valor !== 'tranquilo';
        });
      });
      
      residentesConIncidencias.forEach((residente, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${residente.nombre} ${residente.apellidos} (${residente.edad} años)`, 25, yPos);
        yPos += 8;
        
        // Detallar las incidencias
        Object.entries(residente.datos_parte).forEach(([campo, valor]) => {
          if (valor && valor !== 'normal' && valor !== 'completo' && valor !== 'continente' && valor !== 'dispuesto' && valor !== 'tranquilo') {
            doc.setFontSize(10);
            doc.text(`   • ${campo.replace(/_/g, ' ')}: ${valor}`, 30, yPos);
            yPos += 6;
          }
        });
        yPos += 5;
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(40, 167, 69);
      doc.text('✓ Todos los residentes sin incidencias relevantes', 20, yPos);
    }
    
    // Footer
    yPos = 280;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Documento generado el ${new Date().toLocaleString('es-ES')}`, 20, yPos);
    doc.text('Sistema de Gestión de Residencias', 20, yPos + 5);
    
    // Descargar
    const nombreArchivo = `Parte_Diario_${parte.fecha}_${parte.trabajador_nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  }
  
  // Generar PDF con múltiples partes (para director)
  static generarPartesMultiples(partes) {
    const doc = new jsPDF();
    
    // Header principal
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('INFORME CONSOLIDADO DE PARTES DIARIOS', 20, 25);
    
    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 20, 35);
    doc.text(`Total de partes: ${partes.length}`, 20, 42);
    
    // Línea separadora
    doc.setDrawColor(52, 73, 94);
    doc.line(20, 48, 190, 48);
    
    let yPos = 60;
    
    // Resumen estadístico
    const totalResidentes = partes.reduce((sum, p) => sum + (p.total_residentes || 0), 0);
    const totalIncidencias = partes.reduce((sum, p) => sum + (p.residentes_con_incidencias || 0), 0);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 123, 255);
    doc.text('RESUMEN ESTADÍSTICO', 20, yPos);
    yPos += 12;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`• Total residentes monitorizados: ${totalResidentes}`, 25, yPos);
    yPos += 8;
    doc.text(`• Total incidencias registradas: ${totalIncidencias}`, 25, yPos);
    yPos += 8;
    doc.text(`• Promedio incidencias por parte: ${(totalIncidencias / partes.length).toFixed(1)}`, 25, yPos);
    yPos += 15;
    
    // Tabla resumen de partes
    const datosTabla = partes.map(parte => [
      new Date(parte.fecha).toLocaleDateString('es-ES'),
      parte.trabajador_nombre || 'N/A',
      parte.residencia_nombre || 'N/A',
      parte.total_residentes || 0,
      parte.residentes_con_incidencias || 0
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Fecha', 'Profesional', 'Residencia', 'Residentes', 'Incidencias']],
      body: datosTabla,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 73, 94] }
    });
    
    // Descargar
    const fechaHoy = new Date().toISOString().split('T')[0];
    doc.save(`Informe_Partes_${fechaHoy}.pdf`);
  }
  
  // Generar PDF de datos del desarrollador (exportación de datos)
  static generarInformeDatos(tipo, datos, titulo) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text(`INFORME DE ${titulo.toUpperCase()}`, 20, 25);
    
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 20, 35);
    doc.text(`Total registros: ${datos.length}`, 20, 42);
    
    doc.line(20, 48, 190, 48);
    
    // Convertir datos a tabla
    if (datos.length > 0) {
      const primerElemento = datos[0];
      const columnas = Object.keys(primerElemento).filter(key => 
        !key.startsWith('_') && key !== 'id' && key !== 'password' && key !== 'contrasena'
      );
      
      const datosTabla = datos.map(item => 
        columnas.map(col => {
          let valor = item[col];
          if (typeof valor === 'object') valor = JSON.stringify(valor);
          if (typeof valor === 'string' && valor.length > 30) valor = valor.substring(0, 30) + '...';
          return valor || 'N/A';
        })
      );
      
      doc.autoTable({
        startY: 55,
        head: [columnas.map(col => col.replace(/_/g, ' ').toUpperCase())],
        body: datosTabla,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [52, 73, 94] }
      });
    }
    
    doc.save(`Informe_${titulo}_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
