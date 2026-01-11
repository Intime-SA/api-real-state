import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface StepState {
  status: "pending" | "current" | "completed" | "invalid"
  hasData: boolean
  lastVisited: boolean
}

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
    totalSurface?: number
    coveredSurface?: number
    rooms?: number
    bedrooms?: number
    bathrooms?: number
    parkingSpaces?: number
    title: string
    description: string
    videoUrl: string
    price: number
    currency: string
    expenses: number
  }
  currentStep: number
  stepStates: Record<number, StepState>
  errors: Record<string, string>
  isSubmitting: boolean
}

const initialStepStates: Record<number, StepState> = {
  1: { status: "current", hasData: false, lastVisited: true },
  2: { status: "pending", hasData: false, lastVisited: false },
  3: { status: "pending", hasData: false, lastVisited: false },
  4: { status: "pending", hasData: false, lastVisited: false },
  5: { status: "pending", hasData: false, lastVisited: false },
  6: { status: "pending", hasData: false, lastVisited: false },
  7: { status: "pending", hasData: false, lastVisited: false },
  8: { status: "pending", hasData: false, lastVisited: false },
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
    totalSurface: undefined,
    coveredSurface: undefined,
    rooms: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    parkingSpaces: undefined,
    title: "",
    description: "",
    videoUrl: "",
    price: 0,
    currency: "USD",
    expenses: 0,
  },
  currentStep: 1,
  stepStates: initialStepStates,
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

      // Update step data status based on field changes
      updateStepDataStatus(state)
    },
    setFormData: (state, action: PayloadAction<any>) => {
      state.formData = { ...state.formData, ...action.payload }
      // Update step data status when form data is set
      updateStepDataStatus(state)
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      // Mark previous step as visited
      if (state.stepStates[state.currentStep]) {
        state.stepStates[state.currentStep].status = "completed"
      }

      state.currentStep = action.payload

      // Mark new step as current and visited
      if (state.stepStates[action.payload]) {
        state.stepStates[action.payload].status = "current"
        state.stepStates[action.payload].lastVisited = true
      }
    },
    completeStep: (state, action: PayloadAction<number>) => {
      const stepId = action.payload
      if (state.stepStates[stepId]) {
        state.stepStates[stepId].status = "completed"
        state.stepStates[stepId].hasData = true
        state.stepStates[stepId].lastVisited = true
      }
    },
    markStepAsInvalid: (state, action: PayloadAction<number>) => {
      const stepId = action.payload
      if (state.stepStates[stepId]) {
        state.stepStates[stepId].status = "invalid"
      }
    },
    resetForm: (state) => {
      state.formData = initialState.formData
      state.currentStep = 1
      state.stepStates = initialStepStates
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

// Helper function to update step data status based on form data
function updateStepDataStatus(state: PublicationState) {
  const { formData } = state

  // Step 1: Category
  state.stepStates[1].hasData = !!formData.category

  // Step 2: Operation Type
  state.stepStates[2].hasData = !!formData.operationType

  // Step 3: Location
  state.stepStates[3].hasData = !!(formData.address && formData.province && formData.city)

  // Step 4: Photos
  state.stepStates[4].hasData = formData.photos.length > 0

  // Step 5: Characteristics (opcional - siempre se considera completo)
  state.stepStates[5].hasData = true

  // Step 6: Title and Description
  state.stepStates[6].hasData = !!(formData.title && formData.description)

  // Step 7: Video and Price
  state.stepStates[7].hasData = !!formData.price

  // Step 8: Features (always consider as having data for now)
  state.stepStates[8].hasData = true
}

export const {
  updateField,
  setFormData,
  setCurrentStep,
  completeStep,
  markStepAsInvalid,
  resetForm,
  setErrors,
  setSubmitting,
} = publicationSlice.actions

// Selectors
export const selectFormData = (state: RootState) => state.publication.formData
export const selectCurrentStep = (state: RootState) => state.publication.currentStep
export const selectStepStates = (state: RootState) => state.publication.stepStates
export const selectFormErrors = (state: RootState) => state.publication.errors
export const selectIsSubmitting = (state: RootState) => state.publication.isSubmitting
export const selectIsFormComplete = (state: RootState) => {
  const stepStates = state.publication.stepStates
  return Object.values(stepStates).every((step) => step.status === "completed")
}

export default publicationSlice.reducer
