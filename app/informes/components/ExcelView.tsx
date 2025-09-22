"use client";
import React, { useState } from "react";
import * as XLSX from 'xlsx';

export default function ExcelView({
  sesionActiva,
  residencias,
  personal,
  residentes,
  onRecargarDatos,
}: {
  sesionActiva: any;
  residencias: any[];
  personal: any[];
  residentes: any[];
  onRecargarDatos: () => void;
}) {
  const [archivo, setArchivo] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [paso, setPaso] = useState(1);
  const [resultados, setResultados] = useState(null);
  const [errores, setErrores] = useState([]);

  const descargarPlantillaExcel = () => {
    const wb = XLSX.utils.book_new();

    const datosResidencias = [
      {
        nombre: "Residencia San Juan",
        direccion: "Calle Mayor 15",
        codigo_postal: "28001",
        poblacion: "Madrid",
        telefono_fijo: "915551234",
        telefono_movil: "666123456",
        email: "sanjuan@residencias.es",
        total_plazas: 50,
        plazas_ocupadas: 35,
        cif: "A12345678",
        numero_licencia: "LIC-001",
        dni_director: "12345678A",
        nombre_director: "Director Ejemplo"
      },
      {
        nombre: "Residencia Vista Alegre",
        direccion: "Avenida de la Paz 22",
        codigo_postal: "28002",
        poblacion: "Madrid",
        telefono_fijo: "915552345",
        telefono_movil: "666234567",
        email: "vistaalegre@residencias.es",
        total_plazas: 40,
        plazas_ocupadas: 28,
        cif: "B23456789",
        numero_licencia: "LIC-002",
        dni_director: "12345678A",
        nombre_director: "Director Ejemplo"
      }
    ];

    const datosPersonal = [
      {
        dni: "11111111A",
        nombre: "María",
        apellidos: "García López",
        telefono: "666111222",
        email: "maria.garcia@clinica.es",
        fecha_nacimiento: "1985-03-15",
        direccion: "Calle Sol 10",
        poblacion: "Madrid",
        codigo_postal: "28003",
        fecha_alta: "2020-01-15",
        titulacion: "Enfermería",
        numero_colegiado: "COL-001",
        cif_residencia: "A12345678",
        contrasena: "enfermera123"
      },
      {
        dni: "22222222B",
        nombre: "Carlos",
        apellidos: "Martín Ruiz",
        telefono: "666333444",
        email: "carlos.martin@clinica.es",
        fecha_nacimiento: "1978-07-22",
        direccion: "Plaza España 5",
        poblacion: "Madrid",
        codigo_postal: "28004",
        fecha_alta: "2019-06-10",
        titulacion: "Medicina",
        numero_colegiado: "COL-002",
        cif_residencia: "A12345678",
        contrasena: "doctor456"
      },
      {
        dni: "33333333C",
        nombre: "Ana",
        apellidos: "López Santos",
        telefono: "666555777",
        email: "ana.lopez@clinica.es",
        fecha_nacimiento: "1982-11-08",
        direccion: "Gran Vía 33",
        poblacion: "Madrid",
        codigo_postal: "28005",
        fecha_alta: "2021-03-20",
        titulacion: "Fisioterapia",
        numero_colegiado: "COL-003",
        cif_residencia: "B23456789",
        contrasena: "fisio789"
      }
    ];

    const datosResidentes = [
      {
        dni: "44444444D",
        nombre: "José",
        apellidos: "Fernández García",
        fecha_nacimiento: "1935-05-12",
        edad: 89,
        numero_historia: "HIST-001",
        fecha_ingreso: "2022-01-15",
        grado_dependencia: "II",
        alergias: "Penicilina",
        medicacion_habitual: "Omeprazol 20mg",
        contacto_emergencia: "Carmen Fernández",
        telefono_emergencia: "666888999",
        parentesco: "Hija",
        estado_salud: "Estable",
        observaciones: "Muy colaborador",
        cif_residencia: "A12345678"
      },
      {
        dni: "55555555E",
        nombre: "Pilar",
        apellidos: "Rodríguez Jiménez",
        fecha_nacimiento: "1940-08-25",
        edad: 84,
        numero_historia: "HIST-002",
        fecha_ingreso: "2021-11-20",
        grado_dependencia: "I",
        alergias: "Ninguna",
        medicacion_habitual: "Paracetamol 500mg",
        contacto_emergencia: "Miguel Rodríguez",
        telefono_emergencia: "666777888",
        parentesco: "Hijo",
        estado_salud: "Bueno",
        observaciones: "Independiente para AVD",
        cif_residencia: "A12345678"
      },
      {
        dni: "66666666F",
        nombre: "Antonio",
        apellidos: "Sánchez López",
        fecha_nacimiento: "1932-12-03",
        edad: 92,
        numero_historia: "HIST-003",
        fecha_ingreso: "2023-02-10",
        grado_dependencia: "III",
        alergias: "Aspirina",
        medicacion_habitual: "Insulina Lantus",
        contacto_emergencia: "Rosa Sánchez",
        telefono_emergencia: "666666777",
        parentesco: "Esposa",
        estado_salud: "Delicado",
        observaciones: "Requiere asistencia continua",
        cif_residencia: "B23456789"
      }
    ];

    const wsResidencias = XLSX.utils.json_to_sheet(datosResidencias);
    const wsPersonal = XLSX.utils.json_to_sheet(datosPersonal);
    const wsResidentes = XLSX.utils.json_to_sheet(datosResidentes);

    XLSX.utils.book_append_sheet(wb, wsResidencias, "Residencias");
    XLSX.utils.book_append_sheet(wb, wsPersonal, "Personal");
    XLSX.utils.book_append_sheet(wb, wsResidentes, "Residentes");

    XLSX.writeFile(wb, "plantilla_datos_prueba.xlsx");
  };

  const descargarDatosActualesExcel = () => {
    const wb = XLSX.utils.book_new();

    const residenciasParaExcel = residencias.map(r => ({
      nombre: r.nombre,
      direccion: r.direccion,
      codigo_postal: r.codigo_postal,
      poblacion: r.poblacion,
      telefono_fijo: r.telefono_fijo,
      telefono_movil: r.telefono_movil || '',
      email: r.email,
      total_plazas: r.total_plazas,
      plazas_ocupadas: r.plazas_ocupadas,
      cif: r.cif,
      numero_licencia: r.numero_licencia,
      dni_director: r.dni_director,
      nombre_director: r.nombre_director
    }));

    const personalParaExcel = personal.map(p => {
      const residencia = residencias.find(r => r.id == p.residencia_id);
      return {
        dni: p.dni,
        nombre: p.nombre,
        apellidos: p.apellidos,
        telefono: p.telefono,
        email: p.email,
        fecha_nacimiento: p.fecha_nacimiento,
        direccion: p.direccion,
        poblacion: p.poblacion,
        codigo_postal: p.codigo_postal,
        fecha_alta: p.fecha_alta,
        titulacion: p.titulacion,
        numero_colegiado: p.numero_colegiado,
        cif_residencia: residencia?.cif || '',
        contrasena: p.contrasena
      };
    });

    const residentesParaExcel = residentes.map(r => {
      const residencia = residencias.find(res => res.id == r.residencia_id);
      return {
        dni: r.dni,
        nombre: r.nombre,
        apellidos: r.apellidos,
        fecha_nacimiento: r.fecha_nacimiento,
        edad: r.edad,
        numero_historia: r.numero_historia,
        fecha_ingreso: r.fecha_ingreso,
        grado_dependencia: r.grado_dependencia,
        alergias: r.alergias || '',
        medicacion_habitual: r.medicacion_habitual || '',
        contacto_emergencia: r.contacto_emergencia,
        telefono_emergencia: r.telefono_emergencia,
        parentesco: r.parentesco,
        estado_salud: r.estado_salud || '',
        observaciones: r.observaciones || '',
        cif_residencia: residencia?.cif || ''
      };
    });

    const wsResidencias = XLSX.utils.json_to_sheet(residenciasParaExcel);
    const wsPersonal = XLSX.utils.json_to_sheet(personalParaExcel);
    const wsResidentes = XLSX.utils.json_to_sheet(residentesParaExcel);

    XLSX.utils.book_append_sheet(wb, wsResidencias, "Residencias");
    XLSX.utils.book_append_sheet(wb, wsPersonal, "Personal");
    XLSX.utils.book_append_sheet(wb, wsResidentes, "Residentes");

    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `datos_actuales_${fecha}.xlsx`);
  };

  const procesarArchivo = async (file) => {
    setProcesando(true);
    setErrores([]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const resultadosProceso = {
        residencias: 0,
        personal: 0,
        residentes: 0,
        residenciasActualizadas: 0,
        personalActualizado: 0,
        residentesActualizados: 0,
        errores: []
      };

      const mapaCifAId = {}; // Mapear CIF a ID de residencia

      // PASO 1: Procesar Residencias usando CIF como identificador único
      if (workbook.SheetNames.includes('Residencias')) {
        const hoja = workbook.Sheets['Residencias'];
        const datosResidencias = XLSX.utils.sheet_to_json(hoja);
        
        let residenciasExistentes = JSON.parse(localStorage.getItem('residencias_sistema') || '[]');
        
        datosResidencias.forEach((fila, index) => {
          try {
            const cif = fila.cif;
            if (!cif) {
              resultadosProceso.errores.push(`Residencia fila ${index + 2}: CIF es obligatorio`);
              return;
            }

            // Buscar si ya existe una residencia con este CIF
            const residenciaExistente = residenciasExistentes.find(r => r.cif === cif);
            
            if (residenciaExistente) {
              // ACTUALIZAR residencia existente
              residenciaExistente.nombre = fila.nombre;
              residenciaExistente.direccion = fila.direccion;
              residenciaExistente.codigo_postal = fila.codigo_postal;
              residenciaExistente.poblacion = fila.poblacion;
              residenciaExistente.telefono_fijo = fila.telefono_fijo;
              residenciaExistente.telefono_movil = fila.telefono_movil || '';
              residenciaExistente.email = fila.email;
              residenciaExistente.total_plazas = parseInt(fila.total_plazas) || 0;
              residenciaExistente.plazas_ocupadas = parseInt(fila.plazas_ocupadas) || 0;
              residenciaExistente.numero_licencia = fila.numero_licencia;
              residenciaExistente.dni_director = fila.dni_director;
              residenciaExistente.nombre_director = fila.nombre_director;
              residenciaExistente.fecha_modificacion = new Date().toISOString();
              
              mapaCifAId[cif] = residenciaExistente.id;
              resultadosProceso.residenciasActualizadas++;
            } else {
              // CREAR nueva residencia
              const idResidencia = Date.now() + index;
              const nuevaResidencia = {
                id: idResidencia,
                nombre: fila.nombre,
                direccion: fila.direccion,
                codigo_postal: fila.codigo_postal,
                poblacion: fila.poblacion,
                telefono_fijo: fila.telefono_fijo,
                telefono_movil: fila.telefono_movil || '',
                email: fila.email,
                total_plazas: parseInt(fila.total_plazas) || 0,
                plazas_ocupadas: parseInt(fila.plazas_ocupadas) || 0,
                cif: cif,
                numero_licencia: fila.numero_licencia,
                dni_director: fila.dni_director,
                nombre_director: fila.nombre_director,
                director_id: sesionActiva.directorId,
                fecha_creacion: new Date().toISOString(),
                fecha_modificacion: new Date().toISOString()
              };
              
              residenciasExistentes.push(nuevaResidencia);
              mapaCifAId[cif] = idResidencia;
              resultadosProceso.residencias++;
            }
          } catch (error) {
            resultadosProceso.errores.push(`Error en residencia fila ${index + 2}: ${error.message}`);
          }
        });
        
        localStorage.setItem('residencias_sistema', JSON.stringify(residenciasExistentes));
      }

      // PASO 2: Procesar Personal usando DNI como identificador único
      if (workbook.SheetNames.includes('Personal')) {
        const hoja = workbook.Sheets['Personal'];
        const datosPersonal = XLSX.utils.sheet_to_json(hoja);
        
        let personalExistente = JSON.parse(localStorage.getItem('personal_data') || '[]');
        
        datosPersonal.forEach((fila, index) => {
          try {
            const dni = fila.dni;
            if (!dni) {
              resultadosProceso.errores.push(`Personal fila ${index + 2}: DNI es obligatorio`);
              return;
            }

            // Encontrar ID de residencia por CIF
            let residenciaId = null;
            if (fila.cif_residencia && mapaCifAId[fila.cif_residencia]) {
              residenciaId = mapaCifAId[fila.cif_residencia];
            }

            if (!residenciaId) {
              resultadosProceso.errores.push(`Personal fila ${index + 2}: No se encontró residencia con CIF ${fila.cif_residencia}`);
              return;
            }

            // Buscar si ya existe personal con este DNI
            const personalExist = personalExistente.find(p => p.dni === dni);
            
            if (personalExist) {
              // ACTUALIZAR personal existente
              personalExist.nombre = fila.nombre;
              personalExist.apellidos = fila.apellidos;
              personalExist.telefono = fila.telefono;
              personalExist.email = fila.email;
              personalExist.fecha_nacimiento = fila.fecha_nacimiento;
              personalExist.direccion = fila.direccion;
              personalExist.poblacion = fila.poblacion;
              personalExist.codigo_postal = fila.codigo_postal;
              personalExist.fecha_alta = fila.fecha_alta;
              personalExist.titulacion = fila.titulacion;
              personalExist.numero_colegiado = fila.numero_colegiado;
              personalExist.residencia_id = residenciaId;
              personalExist.contrasena = fila.contrasena;
              personalExist.fecha_modificacion = new Date().toISOString();
              
              resultadosProceso.personalActualizado++;
            } else {
              // CREAR nuevo personal
              const nuevoPersonal = {
                id: Date.now() + index + 10000,
                dni: dni,
                nombre: fila.nombre,
                apellidos: fila.apellidos,
                telefono: fila.telefono,
                email: fila.email,
                fecha_nacimiento: fila.fecha_nacimiento,
                direccion: fila.direccion,
                poblacion: fila.poblacion,
                codigo_postal: fila.codigo_postal,
                fecha_alta: fila.fecha_alta,
                titulacion: fila.titulacion,
                numero_colegiado: fila.numero_colegiado,
                residencia_id: residenciaId,
                contrasena: fila.contrasena,
                fecha_creacion: new Date().toISOString(),
                fecha_modificacion: new Date().toISOString()
              };
              
              personalExistente.push(nuevoPersonal);
              resultadosProceso.personal++;
            }
          } catch (error) {
            resultadosProceso.errores.push(`Error en personal fila ${index + 2}: ${error.message}`);
          }
        });
        
        localStorage.setItem('personal_data', JSON.stringify(personalExistente));
      }

      // PASO 3: Procesar Residentes usando DNI como identificador único
      if (workbook.SheetNames.includes('Residentes')) {
        const hoja = workbook.Sheets['Residentes'];
        const datosResidentes = XLSX.utils.sheet_to_json(hoja);
        
        let residentesExistentes = JSON.parse(localStorage.getItem('residentes_data') || '[]');
        
        datosResidentes.forEach((fila, index) => {
          try {
            const dni = fila.dni;
            if (!dni) {
              resultadosProceso.errores.push(`Residente fila ${index + 2}: DNI es obligatorio`);
              return;
            }

            // Encontrar ID de residencia por CIF
            let residenciaId = null;
            if (fila.cif_residencia && mapaCifAId[fila.cif_residencia]) {
              residenciaId = mapaCifAId[fila.cif_residencia];
            }

            if (!residenciaId) {
              resultadosProceso.errores.push(`Residente fila ${index + 2}: No se encontró residencia con CIF ${fila.cif_residencia}`);
              return;
            }

            // Buscar si ya existe residente con este DNI
            const residenteExistente = residentesExistentes.find(r => r.dni === dni);
            
            if (residenteExistente) {
              // ACTUALIZAR residente existente
              residenteExistente.nombre = fila.nombre;
              residenteExistente.apellidos = fila.apellidos;
              residenteExistente.fecha_nacimiento = fila.fecha_nacimiento;
              residenteExistente.edad = parseInt(fila.edad) || 0;
              residenteExistente.numero_historia = fila.numero_historia;
              residenteExistente.fecha_ingreso = fila.fecha_ingreso;
              residenteExistente.grado_dependencia = fila.grado_dependencia;
              residenteExistente.alergias = fila.alergias || '';
              residenteExistente.medicacion_habitual = fila.medicacion_habitual || '';
              residenteExistente.contacto_emergencia = fila.contacto_emergencia;
              residenteExistente.telefono_emergencia = fila.telefono_emergencia;
              residenteExistente.parentesco = fila.parentesco;
              residenteExistente.estado_salud = fila.estado_salud || '';
              residenteExistente.observaciones = fila.observaciones || '';
              residenteExistente.residencia_id = residenciaId;
              residenteExistente.fecha_modificacion = new Date().toISOString();
              
              resultadosProceso.residentesActualizados++;
            } else {
              // CREAR nuevo residente
              const nuevoResidente = {
                id: Date.now() + index + 20000,
                dni: dni,
                nombre: fila.nombre,
                apellidos: fila.apellidos,
                fecha_nacimiento: fila.fecha_nacimiento,
                edad: parseInt(fila.edad) || 0,
                numero_historia: fila.numero_historia,
                fecha_ingreso: fila.fecha_ingreso,
                grado_dependencia: fila.grado_dependencia,
                alergias: fila.alergias || '',
                medicacion_habitual: fila.medicacion_habitual || '',
                contacto_emergencia: fila.contacto_emergencia,
                telefono_emergencia: fila.telefono_emergencia,
                parentesco: fila.parentesco,
                estado_salud: fila.estado_salud || '',
                observaciones: fila.observaciones || '',
                residencia_id: residenciaId,
                fecha_creacion: new Date().toISOString(),
                fecha_modificacion: new Date().toISOString()
              };
              
              residentesExistentes.push(nuevoResidente);
              resultadosProceso.residentes++;
            }
          } catch (error) {
            resultadosProceso.errores.push(`Error en residente fila ${index + 2}: ${error.message}`);
          }
        });
        
        localStorage.setItem('residentes_data', JSON.stringify(residentesExistentes));
      }

      setResultados(resultadosProceso);
      setPaso(4);
      onRecargarDatos();
      
    } catch (error) {
      setErrores([`Error al procesar archivo: ${error.message}`]);
    } finally {
      setProcesando(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setPaso(2);
    }
  };

  const confirmarSubida = () => {
    if (archivo) {
      setPaso(3);
      procesarArchivo(archivo);
    }
  };

  const reiniciar = () => {
    setArchivo(null);
    setPaso(1);
    setResultados(null);
    setErrores([]);
  };

  return (
    <div>
      <h2>Carga Masiva Excel</h2>
      
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={descargarPlantillaExcel}
            style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px' }}
          >
            Descargar plantilla Excel
          </button>
          
          <button 
            onClick={descargarDatosActualesExcel}
            style={{ padding: '12px 24px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '8px' }}
          >
            Exportar datos actuales
          </button>
        </div>
        
        <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Identificadores únicos:</h3>
          <ul>
            <li><strong>Residencias:</strong> Se identifican por <strong>CIF</strong> (si existe el CIF, actualiza; si no, crea)</li>
            <li><strong>Personal:</strong> Se identifican por <strong>DNI</strong> (si existe el DNI, actualiza; si no, crea)</li>
            <li><strong>Residentes:</strong> Se identifican por <strong>DNI</strong> (si existe el DNI, actualiza; si no, crea)</li>
          </ul>
          <p><strong>Relaciones:</strong> Personal y Residentes usan <strong>cif_residencia</strong> para vincularse a residencias.</p>
        </div>

        {paso === 1 && (
          <div>
            <h3>Cargar archivo Excel</h3>
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleFileChange}
              style={{ padding: '15px', border: '2px dashed #ddd', borderRadius: '8px', width: '100%' }}
            />
          </div>
        )}

        {paso === 2 && archivo && (
          <div>
            <h3>Confirmar archivo</h3>
            <div style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <p><strong>Archivo:</strong> {archivo.name}</p>
              <p><strong>Tamaño:</strong> {(archivo.size / 1024).toFixed(2)} KB</p>
            </div>
            
            <button 
              onClick={confirmarSubida}
              style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', marginRight: '10px' }}
            >
              Procesar archivo
            </button>
            
            <button 
              onClick={reiniciar}
              style={{ padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px' }}
            >
              Cancelar
            </button>
          </div>
        )}

        {paso === 3 && procesando && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>Procesando archivo...</h3>
            <div style={{ fontSize: '50px', margin: '20px 0' }}>⏳</div>
          </div>
        )}

        {paso === 4 && resultados && (
          <div>
            <h3>Resultados del procesamiento</h3>
            
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4>Datos creados:</h4>
              <p>✅ Residencias nuevas: {resultados.residencias}</p>
              <p>✅ Personal nuevo: {resultados.personal}</p>
              <p>✅ Residentes nuevos: {resultados.residentes}</p>
              
              <h4>Datos actualizados:</h4>
              <p>🔄 Residencias actualizadas: {resultados.residenciasActualizadas}</p>
              <p>🔄 Personal actualizado: {resultados.personalActualizado}</p>
              <p>🔄 Residentes actualizados: {resultados.residentesActualizados}</p>
            </div>

            {resultados.errores.length > 0 && (
              <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4>Errores:</h4>
                {resultados.errores.map((error, index) => (
                  <p key={index}>❌ {error}</p>
                ))}
              </div>
            )}

            <button 
              onClick={reiniciar}
              style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}
            >
              Cargar otro archivo
            </button>
          </div>
        )}

        {errores.length > 0 && (
          <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h4>Errores:</h4>
            {errores.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
            <button 
              onClick={reiniciar}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Volver
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
