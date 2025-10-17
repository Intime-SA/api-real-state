import { type Collection, type Db } from "mongodb"
import clientPromise from "@/lib/mongo"
import type { MetricData, CreateMetricData, Metric } from "@/lib/models/Metric"

const DB_NAME = "real-state"
const COLLECTION_NAME = "metrics"

class MetricService {
  private async getCollection(): Promise<Collection<Metric>> {
    const client = await clientPromise
    const db: Db = client.db(DB_NAME)
    return db.collection<Metric>(COLLECTION_NAME)
  }

  /**
   * Obtiene la fecha y hora actual en formato ISO string para zona horaria de Argentina
   * Argentina está en UTC-3
   */
  private getArgentinaTimestamp(): string {
    const now = new Date()
    // Argentina está en UTC-3, así que restamos 3 horas a la hora UTC
    const argentinaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000))
    return argentinaTime.toISOString()
  }

  async create(data: CreateMetricData): Promise<Metric> {
    const collection = await this.getCollection()

    const metric: Omit<Metric, "_id"> = {
      ...data,
      timestamp: this.getArgentinaTimestamp(),
    }

    const result = await collection.insertOne(metric as Metric)

    const createdMetric = await collection.findOne({ _id: result.insertedId })

    if (!createdMetric) {
      throw new Error("Error al crear la métrica")
    }

    return createdMetric
  }

  async findAll(
    filters: {
      type?: 'visit' | 'form'
      idProperty?: string
      subject?: 'contacto' | 'tasaciones' | 'publicacion'
      page?: number
      limit?: number
      startDate?: string // formato ISO string
      endDate?: string // formato ISO string
    } = {},
  ): Promise<{ metrics: Metric[]; total: number; page: number; totalPages: number }> {
    const collection = await this.getCollection()

    const { page = 1, limit = 10, ...filterParams } = filters
    const skip = (page - 1) * limit

    // Construir filtros de búsqueda
    const searchFilters: any = {}

    if (filterParams.type) {
      searchFilters.type = filterParams.type
    }

    if (filterParams.idProperty) {
      searchFilters.idProperty = filterParams.idProperty
    }

    if (filterParams.subject) {
      searchFilters.subject = filterParams.subject
    }

    // Filtro por rango de fechas
    if (filterParams.startDate || filterParams.endDate) {
      searchFilters.timestamp = {}
      if (filterParams.startDate) {
        searchFilters.timestamp.$gte = filterParams.startDate
      }
      if (filterParams.endDate) {
        searchFilters.timestamp.$lte = filterParams.endDate
      }
    }

    const [metrics, total] = await Promise.all([
      collection.find(searchFilters).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(searchFilters),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      metrics,
      total,
      page,
      totalPages,
    }
  }

  /**
   * Obtiene estadísticas de métricas agrupadas por tipo
   */
  async getStats(
    filters: {
      startDate?: string
      endDate?: string
    } = {},
  ): Promise<{
    totalVisits: number
    totalForms: number
    formsBySubject: Record<string, number>
    visitsByProperty: Record<string, number>
  }> {
    const collection = await this.getCollection()

    const searchFilters: any = {}

    // Filtro por rango de fechas
    if (filters.startDate || filters.endDate) {
      searchFilters.timestamp = {}
      if (filters.startDate) {
        searchFilters.timestamp.$gte = filters.startDate
      }
      if (filters.endDate) {
        searchFilters.timestamp.$lte = filters.endDate
      }
    }

    const metrics = await collection.find(searchFilters).toArray()

    const stats = {
      totalVisits: 0,
      totalForms: 0,
      formsBySubject: {} as Record<string, number>,
      visitsByProperty: {} as Record<string, number>,
    }

    for (const metric of metrics) {
      if (metric.type === 'visit') {
        stats.totalVisits++
        const visitMetric = metric as any // Type assertion para acceder a idProperty
        if (visitMetric.idProperty) {
          stats.visitsByProperty[visitMetric.idProperty] = (stats.visitsByProperty[visitMetric.idProperty] || 0) + 1
        }
      } else if (metric.type === 'form') {
        stats.totalForms++
        const formMetric = metric as any // Type assertion para acceder a subject
        if (formMetric.subject) {
          stats.formsBySubject[formMetric.subject] = (stats.formsBySubject[formMetric.subject] || 0) + 1
        }
      }
    }

    return stats
  }
}

export const metricService = new MetricService()
