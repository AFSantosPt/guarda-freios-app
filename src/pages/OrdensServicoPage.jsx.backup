import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'

export default function OrdensServicoPage() {
  const navigate = useNavigate()

  const ordens = [
    { id: 1, assunto: 'Assunto 1', duracao: '30 min' },
    { id: 2, assunto: 'Assunto 2', duracao: '45 min' },
    { id: 3, assunto: 'Assunto 3', duracao: '1 h' }
  ]

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
        <h1 className="text-xl font-bold text-gray-900">Ordens de Serviço</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="space-y-4">
          {ordens.map((ordem) => (
            <div
              key={ordem.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {ordem.assunto}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{ordem.duracao}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/detalhes-ordem')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <span className="text-gray-600 text-sm">1 de 1</span>
        </div>
      </main>
    </div>
  )
}

