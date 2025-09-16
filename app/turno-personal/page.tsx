'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Datos realistas de 60 residentes
const RESIDENTES_60 = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  nombre: [
    "Juan Pérez", "María López", "Carlos Ruiz", "Ana García", "Luis Martín",
    "Rosa Díez", "Pedro Vega", "Isabel Ruiz", "Manuel Torres", "Carmen Vega",
    "Francisco Silva", "Dolores Moreno", "Antonio Jiménez", "Pilar Sánchez", "José Herrera",
    "Mercedes Castro", "Rafael Ortega", "Esperanza Ramos", "Miguel Delgado", "Concepción Vargas",
    "Ángel Romero", "Amparo Guerrero", "Fernando Iglesias", "Remedios Rubio", "Sebastián Prieto",
    "Encarnación Calvo", "Esteban Gallego", "Milagros León", "Victoriano Méndez", "Purificación Santos",
    "Bartolomé Pascual", "Asunción Lorenzo", "Cándido Aguilar", "Visitación Serrano", "Primitivo Morales",
    "Salvadora Durán", "Maximino Cabrera", "Genoveva Vázquez", "Telesforo Ramírez", "Escolástica Martín",
    "Demetrio Suárez", "Honorina Blanco", "Clemente Ruiz", "Basilisa Álvarez", "Marcelino González",
    "Florencia Díaz", "Saturnino López", "Feliciana Rodríguez", "Bautista Fernández", "Petronila García",
    "Teófilo Martínez", "Casimira Jiménez", "Evaristo Hernández", "Eustaquia Pérez", "Higinio Gómez",
    "Gregoria Sánchez", "Policarpo Martín", "Hipólita Álvarez", "Anacleto Torres", "Aquilina Romero"
  ][i],
  habitacion: String(101 + i).padStart(3, '0'),
  edad: 65 + Math.floor(Math.random() * 25)
}));

export default function TurnoPersonal() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [estados, setEstados] = useState({});
  const [incidencias, setIncidencias] = useState({});
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [finalizando, setFinalizando] = useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const usuarioData = sessionStorage.getItem('usuario');
    if (!usuarioData) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(usuarioData);
    if (user.tipo !== 'personal') {
      router.push('/login');
      return;
    }
    setUsuario(user);
    
    // Inicializar todos los estados como OK
    const estadosIniciales = {};
    RESIDENTES_60.forEach(residente => {
      estadosIniciales[residente.id] = {
        medicacion: 'ok',
        desayuno: 'ok',
        comida: 'ok',
        cena: 'ok',
        higiene: 'ok',
        estado: 'ok'
      };
    });
    setEstados(estadosIniciales);
  }, [router]);

  const toggleEstado = (residenteId, campo) => {
    setEstados(prev => ({
      ...prev,
      [residenteId]: {
        ...prev[residenteId],
        [campo]: prev[residenteId][campo] === 'ok' ? 'incidencia' : 'ok'
      }
    }));

    // Si se pone en OK, limpiar la incidencia
    if (estados[residenteId]?.[campo] === 'incidencia') {
      setIncidencias(prev => ({
        ...prev,
        [`${residenteId}-${campo}`]: ''
      }));
    }
  };

  const actualizarIncidencia = (residenteId, campo, texto) => {
    setIncidencias(prev => ({
      ...prev,
      [`${residenteId}-${campo}`]: texto
    }));
  };

  const actualizarEstadoGeneral = (residenteId, nuevoEstado) => {
    setEstados(prev => ({
      ...prev,
      [residenteId]: {
        ...prev[residenteId],
        estado: nuevoEstado
      }
    }));
  };

  const obtenerResumen = () => {
    let totalIncidencias = 0;
    let medicacionIncidencias = 0;
    let comidaIncidencias = 0;
    let higieneIncidencias = 0;
    let estadoProblemas = 0;

    Object.values(estados).forEach(estado => {
      if (estado.medicacion === 'incidencia') medicacionIncidencias++;
      if (estado.desayuno === 'incidencia' || estado.comida === 'incidencia' || estado.cena === 'incidencia') comidaIncidencias++;
      if (estado.higiene === 'incidencia') higieneIncidencias++;
      if (estado.estado !== 'ok') estadoProblemas++;
    });

    totalIncidencias = medicacionIncidencias + comidaIncidencias + higieneIncidencias;

    return {
      totalIncidencias,
      medicacionIncidencias,
      comidaIncidencias,
      higieneIncidencias,
      estadoProblemas,
      residentesOK: RESIDENTES_60.length - totalIncidencias - estadoProblemas
    };
  };

  const finalizarTurno = async () => {
    setFinalizando(true);
    
    const resumen = obtenerResumen();
    const incidenciasTexto = Object.entries(incidencias)
      .filter(([_, texto]) => texto.trim())
      .map(([key, texto]) => {
        const [residenteId, campo] = key.split('-');
        const residente = RESIDENTES_60.find(r => r.id === parseInt(residenteId));
        return `${residente.nombre} (${campo}): ${texto}`;
      });

    const parteData = {
      fecha: new Date().toISOString().split('T')[0],
      personal: usuario.nombre,
      centro: usuario.centro,
      turno: obtenerTurno(),
      estados,
      incidenciasTexto,
      observacionesGenerales,
      resumen,
      totalResidentes: RESIDENTES_60.length,
      hora_inicio: '08:00',
      hora_fin: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const partesGuardados = JSON.parse(localStorage.getItem('partes') || '[]');
    partesGuardados.push({
      id: Date.now(),
      ...parteData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('partes', JSON.stringify(partesGuardados));
    
    alert(`✅ Turno finalizado correctamente.
📊 Resumen: ${resumen.residentesOK} residentes OK, ${resumen.totalIncidencias} incidencias
📄 Parte generado automáticamente para el director.`);
    
    setFinalizando(false);
  };

  const obtenerTurno = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 14) return 'Mañana';
    if (hora >= 14 && hora < 22) return 'Tarde';
    return 'Noche';
  };

  const residentesFiltrados = RESIDENTES_60.filter(residente =>
    residente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    residente.habitacion.includes(filtro)
  );

  if (!usuario) return <div>Cargando...</div>;

  const resumen = obtenerResumen();

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      {/* Header compacto */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              Turno {obtenerTurno()} - {usuario.nombre}
            </h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="text-green-600 font-bold">{resumen.residentesOK} OK</div>
            <div className="text-red-600">{resumen.totalIncidencias} incidencias</div>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar residente o habitación..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mostrando {residentesFiltrados.length} de {RESIDENTES_60.length} residentes
        </p>
      </div>

      {/* Lista de residentes */}
      <div className="space-y-3 mb-6">
        {residentesFiltrados.map(residente => {
          const estadoResidente = estados[residente.id] || {};
          
          return (
            <div key={residente.id} className="bg-white rounded-lg shadow-sm p-3">
              {/* Header del residente */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    {residente.nombre}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Hab. {residente.habitacion} • {residente.edad} años
                  </p>
                </div>
                
                {/* Estado general con desplegable */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Estado:</span>
                  <select
                    value={estadoResidente.estado || 'ok'}
                    onChange={(e) => actualizarEstadoGeneral(residente.id, e.target.value)}
                    className={`text-sm px-2 py-1 rounded border ${
                      estadoResidente.estado === 'ok' ? 'bg-green-50 border-green-300 text-green-700' :
                      estadoResidente.estado === 'regular' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                      estadoResidente.estado === 'mal' ? 'bg-red-50 border-red-300 text-red-700' :
                      'bg-orange-50 border-orange-300 text-orange-700'
                    }`}
                  >
                    <option value="ok">😊 Bien</option>
                    <option value="regular">😐 Regular</option>
                    <option value="mal">😟 Mal</option>
                    <option value="dolor">😣 Dolor</option>
                  </select>
                </div>
              </div>

              {/* Controles principales con iconos */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {/* Medicación */}
                <div className="text-center">
                  <button
                    onClick={() => toggleEstado(residente.id, 'medicacion')}
                    className={`w-full p-2 md:p-3 rounded-lg border-2 transition-all ${
                      estadoResidente.medicacion === 'ok'
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                    }`}
                  >
                    <div className="text-lg md:text-xl">💊</div>
                    <div className="text-xs font-medium">Med</div>
                  </button>
                </div>

                {/* Desayuno */}
                <div className="text-center">
                  <button
                    onClick={() => toggleEstado(residente.id, 'desayuno')}
                    className={`w-full p-2 md:p-3 rounded-lg border-2 transition-all ${
                      estadoResidente.desayuno === 'ok'
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                    }`}
                  >
                    <div className="text-lg md:text-xl">🌅</div>
                    <div className="text-xs font-medium">Des</div>
                  </button>
                </div>

                {/* Comida */}
                <div className="text-center">
                  <button
                    onClick={() => toggleEstado(residente.id, 'comida')}
                    className={`w-full p-2 md:p-3 rounded-lg border-2 transition-all ${
                      estadoResidente.comida === 'ok'
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                    }`}
                  >
                    <div className="text-lg md:text-xl">🍽️</div>
                    <div className="text-xs font-medium">Com</div>
                  </button>
                </div>

                {/* Cena */}
                <div className="text-center">
                  <button
                    onClick={() => toggleEstado(residente.id, 'cena')}
                    className={`w-full p-2 md:p-3 rounded-lg border-2 transition-all ${
                      estadoResidente.cena === 'ok'
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                    }`}
                  >
                    <div className="text-lg md:text-xl">🌙</div>
                    <div className="text-xs font-medium">Cena</div>
                  </button>
                </div>

                {/* Higiene */}
                <div className="text-center">
                  <button
                    onClick={() => toggleEstado(residente.id, 'higiene')}
                    className={`w-full p-2 md:p-3 rounded-lg border-2 transition-all ${
                      estadoResidente.higiene === 'ok'
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-red-100 border-red-400 text-red-700'
                    }`}
                  >
                    <div className="text-lg md:text-xl">🚿</div>
                    <div className="text-xs font-medium">Hig</div>
                  </button>
                </div>
              </div>

              {/* Campos de incidencias (solo aparecen si hay incidencia) */}
              {Object.entries(estadoResidente).map(([campo, estado]) => {
                if (estado === 'incidencia' && campo !== 'estado') {
                  return (
                    <div key={campo} className="mt-3">
                      <textarea
                        placeholder={`Describe la incidencia de ${campo}...`}
                        value={incidencias[`${residente.id}-${campo}`] || ''}
                        onChange={(e) => actualizarIncidencia(residente.id, campo, e.target.value)}
                        className="w-full p-2 border border-red-300 rounded-lg bg-red-50 text-sm"
                        rows={2}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        })}
      </div>

      {/* Observaciones generales */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">📝 Observaciones Generales del Turno</h2>
        <textarea
          value={observacionesGenerales}
          onChange={(e) => setObservacionesGenerales(e.target.value)}
          placeholder="Observaciones generales, notas para el siguiente turno, cambios importantes..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          rows={3}
        />
      </div>

      {/* Finalizar turno */}
      <div className="text-center">
        <button
          onClick={finalizarTurno}
          disabled={finalizando}
          className={`w-full p-4 rounded-xl text-lg font-bold transition-all duration-200 ${
            finalizando
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-95'
          }`}
        >
          {finalizando ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Finalizando turno y generando parte...
            </div>
          ) : (
            <>
              🏁 FINALIZAR TURNO
              <div className="text-sm font-normal mt-1 opacity-90">
                {resumen.residentesOK} OK • {resumen.totalIncidencias} incidencias
              </div>
            </>
          )}
        </button>
      </div>

      {/* Estimación de tiempo */}
      <div className="text-center mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700">
          ⏱️ <strong>Tiempo empleado:</strong> ~{Math.max(1, Math.ceil(resumen.totalIncidencias * 0.3))} minutos
        </p>
        <p className="text-xs text-green-600 mt-1">
          🎯 {resumen.totalIncidencias === 0 ? 'PERFECTO' : resumen.totalIncidencias < 10 ? 'EXCELENTE' : 'NORMAL'} • Máximo 5 min vs 30-35 min en papel
        </p>
      </div>
    </div>
  );
}