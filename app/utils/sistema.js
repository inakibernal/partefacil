// Sistema de gestión de entidades y permisos
export const SistemaGestion = {
  // Verificar permisos según rol y operación
  verificarPermisos: (sesion, operacion, entidad, targetId = null) => {
    if (!sesion || !sesion.rol) return false;
    
    switch (sesion.rol) {
      case 'desarrollador':
        // El desarrollador puede hacer todo
        return true;
        
      case 'director':
        // El director solo puede gestionar sus propias entidades
        if (operacion === 'crear') return true;
        if (targetId && entidad === 'residencia') {
          const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
          const residencia = residencias.find(r => r.id === targetId);
          return residencia && residencia.director_id === sesion.directorId;
        }
        if (targetId && (entidad === 'trabajador' || entidad === 'residente')) {
          // Verificar que pertenece a una residencia del director
          const entidades = JSON.parse(localStorage.getItem(`${entidad}es_data`) || '[]');
          const item = entidades.find(i => i.id === targetId);
          if (!item || !item.residencia_id) return false;
          
          const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
          const residencia = residencias.find(r => r.id === item.residencia_id);
          return residencia && residencia.director_id === sesion.directorId;
        }
        return true;
        
      case 'personal':
        // El personal solo puede ver/crear partes de su residencia
        if (entidad === 'parte' && (operacion === 'leer' || operacion === 'crear')) {
          return true;
        }
        return false;
        
      default:
        return false;
    }
  },

  // Filtrar entidades según permisos del usuario
  filtrarSegunPermisos: (sesion, entidades, tipoEntidad) => {
    if (!sesion || !entidades) return [];
    
    switch (sesion.rol) {
      case 'desarrollador':
        return entidades;
        
      case 'director':
        if (tipoEntidad === 'residencia') {
          return entidades.filter(r => r.director_id === sesion.directorId);
        }
        if (tipoEntidad === 'trabajador' || tipoEntidad === 'residente') {
          const residenciasDelDirector = JSON.parse(localStorage.getItem('residencias_sistema') || '[]')
            .filter(r => r.director_id === sesion.directorId)
            .map(r => r.id);
          return entidades.filter(e => residenciasDelDirector.includes(e.residencia_id));
        }
        return entidades;
        
      case 'personal':
        if (tipoEntidad === 'residente') {
          return entidades.filter(r => r.residencia_id === sesion.residenciaId);
        }
        if (tipoEntidad === 'parte') {
          return entidades.filter(p => p.personalId === sesion.personalId);
        }
        return [];
        
      default:
        return [];
    }
  },

  // Crear relación entre entidades
  crearRelacion: (entidadPadre, entidadHija, padreId, hijaId) => {
    const relaciones = JSON.parse(localStorage.getItem('relaciones_sistema') || '{}');
    
    if (!relaciones[entidadPadre]) relaciones[entidadPadre] = {};
    if (!relaciones[entidadPadre][padreId]) relaciones[entidadPadre][padreId] = [];
    
    if (!relaciones[entidadPadre][padreId].includes(hijaId)) {
      relaciones[entidadPadre][padreId].push(hijaId);
    }
    
    localStorage.setItem('relaciones_sistema', JSON.stringify(relaciones));
  },

  // Obtener hijos de una entidad
  obtenerHijos: (entidadPadre, padreId) => {
    const relaciones = JSON.parse(localStorage.getItem('relaciones_sistema') || '{}');
    return relaciones[entidadPadre]?.[padreId] || [];
  },

  // Eliminar relación (para sistema de papelera)
  eliminarRelacion: (entidadPadre, entidadHija, padreId, hijaId) => {
    const relaciones = JSON.parse(localStorage.getItem('relaciones_sistema') || '{}');
    
    if (relaciones[entidadPadre]?.[padreId]) {
      relaciones[entidadPadre][padreId] = relaciones[entidadPadre][padreId]
        .filter(id => id !== hijaId);
    }
    
    localStorage.setItem('relaciones_sistema', JSON.stringify(relaciones));
  }
};

// Sistema de papelera con retención de 5 años
export const SistemaPapelera = {
  // Mover elemento a papelera
  eliminar: (tipoEntidad, elemento, motivoEliminacion = 'Usuario') => {
    const papelera = JSON.parse(localStorage.getItem('papelera_sistema') || '[]');
    
    const elementoPapelera = {
      id: elemento.id,
      tipoEntidad,
      datos: elemento,
      fechaEliminacion: new Date().toISOString(),
      fechaExpiracion: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 5 años
      motivoEliminacion,
      eliminadoPor: JSON.parse(localStorage.getItem('sesion_activa') || '{}').usuario || 'Sistema'
    };
    
    papelera.push(elementoPapelera);
    localStorage.setItem('papelera_sistema', JSON.stringify(papelera));
    
    // Eliminar del almacenamiento principal
    const clavePrincipal = SistemaPapelera.obtenerClaveAlmacenamiento(tipoEntidad);
    const entidades = JSON.parse(localStorage.getItem(clavePrincipal) || '[]');
    const entidadesActualizadas = entidades.filter(e => e.id !== elemento.id);
    localStorage.setItem(clavePrincipal, JSON.stringify(entidadesActualizadas));
    
    return elementoPapelera.id;
  },

  // Restaurar elemento desde papelera
  restaurar: (elementoId) => {
    const papelera = JSON.parse(localStorage.getItem('papelera_sistema') || '[]');
    const elemento = papelera.find(e => e.id === elementoId);
    
    if (!elemento) return false;
    
    // Restaurar al almacenamiento principal
    const clavePrincipal = this.obtenerClaveAlmacenamiento(elemento.tipoEntidad);
    const entidades = JSON.parse(localStorage.getItem(clavePrincipal) || '[]');
    entidades.push(elemento.datos);
    localStorage.setItem(clavePrincipal, JSON.stringify(entidades));
    
    // Eliminar de papelera
    const papeleraActualizada = papelera.filter(e => e.id !== elementoId);
    localStorage.setItem('papelera_sistema', JSON.stringify(papeleraActualizada));
    
    return true;
  },

  // Obtener elementos en papelera
  obtenerPapelera: (tipoEntidad = null) => {
    const papelera = JSON.parse(localStorage.getItem('papelera_sistema') || '[]');
    
    if (tipoEntidad) {
      return papelera.filter(e => e.tipoEntidad === tipoEntidad);
    }
    
    return papelera;
  },

  // Limpiar elementos expirados automáticamente
  limpiarExpirados: () => {
    const papelera = JSON.parse(localStorage.getItem('papelera_sistema') || '[]');
    const ahora = new Date().toISOString();
    
    const papeleraLimpia = papelera.filter(e => e.fechaExpiracion > ahora);
    localStorage.setItem('papelera_sistema', JSON.stringify(papeleraLimpia));
    
    return papelera.length - papeleraLimpia.length; // Cantidad eliminada
  },

  // Obtener clave de almacenamiento según tipo de entidad
  obtenerClaveAlmacenamiento: (tipoEntidad) => {
    const claves = {
      'director': 'directores_sistema',
      'residencia': 'residencias_sistema', 
      'trabajador': 'personal_data',
      'residente': 'residentes_data',
      'parte': 'partes_completos'
    };
    
    return claves[tipoEntidad] || `${tipoEntidad}s_data`;
  }
};

// Inicialización del sistema
export const inicializarSistema = () => {
  // Limpiar elementos expirados de la papelera al iniciar
  SistemaPapelera.limpiarExpirados();
  
  // Verificar integridad de relaciones
  // (Aquí se pueden añadir más verificaciones si es necesario)
};
