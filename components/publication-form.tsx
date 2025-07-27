"use client"

import type React from "react"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  updateField,
  resetForm,
  setFormData,
  selectFormData,
  selectFormErrors,
  selectIsSubmitting,
} from "@/lib/slices/publicationSlice"
import { Home, MapPin, DollarSign, Ruler, Bed, Bath, Camera, Save, X } from "lucide-react"

interface Publication {
  id?: string
  title: string
  propertyType: string
  location: string
  price: number
  currency: string
  operationType: string
  size: number
  bedrooms: number
  bathrooms: number
  description: string
  status: string
  images: string[]
}

interface PublicationFormProps {
  publication?: Publication | null
}

export default function PublicationForm({ publication }: PublicationFormProps) {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)
  const errors = useSelector(selectFormErrors)
  const isSubmitting = useSelector(selectIsSubmitting)

  useEffect(() => {
    if (publication) {
      dispatch(setFormData(publication))
    } else {
      dispatch(resetForm())
    }
  }, [publication, dispatch])

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de envío
    console.log("Enviando formulario:", formData)
  }

  const handleReset = () => {
    dispatch(resetForm())
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white flex items-center gap-2">
          <Home className="w-5 h-5" />
          {publication ? "Editar Publicación" : "Nueva Publicación"}
        </CardTitle>
        {publication && (
          <Badge variant="secondary" className="w-fit">
            ID: {publication.id}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Home className="w-4 h-4" />
                Información Básica
              </h3>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-blue-200">
                  Título de la Publicación
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="Ej: Depto 3 amb, Av. Corrientes 1234"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
                {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-blue-200">Tipo de Propiedad</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleFieldChange("propertyType", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="local">Local Comercial</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-200">Operación</Label>
                  <Select
                    value={formData.operationType}
                    onValueChange={(value) => handleFieldChange("operationType", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Tipo de operación" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="alquiler">Alquiler</SelectItem>
                      <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-blue-200 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Ubicación
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  placeholder="Ej: Palermo, CABA"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Precio y Características */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Precio y Características
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-blue-200">Moneda</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleFieldChange("currency", value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="ARS">ARS</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-blue-200">
                    Precio
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", Number(e.target.value))}
                    placeholder="0"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-blue-200 flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    Superficie (m²)
                  </Label>
                  <Input
                    id="size"
                    type="number"
                    value={formData.size}
                    onChange={(e) => handleFieldChange("size", Number(e.target.value))}
                    placeholder="0"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-blue-200 flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    Dormitorios
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleFieldChange("bedrooms", Number(e.target.value))}
                    placeholder="0"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-blue-200 flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    Baños
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleFieldChange("bathrooms", Number(e.target.value))}
                    placeholder="0"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-blue-200">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleFieldChange("status", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Estado de la publicación" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="vendida">Vendida</SelectItem>
                    <SelectItem value="alquilada">Alquilada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-blue-200">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Describe las características principales de la propiedad..."
              rows={4}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Imágenes
            </h3>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Arrastra las imágenes aquí o haz clic para seleccionar</p>
              <Button
                type="button"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Seleccionar Imágenes
              </Button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : publication ? "Actualizar" : "Crear Publicación"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2 bg-transparent"
            >
              <X className="w-4 h-4" />
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
