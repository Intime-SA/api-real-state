"use client"

import { useDispatch, useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ruler } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

export default function Step5Characteristics() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-orange-600/20 rounded-lg flex items-center justify-center">
          <Ruler className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Características (Opcionales)</h2>
          <p className="text-slate-400">Agregá información adicional sobre tu inmueble si lo deseás</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalSurface" className="text-blue-200">
            Superficie total (opcional)
          </Label>
          <div className="relative">
            <Input
              id="totalSurface"
              type="number"
              value={formData.totalSurface || ""}
              onChange={(e) => handleFieldChange("totalSurface", e.target.value ? Number(e.target.value) : undefined)}
              className="bg-slate-700 border-slate-600 text-white pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">m²</span>
          </div>
        </div>

        <div>
          <Label htmlFor="coveredSurface" className="text-blue-200">
            Superficie cubierta (opcional)
          </Label>
          <div className="relative">
            <Input
              id="coveredSurface"
              type="number"
              value={formData.coveredSurface || ""}
              onChange={(e) => handleFieldChange("coveredSurface", e.target.value ? Number(e.target.value) : undefined)}
              className="bg-slate-700 border-slate-600 text-white pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">m²</span>
          </div>
        </div>

        <div>
          <Label htmlFor="rooms" className="text-blue-200">
            Ambientes (opcional)
          </Label>
          <Input
            id="rooms"
            type="number"
            value={formData.rooms || ""}
            onChange={(e) => handleFieldChange("rooms", e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="bedrooms" className="text-blue-200">
            Dormitorios (opcional)
          </Label>
          <Input
            id="bedrooms"
            type="number"
            value={formData.bedrooms || ""}
            onChange={(e) => handleFieldChange("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="bathrooms" className="text-blue-200">
            Baños (opcional)
          </Label>
          <Input
            id="bathrooms"
            type="number"
            value={formData.bathrooms || ""}
            onChange={(e) => handleFieldChange("bathrooms", e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="parkingSpaces" className="text-blue-200">
            Cocheras (opcional)
          </Label>
          <Input
            id="parkingSpaces"
            type="number"
            value={formData.parkingSpaces || ""}
            onChange={(e) => handleFieldChange("parkingSpaces", e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
    </div>
  )
}
