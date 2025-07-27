import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/utils/database"

// GET /api/health - Verificar estado de la API y base de datos
export async function GET() {
  try {
    const dbConnected = await checkDatabaseConnection()

    return NextResponse.json({
      success: true,
      status: "healthy",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: "Error checking system health",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
