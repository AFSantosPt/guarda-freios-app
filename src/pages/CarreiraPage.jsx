import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Tram, MessageCircle } from 'lucide-react'

export default function CarreiraPage() {
  const navigate = useNavigate()

  const paragens = [
    { nome: 'Martim Moniz', posicao: 'top', temEletrico: false },
    { nome: 'Graça', posicao: 'middle', temEletrico: true },
    { nome: 'R. Conceição', posicao: 'middle', temEletrico: false },
    { nome: 'Estrela', posicao: 'middle', temEletrico: true },
    { nome: 'Prazeres', posicao: 'middle', temEletrico: false },
    { nome: 'R. Conceição', posicao: 'middle', temEletrico: false },
    { nome: 'Graça', posicao: 'middle', temEletrico: false },
    { nome: 'Martim Moniz', posicao: 'bottom', temEletrico: false }
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
        <h1 className="text-xl font-bold text-gray-900">Carreira 28E</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 flex flex-col items-center">
        <div className="relative w-full max-w-md">
          {/* Linha vertical */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 h-full"></div>
          
          {/* Paragens */}
          <div className="space-y-8 py-4">
            {paragens.map((paragem, index) => (
              <div key={index} className="relative flex items-center">
                {/* Ponto da paragem */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full z-10"></div>
                
                {/* Nome da paragem - alternando lados */}
                <div className={`flex items-center ${index % 2 === 0 ? 'justify-start pr-8' : 'justify-end pl-8'} w-full`}>
                  {index % 2 === 0 ? (
                    <>
                      <span className="text-lg font-medium text-gray-900 mr-4">
                        {paragem.nome}
                      </span>
                      {paragem.temEletrico && (
                        <Tram className="w-8 h-8 text-yellow-600" />
                      )}
                    </>
                  ) : (
                    <>
                      {paragem.temEletrico && (
                        <Tram className="w-8 h-8 text-yellow-600 mr-4" />
                      )}
                      <span className="text-lg font-medium text-gray-900">
                        {paragem.nome}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Bubble */}
        <div className="fixed bottom-20 right-4">
          <div className="bg-black text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-lg max-w-xs">
            <p className="text-sm">Como posso ajudar?</p>
          </div>
          <Button
            size="sm"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  )
}

