"use client"

import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

export default function Step4Photos() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhotos = [...formData.photos, "photo-placeholder.jpg"]
    dispatch(updateField({ field: "photos", value: newPhotos }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-yellow-600/20 rounded-lg flex items-center justify-center">
          <Camera className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Fotos</h2>
          <p className="text-slate-400">Subí buenas fotos para que el inmueble se destaque</p>
        </div>
      </div>

      <div className="bg-slate-700/30 border-2 border-dashed border-slate-600 rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Agregá hasta 20 fotos y organizalas como quieras</h3>
          <p className="text-slate-400 mb-4">
            Para no perder exposición, no agregues bordes, logos ni marcas de agua. No incluyas datos de contacto,
            banners ni textos promocionales.
          </p>
          <Button onClick={handlePhotoUpload} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar Fotos
          </Button>
        </div>
      </div>

      {formData.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center">
              <Camera className="w-8 h-8 text-slate-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
