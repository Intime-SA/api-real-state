import { type NextRequest, NextResponse } from "next/server"
import { publicationService } from "@/lib/services/publicationService"
import { publicationSchema } from "@/lib/schemas/publicationSchema"

// GET /api/publications - Obtener todas las publicaciones con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      category: searchParams.get("category") || undefined,
      operationType: searchParams.get("operationType") || undefined,
      province: searchParams.get("province") || undefined,
      city: searchParams.get("city") || undefined,
      status: searchParams.get("status") || undefined,
      userId: searchParams.get("userId") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "10"),
    }

    const result = await publicationService.findAll(filters)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

// POST /api/publications - Crear nueva publicación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos con Zod
    const validationResult = publicationSchema.safeParse(body)

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

    const publication = await publicationService.create(validationResult.data)

    return NextResponse.json(
      {
        success: true,
        data: publication,
        message: "Publicación creada exitosamente",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating publication:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
