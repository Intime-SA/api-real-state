import clientPromise from "@/lib/mongo"

// Función utilitaria para inicializar índices de la base de datos
export async function initializeDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("real-state")
    const collection = db.collection("publications")

    // Crear índices para mejorar el rendimiento de las consultas
    await collection.createIndex({ category: 1 })
    await collection.createIndex({ operationType: 1 })
    await collection.createIndex({ province: 1, city: 1 })
    await collection.createIndex({ price: 1 })
    await collection.createIndex({ status: 1 })
    await collection.createIndex({ createdAt: -1 })
    await collection.createIndex({ userId: 1 })

    // Índice de texto para búsquedas
    await collection.createIndex({
      title: "text",
      description: "text",
      address: "text",
      city: "text",
      province: "text",
    })

    console.log("Database indexes initialized successfully")
  } catch (error) {
    console.error("Error initializing database indexes:", error)
  }
}

// Función para verificar la conexión a la base de datos
export async function checkDatabaseConnection() {
  try {
    const client = await clientPromise
    await client.db("real-state").admin().ping()
    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
