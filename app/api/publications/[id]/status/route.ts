import { type NextRequest, NextResponse } from "next/server"
import { publicationService } from "@/lib/services/publicationService"

// PATCH /api/publications/[id]/status - Actualizar estado de publicación
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    // Validar que el estado sea válido
    const validStatuses = ["active", "paused", "sold", "rented"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Estado inválido. Los estados válidos son: active, paused, sold, rented",
        },
        { status: 400 },
      )
    }

    const publication = await publicationService.updateStatus(params.id, status)

    if (!publication) {
      return NextResponse.json(
        {
          success: false,
          error: "Publicación no encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: publication,
      message: "Estado actualizado exitosamente",
    })
  } catch (error) {
    console.error("Error updating publication status:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
