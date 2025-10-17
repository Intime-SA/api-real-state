import { type NextRequest, NextResponse } from "next/server"
import { metricService } from "@/lib/services/metricService"
import { metricSchema } from "@/lib/schemas/metricSchema"

// POST /api/metrics - Crear nueva métrica
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos con Zod
    const validationResult = metricSchema.safeParse(body)

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

    const metric = await metricService.create(validationResult.data)

    return NextResponse.json(
      {
        success: true,
        data: metric,
        message: "Métrica registrada exitosamente",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating metric:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

// GET /api/metrics - Obtener métricas con filtros (opcional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      type: (searchParams.get("type") as 'visit' | 'form') || undefined,
      idProperty: searchParams.get("idProperty") || undefined,
      subject: (searchParams.get("subject") as 'contacto' | 'tasaciones' | 'publicacion') || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "10"),
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    }

    const result = await metricService.findAll(filters)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
