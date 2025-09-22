import { PDFGenerator } from '../app/utils/pdfGenerator.js';

export const generarPDFIndividual = (parte) => {
  return PDFGenerator.generarParteDiario(parte);
};
