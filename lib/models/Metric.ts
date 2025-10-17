import type { ObjectId } from "mongodb"

export type MetricType = 'visit' | 'form'

export type FormSubject = 'contacto' | 'tasaciones' | 'publicacion'

// Base metric interface
export interface Metric {
  _id?: ObjectId
  type: MetricType
  userAgent: string
  timestamp: string // ISO string con zona horaria de Argentina
}

// Visit metric - tracks property visits
export interface VisitMetric extends Metric {
  type: 'visit'
  idProperty: string // ID de la publicación
}

// Form metric - tracks form submissions
export interface FormMetric extends Metric {
  type: 'form'
  subject: FormSubject
  form: string // Datos del formulario en formato string (probablemente JSON stringified)
}

// Union type for all metrics
export type MetricData = VisitMetric | FormMetric

// Input types for creating metrics (without auto-generated fields)
export interface CreateVisitMetricData {
  type: 'visit'
  userAgent: string
  idProperty: string
}

export interface CreateFormMetricData {
  type: 'form'
  userAgent: string
  subject: FormSubject
  form: string
}

export type CreateMetricData = CreateVisitMetricData | CreateFormMetricData
