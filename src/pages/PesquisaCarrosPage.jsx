import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search } from 'lucide-react'

export default function PesquisaCarrosPage() {
  const navigate = useNavigate()
  const [pesquisa, setPesquisa] = useState('')

  const carros = [
    { numero: '501', estado: 'Pendente', cor: 'text-orange-600' },
    { numero: '523', estado: 'Resolvida', cor: 'text-green-600' },
    { numero: '542', estado: 'Pendente', cor: 'text-orange-600' },
    { numero: '586', estado: 'Resolvida', cor: 'text-green-600' }
  ]

  const carrosFiltrados = carros.filter(carro => 
    carro.numero.includes(pesquisa) || pesquisa === ''
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Pesquisa de Carros</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Search Field */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="N.º do Carro"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de Carros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {carrosFiltrados.map((carro, index) => (
            <div
              key={carro.numero}
              className={`flex justify-between items-center p-4 ${
                index !== carrosFiltrados.length - 1 ? 'border-b border-gray-200' : ''
              } hover:bg-gray-50 transition-colors duration-200`}
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 mr-4">
                  {carro.numero}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`font-medium ${carro.cor}`}>
                  {carro.estado}
                </span>
              </div>
            </div>
          ))}
          
          {carrosFiltrados.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhum carro encontrado</p>
            </div>
          )}
        </div>

        {/* Info adicional */}
        {carrosFiltrados.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Mostrando {carrosFiltrados.length} resultado{carrosFiltrados.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </main>
    </div>
  )
}

