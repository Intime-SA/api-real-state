import { configureStore } from "@reduxjs/toolkit"
import publicationReducer from "./slices/publicationSlice"

export const store = configureStore({
  reducer: {
    publication: publicationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
