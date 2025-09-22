"use client";
import React from "react";

export default function PapeleraView({
  papelera,
  onRestaurar,
}: {
  papelera: any[];
  onRestaurar: (elementoId: any) => void;
}) {
  return (
    <div>
      <h2>Papelera ({papelera.length})</h2>
      <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
        {papelera.map((elemento: any, index: number) => (
          <div key={`papelera-${elemento.id}-${index}`} style={{ padding: "20px", borderBottom: index < papelera.length - 1 ? "1px solid #e9ecef" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>{elemento.tipoEntidad}: {elemento.datos.nombre} {elemento.datos.apellidos || ""}</h3>
                <p>Eliminado: {new Date(elemento.fechaEliminacion).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => onRestaurar(elemento.id)} 
                style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                Restaurar
              </button>
            </div>
          </div>
        ))}
        {papelera.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            <p style={{ fontSize: 18, margin: 0 }}>La papelera está vacía</p>
          </div>
        )}
      </div>
    </div>
  );
}
