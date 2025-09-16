// Tipos para la gestión por residente
export interface Residente {
  id: string
  nombre: string
  apellidos: string
  habitacion: string
  fechaNacimiento: string
  centro: string
  activo: boolean
  observacionesGenerales?: string
  fechaIngreso: string
}

export interface RegistroActividad {
  id: string
  residenteId: string
  fecha: string
  hora: string
  tipo: 'medicacion' | 'comida' | 'higiene' | 'incidencia' | 'actividad' | 'visita'
  subtipo?: string // ej: 'desayuno', 'comida', 'cena' para tipo 'comida'
  descripcion: string
  observaciones?: string
  estado: 'realizado' | 'pendiente' | 'no_realizado'
  realizadoPor: string
  urgente: boolean
  fechaCreacion: string
}

export interface ResumenDiarioResidente {
  residenteId: string
  fecha: string
  estadoGeneral: 'bueno' | 'regular' | 'preocupante'
  medicacionCompleta: boolean
  comidasRealizadas: number
  totalComidas: number
  incidencias: number
  observacionesDelDia: string
  ultimaActualizacion: string
}

// Datos de ejemplo de residentes
export const residentesEjemplo: Residente[] = [
  {
    id: "res_001",
    nombre: "María",
    apellidos: "García López",
    habitacion: "101",
    fechaNacimiento: "1935-03-15",
    centro: "Residencia San Miguel",
    activo: true,
    fechaIngreso: "2020-01-15"
  },
  {
    id: "res_002", 
    nombre: "Antonio",
    apellidos: "Martín Pérez",
    habitacion: "102",
    fechaNacimiento: "1940-07-22",
    centro: "Residencia San Miguel",
    activo: true,
    fechaIngreso: "2019-05-10"
  },
  {
    id: "res_003",
    nombre: "Carmen",
    apellidos: "Rodríguez Silva",
    habitacion: "103", 
    fechaNacimiento: "1938-11-08",
    centro: "Residencia San Miguel",
    activo: true,
    fechaIngreso: "2021-02-20"
  },
  {
    id: "res_004",
    nombre: "José",
    apellidos: "Fernández Ruiz",
    habitacion: "201",
    fechaNacimiento: "1942-01-30",
    centro: "Centro El Rosal",
    activo: true,
    fechaIngreso: "2020-08-05"
  },
  {
    id: "res_005",
    nombre: "Isabel",
    apellidos: "González Morales",
    habitacion: "202",
    fechaNacimiento: "1945-09-12",
    centro: "Centro El Rosal",
    activo: true,
    fechaIngreso: "2021-01-18"
  }
]

// Actividades predefinidas por tipo
export const actividadesPredefinidas = {
  medicacion: [
    "Medicación matutina",
    "Medicación vespertina", 
    "Medicación nocturna",
    "Insulina",
    "Medicación específica"
  ],
  comida: [
    "Desayuno",
    "Media mañana", 
    "Comida",
    "Merienda",
    "Cena"
  ],
  higiene: [
    "Aseo personal",
    "Ducha/baño",
    "Cambio de ropa",
    "Cuidado bucal",
    "Arreglo personal"
  ],
  actividad: [
    "Fisioterapia",
    "Terapia ocupacional",
    "Ejercicios",
    "Actividad grupal",
    "Paseo"
  ],
  incidencia: [
    "Caída",
    "Malestar",
    "Comportamiento alterado",
    "Problema médico",
    "Otro"
  ],
  visita: [
    "Familia",
    "Médico",
    "Especialista",
    "Servicios sociales",
    "Otro profesional"
  ]
}

// Funciones de gestión
export const getResidentesPorCentro = (centro: string): Residente[] => {
  const residentes = JSON.parse(localStorage.getItem("residentes") || JSON.stringify(residentesEjemplo))
  return residentes.filter((r: Residente) => r.centro === centro && r.activo)
}

export const getAllResidentes = (): Residente[] => {
  return JSON.parse(localStorage.getItem("residentes") || JSON.stringify(residentesEjemplo))
}

export const getRegistrosResidentePorFecha = (residenteId: string, fecha: string): RegistroActividad[] => {
  const registros = JSON.parse(localStorage.getItem("registros_residentes") || "[]")
  return registros.filter((r: RegistroActividad) => r.residenteId === residenteId && r.fecha === fecha)
}

export const guardarRegistroActividad = (registro: RegistroActividad): void => {
  const registros = JSON.parse(localStorage.getItem("registros_residentes") || "[]")
  registros.push(registro)
  localStorage.setItem("registros_residentes", JSON.stringify(registros))
}

export const getResumenDiario = (fecha: string, centro: string): ResumenDiarioResidente[] => {
  const residentes = getResidentesPorCentro(centro)
  const resumenes: ResumenDiarioResidente[] = []
  
  residentes.forEach(residente => {
    const registros = getRegistrosResidentePorFecha(residente.id, fecha)
    
    const medicacion = registros.filter(r => r.tipo === 'medicacion')
    const comidas = registros.filter(r => r.tipo === 'comida')
    const incidencias = registros.filter(r => r.tipo === 'incidencia')
    
    const medicacionCompleta = medicacion.length > 0 && medicacion.every(m => m.estado === 'realizado')
    const comidasRealizadas = comidas.filter(c => c.estado === 'realizado').length
    const totalComidas = 5 // desayuno, media mañana, comida, merienda, cena
    
    let estadoGeneral: 'bueno' | 'regular' | 'preocupante' = 'bueno'
    
    if (incidencias.length > 0 || !medicacionCompleta) {
      estadoGeneral = 'preocupante'
    } else if (comidasRealizadas < 3) {
      estadoGeneral = 'regular' 
    }
    
    resumenes.push({
      residenteId: residente.id,
      fecha,
      estadoGeneral,
      medicacionCompleta,
      comidasRealizadas,
      totalComidas,
      incidencias: incidencias.length,
      observacionesDelDia: registros
        .filter(r => r.observaciones)
        .map(r => r.observaciones)
        .join('; ') || '',
      ultimaActualizacion: new Date().toISOString()
    })
  })
  
  return resumenes
}

export const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  
  return edad
}

export const getIniciales = (nombre: string, apellidos: string): string => {
  return (nombre.charAt(0) + apellidos.split(' ')[0].charAt(0)).toUpperCase()
}

// Inicializar datos si no existen
export const inicializarDatos = (): void => {
  if (!localStorage.getItem("residentes")) {
    localStorage.setItem("residentes", JSON.stringify(residentesEjemplo))
  }
  
  if (!localStorage.getItem("registros_residentes")) {
    localStorage.setItem("registros_residentes", JSON.stringify([]))
  }
}