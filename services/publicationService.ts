import type { PublicationFormData } from "@/lib/schemas/publicationSchema"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const publicationService = {
  create: async (data: PublicationFormData) => {
    const response = await fetch(`${API_BASE_URL}/publications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Error al crear la publicación")
    }

    return response.json()
  },

  update: async (id: string, data: PublicationFormData) => {
    const response = await fetch(`${API_BASE_URL}/publications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar la publicación")
    }

    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/publications/${id}`)

    if (!response.ok) {
      throw new Error("Error al obtener la publicación")
    }

    return response.json()
  },
}
