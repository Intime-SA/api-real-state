"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Ruler,
  Home,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  Building,
  Play,
  Check,
  ArrowLeft,
  Camera,
} from "lucide-react"
import { selectFormData } from "@/lib/slices/publicationSlice"
import { useCreatePublication } from "@/hooks/useCreatePublication"

interface PublicationPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

export default function PublicationPreviewModal({ isOpen, onClose, onConfirm }: PublicationPreviewModalProps) {
  const formData = useSelector(selectFormData)
  const { mutate: createPublication, isPending } = useCreatePublication()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleConfirm = () => {
    createPublication(formData, {
      onSuccess: () => {
        onConfirm?.()
        onClose()
      },
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const categories = {
      departamentos: "Departamento",
      casas: "Casa",
      "camas-nauticas": "Cama Náutica",
      campos: "Campo",
      cocheras: "Cochera",
      consultorios: "Consultorio",
      "depositos-galpones": "Depósito/Galpón",
      "fondo-comercio": "Fondo de Comercio",
    }
    return categories[category] || category
  }

  const getOperationLabel = (operation: string) => {
    const operations = {
      venta: "Venta",
      alquiler: "Alquiler",
      "alquiler-temporario": "Alquiler Temporario",
    }
    return operations[operation] || operation
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900">Preview de la Publicación</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="bg-gray-50">
            {/* Hero Section with Images */}
            <div className="relative bg-white">
              <div className="relative h-96 bg-gray-200 overflow-hidden">
                {formData.photos.length > 0 ? (
                  <div className="relative w-full h-full">
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-white/70" />
                      <span className="ml-4 text-white/70 text-lg">Imagen {currentImageIndex + 1}</span>
                    </div>
                    {formData.photos.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {formData.photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Photo counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  {formData.photos.length}
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Property Header */}
              <div className="px-6 py-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {getOperationLabel(formData.operationType)}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(formData.category)}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{formData.address}</span>
                      {!formData.hideExactAddress && (
                        <span className="ml-2 text-sm">
                          • {formData.city}, {formData.province}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {formatPrice(formData.price, formData.currency)}
                    </div>
                    {formData.expenses > 0 && (
                      <div className="text-sm text-gray-600">+ ${formData.expenses} expensas</div>
                    )}
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Ruler className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Superficie</div>
                      <div className="font-semibold">{formData.totalSurface} m²</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Home className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Ambientes</div>
                      <div className="font-semibold">{formData.rooms}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Bed className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Dormitorios</div>
                      <div className="font-semibold">{formData.bedrooms}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Bath className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Baños</div>
                      <div className="font-semibold">{formData.bathrooms}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <Ruler className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Superficie cubierta</span>
                        </div>
                        <span className="font-medium">{formData.coveredSurface} m²</span>
                      </div>

                      {formData.parkingSpaces > 0 && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <Car className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">Cocheras</span>
                          </div>
                          <span className="font-medium">{formData.parkingSpaces}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Tipo</span>
                        </div>
                        <span className="font-medium">{getCategoryLabel(formData.category)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ubicación</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Provincia</span>
                        </div>
                        <span className="font-medium">{formData.province}</span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Ciudad</span>
                        </div>
                        <span className="font-medium">{formData.city}</span>
                      </div>

                      {formData.neighborhood && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-gray-700">Barrio</span>
                          </div>
                          <span className="font-medium">{formData.neighborhood}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {formData.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.description}</p>
                    </div>
                  </div>
                )}

                {/* Video */}
                {formData.videoUrl && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Video</h3>
                    <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500 mr-2" />
                      <span className="text-gray-600">Video disponible</span>
                    </div>
                  </div>
                )}

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Te interesa esta propiedad?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
          <Button variant="outline" onClick={onClose} className="flex items-center bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Editar
          </Button>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">¿Todo se ve bien? Confirma para publicar</div>
            <Button
              onClick={handleConfirm}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              {isPending ? "Publicando..." : "Confirmar y Publicar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
