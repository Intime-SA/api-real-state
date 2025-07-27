"use client"

import { useDispatch, useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Info } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

export default function Step6TitleDescription() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-indigo-600/20 rounded-lg flex items-center justify-center">
          <FileText className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Título y Descripción</h2>
          <p className="text-slate-400">Información que distingue al inmueble</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-blue-200 text-lg font-semibold">
              Título
            </Label>
            <p className="text-slate-400 text-sm mb-2">
              Incluí las características que distinguen al inmueble como si es luminoso, tiene pileta, o si está cerca
              de una estación de subte.
            </p>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-300 text-sm">
              No incluyas datos de contacto, e-mail, teléfono, direcciones ni enlaces a redes sociales.
            </p>
          </div>

          <div className="relative">
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Ej: Casa remodelada con jardín cercana a la estación Bulnes (línea D)"
              maxLength={60}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
              {formData.title.length}/60
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-blue-200 text-lg font-semibold">
              Descripción <span className="text-slate-400 font-normal">| Opcional</span>
            </Label>
            <p className="text-slate-400 text-sm mb-2">Detallá las principales características del inmueble</p>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-300 text-sm">
              No incluyas datos de contacto, e-mail, teléfono, direcciones ni enlaces a redes sociales.
            </p>
          </div>

          <div className="relative">
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Escribí acá más información para las personas interesadas."
              maxLength={50000}
              rows={6}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none"
            />
            <div className="absolute right-3 bottom-3 text-slate-400 text-sm">{formData.description.length}/50000</div>
          </div>
        </div>
      </div>
    </div>
  )
}
