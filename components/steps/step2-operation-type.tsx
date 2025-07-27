"use client"

import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { ChevronRight, DollarSign } from "lucide-react"
import { updateField, selectFormData } from "@/lib/slices/publicationSlice"

const operationTypes = [
  { id: "alquiler", label: "Alquiler" },
  { id: "alquiler-temporario", label: "Alquiler Temporario" },
  { id: "venta", label: "Venta" },
]

export default function Step2OperationType() {
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)

  const handleOperationSelect = (operationType: string) => {
    dispatch(updateField({ field: "operationType", value: operationType }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Tipo de Operación</h2>
          <p className="text-slate-400">¿Qué tipo de operación realizarás?</p>
        </div>
      </div>

      <div className="space-y-2">
        {operationTypes.map((operation) => (
          <Button
            key={operation.id}
            variant="ghost"
            className={`w-full justify-between p-4 h-auto text-left hover:bg-slate-700/50 ${
              formData.operationType === operation.id
                ? "bg-blue-600/20 border border-blue-500/50 text-blue-300"
                : "text-slate-300 border border-slate-700"
            }`}
            onClick={() => handleOperationSelect(operation.id)}
          >
            <span>{operation.label}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}
