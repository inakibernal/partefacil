"use client";
import React, { useEffect, useState } from "react";
import { camposEstatales } from "./campos-legales.js";
import { PDFGenerator } from "../utils/pdfGenerator.js";

type Dict<T = any> = Record<string | number, T>;

const NuevoPartePage = () => {
  // ----------------- STATE -----------------
  const [datos, setDatos] = useState<{
    sesion: any;
    trabajadorData: any;
    residenciaAsignada: any;
    residentes: any[];
    partesAnteriores: any[];
  }>({
    sesion: null,
    trabajadorData: null,
    residenciaAsignada: null,
    residentes: [],
    partesAnteriores: [],
  });

  const [formulario, setFormulario] = useState({
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    vista: "panel" as "panel" | "historial",
  });

  const [residentesData, setResidentesData] = useState<Dict<Dict>>({});
  const [residentesExpandidos, setResidentesExpandidos] = useState<Set<number | string>>(new Set());
  const [filtros, setFiltros] = useState({
    fecha: "",
    mes: "",
    año: new Date().getFullYear().toString(),
    busqueda: "",
  });

  const [parteSeleccionado, setParteSeleccionado] = useState<any | null>(null);

  // ----------------- ESTILOS (inline, sin saltos “#xxxxxx”) -----------------
  const estilos = {
    header: { backgroundColor: "#2c3e50", color: "white", padding: "15px", position: "sticky" as const, top: 0, zIndex: 1000 },
    container: { maxWidth: "1200px", margin: "0 auto" },
    card: { backgroundColor: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
    button: { padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" },
    input: { padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" },
    buttonRed: { padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", backgroundColor: "#dc3545", color: "white" },
  };

  // ----------------- EFFECT: CARGA INICIAL -----------------
  useEffect(() => {
    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------- HELPERS -----------------
  const calcularEdad = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return "N/A";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const cerrarSesion = () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("sesion_activa");
      window.location.href = "/login";
    }
  };

  // Carga de datos y preparación de estructura por defecto para cada residente
  const inicializar = () => {
    const sesion = JSON.parse(localStorage.getItem("sesion_activa") || "{}");

    if (!sesion.rol || !sesion.dni) {
      window.location.href = "/login";
      return;
    }

    const directores = JSON.parse(localStorage.getItem("directores_sistema") || "[]");
    const residencias = JSON.parse(localStorage.getItem("residencias_sistema") || "[]");
    const personal = JSON.parse(localStorage.getItem("personal_data") || "[]");
    const residentes = JSON.parse(localStorage.getItem("residentes_data") || "[]");
    const partes = JSON.parse(localStorage.getItem("partes_completos") || "[]");

    let trabajadorData: any = null;
    let residenciaAsignada: any = null;
    let residentesDelTrabajador: any[] = [];

    if (sesion.rol === "personal" || sesion.rol === "trabajador") {
      trabajadorData = personal.find((p: any) => p.dni === sesion.dni);

      if (!trabajadorData) {
        alert("Error: No se encontraron datos del trabajador");
        window.location.href = "/login";
        return;
      }

      residenciaAsignada = residencias.find(
        (r: any) => r.id == trabajadorData.residencia_id || r.id === parseInt(trabajadorData.residencia_id)
      );

      if (!residenciaAsignada && residencias.length > 0) {
        residenciaAsignada = residencias[0];
        trabajadorData.residencia_id = residenciaAsignada.id;
        const personalActualizado = personal.map((p: any) =>
          p.dni === sesion.dni ? { ...p, residencia_id: residenciaAsignada.id } : p
        );
        localStorage.setItem("personal_data", JSON.stringify(personalActualizado));
        sesion.residenciaId = residenciaAsignada.id;
        sesion.residenciaNombre = residenciaAsignada.nombre;
        localStorage.setItem("sesion_activa", JSON.stringify(sesion));
      }

      residentesDelTrabajador = residentes.filter((residente: any) => residente.residencia_id == residenciaAsignada?.id);
    } else if (sesion.rol === "director") {
      const directorData = directores.find((d: any) => d.dni === sesion.dni);

      if (!directorData) {
        alert("Error: No se encontraron datos del director");
        window.location.href = "/login";
        return;
      }

      const residenciasDelDirector = residencias.filter((r: any) => r.director_id == directorData.id);
      residenciaAsignada = residenciasDelDirector[0];
      trabajadorData = directorData;

      const idsResidencias = residenciasDelDirector.map((r: any) => r.id);
      residentesDelTrabajador = residentes.filter((residente: any) => idsResidencias.includes(residente.residencia_id));
    }

    if (!residenciaAsignada || residentesDelTrabajador.length === 0) {
      alert("No hay residentes asignados a esta residencia.");
      return;
    }

    setDatos({
      sesion,
      trabajadorData,
      residenciaAsignada,
      residentes: residentesDelTrabajador,
      partesAnteriores: partes.filter((p: any) => p.trabajador_dni === sesion.dni),
    });

    // Estado por residente con valores por defecto de camposEstatales
    const datosIniciales: Dict<Dict> = {};
    residentesDelTrabajador.forEach((residente: any) => {
      datosIniciales[residente.id] = {};
      Object.entries(camposEstatales).forEach(([campo, config]: any) => {
        datosIniciales[residente.id][campo] = config?.defecto ?? "";
      });
    });
    setResidentesData(datosIniciales);
  };

  // Incidencias = cualquier campo con valor distinto de su "defecto"
  const tieneIncidencias = (residenteId: number | string) => {
    const datosResidente = residentesData[residenteId] || {};
    return Object.entries(datosResidente).some(([campo, valor]) => {
      const config: any = (camposEstatales as any)[campo];
      return config?.defecto !== undefined && valor !== config.defecto;
    });
  };

  // ----------------- BORRADORES POR RESIDENTE (día + usuario) -----------------
  const borradorKey = () =>
    `borrador_parte_${datos.sesion?.dni || 'anon'}_${formulario.fecha}`;

  const leerBorrador = (): Dict<Dict> => {
    try {
      return JSON.parse(localStorage.getItem(borradorKey()) || '{}');
    } catch {
      return {};
    }
  };

  const escribirBorrador = (b: Dict<Dict>) => {
    localStorage.setItem(borradorKey(), JSON.stringify(b));
  };

  // Guardar parte completo
  const guardarParte = () => {
    if (!confirm("¿Guardar el parte diario completo?")) return;

    const parte = {
      id: Date.now(),
      fecha: formulario.fecha,
      hora: formulario.hora,
      trabajador_nombre: `${datos.sesion.nombre} ${datos.sesion.apellidos}`,
      trabajador_dni: datos.sesion.dni,
      residencia_nombre: datos.residenciaAsignada?.nombre,
      total_residentes: datos.residentes.length,
      residentes_con_incidencias: datos.residentes.filter((r) => tieneIncidencias(r.id)).length,
      residentes_detalle: datos.residentes.map((residente: any) => ({
        id: residente.id,
        dni: residente.dni,
        nombre: residente.nombre,
        apellidos: residente.apellidos,
        edad: calcularEdad(residente.fecha_nacimiento),
        datos_parte: normalizarDatos(residentesData[residente.id] || {}),
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const partesActuales = JSON.parse(localStorage.getItem("partes_completos") || "[]");

    const parteExistente = partesActuales.find(
      (p: any) => p.fecha === parte.fecha && p.trabajador_dni === parte.trabajador_dni
    );

    if (parteExistente) {
      const partesActualizados = partesActuales.map((p: any) =>
        p.id === parteExistente.id ? { ...parte, id: parteExistente.id, created_at: parteExistente.created_at } : p
      );
      localStorage.setItem("partes_completos", JSON.stringify(partesActualizados));
      alert("Parte actualizado correctamente");
    } else {
      localStorage.setItem("partes_completos", JSON.stringify([...partesActuales, parte]));
      alert(
        `Parte guardado: ${datos.residentes.length} residentes, ${parte.residentes_con_incidencias} con incidencias`
      );
    }

    inicializar();
  };

  // Guardar un residente individual (borrador local, NO crea/actualiza parte completo)
  const guardarResidente = (residente: any) => {
    // 1) Leemos borrador actual del día/usuario
    const borrador = leerBorrador();

    // 2) Tomamos el estado actual de ese residente en el formulario
    const valoresActuales = residentesData[residente.id] || {};

    // 3) Guardamos/actualizamos solo ese residente en el borrador (tal cual, sin normalizar)
    borrador[residente.id] = { ...valoresActuales };

    // 4) Persistimos el borrador
    escribirBorrador(borrador);

    // 5) UX: confirmación (no reseteamos la UI ni llamamos a inicializar)
    alert(`Residente guardado (borrador): ${residente.nombre} ${residente.apellidos}`);
  };

  // Normaliza los valores para impresión/guardado: si vacío -> "-"
  function normalizarDatos(obj: Dict): Dict {
    const out: Dict = {};
    Object.entries(camposEstatales as any).forEach(([k, cfg]: any) => {
      const v = obj?.[k];
      // Para selects, si está vacío, usar por defecto; si no, el valor
      if (cfg?.tipo === "select") {
        out[k] = v ?? cfg.defecto ?? "-";
      } else {
        out[k] = (v !== undefined && v !== null && String(v).trim() !== "") ? v : "-";
      }
    });
    return out;
  }

  // Cargar parte anterior para edición
  const editarParte = (parte: any) => {
    const nuevosResidentesData: Dict<Dict> = {};
    parte.residentes_detalle.forEach((residente: any) => {
      // traemos tal cual los valores guardados (incluye textarea de observaciones de medicación)
      nuevosResidentesData[residente.id] = residente.datos_parte || {};
    });
    setResidentesData(nuevosResidentesData);
    setFormulario((prev) => ({ ...prev, fecha: parte.fecha, hora: parte.hora, vista: "panel" }));
  };

  // ----------------- DERIVADOS -----------------
  const partesFiltrados = datos.partesAnteriores.filter((parte: any) => {
    const fechaParte = new Date(parte.fecha);
    const cumpleFecha = !filtros.fecha || parte.fecha === filtros.fecha;
    const cumpleMes = !filtros.mes || fechaParte.getMonth() + 1 === parseInt(filtros.mes);
    const cumpleAño = !filtros.año || fechaParte.getFullYear() === parseInt(filtros.año);
    const cumpleBusqueda =
      !filtros.busqueda ||
      parte.trabajador_nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      parte.residencia_nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    return cumpleFecha && cumpleMes && cumpleAño && cumpleBusqueda;
  });

  // ----------------- RENDER FIELD -----------------
  const renderCampo = (residenteId: number | string, campoKey: string, config: any) => {
    const valor = residentesData[residenteId]?.[campoKey] ?? config?.defecto ?? "";
    const tieneIncidencia = config?.defecto !== undefined && valor !== config.defecto;
    const claseBase = `w-full p-2 border rounded text-sm ${tieneIncidencia ? "border-red-300 bg-red-50" : "border-gray-300"}`;

    const actualizar = (nuevoValor: any) => {
      setResidentesData((prev) => ({
        ...prev,
        [residenteId]: {
          ...prev[residenteId],
          [campoKey]: nuevoValor,
        },
      }));
    };

    const commonProps: any = {
      value: valor,
      onChange: (e: any) => actualizar(e.target.value),
      className: claseBase,
      required: !!config?.obligatorio,
      placeholder: config?.placeholder,
    };

    switch (config?.tipo) {
      case "select":
        return (
          <select {...commonProps}>
            {(config.opciones || []).map((op: any) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        );
      case "number":
        return <input type="number" {...commonProps} min={config?.min} max={config?.max} step={config?.step} />;
      case "time":
        return <input type="time" {...commonProps} />;
      case "textarea":
        return <textarea {...commonProps} rows={2} />;
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  // ----------------- RENDER: CABECERA -----------------
  const renderHeader = () => (
    <div style={estilos.header}>
      <div style={estilos.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h1 style={{ fontSize: "24px", margin: 0 }}>Parte Diario - {new Date(formulario.fecha).toLocaleDateString("es-ES")}</h1>
          <button onClick={cerrarSesion} style={estilos.buttonRed}>
            Cerrar sesión
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>Fecha:</strong>
            <input
              type="date"
              value={formulario.fecha}
              onChange={(e) => setFormulario((prev) => ({ ...prev, fecha: e.target.value }))}
              style={estilos.input}
            />
          </div>
          <div>
            <strong>Hora:</strong>
            <input
              type="time"
              value={formulario.hora}
              onChange={(e) => setFormulario((prev) => ({ ...prev, hora: e.target.value }))}
              style={estilos.input}
            />
          </div>
          <div>
            <strong>Personal:</strong> {datos.sesion?.nombre} {datos.sesion?.apellidos}
          </div>
          <div>
            <strong>Residencia:</strong> {datos.residenciaAsignada?.nombre}
          </div>
          <div>
            <strong>Residentes:</strong> {datos.residentes.length}
          </div>
        </div>
      </div>
    </div>
  );

  // ----------------- RENDER: FILTROS HISTORIAL -----------------
  const renderFiltros = () => (
    <div style={{ ...estilos.card, marginBottom: "20px" }}>
      <h3 style={{ margin: "0 0 15px 0" }}>Filtros</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Fecha específica:</label>
          <input
            type="date"
            value={filtros.fecha}
            onChange={(e) => setFiltros((prev) => ({ ...prev, fecha: e.target.value }))}
            style={estilos.input}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Mes:</label>
          <select value={filtros.mes} onChange={(e) => setFiltros((prev) => ({ ...prev, mes: e.target.value }))} style={estilos.input}>
            <option value="">Todos los meses</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i, 1).toLocaleDateString("es-ES", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Año:</label>
          <select value={filtros.año} onChange={(e) => setFiltros((prev) => ({ ...prev, año: e.target.value }))} style={estilos.input}>
            <option value="">Todos los años</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Buscar:</label>
          <input
            type="text"
            placeholder="Trabajador, residencia..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
            style={estilos.input}
          />
        </div>
      </div>
    </div>
  );

  // ----------------- RENDER: PANEL RESIDENTES -----------------
  const residentesConIncidencias = datos.residentes.filter((r) => tieneIncidencias(r.id));
  const residentesSinIncidencias = datos.residentes.filter((r) => !tieneIncidencias(r.id));

  const renderPanelResidentes = () => (
    <>
      <div style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>

	<button
	  onClick={() => {
	    setResidentesData((prev: Dict<Dict>) => {
	      const nuevo: Dict<Dict> = { ...prev };

	      (datos.residentes || []).forEach((residente: any) => {
	        // Aseguramos el objeto del residente
	        nuevo[residente.id] = { ...(nuevo[residente.id] || {}) };

	        // ✅ Solo restablecemos los SELECT a su valor defecto (si existe)
	        Object.entries(camposEstatales as any).forEach(([campo, cfg]: any) => {
	          if (cfg?.tipo === 'select' && cfg.defecto !== undefined) {
   	         nuevo[residente.id][campo] = cfg.defecto;
	          }
	          // ❌ No tocar text / textarea / number / time
	        });
	      });

	      return nuevo;
	    });
	  }}
	  style={{ ...estilos.button, backgroundColor: '#28a745', color: 'white' }}
	>
	  Marcar todos como "normales"
	</button>

        <button onClick={guardarParte} style={{ ...estilos.button, backgroundColor: "#007bff", color: "white" }}>
          Guardar Parte Completo
        </button>

        <button
          onClick={() => setResidentesExpandidos(new Set(datos.residentes.map((r) => r.id)))}
          style={{ ...estilos.button, backgroundColor: "#6c757d", color: "white" }}
        >
          Expandir todos
        </button>

        <button onClick={() => setResidentesExpandidos(new Set())} style={{ ...estilos.button, backgroundColor: "#6c757d", color: "white" }}>
          Contraer todos
        </button>

        <div style={{ backgroundColor: "#fff3cd", padding: "10px 15px", borderRadius: "8px", border: "1px solid #ffeaa7" }}>
          <span style={{ fontSize: "14px", color: "#856404" }}>
            Con incidencias: {residentesConIncidencias.length} | Sin incidencias: {residentesSinIncidencias.length}
          </span>
        </div>
      </div>

      {datos.residentes.length === 0 ? (
        <div style={{ ...estilos.card, textAlign: "center", padding: "40px" }}>
          <h3 style={{ color: "#dc3545" }}>No hay residentes asignados</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {residentesConIncidencias.length > 0 && (
            <div>
              <h3 style={{ fontSize: "20px", color: "#dc3545", marginBottom: "15px" }}>
                Residentes con incidencias ({residentesConIncidencias.length})
              </h3>
              <div style={{ display: "grid", gap: "20px" }}>
                {residentesConIncidencias.map((residente) => (
                  <div key={residente.id} style={{ ...estilos.card, border: "2px solid #dc3545" }}>
                    <div style={{ marginBottom: "20px", borderBottom: "2px solid #e9ecef", paddingBottom: "15px" }}>
                      <h3 style={{ fontSize: "20px", margin: "0 0 5px 0", color: "#2c3e50" }}>
                        {residente.nombre} {residente.apellidos}
                        <span style={{ color: "#dc3545", marginLeft: "10px" }}>⚠️</span>
                      </h3>
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        DNI: {residente.dni} • Edad: {calcularEdad(residente.fecha_nacimiento)} años
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                      {Object.entries(camposEstatales as any).map(([campoKey, config]: any) => (
                        <div key={campoKey}>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>{config.label}</label>
                          {renderCampo(residente.id, campoKey, config)}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
                      <button
                        onClick={() => guardarResidente(residente)}
                        style={{ ...estilos.button, backgroundColor: "#20c997", color: "white", fontSize: "14px", padding: "10px 14px" }}
                      >
                        Guardar residente
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {residentesSinIncidencias.length > 0 && (
            <div>
              <h3 style={{ fontSize: "20px", color: "#28a745", marginBottom: "15px" }}>
                Residentes sin incidencias ({residentesSinIncidencias.length})
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "10px" }}>
                {residentesSinIncidencias.map((residente) => {
                  const expandido = residentesExpandidos.has(residente.id);

                  return (
                    <div key={residente.id} style={{ backgroundColor: "white", border: "2px solid #28a745", borderRadius: "10px", overflow: "hidden" }}>
                      <div
                        onClick={() => {
                          const nuevos = new Set(residentesExpandidos);
                          if (nuevos.has(residente.id)) nuevos.delete(residente.id);
                          else nuevos.add(residente.id);
                          setResidentesExpandidos(nuevos);
                        }}
                        style={{
                          padding: "15px",
                          cursor: "pointer",
                          backgroundColor: "#f8f9fa",
                          borderBottom: expandido ? "1px solid #e9ecef" : "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h4 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                            {residente.nombre} {residente.apellidos}
                          </h4>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            DNI: {residente.dni} • Edad: {calcularEdad(residente.fecha_nacimiento)} años • Sin incidencias
                          </div>
                        </div>
                        <div style={{ fontSize: "20px", color: "#28a745" }}>{expandido ? "▼" : "▶"}</div>
                      </div>

                      {expandido && (
                        <div style={{ padding: "20px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                            {Object.entries(camposEstatales as any).map(([campoKey, config]: any) => (
                              <div key={campoKey}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "5px" }}>{config.label}</label>
                                {renderCampo(residente.id, campoKey, config)}
                              </div>
                            ))}
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
                            <button
                              onClick={() => guardarResidente(residente)}
                              style={{ ...estilos.button, backgroundColor: "#20c997", color: "white", fontSize: "14px", padding: "10px 14px" }}
                            >
                              Guardar residente
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  // ----------------- RENDER: HISTORIAL -----------------
  const renderHistorial = () => {
    return (
      <div>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Mis Partes Diarios</h2>

        {renderFiltros()}

        {partesFiltrados.length === 0 ? (
          <div style={{ ...estilos.card, textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>No se encontraron partes con los filtros aplicados</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {partesFiltrados.map((parte: any) => (
              <div
                key={parte.id}
                style={{ ...estilos.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                    Parte del {new Date(parte.fecha).toLocaleDateString("es-ES")}
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {parte.total_residentes} residentes • {parte.residentes_con_incidencias} con incidencias • {parte.residencia_nombre}
                  </p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#999" }}>
                    Modificado: {new Date(parte.updated_at).toLocaleString("es-ES")}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setParteSeleccionado(parte)}
                    style={{ ...estilos.button, backgroundColor: "#17a2b8", color: "white", fontSize: "14px", padding: "8px 12px" }}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => editarParte(parte)}
                    style={{ ...estilos.button, backgroundColor: "#ffc107", color: "black", fontSize: "14px", padding: "8px 12px" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      try {
                        PDFGenerator.generarParteDiario(parte);
                      } catch (error) {
                        console.error("Error al generar PDF:", error);
                        alert("Error al generar el PDF. Inténtalo de nuevo.");
                      }
                    }}
                    style={{ ...estilos.button, backgroundColor: "#dc3545", color: "white", fontSize: "14px", padding: "8px 12px" }}
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ----------------- RENDER: VISOR PARTE -----------------
  const renderVisorParte = () => {
    if (!parteSeleccionado) return null;
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "30px", maxWidth: "90%", maxHeight: "90%", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ margin: 0 }}>Parte del {new Date(parteSeleccionado.fecha).toLocaleDateString("es-ES")}</h2>
            <button onClick={() => setParteSeleccionado(null)} style={{ ...estilos.buttonRed, fontSize: "18px", padding: "8px 12px" }}>
              ×
            </button>
          </div>

          <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <p>
              <strong>Trabajador:</strong> {parteSeleccionado.trabajador_nombre}
            </p>
            <p>
              <strong>Residencia:</strong> {parteSeleccionado.residencia_nombre}
            </p>
            <p>
              <strong>Fecha y hora:</strong> {new Date(parteSeleccionado.fecha).toLocaleDateString("es-ES")} a las{" "}
              {parteSeleccionado.hora}
            </p>
            <p>
              <strong>Total residentes:</strong> {parteSeleccionado.total_residentes}
            </p>
            <p>
              <strong>Con incidencias:</strong> {parteSeleccionado.residentes_con_incidencias}
            </p>
            <p>
              <strong>Última modificación:</strong> {new Date(parteSeleccionado.updated_at).toLocaleString("es-ES")}
            </p>
          </div>

          <h3>Detalle de residentes con incidencias:</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {parteSeleccionado.residentes_detalle
              .filter((r: any) =>
                Object.entries(r.datos_parte).some(([campo, valor]: any) => {
                  const config: any = (camposEstatales as any)[campo];
                  return config?.defecto !== undefined && valor !== config.defecto;
                })
              )
              .map((residente: any) => (
                <div key={residente.id} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 10px 0" }}>
                    {residente.nombre} {residente.apellidos} - {residente.edad} años
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "10px", fontSize: "14px" }}>
                    {Object.entries(residente.datos_parte).map(([campo, valor]: any) => {
                      const config: any = (camposEstatales as any)[campo];
                      if (config?.defecto !== undefined && valor !== config.defecto) {
                        return (
                          <div key={campo}>
                            <strong>{config.label}:</strong> {valor}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // ----------------- RENDER: PÁGINA -----------------
  if (!datos.sesion) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {renderHeader()}

      <div style={{ backgroundColor: "white", borderBottom: "1px solid #dee2e6" }}>
        <div style={estilos.container}>
          {(["panel", "historial"] as const).map((vista) => (
            <button
              key={vista}
              onClick={() => setFormulario((prev) => ({ ...prev, vista }))}
              style={{
                padding: "15px 20px",
                border: "none",
                backgroundColor: formulario.vista === vista ? "#e9ecef" : "transparent",
                borderBottom: formulario.vista === vista ? "3px solid #007bff" : "3px solid transparent",
                cursor: "pointer",
              }}
            >
              {vista === "panel" ? "Panel de Residentes" : "Mis Partes"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...estilos.container, padding: "20px" }}>
        {formulario.vista === "panel" ? renderPanelResidentes() : renderHistorial()}
      </div>

      {renderVisorParte()}
    </div>
  );
};

export default NuevoPartePage;
