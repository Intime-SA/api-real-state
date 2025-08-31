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
      neighborhood: searchParams.get("neighborhood") || undefined,
      totalSurface: Number.parseInt(searchParams.get("totalSurface") || "0") || undefined,
      coveredSurface: Number.parseInt(searchParams.get("coveredSurface") || "0") || undefined,
      parkingSpaces: Number.parseInt(searchParams.get("parkingSpaces") || "0") || undefined,
      rooms: Number.parseInt(searchParams.get("rooms") || "0") || undefined,
      minPrice: Number.parseInt(searchParams.get("minPrice") || "0") || undefined,
      maxPrice: Number.parseInt(searchParams.get("maxPrice") || "0") || undefined,
      bedrooms: Number.parseInt(searchParams.get("bedrooms") || "0") || undefined,
      bathrooms: Number.parseInt(searchParams.get("bathrooms") || "0") || undefined,
      all: searchParams.get("query") || 'active',
      id: searchParams.get("id") || undefined,
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
