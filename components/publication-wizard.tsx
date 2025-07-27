"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Save, ArrowLeft, ArrowRight, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { setFormData, selectFormData, selectCurrentStep, setCurrentStep } from "@/lib/slices/publicationSlice"
import PublicationPreviewModal from "./publicacion-preview"
import { useRouter } from "next/navigation"

// Import step components
import Step1Category from "@/components/steps/step1-category"
import Step2OperationType from "@/components/steps/step2-operation-type"
import Step3Location from "@/components/steps/step3-location"
import Step4Photos from "@/components/steps/step4-photos"
import Step5Characteristics from "@/components/steps/step5-characteristics"
import Step6TitleDescription from "@/components/steps/step6-title-description"
import Step7VideoPrice from "@/components/steps/step7-video-price"

const steps = [
  { id: 1, title: "Categoría", subtitle: "¿A qué categoría pertenece?", component: Step1Category },
  { id: 2, title: "Tipo de Operación", subtitle: "Empezá describiendo el inmueble", component: Step2OperationType },
  { id: 3, title: "Ubicación", subtitle: "La dirección busca en el mapa", component: Step3Location },
  { id: 4, title: "Fotos", subtitle: "Adjuntar fotos del inmueble", component: Step4Photos },
  { id: 5, title: "Características", subtitle: "Características secundarias", component: Step5Characteristics },
  { id: 6, title: "Título y Descripción", subtitle: "Información detallada", component: Step6TitleDescription },
  { id: 7, title: "Video y Precio", subtitle: "Información final", component: Step7VideoPrice },
]

export default function PublicationWizard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const formData = useSelector(selectFormData)
  const currentStep = useSelector(selectCurrentStep)
  const [expandedStep, setExpandedStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)

  // Sample data for editing mode
  const samplePublication = {
    category: "departamentos",
    operationType: "venta",
    address: "Marcelo T. de Alvear 669, Mar del Plata",
    province: "Buenos Aires Interior",
    city: "General Pueyrredón",
    neighborhood: "Centro",
    hideExactAddress: false,
    photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
    totalSurface: 75,
    coveredSurface: 70,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    title: "Depto 3 amb, excelente ubicación frente al mar",
    description:
      "Hermoso departamento en el centro de Mar del Plata, con vista al mar y excelente ubicación. Cuenta con todos los servicios y está completamente equipado. Ideal para inversión o vivienda permanente.",
    videoUrl: "https://www.youtube.com/watch?v=example",
    price: 120000,
    currency: "USD",
    expenses: 8500,
  }

  useEffect(() => {
    // Load sample data for editing (you can modify this logic)
    dispatch(setFormData(samplePublication))
  }, [dispatch])

  const handleStepClick = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? 0 : stepId)
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1
      dispatch(setCurrentStep(nextStep))
      setExpandedStep(nextStep)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      dispatch(setCurrentStep(prevStep))
      setExpandedStep(prevStep)
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handlePreviewClose = () => {
    setShowPreview(false)
  }

  const handlePublishSuccess = () => {
    // Redirigir al dashboard después de crear exitosamente
    router.push("/dashboard")
  }

  // Función para verificar si se puede mostrar preview (al menos algunos campos básicos)
  const canShowPreview = () => {
    return !!(formData.category && formData.operationType && formData.title && formData.address)
  }

  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return !!formData.category
      case 2:
        return !!formData.operationType
      case 3:
        return !!formData.address
      case 4:
        return formData.photos.length > 0
      case 5:
        return formData.totalSurface > 0
      case 6:
        return !!formData.title && !!formData.description
      case 7:
        return formData.price > 0
      default:
        return false
    }
  }

  const isFormComplete = () => {
    return steps.every((step) => isStepCompleted(step.id))
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep >= step.id ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400",
                  )}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-1 mx-2 transition-colors",
                      currentStep > step.id ? "bg-blue-600" : "bg-slate-700",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-blue-200 text-center">
            Paso {currentStep} de {steps.length}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const StepComponent = step.component
            const isExpanded = expandedStep === step.id
            const isCompleted = isStepCompleted(step.id)

            return (
              <Card
                key={step.id}
                className={cn(
                  "bg-slate-800/50 border-slate-700 backdrop-blur-sm transition-all duration-300",
                  isExpanded && "ring-2 ring-blue-500/50",
                )}
              >
                <div
                  className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        isCompleted
                          ? "bg-green-600 text-white"
                          : currentStep === step.id
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-400",
                      )}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{step.title}</h3>
                      <p className="text-slate-400 text-sm">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                        Completado
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="pt-0 pb-6">
                    <div className="border-t border-slate-700 pt-6">
                      <StepComponent />

                      {/* Step Navigation */}
                      <div className="flex justify-between mt-6 pt-4 border-t border-slate-700">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Anterior
                        </Button>

                        <div className="flex gap-3">
                          {/* Botón de preview disponible desde cualquier paso si hay datos mínimos */}
                          {canShowPreview() && (
                            <Button
                              onClick={handlePreview}
                              variant="outline"
                              className="border-purple-600 text-purple-300 hover:bg-purple-700/20 bg-transparent"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Vista Previa
                            </Button>
                          )}

                          {currentStep === steps.length && isFormComplete() && (
                            <Button
                              onClick={handlePreview}
                              variant="outline"
                              className="border-blue-600 text-blue-300 hover:bg-blue-700/20 bg-transparent"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Vista Previa
                            </Button>
                          )}

                          {currentStep < steps.length ? (
                            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                              Siguiente
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button
                              onClick={handlePreview}
                              disabled={!isFormComplete()}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Guardar y Previsualizar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Preview Modal */}
      <PublicationPreviewModal isOpen={showPreview} onClose={handlePreviewClose} onConfirm={handlePublishSuccess} />
    </>
  )
}
