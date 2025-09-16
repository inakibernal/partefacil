// lib/ccaaConfig.ts - Configuración modular por CCAA

export interface CampoLegal {
  id: string;
  nombre: string;
  tipo: 'text' | 'select' | 'number' | 'time' | 'date' | 'textarea' | 'checkbox';
  obligatorio: boolean;
  opciones?: string[];
  descripcion: string;
  categoria: string;
  validacion?: string;
}

export interface ConfiguracionCCAA {
  codigo: string;
  nombre: string;
  activa: boolean;
  campos_adicionales: CampoLegal[];
  ratios_especiales?: {
    personal_adicional?: number;
    documentacion_extra?: string[];
  };
  validaciones_especiales?: string[];
}

// CONFIGURACIÓN BASE ESTATAL (SIEMPRE ACTIVA)
export const CAMPOS_BASE_ESTATAL: CampoLegal[] = [
  // 1. REGISTRO ADMINISTRACIÓN MEDICAMENTOS (RAM)
  {
    id: 'medicacion_estado',
    nombre: 'Estado Medicación',
    tipo: 'select',
    obligatorio: true,
    opciones: ['administrada', 'no_administrada', 'parcial', 'vomito', 'rechazo'],
    descripcion: 'Estado de la administración de medicación (BOE Art. 42-1)',
    categoria: 'RAM',
    validacion: 'required'
  },
  {
    id: 'medicacion_hora',
    nombre: 'Hora Exacta Administración',
    tipo: 'time',
    obligatorio: true,
    descripcion: 'Hora exacta de administración (BOE - obligatorio)',
    categoria: 'RAM',
    validacion: 'required'
  },
  {
    id: 'medicacion_profesional',
    nombre: 'Profesional Responsable',
    tipo: 'text',
    obligatorio: true,
    descripcion: 'Profesional que administra (responsabilidad legal)',
    categoria: 'RAM',
    validacion: 'required|min:3'
  },
  {
    id: 'medicacion_efectos_adversos',
    nombre: 'Efectos Adversos',
    tipo: 'textarea',
    obligatorio: true,
    descripcion: 'Efectos adversos observados (escribir "ninguno" si no hay)',
    categoria: 'RAM',
    validacion: 'required|min:3'
  },
  
  // 2. ACTIVIDADES BÁSICAS VIDA DIARIA (ABVD)
  {
    id: 'abvd_higiene_personal',
    nombre: 'Higiene Personal',
    tipo: 'select',
    obligatorio: true,
    opciones: ['realizada', 'pendiente', 'rechazada', 'ayuda_parcial', 'ayuda_total'],
    descripcion: 'Estado higiene personal (Ley 39/2006)',
    categoria: 'ABVD',
    validacion: 'required'
  },
  {
    id: 'abvd_control_esfinteres',
    nombre: 'Control Esfínteres',
    tipo: 'select',
    obligatorio: true,
    opciones: ['continente', 'incontinencia_urinaria', 'incontinencia_fecal', 'incontinencia_mixta'],
    descripcion: 'Estado control esfínteres (BOE Criterios Comunes)',
    categoria: 'ABVD',
    validacion: 'required'
  },
  {
    id: 'abvd_cambios_posturales',
    nombre: 'Cambios Posturales',
    tipo: 'select',
    obligatorio: true,
    opciones: ['realizados_2h', 'realizados_3h', 'no_realizados', 'no_precisa'],
    descripcion: 'Cambios posturales cada 2-3h (obligatorio prevención úlceras)',
    categoria: 'ABVD',
    validacion: 'required'
  },

  // 3. NUTRICIÓN E HIDRATACIÓN
  {
    id: 'nutricion_desayuno_estado',
    nombre: 'Desayuno - Estado',
    tipo: 'select',
    obligatorio: true,
    opciones: ['tomado', 'parcial', 'rechazado', 'ayunas_medicas'],
    descripcion: 'Estado del desayuno (BOE - obligatorio)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_desayuno_porcentaje',
    nombre: 'Desayuno - Porcentaje',
    tipo: 'select',
    obligatorio: true,
    opciones: ['100%', '75%', '50%', '25%', '0%'],
    descripcion: 'Porcentaje ingerido desayuno (BOE Criterios Comunes)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_comida_estado',
    nombre: 'Comida - Estado',
    tipo: 'select',
    obligatorio: true,
    opciones: ['tomado', 'parcial', 'rechazado', 'ayunas_medicas'],
    descripcion: 'Estado de la comida (BOE - obligatorio)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_comida_porcentaje',
    nombre: 'Comida - Porcentaje',
    tipo: 'select',
    obligatorio: true,
    opciones: ['100%', '75%', '50%', '25%', '0%'],
    descripcion: 'Porcentaje ingerido comida (BOE Criterios Comunes)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_merienda_estado',
    nombre: 'Merienda - Estado',
    tipo: 'select',
    obligatorio: true,
    opciones: ['tomado', 'parcial', 'rechazado', 'no_ofrecida'],
    descripcion: 'Estado de la merienda (BOE - obligatorio)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_cena_estado',
    nombre: 'Cena - Estado',
    tipo: 'select',
    obligatorio: true,
    opciones: ['tomado', 'parcial', 'rechazado', 'ayunas_medicas'],
    descripcion: 'Estado de la cena (BOE - obligatorio)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_liquidos',
    nombre: 'Ingesta Líquidos',
    tipo: 'select',
    obligatorio: true,
    opciones: ['adecuada', 'escasa', 'excesiva', 'rechaza'],
    descripcion: 'Ingesta de líquidos (prevención deshidratación)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },
  {
    id: 'nutricion_deglucion',
    nombre: 'Problemas Deglución',
    tipo: 'select',
    obligatorio: true,
    opciones: ['sin_problemas', 'tos_ocasional', 'atragantamiento', 'disfagia'],
    descripcion: 'Problemas de deglución (BOE Criterios Comunes)',
    categoria: 'NUTRICION',
    validacion: 'required'
  },

  // 4. ESTADO PIEL Y PREVENCIÓN ÚLCERAS
  {
    id: 'piel_integridad',
    nombre: 'Integridad Cutánea',
    tipo: 'select',
    obligatorio: true,
    opciones: ['integra', 'eritema', 'lesiones_superficiales', 'ulceras_presion'],
    descripcion: 'Estado integridad de la piel (normativa sanitaria)',
    categoria: 'PIEL',
    validacion: 'required'
  },
  {
    id: 'piel_zonas_riesgo',
    nombre: 'Zonas de Riesgo',
    tipo: 'select',
    obligatorio: true,
    opciones: ['sin_alteraciones', 'eritema_sacro', 'eritema_talones', 'eritema_trocanteres', 'multiples_zonas'],
    descripcion: 'Estado zonas de riesgo úlceras (sacro, talones, trocánteres)',
    categoria: 'PIEL',
    validacion: 'required'
  },

  // 5. CONSTANTES VITALES (SI PRESCRITAS)
  {
    id: 'constantes_temperatura',
    nombre: 'Temperatura (°C)',
    tipo: 'number',
    obligatorio: false,
    descripcion: 'Temperatura corporal si prescrita (dejar vacío si no se toma)',
    categoria: 'CONSTANTES',
    validacion: 'numeric|between:35,42'
  },
  {
    id: 'constantes_tension_sistolica',
    nombre: 'Tensión Sistólica',
    tipo: 'number',
    obligatorio: false,
    descripcion: 'Tensión arterial sistólica si prescrita',
    categoria: 'CONSTANTES',
    validacion: 'numeric|between:80,200'
  },
  {
    id: 'constantes_tension_diastolica',
    nombre: 'Tensión Diastólica',
    tipo: 'number',
    obligatorio: false,
    descripcion: 'Tensión arterial diastólica si prescrita',
    categoria: 'CONSTANTES',
    validacion: 'numeric|between:40,120'
  },
  {
    id: 'constantes_glucemia',
    nombre: 'Glucemia (mg/dl)',
    tipo: 'number',
    obligatorio: false,
    descripcion: 'Glucemia en diabéticos (obligatorio si es diabético)',
    categoria: 'CONSTANTES',
    validacion: 'numeric|between:40,400'
  },

  // 6. ESTADO MENTAL Y COGNITIVO
  {
    id: 'mental_orientacion',
    nombre: 'Orientación',
    tipo: 'select',
    obligatorio: true,
    opciones: ['orientado', 'desorientacion_temporal', 'desorientacion_espacial', 'desorientacion_personal', 'desorientacion_total'],
    descripcion: 'Estado de orientación (BOE Criterios Comunes)',
    categoria: 'MENTAL',
    validacion: 'required'
  },
  {
    id: 'mental_animo',
    nombre: 'Estado Ánimo',
    tipo: 'select',
    obligatorio: true,
    opciones: ['tranquilo', 'alegre', 'triste', 'ansioso', 'agresivo', 'apatico'],
    descripcion: 'Estado anímico del residente',
    categoria: 'MENTAL',
    validacion: 'required'
  },
  {
    id: 'mental_comunicacion',
    nombre: 'Comunicación',
    tipo: 'select',
    obligatorio: true,
    opciones: ['adecuada', 'dificultad_expresion', 'dificultad_comprension', 'no_verbal', 'mutismo'],
    descripcion: 'Capacidad de comunicación',
    categoria: 'MENTAL',
    validacion: 'required'
  },

  // 7. SUJECIONES (OBLIGATORIO BOE)
  {
    id: 'sujeciones_uso',
    nombre: 'Uso de Sujeciones',
    tipo: 'select',
    obligatorio: true,
    opciones: ['no_utilizadas', 'excepcion_prescrita', 'urgencia_documentada'],
    descripcion: 'Uso de sujeciones (BOE Art. 15 - Atención libre sujeciones)',
    categoria: 'SUJECIONES',
    validacion: 'required'
  },
  {
    id: 'sujeciones_justificacion',
    nombre: 'Justificación Médica',
    tipo: 'textarea',
    obligatorio: false,
    descripcion: 'Justificación médica si se usan sujeciones (obligatorio si uso)',
    categoria: 'SUJECIONES',
    validacion: 'required_if:sujeciones_uso,excepcion_prescrita,urgencia_documentada'
  },

  // 8. SUEÑO Y DESCANSO
  {
    id: 'sueno_patron_nocturno',
    nombre: 'Patrón Sueño Nocturno',
    tipo: 'select',
    obligatorio: true,
    opciones: ['continuo', 'interrumpido_ocasional', 'interrumpido_frecuente', 'insomnio', 'hipersomnia'],
    descripcion: 'Patrón de sueño nocturno',
    categoria: 'SUENO',
    validacion: 'required'
  },
  {
    id: 'sueno_episodios_nocturnos',
    nombre: 'Episodios Nocturnos',
    tipo: 'select',
    obligatorio: true,
    opciones: ['ninguno', 'levantadas_ocasionales', 'deambulacion_nocturna', 'desorientacion_nocturna', 'agitacion_nocturna'],
    descripcion: 'Episodios durante la noche',
    categoria: 'SUENO',
    validacion: 'required'
  },

  // 9. OBSERVACIONES GENERALES
  {
    id: 'observaciones_generales',
    nombre: 'Observaciones del Turno',
    tipo: 'textarea',
    obligatorio: false,
    descripcion: 'Observaciones generales, cambios importantes, comunicaciones',
    categoria: 'OBSERVACIONES',
    validacion: 'max:500'
  }
];

// CONFIGURACIONES POR CCAA (ACTIVABLES POR VENTA)
export const CONFIGURACIONES_CCAA: ConfiguracionCCAA[] = [
  
  // ANDALUCÍA
  {
    codigo: 'AN',
    nombre: 'Andalucía',
    activa: false,
    campos_adicionales: [
      {
        id: 'an_coordinacion_sanitaria',
        nombre: 'Coordinación Sanitaria SAS',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'consulta_telefonica', 'visita_presencial', 'derivacion_urgente'],
        descripcion: 'Coordinación con Sistema Andaluz de Salud',
        categoria: 'ANDALUCIA',
        validacion: 'required'
      },
      {
        id: 'an_plan_atencion_individual',
        nombre: 'Plan Atención Individual',
        tipo: 'select',
        obligatorio: true,
        opciones: ['cumplido', 'modificado', 'revision_pendiente'],
        descripcion: 'Estado del Plan Individual de Atención (PIA)',
        categoria: 'ANDALUCIA',
        validacion: 'required'
      }
    ],
    ratios_especiales: {
      personal_adicional: 0.05,
      documentacion_extra: ['Plan Coordinación SAS', 'Registro DIRAYA']
    }
  },

  // CATALUÑA
  {
    codigo: 'CT',
    nombre: 'Cataluña',
    activa: false,
    campos_adicionales: [
      {
        id: 'ct_idioma_comunicacion',
        nombre: 'Idioma Comunicación',
        tipo: 'select',
        obligatorio: true,
        opciones: ['catalan', 'castellano', 'ambos', 'otros'],
        descripcion: 'Idioma utilizado en la comunicación con el residente',
        categoria: 'CATALUÑA',
        validacion: 'required'
      },
      {
        id: 'ct_coordinacion_catsalut',
        nombre: 'Coordinación CatSalut',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'consulta_realizada', 'seguimiento_activo'],
        descripcion: 'Coordinación con sistema sanitario catalán',
        categoria: 'CATALUÑA',
        validacion: 'required'
      }
    ]
  },

  // MADRID
  {
    codigo: 'MD',
    nombre: 'Madrid',
    activa: false,
    campos_adicionales: [
      {
        id: 'md_coordinacion_sermas',
        nombre: 'Coordinación SERMAS',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'consulta_telefonica', 'visita_programada'],
        descripcion: 'Coordinación con SERMAS',
        categoria: 'MADRID',
        validacion: 'required'
      }
    ]
  },

  // PAÍS VASCO
  {
    codigo: 'PV',
    nombre: 'País Vasco',
    activa: false,
    campos_adicionales: [
      {
        id: 'pv_coordinacion_osakidetza',
        nombre: 'Coordinación Osakidetza',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'contacto_medico_referencia', 'protocolo_activado'],
        descripcion: 'Coordinación con Osakidetza',
        categoria: 'PAIS_VASCO',
        validacion: 'required'
      }
    ]
  },

  // VALENCIA
  {
    codigo: 'VC',
    nombre: 'Valencia',
    activa: false,
    campos_adicionales: [
      {
        id: 'vc_coordinacion_valencia_salud',
        nombre: 'Coordinación Valencia Salud',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'protocolo_seguimiento', 'derivacion_especializada'],
        descripcion: 'Coordinación con sistema sanitario valenciano',
        categoria: 'VALENCIA',
        validacion: 'required'
      }
    ]
  },

  // GALICIA
  {
    codigo: 'GA',
    nombre: 'Galicia',
    activa: false,
    campos_adicionales: [
      {
        id: 'ga_coordinacion_sergas',
        nombre: 'Coordinación SERGAS',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'seguimiento_medico', 'protocolo_cronicidad'],
        descripcion: 'Coordinación con SERGAS',
        categoria: 'GALICIA',
        validacion: 'required'
      }
    ]
  },

  // CASTILLA Y LEÓN
  {
    codigo: 'CL',
    nombre: 'Castilla y León',
    activa: false,
    campos_adicionales: [
      {
        id: 'cl_modelo_aicp',
        nombre: 'Aplicación Modelo AICP',
        tipo: 'select',
        obligatorio: true,
        opciones: ['aplicado', 'en_proceso', 'no_aplicable'],
        descripcion: 'Aplicación Modelo Atención Integral Centrada en la Persona (Ley 3/2024)',
        categoria: 'CASTILLA_LEON',
        validacion: 'required'
      }
    ]
  },

  // ASTURIAS
  {
    codigo: 'AS',
    nombre: 'Asturias',
    activa: false,
    campos_adicionales: [
      {
        id: 'as_coordinacion_sespa',
        nombre: 'Coordinación SESPA',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'consulta_medico_familia', 'seguimiento_especializado'],
        descripcion: 'Coordinación con SESPA',
        categoria: 'ASTURIAS',
        validacion: 'required'
      }
    ]
  },

  // CANTABRIA
  {
    codigo: 'CB',
    nombre: 'Cantabria',
    activa: false,
    campos_adicionales: [
      {
        id: 'cb_coordinacion_scs',
        nombre: 'Coordinación SCS',
        tipo: 'select',
        obligatorio: true,
        opciones: ['no_requerida', 'seguimiento_geriatria', 'protocolo_activado'],
        descripcion: 'Coordinación con Servicio Cántabro de Salud',
        categoria: 'CANTABRIA',
        validacion: 'required'
      }
    ]
  }
];

// FUNCIÓN PARA OBTENER CONFIGURACIÓN ACTIVA
export function obtenerConfiguracionActiva(): {
  campos_base: CampoLegal[];
  campos_ccaa: CampoLegal[];
  ccaa_activas: string[];
} {
  // Cargar configuración desde localStorage si existe
  if (typeof window !== 'undefined') {
    const configGuardada = localStorage.getItem('ccaa_config');
    if (configGuardada) {
      const configuracionesActualizadas = JSON.parse(configGuardada);
      const ccaaActivas = configuracionesActualizadas.filter((ccaa: ConfiguracionCCAA) => ccaa.activa);
      const camposCCAA = ccaaActivas.flatMap((ccaa: ConfiguracionCCAA) => ccaa.campos_adicionales);
      
      return {
        campos_base: CAMPOS_BASE_ESTATAL,
        campos_ccaa: camposCCAA,
        ccaa_activas: ccaaActivas.map((ccaa: ConfiguracionCCAA) => ccaa.nombre)
      };
    }
  }

  const ccaaActivas = CONFIGURACIONES_CCAA.filter(ccaa => ccaa.activa);
  const camposCCAA = ccaaActivas.flatMap(ccaa => ccaa.campos_adicionales);
  
  return {
    campos_base: CAMPOS_BASE_ESTATAL,
    campos_ccaa: camposCCAA,
    ccaa_activas: ccaaActivas.map(ccaa => ccaa.nombre)
  };
}

// FUNCIÓN PARA VALIDAR CAMPOS SEGÚN CONFIGURACIÓN
export function validarCamposSegunCCAA(datos: any): string[] {
  const configuracion = obtenerConfiguracionActiva();
  const errores: string[] = [];
  
  // Validar campos base (siempre obligatorios)
  configuracion.campos_base.forEach(campo => {
    if (campo.obligatorio && !datos[campo.id]) {
      errores.push(`${campo.nombre} es obligatorio (normativa estatal)`);
    }
  });
  
  // Validar campos CCAA activas
  configuracion.campos_ccaa.forEach(campo => {
    if (campo.obligatorio && !datos[campo.id]) {
      errores.push(`${campo.nombre} es obligatorio (normativa autonómica)`);
    }
  });
  
  return errores;
}