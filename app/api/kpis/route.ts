import { type NextRequest, NextResponse } from "next/server"
import { metricService } from "@/lib/services/metricService"

// GET /api/kpis - Obtener los 4 KPIs principales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    }

    const kpis = await metricService.getKPIs(filters)

    return NextResponse.json({
      success: true,
      data: kpis,
    })
  } catch (error) {
    console.error("Error fetching KPIs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
