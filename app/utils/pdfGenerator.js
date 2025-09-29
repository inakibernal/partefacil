// app/utils/pdfGenerator.js
// Generador de PDFs compatible con jspdf-autotable v2 y v3
// - v2: doc.autoTable(opts)
// - v3: autoTable(doc, opts)

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { camposEstatales } from '../nuevo-parte/campos-legales.js';

/** Ejecuta autotable sea v2 o v3 */
function safeAutoTable(doc, opts) {
  try {
    if (typeof autoTable === 'function') {
      // v3
      return autoTable(doc, opts);
    }
  } catch (_) {
    // ignoramos y probamos la otra ruta
  }
  if (doc && typeof doc.autoTable === 'function') {
    // v2
    return doc.autoTable(opts);
  }
  console.error('jspdf-autotable no disponible. Revisa la instalación.');
  throw new Error('jspdf-autotable no disponible');
}

/** Devuelve el label visible para selects; para texto/number/time devuelve el valor tal cual */
function mapToLabel(campoKey, value) {
  const cfg = camposEstatales[campoKey];
  if (!cfg) return value ?? '-';
  if (cfg.tipo === 'select' && Array.isArray(cfg.opciones)) {
    const found = cfg.opciones.find((o) => o.value === value);
    if (found) return found.label;
  }
  return value ?? '-';
}

/** Valor final a imprimir (valor si existe, si no, defecto mapeado; si tampoco, '-') */
function valorCampo(campoKey, datos) {
  const cfg = camposEstatales[campoKey] || {};
  const v = datos?.[campoKey];

  if (v !== undefined && v !== null && v !== '') {
    return mapToLabel(campoKey, v);
  }
  if (cfg.defecto !== undefined) {
    return mapToLabel(campoKey, cfg.defecto);
  }
  return '-';
}

/** Crea las filas [Campo, Valor] para un residente */
function filasResidente(datosParteDeResidente) {
  const filas = [];
  Object.entries(camposEstatales).forEach(([key, cfg]) => {
    const label = cfg?.label ?? key;
    const val = valorCampo(key, datosParteDeResidente);
    filas.push([label, val]);
  });
  return filas;
}

/** Cabecera común del documento */
function dibujarCabecera(doc, parte, marginX) {
  let y = 40;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(
    `Parte diario — ${parte?.residencia_nombre ?? 'Residencia'}`,
    marginX,
    y
  );
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Fecha: ${parte?.fecha ?? '-'}  •  Hora: ${parte?.hora ?? '-'}`, marginX, y);
  y += 16;

  doc.text(
    `Trabajador: ${parte?.trabajador_nombre ?? '-'}  •  DNI: ${parte?.trabajador_dni ?? '-'}`,
    marginX,
    y
  );
  y += 16;

  const total = parte?.total_residentes ?? (parte?.residentes_detalle?.length ?? '-');
  const conInc = parte?.residentes_con_incidencias ?? '-';
  doc.text(
    `Residentes: ${total}  •  Con incidencias: ${conInc}`,
    marginX,
    y
  );
  y += 22;

  doc.setLineWidth(0.5);
  doc.line(marginX, y, 555, y);
  y += 14;

  return y;
}

/** Sección de un residente */
function dibujarSeccionResidente(doc, residente, y, marginX) {
  const encabezado =
    `${residente?.nombre ?? ''} ${residente?.apellidos ?? ''}`.trim() || 'Residente';
  const sub = `DNI: ${residente?.dni ?? '-'} • Edad: ${residente?.edad ?? '-'} años`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(encabezado, marginX, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(sub, marginX, y);
  y += 8;

  const body = filasResidente(residente?.datos_parte || {});
  safeAutoTable(doc, {
    startY: y + 6,
    head: [['Campo', 'Valor']],
    body,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 0: { cellWidth: 220 }, 1: { cellWidth: 300 } },
    margin: { left: marginX, right: 20 },
  });

  return (doc.lastAutoTable?.finalY ?? y) + 16;
}

function nombreArchivoParte(parte) {
  const resid = (parte?.residencia_nombre || 'Residencia')
    .replace(/\s+/g, '_')
    .replace(/[^\w_-]/g, '');
  return `parte_${resid}_${parte?.fecha || 'fecha'}.pdf`;
}

export class PDFGenerator {
  /** PDF de un parte individual (panel director o mis-partes) */
  static generarParteDiario(parte) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const M = 40;
    let y = dibujarCabecera(doc, parte, M);

    const residentes = Array.isArray(parte?.residentes_detalle)
      ? parte.residentes_detalle
      : [];

    residentes.forEach((r, idx) => {
      y = dibujarSeccionResidente(doc, r, y, M);
      if (idx < residentes.length - 1 && y > 760) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save(nombreArchivoParte(parte));
  }

  /** PDF con varios partes seleccionados (panel director) */
  static generarPartesMultiples(partes) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const M = 40;
    let first = true;

    partes.forEach((parte, iParte) => {
      if (!first) doc.addPage();
      first = false;

      let y = dibujarCabecera(doc, parte, M);
      const residentes = Array.isArray(parte?.residentes_detalle)
        ? parte.residentes_detalle
        : [];

      residentes.forEach((r, idx) => {
        y = dibujarSeccionResidente(doc, r, y, M);
        if (idx < residentes.length - 1 && y > 760) {
          doc.addPage();
          y = 40;
        }
      });
    });

    const nombre = `partes_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(nombre);
  }

  /** Informe genérico tipo tabla (exportar datos del desarrollador) */
  static generarInformeDatos(tipo, datos, titulo = 'Informe') {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const M = 40;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${titulo}`, M, 40);

    const claves = datos?.length ? Object.keys(datos[0]) : [];
    const head = [claves];
    const body = (datos || []).map((row) => claves.map((k) => String(row[k] ?? '-')));

    safeAutoTable(doc, {
      startY: 60,
      head,
      body,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [240, 240, 240] },
      margin: { left: M, right: 20 },
    });

    doc.save(`${tipo || 'datos'}.pdf`);
  }
}

export default PDFGenerator;

