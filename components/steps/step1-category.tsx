"use client"

import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

const categories = [
  { id: "departamentos", label: "Departamentos" },
  { id: "casas", label: "Casas" },
  { id: "camas-nauticas", label: "Camas Náuticas" },
  { id: "campos", label: "Campos" },
  { id: "cocheras", label: "Cocheras" },
  { id: "consultorios", label: "Consultorios" },
  { id: "depositos-galpones", label: "Depósitos y Galpones" },
  { id: "fondo-comercio", label: "Fondo de Comercio" },
]

export default function Step1Category() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handleCategorySelect = (categoryId: string) => {
    dispatch(updateField({ field: "category", value: categoryId }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center">
          <Home className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Empezá describiendo el inmueble</h2>
          <p className="text-slate-400">¿A qué categoría pertenece?</p>
        </div>
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={`w-full justify-between p-4 h-auto text-left hover:bg-slate-700/50 ${
              formData.category === category.id
                ? "bg-blue-600/20 border border-blue-500/50 text-blue-300"
                : "text-slate-300 border border-slate-700"
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <span>{category.label}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}
