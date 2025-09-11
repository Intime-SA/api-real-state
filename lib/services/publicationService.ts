import { type Collection, type Db, ObjectId } from "mongodb"
import clientPromise from "@/lib/mongo"
import type { Publication, CreatePublicationData, UpdatePublicationData } from "@/lib/models/Publication"

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
    } = {},
  ): Promise<{ publications: Publication[]; total: number; page: number; totalPages: number }> {
    const collection = await this.getCollection()

    const { page = 1, limit = 10, ...filterParams } = filters
    const skip = (page - 1) * limit

    // Construir filtros de búsqueda
    const searchFilters: any = {}

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
    if (filterParams.id) {
      console.log('filterParams.id', filterParams.id)
      searchFilters._id = new ObjectId(filterParams.id)
    }

    const [publications, total] = await Promise.all([
      collection.find(searchFilters).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(searchFilters),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      publications,
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
  ): Promise<{ publications: Publication[]; total: number; page: number; totalPages: number }> {
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

    return {
      publications,
      total,
      page,
      totalPages,
    }
  }
}

export const publicationService = new PublicationService()
