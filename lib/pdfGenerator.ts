import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ParteDiario {
  id: string
  fecha: string
  centro: string
  numeroResidentes: number
  medicacionAdministrada: boolean
  incidencias: string
  menuComida: string
  menuCena: string
  personalTurno: string
  fechaCreacion: string
  creadoPor?: string
}

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const generarPDFIndividual = (parte: ParteDiario): void => {
  const doc = new jsPDF()
  
  doc.setFont('helvetica')
  
  doc.setFontSize(20)
  doc.setTextColor(0, 102, 204)
  doc.text('PARTE DIARIO DE RESIDENCIA', 105, 25, { align: 'center' })
  
  doc.setDrawColor(0, 102, 204)
  doc.setLineWidth(1)
  doc.line(20, 35, 190, 35)
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  
  let yPosition = 50
  
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMACIÓN GENERAL', 20, yPosition)
  yPosition += 10
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Fecha: ${formatearFecha(parte.fecha)}`, 20, yPosition)
  doc.text(`Centro: ${parte.centro}`, 110, yPosition)
  yPosition += 8
  
  doc.text(`Número de residentes presentes: ${parte.numeroResidentes}`, 20, yPosition)
  yPosition += 8
  
  doc.text(`Personal de turno: ${parte.personalTurno || 'No especificado'}`, 20, yPosition)
  yPosition += 15
  
  doc.setFont('helvetica', 'bold')
  doc.text('MEDICACIÓN', 20, yPosition)
  yPosition += 10
  
  doc.setFont('helvetica', 'normal')
  const medicacionTexto = parte.medicacionAdministrada ? 
    'Toda la medicación fue administrada correctamente' : 
    'Hubo incidencias con la medicación'
  doc.text(medicacionTexto, 20, yPosition)
  yPosition += 15
  
  doc.setFont('helvetica', 'bold')
  doc.text('MENÚS DEL DÍA', 20, yPosition)
  yPosition += 10
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Comida: ${parte.menuComida || 'No especificado'}`, 20, yPosition)
  yPosition += 8
  doc.text(`Cena: ${parte.menuCena || 'No especificado'}`, 20, yPosition)
  yPosition += 15
  
  doc.setFont('helvetica', 'bold')
  doc.text('INCIDENCIAS Y OBSERVACIONES', 20, yPosition)
  yPosition += 10
  
  doc.setFont('helvetica', 'normal')
  if (parte.incidencias && parte.incidencias.trim()) {
    const incidenciasLineas = doc.splitTextToSize(parte.incidencias, 170)
    doc.text(incidenciasLineas, 20, yPosition)
    yPosition += (incidenciasLineas.length * 6) + 10
  } else {
    doc.text('Sin incidencias registradas', 20, yPosition)
    yPosition += 15
  }
  
  yPosition = Math.max(yPosition, 240)
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 10
  
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 20, yPosition)
  if (parte.creadoPor) {
    doc.text(`Creado por: ${parte.creadoPor}`, 110, yPosition)
  }
  yPosition += 6
  doc.text('Sistema Informe Fácil - Gestión de Residencias', 20, yPosition)
  
  const nombreArchivo = `parte_${parte.centro.replace(/\s+/g, '_')}_${parte.fecha}.pdf`
  doc.save(nombreArchivo)
}

export const generarPDFMultiple = (partes: ParteDiario[], titulo: string = 'Informe Multiple'): void => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.setTextColor(0, 102, 204)
  doc.text(titulo.toUpperCase(), 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(`Total de partes: ${partes.length}`, 20, 35)
  
  if (partes.length > 0) {
    const fechaInicio = partes.reduce((min, p) => p.fecha < min ? p.fecha : min, partes[0].fecha)
    const fechaFin = partes.reduce((max, p) => p.fecha > max ? p.fecha : max, partes[0].fecha)
    doc.text(`Período: ${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`, 20, 45)
  }
  
  const headers = [['Fecha', 'Centro', 'Residentes', 'Medicación', 'Personal']]
  const data = partes.map(parte => [
    formatearFecha(parte.fecha),
    parte.centro,
    parte.numeroResidentes.toString(),
    parte.medicacionAdministrada ? 'Sí' : 'No',
    parte.personalTurno || '-'
  ])
  
  ;(doc as any).autoTable({
    head: headers,
    body: data,
    startY: 60,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 50 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 50 }
    }
  })
  
  const finalY = (doc as any).lastAutoTable.finalY + 20
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 20, finalY)
  doc.text('Sistema Informe Fácil - Gestión de Residencias', 20, finalY + 6)
  
  const fecha = new Date().toISOString().split('T')[0]
  const nombreArchivo = `informe_multiple_${fecha}.pdf`
  doc.save(nombreArchivo)
}

export const generarPDFMensual = (partes: ParteDiario[], mes: string, año: string): void => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  const numeroMes = parseInt(mes) - 1
  const nombreMes = meses[numeroMes] || mes
  const titulo = `INFORME MENSUAL - ${nombreMes.toUpperCase()} ${año}`
  
  const doc = new jsPDF()
  
  doc.setFontSize(16)
  doc.setTextColor(0, 102, 204)
  doc.text(titulo, 105, 20, { align: 'center' })
  
  const centrosUnicos = [...new Set(partes.map(p => p.centro))]
  const totalResidentes = partes.reduce((sum, p) => sum + p.numeroResidentes, 0)
  const promedioResidentes = partes.length > 0 ? Math.round(totalResidentes / partes.length) : 0
  const partesConMedicacion = partes.filter(p => p.medicacionAdministrada).length
  const porcentajeMedicacion = partes.length > 0 ? Math.round((partesConMedicacion / partes.length) * 100) : 0
  
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  let yPos = 40
  
  doc.setFont('helvetica', 'bold')
  doc.text('RESUMEN DEL MES:', 20, yPos)
  yPos += 10
  
  doc.setFont('helvetica', 'normal')
  doc.text(`• Total de partes registrados: ${partes.length}`, 25, yPos)
  yPos += 7
  doc.text(`• Centros involucrados: ${centrosUnicos.length} (${centrosUnicos.join(', ')})`, 25, yPos)
  yPos += 7
  doc.text(`• Promedio de residentes por día: ${promedioResidentes}`, 25, yPos)
  yPos += 7
  doc.text(`• Medicación administrada correctamente: ${porcentajeMedicacion}% de los días`, 25, yPos)
  yPos += 15
  
  const headers = [['Fecha', 'Centro', 'Residentes', 'Medicación', 'Incidencias']]
  const data = partes
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map(parte => [
      formatearFecha(parte.fecha),
      parte.centro,
      parte.numeroResidentes.toString(),
      parte.medicacionAdministrada ? 'Sí' : 'No',
      parte.incidencias ? (parte.incidencias.length > 30 ? parte.incidencias.substring(0, 30) + '...' : parte.incidencias) : 'Sin incidencias'
    ])
  
  ;(doc as any).autoTable({
    head: headers,
    body: data,
    startY: yPos + 10,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 45 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 60 }
    }
  })
  
  const finalY = (doc as any).lastAutoTable.finalY + 20
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 20, finalY)
  doc.text('Sistema Informe Fácil - Gestión de Residencias', 20, finalY + 6)
  
  const nombreArchivo = `informe_mensual_${nombreMes.toLowerCase()}_${año}.pdf`
  doc.save(nombreArchivo)
}