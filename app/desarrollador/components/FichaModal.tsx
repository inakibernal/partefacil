"use client";
import React from "react";

type TipoElemento = "director" | "residencia" | "trabajador" | "residente";

interface FichaModalProps {
  elemento: any;
  tipo: TipoElemento;
  onCerrar: () => void;
}

const estilos: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    width: "min(900px, 96vw)",
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    color: "white",
  },
  content: {
    padding: 20,
    background: "#fff",
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid #eef0f2",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 14,
  },
  label: {
    fontWeight: 600,
    color: "#333",
  },
  value: {
    color: "#111",
    wordBreak: "break-word",
  },
  footer: {
    padding: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    background: "#fafbfc",
    borderTop: "1px solid #eef0f2",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#f3f4f6",
    color: "#111827",
  },
  list: {
    margin: 0,
    paddingLeft: 18,
  },
};

function isEmpty(v: any) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

function coalesce<T = any>(obj: any, keys: string[], fallback: T = "" as unknown as T): T {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && !isEmpty(obj[k])) return obj[k] as T;
  }
  return fallback;
}

function renderField(label: string, value: any) {
  if (isEmpty(value)) return null;
  return (
    <div style={estilos.field}>
      <span style={estilos.label}>{label}</span>
      <span style={estilos.value}>{String(value)}</span>
    </div>
  );
}

function renderCountPill(text: string, count?: number) {
  if (count === undefined || count === null) return null;
  return (
    <span style={estilos.pill}>
      <span>•</span>
      <span>{text}: {count}</span>
    </span>
  );
}

export default function FichaModal({ elemento, tipo, onCerrar }: FichaModalProps) {
  if (!elemento) return null;

  const getHeaderColor = () => {
    switch (tipo) {
      case "director": return "#2563eb";
      case "residencia": return "#0ea5e9";
      case "trabajador": return "#22c55e";
      case "residente": return "#f59e0b";
      default: return "#111827";
    }
  };

  const HeaderTitle = () => {
    const nombre = coalesce<string>(elemento, ["nombre"], "");
    const apellidos = coalesce<string>(elemento, ["apellidos"], "");
    const titulo = (() => {
      switch (tipo) {
        case "director": return "Ficha del Director";
        case "residencia": return "Ficha de la Residencia";
        case "trabajador": return "Ficha del Trabajador";
        case "residente": return "Ficha del Residente";
        default: return "Ficha";
      }
    })();

    const subtitulo =
      tipo === "residencia"
        ? coalesce<string>(elemento, ["nombre", "nombre_residencia"], "")
        : [nombre, apellidos].filter(Boolean).join(" ");

    return (
      <div>
        <h2 style={{ fontSize: 22, margin: "0 0 4px 0" }}>{titulo}</h2>
        {!isEmpty(subtitulo) && (
          <div style={{ opacity: 0.95 }}>{subtitulo}</div>
        )}
      </div>
    );
  };

  const CloseButton = () => (
    <button
      onClick={onCerrar}
      style={{
        padding: "8px 12px",
        fontSize: 14,
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.5)",
        background: "transparent",
        color: "white",
        cursor: "pointer",
      }}
      aria-label="Cerrar"
    >
      Cerrar
    </button>
  );

  const renderDirector = () => {
    const nombre = coalesce(elemento, ["nombre"], "");
    const apellidos = coalesce(elemento, ["apellidos"], "");
    const dni = coalesce(elemento, ["dni", "dni_director"], "");
    const email = coalesce(elemento, ["email", "correo"], "");
    const telefono = coalesce(elemento, ["telefono", "telefono_movil", "telefono_fijo"], "");
    const fechaNacimiento = coalesce(elemento, ["fecha_nacimiento"], "");
    const direccion = coalesce(elemento, ["direccion"], "");
    const poblacion = coalesce(elemento, ["poblacion", "municipio"], "");
    const provincia = coalesce(elemento, ["provincia"], "");
    const codigoPostal = coalesce(elemento, ["codigo_postal", "cp"], "");
    const titulacion = coalesce(elemento, ["titulacion", "titulo_profesional"], "");
    const experiencia = coalesce(elemento, ["experiencia", "anios_experiencia", "años_experiencia"], "");
    const numColegiado = coalesce(elemento, ["numero_colegiado", "n_colegiado"], "");
    const residencias = coalesce<any[]>(elemento, ["residencias"], []);

    return (
      <>
        <div style={estilos.section}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {renderCountPill("Residencias a cargo", Array.isArray(residencias) ? residencias.length : undefined)}
          </div>
          <div style={estilos.grid}>
            {renderField("Nombre", [nombre, apellidos].filter(Boolean).join(" "))}
            {renderField("DNI", dni)}
            {renderField("Email", email)}
            {renderField("Teléfono", telefono)}
            {renderField("Fecha de nacimiento", fechaNacimiento)}
          </div>
        </div>

        <div style={estilos.section}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Dirección</h3>
          <div style={estilos.grid}>
            {renderField("Dirección", direccion)}
            {renderField("Población", poblacion)}
            {renderField("Provincia", provincia)}
            {renderField("Código Postal", codigoPostal)}
          </div>
        </div>

        <div style={estilos.section}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Profesional</h3>
          <div style={estilos.grid}>
            {renderField("Titulación", titulacion)}
            {renderField("Experiencia (años)", experiencia)}
            {renderField("Nº Colegiado", numColegiado)}
          </div>
        </div>

        {!isEmpty(residencias) && Array.isArray(residencias) && (
          <div style={estilos.section}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Residencias asociadas</h3>
            <ul style={estilos.list}>
              {residencias.map((r: any) => (
                <li key={r.id || r.cif || r.nombre}>
                  {coalesce(r, ["nombre"], "Residencia")} — {coalesce(r, ["poblacion"], "")} {coalesce(r, ["codigo_postal", "cp"], "")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  const renderResidencia = () => {
    const nombre = coalesce(elemento, ["nombre"], "");
    const direccion = coalesce(elemento, ["direccion"], "");
    const poblacion = coalesce(elemento, ["poblacion", "municipio"], "");
    const codigoPostal = coalesce(elemento, ["codigo_postal", "cp"], "");
    const telefonoFijo = coalesce(elemento, ["telefono_fijo", "telefono"], "");
    const telefonoMovil = coalesce(elemento, ["telefono_movil"], "");
    const email = coalesce(elemento, ["email", "correo"], "");
    const totalPlazas = coalesce(elemento, ["total_plazas"], "");
    const plazasOcupadas = coalesce(elemento, ["plazas_ocupadas"], "");
    const cif = coalesce(elemento, ["cif"], "");
    const numeroLicencia = coalesce(elemento, ["numero_licencia", "licencia"], "");
    const director = coalesce<any>(elemento, ["director"], null);
    const personal = coalesce<any[]>(elemento, ["personal"], []);
    const residentes = coalesce<any[]>(elemento, ["residentes"], []);

    return (
      <>
        <div style={estilos.section}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {renderCountPill("Personal", Array.isArray(personal) ? personal.length : undefined)}
            {renderCountPill("Residentes", Array.isArray(residentes) ? residentes.length : undefined)}
          </div>
          <div style={estilos.grid}>
            {renderField("Nombre", nombre)}
            {renderField("CIF", cif)}
            {renderField("Licencia", numeroLicencia)}
            {renderField("Email", email)}
            {renderField("Teléfono fijo", telefonoFijo)}
            {renderField("Teléfono móvil", telefonoMovil)}
            {renderField("Total plazas", totalPlazas)}
            {renderField("Plazas ocupadas", plazasOcupadas)}
          </div>
        </div>

        <div style={estilos.section}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Dirección</h3>
          <div style={estilos.grid}>
            {renderField("Dirección", direccion)}
            {renderField("Población", poblacion)}
            {renderField("Código Postal", codigoPostal)}
          </div>
        </div>

        {!isEmpty(director) && (
          <div style={estilos.section}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Director/a</h3>
            <div style={estilos.grid}>
              {renderField("Nombre", [coalesce(director, ["nombre"], ""), coalesce(director, ["apellidos"], "")].filter(Boolean).join(" "))}
              {renderField("DNI", coalesce(director, ["dni"], ""))}
              {renderField("Teléfono", coalesce(director, ["telefono", "telefono_movil", "telefono_fijo"], ""))}
              {renderField("Email", coalesce(director, ["email"], ""))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTrabajador = () => {
    const nombre = coalesce(elemento, ["nombre"], "");
    const apellidos = coalesce(elemento, ["apellidos"], "");
    const dni = coalesce(elemento, ["dni"], "");
    const email = coalesce(elemento, ["email"], "");
    const telefono = coalesce(elemento, ["telefono", "telefono_movil", "telefono_fijo"], "");
    const fechaNacimiento = coalesce(elemento, ["fecha_nacimiento"], "");
    const direccion = coalesce(elemento, ["direccion"], "");
    const poblacion = coalesce(elemento, ["poblacion", "municipio"], "");
    const codigoPostal = coalesce(elemento, ["codigo_postal", "cp"], "");
    const titulacion = coalesce(elemento, ["titulacion", "titulo_profesional"], "");
    const numColegiado = coalesce(elemento, ["numero_colegiado", "n_colegiado"], "");
    const residencia = coalesce<any>(elemento, ["residencia"], null);
    const director = coalesce<any>(elemento, ["director"], null);

    return (
      <>
        <div style={estilos.section}>
          <div style={estilos.grid}>
            {renderField("Nombre", [nombre, apellidos].filter(Boolean).join(" "))}
            {renderField("DNI", dni)}
            {renderField("Email", email)}
            {renderField("Teléfono", telefono)}
            {renderField("Fecha de nacimiento", fechaNacimiento)}
          </div>
        </div>

        <div style={estilos.section}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Dirección</h3>
          <div style={estilos.grid}>
            {renderField("Dirección", direccion)}
            {renderField("Población", poblacion)}
            {renderField("Código Postal", codigoPostal)}
          </div>
        </div>

        <div style={estilos.section}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Profesional</h3>
          <div style={estilos.grid}>
            {renderField("Titulación", titulacion)}
            {renderField("Nº Colegiado", numColegiado)}
          </div>
        </div>

        {!isEmpty(residencia) && (
          <div style={estilos.section}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Residencia</h3>
            <div style={estilos.grid}>
              {renderField("Nombre", coalesce(residencia, ["nombre"], ""))}
              {renderField("Población", coalesce(residencia, ["poblacion"], ""))}
              {renderField("C.P.", coalesce(residencia, ["codigo_postal", "cp"], ""))}
            </div>
          </div>
        )}

        {!isEmpty(director) && (
          <div style={estilos.section}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Director/a</h3>
            <div style={estilos.grid}>
              {renderField("Nombre", [coalesce(director, ["nombre"], ""), coalesce(director, ["apellidos"], "")].filter(Boolean).join(" "))}
              {renderField("DNI", coalesce(director, ["dni"], ""))}
              {renderField("Teléfono", coalesce(director, ["telefono", "telefono_movil", "telefono_fijo"], ""))}
              {renderField("Email", coalesce(director, ["email"], ""))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderResidente = () => {
    const nombre = coalesce(elemento, ["nombre"], "");
    const apellidos = coalesce(elemento, ["apellidos"], "");
    const dni = coalesce(elemento, ["dni"], "");
    const numeroHistoria = coalesce(elemento, ["numeroHistoria", "n_historia", "numero_historia"], "");
    const edad = coalesce(elemento, ["edad"], "");
    const fechaNacimiento = coalesce(elemento, ["fecha_nacimiento"], "");
    const direccion = coalesce(elemento, ["direccion"], "");
    const poblacion = coalesce(elemento, ["poblacion", "municipio"], "");
    const codigoPostal = coalesce(elemento, ["codigo_postal", "cp"], "");
    const residencia = coalesce<any>(elemento, ["residencia"], null);

    return (
      <>
        <div style={estilos.section}>
          <div style={estilos.grid}>
            {renderField("Nombre", [nombre, apellidos].filter(Boolean).join(" "))}
            {renderField("DNI", dni)}
            {renderField("Edad", edad)}
            {renderField("Nº Historia", numeroHistoria)}
            {renderField("Fecha de nacimiento", fechaNacimiento)}
          </div>
        </div>

        <div style={estilos.section}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Dirección</h3>
          <div style={estilos.grid}>
            {renderField("Dirección", direccion)}
            {renderField("Población", poblacion)}
            {renderField("Código Postal", codigoPostal)}
          </div>
        </div>

        {!isEmpty(residencia) && (
          <div style={estilos.section}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>Residencia</h3>
            <div style={estilos.grid}>
              {renderField("Nombre", coalesce(residencia, ["nombre"], ""))}
              {renderField("Población", coalesce(residencia, ["poblacion"], ""))}
              {renderField("C.P.", coalesce(residencia, ["codigo_postal", "cp"], ""))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderContent = () => {
    switch (tipo) {
      case "director": return renderDirector();
      case "residencia": return renderResidencia();
      case "trabajador": return renderTrabajador();
      case "residente": return renderResidente();
      default: return <div>Tipo no reconocido</div>;
    }
  };

  return (
    <div style={estilos.overlay} onClick={(e) => {
      if (e.target === e.currentTarget) onCerrar();
    }}>
      <div style={estilos.modal}>
        <div style={{ ...estilos.header, backgroundColor: getHeaderColor() }}>
          <HeaderTitle />
          <CloseButton />
        </div>

        <div style={estilos.content}>
          {renderContent()}
        </div>

        <div style={estilos.footer}>
          <button
            onClick={onCerrar}
            style={{
              padding: "10px 14px",
              fontSize: 14,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
