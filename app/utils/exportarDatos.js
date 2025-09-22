import { PDFGenerator } from './pdfGenerator.js';

export const exportarDatosDesarrollador = {
  
  exportarTodo: () => {
    const directores = JSON.parse(localStorage.getItem('directores_sistema') || '[]');
    const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
    const personal = JSON.parse(localStorage.getItem('personal_data') || '[]');
    const residentes = JSON.parse(localStorage.getItem('residentes_data') || '[]');
    const partes = JSON.parse(localStorage.getItem('partes_completos') || '[]');
    
    // Crear informe consolidado
    const doc = new (require('jspdf').default)();
    
    doc.setFontSize(16);
    doc.text('INFORME COMPLETO DEL SISTEMA', 20, 25);
    doc.setFontSize(12);
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 20, 35);
    
    let yPos = 50;
    
    // Estadísticas generales
    doc.text(`Directores: ${directores.length}`, 20, yPos);
    doc.text(`Residencias: ${residencias.length}`, 20, yPos + 8);
    doc.text(`Personal: ${personal.length}`, 20, yPos + 16);
    doc.text(`Residentes: ${residentes.length}`, 20, yPos + 24);
    doc.text(`Partes diarios: ${partes.length}`, 20, yPos + 32);
    
    doc.save(`Sistema_Completo_${new Date().toISOString().split('T')[0]}.pdf`);
  },
  
  exportarDirectores: () => {
    const datos = JSON.parse(localStorage.getItem('directores_sistema') || '[]');
    PDFGenerator.generarInformeDatos('directores', datos, 'Directores');
  },
  
  exportarResidencias: () => {
    const datos = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
    PDFGenerator.generarInformeDatos('residencias', datos, 'Residencias');
  },
  
  exportarPersonal: () => {
    const datos = JSON.parse(localStorage.getItem('personal_data') || '[]');
    PDFGenerator.generarInformeDatos('personal', datos, 'Personal');
  },
  
  exportarResidentes: () => {
    const datos = JSON.parse(localStorage.getItem('residentes_data') || '[]');
    PDFGenerator.generarInformeDatos('residentes', datos, 'Residentes');
  },
  
  exportarPartes: () => {
    const datos = JSON.parse(localStorage.getItem('partes_completos') || '[]');
    PDFGenerator.generarPartesMultiples(datos);
  }
};
