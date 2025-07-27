import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface PublicationState {
  formData: {
    category: string
    operationType: string
    address: string
    province: string
    city: string
    neighborhood: string
    hideExactAddress: boolean
    photos: string[]
    totalSurface: number
    coveredSurface: number
    rooms: number
    bedrooms: number
    bathrooms: number
    parkingSpaces: number
    title: string
    description: string
    videoUrl: string
    price: number
    currency: string
    expenses: number
  }
  currentStep: number
  errors: Record<string, string>
  isSubmitting: boolean
}

const initialState: PublicationState = {
  formData: {
    category: "",
    operationType: "",
    address: "",
    province: "",
    city: "",
    neighborhood: "",
    hideExactAddress: false,
    photos: [],
    totalSurface: 0,
    coveredSurface: 0,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    title: "",
    description: "",
    videoUrl: "",
    price: 0,
    currency: "USD",
    expenses: 0,
  },
  currentStep: 1,
  errors: {},
  isSubmitting: false,
}

export const publicationSlice = createSlice({
  name: "publication",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload
      ;(state.formData as any)[field] = value

      // Clear error when field is updated
      if (state.errors[field]) {
        delete state.errors[field]
      }
    },
    setFormData: (state, action: PayloadAction<any>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    resetForm: (state) => {
      state.formData = initialState.formData
      state.currentStep = 1
      state.errors = {}
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
  },
})

export const { updateField, setFormData, setCurrentStep, resetForm, setErrors, setSubmitting } =
  publicationSlice.actions

// Selectors
export const selectFormData = (state: RootState) => state.publication.formData
export const selectCurrentStep = (state: RootState) => state.publication.currentStep
export const selectFormErrors = (state: RootState) => state.publication.errors
export const selectIsSubmitting = (state: RootState) => state.publication.isSubmitting

export default publicationSlice.reducer
