"use client";
import React, { useState } from "react";
import { PDFGenerator } from "../../utils/pdfGenerator.js";

export default function PartesView({
  partesGuardados,
  onVerFicha,
}: {
  partesGuardados: any[];
  onVerFicha: (parte: any) => void;
}) {
  const [partesSeleccionados, setPartesSeleccionados] = useState(new Set());
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    profesional: '',
    residencia: ''
  });

  const profesionalesUnicos = [...new Set(partesGuardados.map(p => p.trabajador_nombre || p.profesional).filter(Boolean))];
  const residenciasUnicas = [...new Set(partesGuardados.map(p => p.residencia_nombre).filter(Boolean))];

  const partesFiltrados = partesGuardados.filter(parte => {
    const fechaParte = new Date(parte.fecha);
    const cumpleFechaDesde = !filtros.fechaDesde || fechaParte >= new Date(filtros.fechaDesde);
    const cumpleFechaHasta = !filtros.fechaHasta || fechaParte <= new Date(filtros.fechaHasta);
    const cumpleProfesional = !filtros.profesional || 
      (parte.trabajador_nombre || parte.profesional || '').toLowerCase().includes(filtros.profesional.toLowerCase());
    const cumpleResidencia = !filtros.residencia || 
      (parte.residencia_nombre || '').toLowerCase().includes(filtros.residencia.toLowerCase());
    
    return cumpleFechaDesde && cumpleFechaHasta && cumpleProfesional && cumpleResidencia;
  });

  const toggleSeleccion = (parteId) => {
    const nuevaSeleccion = new Set(partesSeleccionados);
    if (nuevaSeleccion.has(parteId)) {
      nuevaSeleccion.delete(parteId);
    } else {
      nuevaSeleccion.add(parteId);
    }
    setPartesSeleccionados(nuevaSeleccion);
  };

  const seleccionarTodos = () => {
    if (partesSeleccionados.size === partesFiltrados.length) {
      setPartesSeleccionados(new Set());
    } else {
      setPartesSeleccionados(new Set(partesFiltrados.map(p => p.id || p.fecha + p.trabajador_dni)));
    }
  };

  const exportarSeleccionados = () => {
    if (partesSeleccionados.size === 0) {
      alert('Selecciona al menos un parte para exportar');
      return;
    }
    
    const partesAExportar = partesFiltrados.filter(p => 
      partesSeleccionados.has(p.id || p.fecha + p.trabajador_dni)
    );
    
    try {
      PDFGenerator.generarPartesMultiples(partesAExportar);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const exportarPDF = (parte) => {
    try {
      PDFGenerator.generarParteDiario(parte);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const estilos = {
    container: { backgroundColor: "white", borderRadius: "8px", overflow: "hidden" },
    filtros: { padding: "20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #dee2e6" },
    input: { padding: "8px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", width: "100%" },
    button: { padding: "8px 16px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" },
    buttonPrimary: { backgroundColor: "#007bff", color: "white" },
    buttonSuccess: { backgroundColor: "#28a745", color: "white" },
    buttonDanger: { backgroundColor: "#dc3545", color: "white" },
    buttonInfo: { backgroundColor: "#17a2b8", color: "white" },
    parte: { padding: "20px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "15px" }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Partes Diarios ({partesFiltrados.length})</h2>
        
        {partesFiltrados.length > 0 && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#666" }}>
              {partesSeleccionados.size} seleccionados
            </span>
            <button 
              onClick={seleccionarTodos}
              style={{ ...estilos.button, ...estilos.buttonPrimary }}
            >
              {partesSeleccionados.size === partesFiltrados.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
            <button 
              onClick={exportarSeleccionados}
              disabled={partesSeleccionados.size === 0}
              style={{ 
                ...estilos.button, 
                ...estilos.buttonSuccess,
                opacity: partesSeleccionados.size === 0 ? 0.5 : 1
              }}
            >
              Exportar seleccionados ({partesSeleccionados.size})
            </button>
          </div>
        )}
      </div>

      <div style={estilos.container}>
        <div style={estilos.filtros}>
          <h4 style={{ margin: "0 0 15px 0", color: "#495057" }}>Filtros para inspecciones</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
                Desde fecha:
              </label>
              <input 
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
                style={estilos.input}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
                Hasta fecha:
              </label>
              <input 
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
                style={estilos.input}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
                Profesional:
              </label>
              <select 
                value={filtros.profesional}
                onChange={(e) => setFiltros(prev => ({ ...prev, profesional: e.target.value }))}
                style={estilos.input}
              >
                <option value="">Todos los profesionales</option>
                {profesionalesUnicos.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>
                Residencia:
              </label>
              <select 
                value={filtros.residencia}
                onChange={(e) => setFiltros(prev => ({ ...prev, residencia: e.target.value }))}
                style={estilos.input}
              >
                <option value="">Todas las residencias</option>
                {residenciasUnicas.map(res => (
                  <option key={res} value={res}>{res}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(filtros.fechaDesde || filtros.fechaHasta || filtros.profesional || filtros.residencia) && (
            <div style={{ marginTop: "15px" }}>
              <button 
                onClick={() => setFiltros({ fechaDesde: '', fechaHasta: '', profesional: '', residencia: '' })}
                style={{ ...estilos.button, backgroundColor: "#6c757d", color: "white" }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {partesFiltrados.length === 0 ? (
          <p style={{ padding: "40px", textAlign: "center", color: "#666" }}>
            {partesGuardados.length === 0 ? "No hay partes disponibles" : "No se encontraron partes con los filtros aplicados"}
          </p>
        ) : (
          partesFiltrados.map((parte: any, index: number) => {
            const parteId = parte.id || parte.fecha + parte.trabajador_dni;
            const estaSeleccionado = partesSeleccionados.has(parteId);
            
            return (
              <div 
                key={parteId} 
                style={{
                  ...estilos.parte,
                  backgroundColor: estaSeleccionado ? "#e3f2fd" : "white"
                }}
              >
                <input 
                  type="checkbox"
                  checked={estaSeleccionado}
                  onChange={() => toggleSeleccion(parteId)}
                  style={{ transform: "scale(1.2)" }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", color: "#333", marginBottom: "5px" }}>
                    <strong>Fecha:</strong> {new Date(parte.fecha).toLocaleDateString('es-ES')} • 
                    <strong> Profesional:</strong> {parte.trabajador_nombre || parte.profesional || 'No especificado'} • 
                    <strong> Residencia:</strong> {parte.residencia_nombre || 'No especificada'}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {parte.total_residentes || 0} residentes • {parte.residentes_con_incidencias || 0} con incidencias
                    {parte.hora && ` • Hora: ${parte.hora}`}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => onVerFicha(parte)} 
                    style={{ ...estilos.button, ...estilos.buttonInfo }}
                  >
                    Ver
                  </button>
                  <button 
                    onClick={() => exportarPDF(parte)}
                    style={{ ...estilos.button, ...estilos.buttonDanger }}
                  >
                    PDF
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {partesSeleccionados.size > 0 && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "8px",
          color: "#155724"
        }}>
          <strong>Seleccionados para exportar:</strong> {partesSeleccionados.size} partes
          <div style={{ marginTop: "10px" }}>
            <button 
              onClick={exportarSeleccionados}
              style={{ ...estilos.button, ...estilos.buttonSuccess, marginRight: "10px" }}
            >
              Exportar todos los seleccionados
            </button>
            <button 
              onClick={() => setPartesSeleccionados(new Set())}
              style={{ ...estilos.button, backgroundColor: "#6c757d", color: "white" }}
            >
              Limpiar selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
