"use client"

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Search } from "lucide-react"

// Tipos
interface Residencia {
  id: number
  nombre: string
  municipio: string
  provincia: string
  plazas: number
  tipo: 'publica' | 'privada'
  web: string
  telefono: string
  url_ficha: string
}

// Datos de ejemplo
const residenciasData: Residencia[] = [
  {
    id: 1,
    nombre: "Residencia San Francisco",
    municipio: "Madrid",
    provincia: "Madrid",
    plazas: 45,
    tipo: "privada",
    web: "https://residenciasanfrancisco.es",
    telefono: "914 123 456",
    url_ficha: "https://ejemplo.com/ficha/1"
  },
  {
    id: 2,
    nombre: "Centro Geriátrico La Esperanza",
    municipio: "Barcelona",
    provincia: "Barcelona",
    plazas: 60,
    tipo: "publica",
    web: "https://laesperanza-geriatrico.cat",
    telefono: "932 456 789",
    url_ficha: "https://ejemplo.com/ficha/2"
  },
  {
    id: 3,
    nombre: "Residencia Municipal Los Olivos",
    municipio: "Valencia",
    provincia: "Valencia",
    plazas: 35,
    tipo: "publica",
    web: "https://valencia.es/losolivos",
    telefono: "961 789 012",
    url_ficha: "https://ejemplo.com/ficha/3"
  },
  {
    id: 4,
    nombre: "Hogar Santa Teresa",
    municipio: "Sevilla",
    provincia: "Sevilla",
    plazas: 50,
    tipo: "privada",
    web: "https://hogarsantateresa.com",
    telefono: "954 345 678",
    url_ficha: "https://ejemplo.com/ficha/4"
  },
  {
    id: 5,
    nombre: "Residencia Nuestra Señora del Carmen",
    municipio: "Bilbao",
    provincia: "Vizcaya",
    plazas: 40,
    tipo: "privada",
    web: "https://nscarmen-residencia.es",
    telefono: "944 567 890",
    url_ficha: "https://ejemplo.com/ficha/5"
  },
  {
    id: 6,
    nombre: "Centro de Día y Residencia El Parque",
    municipio: "Zaragoza",
    provincia: "Zaragoza",
    plazas: 55,
    tipo: "publica",
    web: "https://zaragoza.es/elparque",
    telefono: "976 123 789",
    url_ficha: "https://ejemplo.com/ficha/6"
  },
  {
    id: 7,
    nombre: "Residencia Virgen de la Paloma",
    municipio: "Málaga",
    provincia: "Málaga",
    plazas: 38,
    tipo: "privada",
    web: "https://virgenpaloma.com",
    telefono: "952 234 567",
    url_ficha: "https://ejemplo.com/ficha/7"
  },
  {
    id: 8,
    nombre: "Hogar Geriátrico San José",
    municipio: "Murcia",
    provincia: "Murcia",
    plazas: 42,
    tipo: "publica",
    web: "https://murcia.es/sanjose",
    telefono: "968 345 012",
    url_ficha: "https://ejemplo.com/ficha/8"
  },
  {
    id: 9,
    nombre: "Residencia La Alameda",
    municipio: "Valladolid",
    provincia: "Valladolid",
    plazas: 48,
    tipo: "privada",
    web: "https://residencia-alameda.es",
    telefono: "983 456 123",
    url_ficha: "https://ejemplo.com/ficha/9"
  },
  {
    id: 10,
    nombre: "Centro Geriátrico El Rosal",
    municipio: "Granada",
    provincia: "Granada",
    plazas: 52,
    tipo: "publica",
    web: "https://granada.es/elrosal",
    telefono: "958 567 234",
    url_ficha: "https://ejemplo.com/ficha/10"
  },
  {
    id: 11,
    nombre: "Residencia Monte Carmelo",
    municipio: "Alicante",
    provincia: "Alicante",
    plazas: 36,
    tipo: "privada",
    web: "https://montecarmelo.com",
    telefono: "965 678 345",
    url_ficha: "https://ejemplo.com/ficha/11"
  },
  {
    id: 12,
    nombre: "Hogar de la Tercera Edad Santa Ana",
    municipio: "Salamanca",
    provincia: "Salamanca",
    plazas: 44,
    tipo: "publica",
    web: "https://salamanca.es/santaana",
    telefono: "923 789 456",
    url_ficha: "https://ejemplo.com/ficha/12"
  },
  {
    id: 13,
    nombre: "Residencia Buen Pastor",
    municipio: "Córdoba",
    provincia: "Córdoba",
    plazas: 58,
    tipo: "privada",
    web: "https://buenpastor-cordoba.es",
    telefono: "957 890 567",
    url_ficha: "https://ejemplo.com/ficha/13"
  },
  {
    id: 14,
    nombre: "Centro Sociosanitario Las Flores",
    municipio: "Pamplona",
    provincia: "Navarra",
    plazas: 41,
    tipo: "publica",
    web: "https://navarra.es/lasflores",
    telefono: "948 901 678",
    url_ficha: "https://ejemplo.com/ficha/14"
  },
  {
    id: 15,
    nombre: "Residencia San Miguel Arcángel",
    municipio: "Oviedo",
    provincia: "Asturias",
    plazas: 47,
    tipo: "privada",
    web: "https://sanmiguelarcangel.es",
    telefono: "985 012 789",
    url_ficha: "https://ejemplo.com/ficha/15"
  },
  {
    id: 16,
    nombre: "Hogar Geriátrico Virgen del Pilar",
    municipio: "Castellón",
    provincia: "Castellón",
    plazas: 39,
    tipo: "publica",
    web: "https://castellon.es/virgenpilar",
    telefono: "964 123 890",
    url_ficha: "https://ejemplo.com/ficha/16"
  },
  {
    id: 17,
    nombre: "Residencia Nuestra Señora de los Remedios",
    municipio: "Toledo",
    provincia: "Toledo",
    plazas: 43,
    tipo: "privada",
    web: "https://nsremedios.com",
    telefono: "925 234 901",
    url_ficha: "https://ejemplo.com/ficha/17"
  },
  {
    id: 18,
    nombre: "Centro de Mayores El Olivar",
    municipio: "Jaén",
    provincia: "Jaén",
    plazas: 51,
    tipo: "publica",
    web: "https://jaen.es/elolivar",
    telefono: "953 345 012",
    url_ficha: "https://ejemplo.com/ficha/18"
  },
  {
    id: 19,
    nombre: "Residencia Santa Lucía",
    municipio: "Cádiz",
    provincia: "Cádiz",
    plazas: 37,
    tipo: "privada",
    web: "https://santalucia-cadiz.es",
    telefono: "956 456 123",
    url_ficha: "https://ejemplo.com/ficha/19"
  },
  {
    id: 20,
    nombre: "Hogar Geriátrico San Antonio",
    municipio: "Badajoz",
    provincia: "Badajoz",
    plazas: 46,
    tipo: "publica",
    web: "https://badajoz.es/sanantonio",
    telefono: "924 567 234",
    url_ficha: "https://ejemplo.com/ficha/20"
  }
]

export default function ResidenciasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [provinciaFilter, setProvinciaFilter] = useState<string>('all')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Obtener provincias únicas para el filtro
  const provincias = useMemo(() => {
    const uniqueProvincias = [...new Set(residenciasData.map(r => r.provincia))]
    return uniqueProvincias.sort()
  }, [])

  // Filtrar datos
  const filteredData = useMemo(() => {
    return residenciasData.filter((residencia) => {
      const matchesSearch = 
        residencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        residencia.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        residencia.provincia.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesProvincia = provinciaFilter === 'all' || residencia.provincia === provinciaFilter
      const matchesTipo = tipoFilter === 'all' || residencia.tipo === tipoFilter

      return matchesSearch && matchesProvincia && matchesTipo
    })
  }, [searchTerm, provinciaFilter, tipoFilter])

  // Calcular datos de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  // Resetear página cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, provinciaFilter, tipoFilter])

  const handleWebClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Directorio de Residencias</h1>
          <p className="text-muted-foreground">
            Gestión de residencias de ancianos - {filteredData.length} residencias encontradas
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros de búsqueda</CardTitle>
            <CardDescription>
              Busca y filtra residencias por nombre, ubicación y características
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, municipio o provincia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por provincia */}
              <Select value={provinciaFilter} onValueChange={setProvinciaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las provincias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las provincias</SelectItem>
                  {provincias.map((provincia) => (
                    <SelectItem key={provincia} value={provincia}>
                      {provincia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por tipo */}
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="publica">Pública</SelectItem>
                  <SelectItem value="privada">Privada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  Mostrando {currentData.length} de {filteredData.length} residencias
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Municipio</TableHead>
                    <TableHead>Provincia</TableHead>
                    <TableHead className="text-center">Plazas</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Web</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Ficha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((residencia) => (
                    <TableRow key={residencia.id}>
                      <TableCell className="font-medium">
                        {residencia.nombre}
                      </TableCell>
                      <TableCell>{residencia.municipio}</TableCell>
                      <TableCell>{residencia.provincia}</TableCell>
                      <TableCell className="text-center">{residencia.plazas}</TableCell>
                      <TableCell>
                        <Badge variant={residencia.tipo === 'publica' ? 'default' : 'secondary'}>
                          {residencia.tipo === 'publica' ? 'Pública' : 'Privada'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWebClick(residencia.web)}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Abrir web</span>
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {residencia.telefono}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWebClick(residencia.url_ficha)}
                        >
                          Ver ficha
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Paginación */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                {/* Números de página */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}