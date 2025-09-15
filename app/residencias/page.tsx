"use client";

import * as React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";

type Residencia = {
  nombre: string;
  municipio: string;
  provincia: string;
  plazas: number;
  tipo: string;
  web: string;
  telefono: string;
  url_ficha: string;
};

const DATA: Residencia[] = [
  { nombre: "Residencia Buen Vivir", municipio: "Sevilla", provincia: "Sevilla", plazas: 120, tipo: "Pública", web: "https://buenvivir.es", telefono: "954 000 111", url_ficha: "https://buenvivir.es/ficha" },
  { nombre: "Hogar del Sol", municipio: "Málaga", provincia: "Málaga", plazas: 80, tipo: "Privada", web: "https://hogardelsol.es", telefono: "952 123 456", url_ficha: "https://hogardelsol.es/ficha" },
  { nombre: "Mar y Sierra", municipio: "Estepona", provincia: "Málaga", plazas: 60, tipo: "Concertada", web: "https://marysierra.es", telefono: "952 222 333", url_ficha: "https://marysierra.es/ficha" },
  { nombre: "Los Olivos", municipio: "Granada", provincia: "Granada", plazas: 95, tipo: "Pública", web: "https://losolivos.es", telefono: "958 444 555", url_ficha: "https://losolivos.es/ficha" },
  { nombre: "San Isidro", municipio: "Almería", provincia: "Almería", plazas: 70, tipo: "Privada", web: "https://sanisidro.es", telefono: "950 111 222", url_ficha: "https://sanisidro.es/ficha" },
  { nombre: "La Vega", municipio: "Córdoba", provincia: "Córdoba", plazas: 110, tipo: "Concertada", web: "https://lavega.es", telefono: "957 333 444", url_ficha: "https://lavega.es/ficha" },
  { nombre: "Valle Verde", municipio: "Jaén", provincia: "Jaén", plazas: 55, tipo: "Privada", web: "https://valleverde.es", telefono: "953 555 666", url_ficha: "https://valleverde.es/ficha" },
  { nombre: "Costa Azul", municipio: "Huelva", provincia: "Huelva", plazas: 85, tipo: "Pública", web: "https://costazul.es", telefono: "959 777 888", url_ficha: "https://costazul.es/ficha" },
  { nombre: "Sierra Nevada", municipio: "Monachil", provincia: "Granada", plazas: 40, tipo: "Privada", web: "https://sierranevada.es", telefono: "958 777 111", url_ficha: "https://sierranevada.es/ficha" },
  { nombre: "Bahía Serena", municipio: "Cádiz", provincia: "Cádiz", plazas: 130, tipo: "Concertada", web: "https://bahiaserena.es", telefono: "956 222 999", url_ficha: "https://bahiaserena.es/ficha" },
  // más registros de ejemplo para probar paginación
  { nombre: "Campo Claro", municipio: "Dos Hermanas", provincia: "Sevilla", plazas: 75, tipo: "Pública", web: "https://campoclaro.es", telefono: "954 333 888", url_ficha: "https://campoclaro.es/ficha" },
  { nombre: "Aurora", municipio: "Marbella", provincia: "Málaga", plazas: 90, tipo: "Privada", web: "https://aurora.es", telefono: "952 654 321", url_ficha: "https://aurora.es/ficha" },
  { nombre: "Río Verde", municipio: "Motril", provincia: "Granada", plazas: 65, tipo: "Concertada", web: "https://rioverde.es", telefono: "958 999 000", url_ficha: "https://rioverde.es/ficha" },
  { nombre: "Costa de la Luz", municipio: "Lepe", provincia: "Huelva", plazas: 50, tipo: "Privada", web: "https://costaluz.es", telefono: "959 222 444", url_ficha: "https://costaluz.es/ficha" },
  { nombre: "La Alhambra", municipio: "Granada", provincia: "Granada", plazas: 140, tipo: "Pública", web: "https://alhambra.es", telefono: "958 123 987", url_ficha: "https://alhambra.es/ficha" },
  { nombre: "Doñana", municipio: "Almonte", provincia: "Huelva", plazas: 72, tipo: "Concertada", web: "https://donana.es", telefono: "959 111 333", url_ficha: "https://donana.es/ficha" },
  { nombre: "Sierra de Cádiz", municipio: "Ubrique", provincia: "Cádiz", plazas: 45, tipo: "Privada", web: "https://sierracadiz.es", telefono: "956 555 111", url_ficha: "https://sierracadiz.es/ficha" },
  { nombre: "Los Montes", municipio: "Priego", provincia: "Córdoba", plazas: 88, tipo: "Pública", web: "https://losmontes.es", telefono: "957 111 555", url_ficha: "https://losmontes.es/ficha" },
  { nombre: "Guadalquivir", municipio: "Andújar", provincia: "Jaén", plazas: 68, tipo: "Concertada", web: "https://guadalquivir.es", telefono: "953 222 777", url_ficha: "https://guadalquivir.es/ficha" },
  { nombre: "Puerta del Mar", municipio: "Algeciras", provincia: "Cádiz", plazas: 100, tipo: "Privada", web: "https://puertadelmar.es", telefono: "956 444 222", url_ficha: "https://puertadelmar.es/ficha" },
];

const unique = (arr: string[]) => Array.from(new Set(arr)).sort();

export default function ResidenciasPage() {
  const [query, setQuery] = React.useState("");
  const [provincia, setProvincia] = React.useState("todas");
  const [tipo, setTipo] = React.useState("todos");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const provincias = React.useMemo(
    () => ["todas", ...unique(DATA.map((d) => d.provincia))],
    []
  );
  const tipos = React.useMemo(
    () => ["todos", ...unique(DATA.map((d) => d.tipo))],
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter((d) => {
      const matchesQuery = q
        ? [d.nombre, d.municipio, d.provincia, d.tipo, d.telefono]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;
      const matchesProvincia = provincia === "todas" || d.provincia === provincia;
      const matchesTipo = tipo === "todos" || d.tipo === tipo;
      return matchesQuery && matchesProvincia && matchesTipo;
    });
  }, [query, provincia, tipo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [query, provincia, tipo]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Residencias</h1>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          placeholder="Buscar por texto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          options={provincias.map((p) => ({ label: p === "todas" ? "Todas las provincias" : p, value: p }))}
          value={provincia}
          onChange={setProvincia}
        />
        <Select
          options={tipos.map((t) => ({ label: t === "todos" ? "Todos los tipos" : t, value: t }))}
          value={tipo}
          onChange={setTipo}
        />
      </div>

      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Municipio</TableHead>
            <TableHead>Provincia</TableHead>
            <TableHead className="text-right">Plazas</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Web</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Ficha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d) => (
            <TableRow key={`${d.nombre}-${d.municipio}`}>
              <TableCell className="font-medium">{d.nombre}</TableCell>
              <TableCell>{d.municipio}</TableCell>
              <TableCell>{d.provincia}</TableCell>
              <TableCell className="text-right">{d.plazas}</TableCell>
              <TableCell>{d.tipo}</TableCell>
              <TableCell>
                <a className="text-blue-600 hover:underline" href={d.web} target="_blank" rel="noopener noreferrer">
                  {new URL(d.web).hostname}
                </a>
              </TableCell>
              <TableCell>{d.telefono}</TableCell>
              <TableCell>
                <a className="text-blue-600 hover:underline" href={d.url_ficha} target="_blank" rel="noopener noreferrer">
                  Ver ficha
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          Mostrando {rows.length} de {filtered.length} resultados
        </TableCaption>
      </Table>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-black/60">
          Página {currentPage} de {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            className="h-10 rounded-md border border-black/10 px-3 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            className="h-10 rounded-md border border-black/10 px-3 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}


