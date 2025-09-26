import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Clock } from 'lucide-react'

export default function DetalhesOrdemPage() {
  const navigate = useNavigate()
  const [numeroEletrico, setNumeroEletrico] = useState('500')

  const assuntos = [
    { id: 1, descricao: 'Iluminação interior fraca', tempo: '00:10' },
    { id: 2, descricao: 'Porta não abre', tempo: '00:17' }
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
        <h1 className="text-xl font-bold text-gray-900">Elétrico & Serviço</h1>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Número do Elétrico */}
        <div className="mb-6">
          <Label htmlFor="numero-eletrico" className="text-gray-700 font-medium mb-2 block">
            N.º do Elétrico
          </Label>
          <Input
            id="numero-eletrico"
            type="text"
            value={numeroEletrico}
            onChange={(e) => setNumeroEletrico(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Lista de Assuntos */}
        <div className="space-y-4">
          {assuntos.map((assunto) => (
            <div
              key={assunto.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    Assunto
                  </h3>
                  <p className="text-gray-700 mb-2">{assunto.descricao}</p>
                </div>
                <div className="flex items-center text-gray-600 ml-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono">{assunto.tempo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <span className="text-gray-600 text-sm">1 / 1</span>
        </div>
      </main>
    </div>
  )
}

