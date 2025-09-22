// Configuración de campos legales obligatorios (nivel estatal BOE)
export const camposEstatales = {
  estado_conciencia: {
    label: 'Estado de conciencia', tipo: 'select', obligatorio: true, defecto: 'dispuesto',
    opciones: [
      { value: 'dispuesto', label: 'Dispuesto/Alerta' },
      { value: 'somnoliento', label: 'Somnoliento' },
      { value: 'confuso', label: 'Confuso/Desorientado' },
      { value: 'agitado', label: 'Agitado/Inquieto' },
      { value: 'inconsciente', label: 'Inconsciente' }
    ]
  },
  estado_animico: {
    label: 'Estado anímico', tipo: 'select', obligatorio: true, defecto: 'tranquilo',
    opciones: [
      { value: 'tranquilo', label: 'Tranquilo' },
      { value: 'animado', label: 'Animado/Alegre' },
      { value: 'apatico', label: 'Apático' },
      { value: 'triste', label: 'Triste/Deprimido' },
      { value: 'ansioso', label: 'Ansioso/Nervioso' }
    ]
  },
  temperatura: {
    label: 'Temperatura corporal (°C)', tipo: 'number', obligatorio: false,
    placeholder: '36.5', step: '0.1', min: '35', max: '42'
  },
  tension_arterial: {
    label: 'Tensión arterial', tipo: 'text', obligatorio: false,
    placeholder: '120/80', patron: '^[0-9]{2,3}/[0-9]{2,3}$'
  },
  glucemia: {
    label: 'Glucemia (mg/dl)', tipo: 'number', obligatorio: false,
    placeholder: '90', min: '50', max: '500'
  },
  alimentacion_desayuno: {
    label: 'Desayuno', tipo: 'select', obligatorio: true, defecto: 'completo',
    opciones: [
      { value: 'completo', label: 'Completo (100%)' },
      { value: 'bastante', label: 'Bastante (75%)' },
      { value: 'poco', label: 'Poco (50%)' },
      { value: 'nada', label: 'Nada (0%)' },
      { value: 'rechaza', label: 'Rechaza' }
    ]
  },
  alimentacion_comida: {
    label: 'Comida', tipo: 'select', obligatorio: true, defecto: 'completo',
    opciones: [
      { value: 'completo', label: 'Completo (100%)' },
      { value: 'bastante', label: 'Bastante (75%)' },
      { value: 'poco', label: 'Poco (50%)' },
      { value: 'nada', label: 'Nada (0%)' },
      { value: 'rechaza', label: 'Rechaza' }
    ]
  },
  alimentacion_cena: {
    label: 'Cena', tipo: 'select', obligatorio: true, defecto: 'completo',
    opciones: [
      { value: 'completo', label: 'Completo (100%)' },
      { value: 'bastante', label: 'Bastante (75%)' },
      { value: 'poco', label: 'Poco (50%)' },
      { value: 'nada', label: 'Nada (0%)' },
      { value: 'rechaza', label: 'Rechaza' }
    ]
  },
  hidratacion: {
    label: 'Hidratación', tipo: 'select', obligatorio: true, defecto: 'correcta',
    opciones: [
      { value: 'correcta', label: 'Correcta' },
      { value: 'escasa', label: 'Escasa' },
      { value: 'rechaza', label: 'Rechaza líquidos' }
    ]
  },
  medicacion_administrada: {
    label: 'Medicación administrada', tipo: 'select', obligatorio: true, defecto: 'completa',
    opciones: [
      { value: 'completa', label: 'Toda según pauta' },
      { value: 'parcial', label: 'Parcial' },
      { value: 'rechazada', label: 'Rechazada' },
      { value: 'omitida', label: 'Omitida' }
    ]
  },
  medicacion_hora: { label: 'Hora administración', tipo: 'time', obligatorio: false },
  medicacion_observaciones: {
    label: 'Observaciones medicación', tipo: 'textarea', obligatorio: false,
    placeholder: 'Detallar omisiones, rechazos o reacciones adversas'
  },
  higiene_personal: {
    label: 'Higiene personal', tipo: 'select', obligatorio: true, defecto: 'completa',
    opciones: [
      { value: 'completa', label: 'Completa' },
      { value: 'parcial', label: 'Parcial' },
      { value: 'no_realizada', label: 'No realizada' }
    ]
  },
  control_esfinteres: {
    label: 'Control de esfínteres', tipo: 'select', obligatorio: true, defecto: 'continente',
    opciones: [
      { value: 'continente', label: 'Continente' },
      { value: 'incontinencia_urinaria', label: 'Incontinencia urinaria' },
      { value: 'incontinencia_fecal', label: 'Incontinencia fecal' },
      { value: 'doble_incontinencia', label: 'Doble incontinencia' }
    ]
  },
  cambios_absorbentes: {
    label: 'Cambios de absorbente', tipo: 'number', obligatorio: true,
    min: '0', max: '20', defecto: '0'
  },
  estado_piel: {
    label: 'Estado de la piel', tipo: 'select', obligatorio: true, defecto: 'normal',
    opciones: [
      { value: 'normal', label: 'Normal' },
      { value: 'seca', label: 'Seca' },
      { value: 'enrojecimiento', label: 'Enrojecimiento' },
      { value: 'herida', label: 'Herida/Úlcera' },
      { value: 'hematoma', label: 'Hematoma' }
    ]
  },
  movilidad: {
    label: 'Movilidad', tipo: 'select', obligatorio: true, defecto: 'autonomo',
    opciones: [
      { value: 'autonomo', label: 'Autónomo' },
      { value: 'ayuda_parcial', label: 'Ayuda parcial' },
      { value: 'ayuda_total', label: 'Ayuda total' },
      { value: 'encamado', label: 'Encamado' }
    ]
  },
  cambios_posturales: {
    label: 'Cambios posturales', tipo: 'select', obligatorio: true, defecto: 'no_necesarios',
    opciones: [
      { value: 'no_necesarios', label: 'No necesarios' },
      { value: 'cada_2h', label: 'Cada 2 horas' },
      { value: 'cada_3h', label: 'Cada 3 horas' },
      { value: 'irregulares', label: 'Irregulares' }
    ]
  },
  sueno: {
    label: 'Sueño/Descanso', tipo: 'select', obligatorio: true, defecto: 'normal',
    opciones: [
      { value: 'normal', label: 'Normal' },
      { value: 'inquieto', label: 'Inquieto' },
      { value: 'insomnio', label: 'Insomnio' },
      { value: 'somnolencia', label: 'Somnolencia diurna' }
    ]
  },
  actividades: {
    label: 'Participación en actividades', tipo: 'select', obligatorio: false, defecto: 'participa',
    opciones: [
      { value: 'participa', label: 'Participa activamente' },
      { value: 'pasivo', label: 'Participación pasiva' },
      { value: 'no_participa', label: 'No participa' },
      { value: 'rechaza', label: 'Rechaza' }
    ]
  },
  visitas_familiares: {
    label: 'Visitas familiares', tipo: 'select', obligatorio: false, defecto: 'no',
    opciones: [
      { value: 'no', label: 'No' },
      { value: 'presencial', label: 'Presencial' },
      { value: 'telefonica', label: 'Telefónica' },
      { value: 'videollamada', label: 'Videollamada' }
    ]
  },
  visita_medico: {
    label: 'Visita médico', tipo: 'select', obligatorio: false, defecto: 'no',
    opciones: [
      { value: 'no', label: 'No' },
      { value: 'programada', label: 'Programada' },
      { value: 'realizada', label: 'Realizada' },
      { value: 'urgente', label: 'Urgente' }
    ]
  },
  observaciones_generales: {
    label: 'Observaciones generales', tipo: 'textarea', obligatorio: false,
    placeholder: 'Cualquier observación relevante del día'
  },
  incidencias: {
    label: 'Incidencias', tipo: 'textarea', obligatorio: false,
    placeholder: 'Caídas, urgencias médicas, cambios de comportamiento, etc.'
  }
};
