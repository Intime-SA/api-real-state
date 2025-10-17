import { z } from "zod"

// Esquema base para métricas
const baseMetricSchema = z.object({
  type: z.enum(['visit', 'form'], {
    errorMap: () => ({ message: "El tipo debe ser 'visit' o 'form'" })
  }),
  userAgent: z.string().min(1, "El userAgent es requerido"),
})

// Esquema para métricas de visita
export const visitMetricSchema = baseMetricSchema.extend({
  type: z.literal('visit'),
  idProperty: z.string().min(1, "El ID de la propiedad es requerido"),
})

// Esquema para métricas de formulario
export const formMetricSchema = baseMetricSchema.extend({
  type: z.literal('form'),
  subject: z.enum(['contacto', 'tasaciones', 'publicacion'], {
    errorMap: () => ({ message: "El subject debe ser 'contacto', 'tasaciones' o 'publicacion'" })
  }),
  form: z.string().min(1, "Los datos del formulario son requeridos"),
})

// Esquema principal que discrimina por tipo
export const metricSchema = z.discriminatedUnion('type', [
  visitMetricSchema,
  formMetricSchema,
])

// Tipos inferidos
export type VisitMetricFormData = z.infer<typeof visitMetricSchema>
export type FormMetricFormData = z.infer<typeof formMetricSchema>
export type MetricFormData = z.infer<typeof metricSchema>
