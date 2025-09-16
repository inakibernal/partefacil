// Utilidades de seguridad para la aplicación

// Función para sanitizar entradas de usuario
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remover caracteres HTML peligrosos
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover eventos onclick, onload, etc.
    .trim()
}

// Función para validar DNI
export const validateDNI = (dni: string): boolean => {
  const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i
  if (!dniRegex.test(dni)) return false
  
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const numbers = dni.slice(0, 8)
  const letter = dni.slice(8, 9).toUpperCase()
  
  return letters[parseInt(numbers) % 23] === letter
}

// Función para generar tokens seguros
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Fallback para entornos sin crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Función para validar sesiones
export const validateSession = (): boolean => {
  try {
    const sessionData = sessionStorage.getItem("usuario_logueado")
    if (!sessionData) return false
    
    const session = JSON.parse(sessionData)
    
    // Verificar que tiene los campos obligatorios
    if (!session.dni || !session.nombre || !session.tipo) return false
    
    // Verificar que el DNI es válido
    if (!validateDNI(session.dni)) return false
    
    // Verificar que la sesión no sea muy antigua (máximo 8 horas)
    if (session.fechaLogin) {
      const fechaLogin = new Date(session.fechaLogin)
      const ahora = new Date()
      const diferencia = ahora.getTime() - fechaLogin.getTime()
      const horas = diferencia / (1000 * 60 * 60)
      
      if (horas > 8) {
        sessionStorage.removeItem("usuario_logueado")
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error("Error validando sesión:", error)
    sessionStorage.removeItem("usuario_logueado")
    return false
  }
}

// Función para limpiar datos sensibles del localStorage
export const clearSensitiveData = (): void => {
  try {
    // Lista de claves que pueden contener datos sensibles
    const sensitiveKeys = [
      'usuario_logueado',
      'informes_diarios',
      'auth_token',
      'session_data'
    ]
    
    sensitiveKeys.forEach(key => {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Error limpiando datos sensibles:", error)
  }
}

// Función para detectar intentos de manipulación
export const detectTampering = (): boolean => {
  try {
    // Verificar si hay herramientas de desarrollo abiertas
    const threshold = 160
    
    if (typeof window !== 'undefined') {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        console.warn("Herramientas de desarrollo detectadas")
        return true
      }
    }
    
    return false
  } catch (error) {
    return false
  }
}

// Función para cifrado básico de datos locales
export const encryptData = (data: string): string => {
  try {
    // Cifrado simple con Base64 y transformación
    const encoded = btoa(data)
    return encoded.split('').reverse().join('')
  } catch (error) {
    console.error("Error cifrando datos:", error)
    return data
  }
}

// Función para descifrado básico de datos locales
export const decryptData = (encryptedData: string): string => {
  try {
    const reversed = encryptedData.split('').reverse().join('')
    return atob(reversed)
  } catch (error) {
    console.error("Error descifrando datos:", error)
    return encryptedData
  }
}

// Función para crear hash de datos
export const createHash = async (data: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  // Fallback simple
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}