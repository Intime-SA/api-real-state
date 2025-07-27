import { z } from "zod"

export const publicationSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  operationType: z.string().min(1, "El tipo de operación es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  province: z.string().min(1, "La provincia es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  neighborhood: z.string().optional(),
  hideExactAddress: z.boolean().default(false),
  photos: z.array(z.string()).min(1, "Al menos una foto es requerida"),
  totalSurface: z.number().min(1, "La superficie total es requerida"),
  coveredSurface: z.number().min(1, "La superficie cubierta es requerida"),
  rooms: z.number().min(1, "El número de ambientes es requerido"),
  bedrooms: z.number().min(0, "El número de dormitorios debe ser válido"),
  bathrooms: z.number().min(1, "Al menos un baño es requerido"),
  parkingSpaces: z.number().min(0, "El número de cocheras debe ser válido"),
  title: z.string().min(1, "El título es requerido").max(60, "El título no puede exceder 60 caracteres"),
  description: z.string().max(50000, "La descripción no puede exceder 50000 caracteres"),
  videoUrl: z.string().url("URL de video inválida").optional().or(z.literal("")),
  price: z.number().min(1, "El precio es requerido"),
  currency: z.enum(["USD", "ARS", "EUR"]),
  expenses: z.number().min(0, "Las expensas deben ser un número válido"),
  features: z.array(z.string()).optional(),
  userId: z.string().optional(),
})

export type PublicationFormData = z.infer<typeof publicationSchema>
