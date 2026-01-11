import type { ObjectId } from "mongodb"

export interface Publication {
  _id?: ObjectId
  category: string
  operationType: string
  address: string
  province: string
  city: string
  neighborhood?: string
  hideExactAddress: boolean
  photos: string[]
  totalSurface?: number
  coveredSurface?: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  title: string
  description: string
  videoUrl?: string
  price: number
  currency: string
  expenses: number
  status: "active" | "paused" | "sold" | "rented"
  createdAt: Date
  updatedAt: Date
  userId?: string // Para asociar con el usuario que creó la publicación
}

export interface CreatePublicationData {
  category: string
  operationType: string
  address: string
  province: string
  city: string
  neighborhood?: string
  hideExactAddress: boolean
  photos: string[]
  totalSurface?: number
  coveredSurface?: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpaces?: number
  title: string
  description: string
  videoUrl?: string
  price: number
  currency: string
  expenses: number
  userId?: string
}

export interface UpdatePublicationData extends Partial<CreatePublicationData> {
  status?: "active" | "paused" | "sold" | "rented"
}

export interface PublicationWithVisits extends Publication {
  visits: number
}
