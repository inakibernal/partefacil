interface Usuario {
  dni: string
  nombre: string
  tipo: string
  residencias: string[]
  fechaLogin: string
  lastActivity?: string
}

// Configuración de timeout (3 minutos en milisegundos)
const SESSION_TIMEOUT = 3 * 60 * 1000 // 3 minutos

let timeoutId: NodeJS.Timeout | null = null

// Función para obtener usuario de sesión
export const getUsuarioSesion = (): Usuario | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const usuarioData = sessionStorage.getItem("usuario_logueado")
    if (!usuarioData) return null
    
    const usuario = JSON.parse(usuarioData)
    
    // Verificar si la sesión ha expirado por inactividad
    if (usuario.lastActivity) {
      const tiempoInactivo = Date.now() - new Date(usuario.lastActivity).getTime()
      if (tiempoInactivo > SESSION_TIMEOUT) {
        cerrarSesion()
        return null
      }
    }
    
    return usuario
  } catch {
    return null
  }
}

// Función para guardar usuario en sesión
export const guardarSesion = (usuario: Usuario): void => {
  if (typeof window === 'undefined') return
  
  const usuarioConActividad = {
    ...usuario,
    lastActivity: new Date().toISOString()
  }
  
  // Usar sessionStorage en lugar de localStorage para que se borre al cerrar navegador
  sessionStorage.setItem("usuario_logueado", JSON.stringify(usuarioConActividad))
  
  // Iniciar el monitoreo de inactividad
  iniciarMonitoreoInactividad()
}

// Función para actualizar actividad del usuario
export const actualizarActividad = (): void => {
  if (typeof window === 'undefined') return
  
  const usuario = getUsuarioSesion()
  if (usuario) {
    usuario.lastActivity = new Date().toISOString()
    sessionStorage.setItem("usuario_logueado", JSON.stringify(usuario))
    
    // Reiniciar el timer de inactividad
    iniciarMonitoreoInactividad()
  }
}

// Función para cerrar sesión
export const cerrarSesion = (): void => {
  if (typeof window === 'undefined') return
  
  sessionStorage.removeItem("usuario_logueado")
  
  // Limpiar timeout si existe
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  
  // Redirigir a login
  window.location.href = "/"
}

// Función para iniciar monitoreo de inactividad
const iniciarMonitoreoInactividad = (): void => {
  // Limpiar timeout anterior si existe
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  // Configurar nuevo timeout
  timeoutId = setTimeout(() => {
    alert("Tu sesión ha expirado por inactividad. Serás redirigido al login.")
    cerrarSesion()
  }, SESSION_TIMEOUT)
}

// Función para configurar listeners de actividad
export const configurarListenersActividad = (): (() => void) => {
  if (typeof window === 'undefined') return () => {}
  
  // Eventos que indican actividad del usuario
  const eventos = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  const manejarActividad = () => {
    actualizarActividad()
  }
  
  // Añadir listeners
  eventos.forEach(evento => {
    document.addEventListener(evento, manejarActividad, true)
  })
  
  // Cleanup función para remover listeners
  return () => {
    eventos.forEach(evento => {
      document.removeEventListener(evento, manejarActividad, true)
    })
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}