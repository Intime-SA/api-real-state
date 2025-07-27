import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Home,
  Key,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Globe,
  Code,
  BookOpen,
} from "lucide-react"

export default function APIWelcome() {
  const stats = [
    { label: "Propiedades Activas", value: "2,847", icon: Home, color: "text-blue-600" },
    { label: "Usuarios Registrados", value: "1,234", icon: Users, color: "text-green-600" },
    { label: "Transacciones", value: "456", icon: TrendingUp, color: "text-purple-600" },
    { label: "Ciudades", value: "89", icon: MapPin, color: "text-orange-600" },
  ]

  const endpoints = [
    { method: "GET", path: "/api/properties", description: "Obtener listado de propiedades" },
    { method: "POST", path: "/api/properties", description: "Crear nueva propiedad" },
    { method: "GET", path: "/api/users", description: "Gestión de usuarios" },
    { method: "GET", path: "/api/locations", description: "Ubicaciones disponibles" },
  ]

  const features = [
    { icon: Shield, title: "Seguridad Avanzada", description: "Autenticación JWT y encriptación de datos" },
    { icon: Zap, title: "Alto Rendimiento", description: "Respuestas optimizadas y cache inteligente" },
    { icon: Database, title: "Base de Datos Robusta", description: "PostgreSQL con respaldos automáticos" },
    { icon: Globe, title: "API RESTful", description: "Estándares web modernos y documentación completa" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Salvatto Inmobiliaria API</h1>
                <p className="text-slate-400 text-sm">Plataforma de Gestión Inmobiliaria</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              API Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Bienvenido a Nexus API</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            La plataforma más avanzada para la gestión de propiedades inmobiliarias. Conecta, gestiona y escala tu
            negocio inmobiliario.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-slate-700/50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* API Endpoints */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-400" />
                Endpoints Principales
              </CardTitle>
              <CardDescription className="text-slate-400">Principales rutas de la API disponibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className={`${
                        endpoint.method === "GET" ? "border-green-500 text-green-400" : "border-blue-500 text-blue-400"
                      } bg-transparent`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-slate-300 font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <p className="text-slate-400 text-sm">{endpoint.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 mr-2 text-purple-400" />
                Características Principales
              </CardTitle>
              <CardDescription className="text-slate-400">Tecnologías y funcionalidades destacadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="p-2 bg-slate-600/50 rounded-lg">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* API Status */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">API Lista para Usar</h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              Nuestra API está completamente operativa y lista para integrarse con tu aplicación. Consulta la
              documentación para comenzar a desarrollar.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Documentación
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-600/20 bg-transparent">
                <Code className="w-4 h-4 mr-2" />
                Ejemplos de Código
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="border-t border-slate-700 pt-8">
            <p className="text-slate-400">
              © 2024 Nexus Inmobiliaria API. Desarrollado por <a href="https://atlantics.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Atlantics.dev</a>
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <Badge variant="outline" className="border-slate-600 text-slate-400 bg-transparent">
                Versión 2.1.0
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-400 bg-transparent">
                Uptime: 99.9%
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-400 bg-transparent">
                Última actualización: Hoy
              </Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
