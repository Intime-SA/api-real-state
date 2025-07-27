import { type NextRequest, NextResponse } from "next/server"
import { publicationService } from "@/lib/services/publicationService"
import { publicationSchema } from "@/lib/schemas/publicationSchema"

// GET /api/publications/[id] - Obtener publicación por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const publication = await publicationService.findById(params.id)

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
    })
  } catch (error) {
    console.error("Error fetching publication:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

// PUT /api/publications/[id] - Actualizar publicación
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validar datos con Zod (permitir campos parciales para actualización)
    const validationResult = publicationSchema.partial().safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const publication = await publicationService.update(params.id, validationResult.data)

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
      message: "Publicación actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error updating publication:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/publications/[id] - Eliminar publicación
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await publicationService.delete(params.id)

    if (!deleted) {
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
      message: "Publicación eliminada exitosamente",
    })
  } catch (error) {
    console.error("Error deleting publication:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
