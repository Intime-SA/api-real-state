"use client"

import { useDispatch, useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

const provinces = ["Buenos Aires Interior", "Capital Federal", "Córdoba", "Santa Fe", "Mendoza"]

const cities = ["General Pueyrredón", "La Plata", "Rosario", "Córdoba Capital"]

export default function Step3Location() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center">
          <MapPin className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Ubicación</h2>
          <p className="text-slate-400">Ingresá la dirección del inmueble</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="address" className="text-blue-200">
            Dirección
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            placeholder="Ej: Marcelo T. de Alvear 669, Mar del Plata"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideAddress"
            checked={formData.hideExactAddress}
            onCheckedChange={(checked) => handleFieldChange("hideExactAddress", checked)}
          />
          <Label htmlFor="hideAddress" className="text-slate-300 text-sm">
            Ocultar dirección exacta
          </Label>
        </div>

        {/* Map placeholder */}
        <div className="h-48 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400">Mapa interactivo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-200">Provincia</Label>
            <Select value={formData.province} onValueChange={(value) => handleFieldChange("province", value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Seleccionar provincia" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-blue-200">Ciudad</Label>
            <Select value={formData.city} onValueChange={(value) => handleFieldChange("city", value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Seleccionar ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="neighborhood" className="text-blue-200">
            Barrio
          </Label>
          <Input
            id="neighborhood"
            value={formData.neighborhood}
            onChange={(e) => handleFieldChange("neighborhood", e.target.value)}
            placeholder="Escribir el barrio"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  )
}
