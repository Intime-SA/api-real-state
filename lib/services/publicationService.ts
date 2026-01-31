import { type Collection, type Db, ObjectId } from "mongodb"
import clientPromise from "@/lib/mongo"
import type { Publication, CreatePublicationData, UpdatePublicationData, PublicationWithVisits } from "@/lib/models/Publication"
import { metricService } from "@/lib/services/metricService"

const DB_NAME = "real-state"
const COLLECTION_NAME = "publications"

class PublicationService {
  private async getCollection(): Promise<Collection<Publication>> {
    const client = await clientPromise
    const db: Db = client.db(DB_NAME)
    return db.collection<Publication>(COLLECTION_NAME)
  }

  async create(data: CreatePublicationData): Promise<Publication> {
    const collection = await this.getCollection()

    const publication: Omit<Publication, "_id"> = {
      ...data,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(publication as Publication)

    const createdPublication = await collection.findOne({ _id: result.insertedId })

    if (!createdPublication) {
      throw new Error("Error al crear la publicación")
    }

    return createdPublication
  }

  async findById(id: string): Promise<Publication | null> {
    const collection = await this.getCollection()

    if (!ObjectId.isValid(id)) {
      return null
    }

    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async findAll(
    filters: {
      operationType?: string
      category?: string
      province?: string
      city?: string
      neighborhood?: string
      totalSurface?: number
      coveredSurface?: number
      parkingSpaces?: number
      rooms?: number
      minPrice?: number
      maxPrice?: number
      bedrooms?: number
      bathrooms?: number
      status?: string
      page?: number
      limit?: number
      query?: string
      id?: string
      title?: string
      moreVisit?: string
      searchCode?: string
    } = {},
  ): Promise<{ publications: PublicationWithVisits[]; total: number; page: number; totalPages: number }> {
    const collection = await this.getCollection()

    const { page = 1, limit = 10, ...filterParams } = filters
    const skip = (page - 1) * limit

    // Construir filtros de búsqueda
    const searchFilters: any = {}

    // Aplicar filtros individuales
    if (filterParams.category) {
      searchFilters.category = filterParams.category
    }

    if (filterParams.operationType) {
      searchFilters.operationType = filterParams.operationType
    }

    if (filterParams.province) {
      searchFilters.province = filterParams.province
    }

    if (filterParams.city) {
      searchFilters.city = filterParams.city
    }

    if (filterParams.status) {
      searchFilters.status = filterParams.status
    }

    if (filterParams.neighborhood) {
      searchFilters.neighborhood = filterParams.neighborhood
    }

    if (filterParams.query) {
      searchFilters.status = filterParams.query
    }

    if (filterParams.title) {
      // Búsqueda por coincidencia parcial en el título, insensible a mayúsculas
      searchFilters.title = { $regex: filterParams.title, $options: 'i' }
    }

    // Aplicar filtros de precio
    if (filterParams.minPrice !== undefined || filterParams.maxPrice !== undefined) {
      searchFilters.price = {}
      if (filterParams.minPrice !== undefined) {
        searchFilters.price.$gte = filterParams.minPrice
      }
      if (filterParams.maxPrice !== undefined) {
        searchFilters.price.$lte = filterParams.maxPrice
      }
    }

    // Aplicar búsqueda general por palabras si existe searchCode
    if (filterParams.searchCode) {
      // Separar el searchCode en palabras individuales
      const searchWords = filterParams.searchCode
        .split(/\s+/) // Separar por espacios
        .filter(word => word.length > 0) // Filtrar palabras vacías
        .map(word => word.trim()); // Limpiar espacios

      // Crear condiciones de búsqueda que combinen filtros existentes con búsqueda
      const baseFilters = { ...searchFilters };
      const searchConditions = [];

      // Crear una condición que combine filtros base + búsqueda por cada palabra
      for (const word of searchWords) {
        const conditionWithFilters = { ...baseFilters };

        // Agregar condición de búsqueda a esta combinación
        conditionWithFilters.$or = [
          { title: { $regex: word, $options: 'i' } },
          { description: { $regex: word, $options: 'i' } },
          { features: { $elemMatch: { $regex: word, $options: 'i' } } }
        ];

        searchConditions.push(conditionWithFilters);
      }

      // Reemplazar filtros con $or de todas las combinaciones
      if (searchConditions.length > 0) {
        searchFilters.$or = searchConditions;
        // Limpiar filtros individuales ya que ahora están en el $or
        Object.keys(baseFilters).forEach(key => {
          delete searchFilters[key];
        });
      }
    }

    if (filterParams.id) {
      console.log('filterParams.id', filterParams.id)
      searchFilters._id = new ObjectId(filterParams.id)
    }

    // Determinar el ordenamiento
    let sortCriteria: any = { createdAt: -1 }
    let shouldSortByVisits = false

    if (filterParams.moreVisit) {
      // Si hay filtro de visitas, no ordenar en la consulta (ordenaremos después)
      sortCriteria = {}
      shouldSortByVisits = true
    }

    const [publications, total] = await Promise.all([
      collection.find(searchFilters).sort(sortCriteria).skip(skip).limit(limit).toArray(),
      collection.countDocuments(searchFilters),
    ])

    const totalPages = Math.ceil(total / limit)

    // Obtener IDs de las publicaciones para consultar visitas
    const publicationIds = publications.map(pub => pub._id!.toString())

    // Obtener conteo de visitas para estas publicaciones
    const visitsCount = await metricService.getVisitsCountByProperties(publicationIds)

    // Agregar visitas a cada publicación
    let publicationsWithVisits: PublicationWithVisits[] = publications.map(pub => ({
      ...pub,
      visits: visitsCount[pub._id!.toString()] || 0
    }))

    // Ordenar por visitas si se especificó el filtro
    if (shouldSortByVisits && filterParams.moreVisit) {
      publicationsWithVisits.sort((a, b) => {
        const visitsA = a.visits
        const visitsB = b.visits

        if (filterParams.moreVisit === "true") {
          // Más visitados primero (descendente)
          return visitsB - visitsA
        } else {
          // Menos visitados primero (ascendente)
          return visitsA - visitsB
        }
      })
    }

    return {
      publications: publicationsWithVisits,
      total,
      page,
      totalPages,
    }
  }

  async update(id: string, data: UpdatePublicationData): Promise<Publication | null> {
    const collection = await this.getCollection()

    if (!ObjectId.isValid(id)) {
      return null
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    )

    return result
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()

    if (!ObjectId.isValid(id)) {
      return false
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }

  async updateStatus(id: string, status: "active" | "paused" | "sold" | "rented"): Promise<Publication | null> {
    return this.update(id, { status })
  }

  async search(
    query: string,
    filters: {
      category?: string
      operationType?: string
      province?: string
      city?: string
      minPrice?: number
      maxPrice?: number
      page?: number
      limit?: number
    } = {},
  ): Promise<{ publications: PublicationWithVisits[]; total: number; page: number; totalPages: number }> {
    const collection = await this.getCollection()

    const { page = 1, limit = 10, minPrice, maxPrice, ...filterParams } = filters
    const skip = (page - 1) * limit

    // Construir filtros de búsqueda
    const searchFilters: any = {
      status: "active", // Solo mostrar publicaciones activas en búsquedas
    }

    // Búsqueda de texto
    if (query) {
      searchFilters.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { province: { $regex: query, $options: "i" } },
      ]
    }

    // Filtros adicionales
    if (filterParams.category) {
      searchFilters.category = filterParams.category
    }

    if (filterParams.operationType) {
      searchFilters.operationType = filterParams.operationType
    }

    if (filterParams.province) {
      searchFilters.province = filterParams.province
    }

    if (filterParams.city) {
      searchFilters.city = filterParams.city
    }

    // Filtro de precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchFilters.price = {}
      if (minPrice !== undefined) {
        searchFilters.price.$gte = minPrice
      }
      if (maxPrice !== undefined) {
        searchFilters.price.$lte = maxPrice
      }
    }

    const [publications, total] = await Promise.all([
      collection.find(searchFilters).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(searchFilters),
    ])

    const totalPages = Math.ceil(total / limit)

    // Obtener IDs de las publicaciones para consultar visitas
    const publicationIds = publications.map(pub => pub._id!.toString())

    // Obtener conteo de visitas para estas publicaciones
    const visitsCount = await metricService.getVisitsCountByProperties(publicationIds)

    // Agregar visitas a cada publicación
    const publicationsWithVisits: PublicationWithVisits[] = publications.map(pub => ({
      ...pub,
      visits: visitsCount[pub._id!.toString()] || 0
    }))

    return {
      publications: publicationsWithVisits,
      total,
      page,
      totalPages,
    }
  }
}

export const publicationService = new PublicationService()
