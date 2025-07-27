"use client"

import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { store } from "@/lib/store"
import PublicationWizard from "@/components/publication-wizard"

const queryClient = new QueryClient()

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Publicaciones</h1>
              <p className="text-blue-200">Gestiona tus propiedades y analiza el rendimiento</p>
            </div>
            <PublicationWizard />
          </div>
        </div>
      </Provider>
    </QueryClientProvider>
  )
}
