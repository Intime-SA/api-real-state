"use client"

import { useDispatch, useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, DollarSign } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

export default function Step7VideoPrice() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handleFieldChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }))
  }

  return (
    <div className="space-y-8">
      {/* Video Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-lg flex items-center justify-center">
            <Video className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Video <span className="text-slate-400 font-normal">| Opcional</span>
            </h2>
            <p className="text-slate-400">
              Agregá un video de YouTube o tour virtual de Matterport para mostrar el inmueble
            </p>
          </div>
        </div>

        <div>
          <Input
            value={formData.videoUrl}
            onChange={(e) => handleFieldChange("videoUrl", e.target.value)}
            placeholder="Ej: https://www.youtube.com/watch?"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Precio</h2>
            <p className="text-slate-400">Indicá a cuánto querés vender el inmueble</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-blue-200">Precio</Label>
            <div className="flex">
              <Select value={formData.currency} onValueChange={(value) => handleFieldChange("currency", value)}>
                <SelectTrigger className="w-24 bg-slate-700 border-slate-600 text-white rounded-r-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleFieldChange("price", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white rounded-l-none border-l-0"
              />
            </div>
          </div>

          <div>
            <Label className="text-blue-200">Expensas</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <Input
                type="number"
                value={formData.expenses}
                onChange={(e) => handleFieldChange("expenses", Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white pl-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                por mes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
