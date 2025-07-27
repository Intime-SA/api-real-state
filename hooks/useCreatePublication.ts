import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { publicationSchema, type PublicationFormData } from "@/lib/schemas/publicationSchema"
import { setErrors, setSubmitting } from "@/lib/slices/publicationSlice"
import { toast } from "sonner"

export const useCreatePublication = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: async (data: PublicationFormData) => {
      dispatch(setSubmitting(true))

      // Validate with Zod
      const validationResult = publicationSchema.safeParse(data)

      if (!validationResult.success) {
        const errors: Record<string, string> = {}
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as string] = error.message
          }
        })
        dispatch(setErrors(errors))
        throw new Error("Datos de formulario inválidos")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return { id: "123", ...validationResult.data }
    },
    onSuccess: (data) => {
      toast.success("¡Publicación creada exitosamente!", {
        description: "Tu propiedad ya está disponible para los interesados.",
      })
      queryClient.invalidateQueries({ queryKey: ["publications"] })
      dispatch(setSubmitting(false))
    },
    onError: (error: Error) => {
      toast.error("Error al crear la publicación", {
        description: error.message || "Hubo un problema al procesar tu solicitud.",
      })
      dispatch(setSubmitting(false))
    },
  })
}
