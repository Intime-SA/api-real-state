import { type NextRequest, NextResponse } from "next/server"
import { publicationService } from "@/lib/services/publicationService"

// GET /api/publications/search - Buscar publicaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("q") || ""
    const filters = {
      category: searchParams.get("category") || undefined,
      operationType: searchParams.get("operationType") || undefined,
      province: searchParams.get("province") || undefined,
      city: searchParams.get("city") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "10"),
    }

    const result = await publicationService.search(query, filters)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error searching publications:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
