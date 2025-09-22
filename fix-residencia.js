// Script para corregir el problema de residencia_id
console.log('=== DIAGNÓSTICO Y CORRECCIÓN ===');

// Cargar datos
const personal = JSON.parse(localStorage.getItem('personal_data') || '[]');
const residencias = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
const sesion = JSON.parse(localStorage.getItem('sesion_activa') || '{}');

console.log('Sesión actual:', sesion);
console.log('Total trabajadores:', personal.length);
console.log('Total residencias:', residencias.length);

// Buscar el trabajador de la sesión
const trabajadorActual = personal.find(p => p.dni === sesion.dni);
console.log('Trabajador encontrado:', trabajadorActual);

if (trabajadorActual) {
  console.log('Residencia_id del trabajador:', trabajadorActual.residencia_id, typeof trabajadorActual.residencia_id);
  
  // Buscar la residencia
  const residenciaEncontrada = residencias.find(r => r.id == trabajadorActual.residencia_id);
  console.log('Residencia encontrada:', residenciaEncontrada);
  
  if (!residenciaEncontrada) {
    console.log('❌ PROBLEMA: No se encuentra residencia con ID:', trabajadorActual.residencia_id);
    console.log('IDs de residencias disponibles:', residencias.map(r => r.id));
    
    // Intentar arreglar asignando la primera residencia disponible
    if (residencias.length > 0) {
      console.log('🔧 CORRECCIÓN: Asignando primera residencia disponible');
      trabajadorActual.residencia_id = residencias[0].id;
      localStorage.setItem('personal_data', JSON.stringify(personal));
      
      // Actualizar sesión
      sesion.residenciaId = residencias[0].id;
      sesion.residenciaNombre = residencias[0].nombre;
      localStorage.setItem('sesion_activa', JSON.stringify(sesion));
      
      console.log('✅ CORREGIDO: Trabajador asignado a', residencias[0].nombre);
      console.log('Recarga la página para probar');
    }
  } else {
    console.log('✅ Todo correcto, residencia encontrada:', residenciaEncontrada.nombre);
  }
}
