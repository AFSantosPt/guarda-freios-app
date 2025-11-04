import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../App'
import axios from 'axios'
import { ArrowLeft, Clock, Plus, Trash2, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'

export default function OrdensServicoPage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const isGestor = user?.tipo === 'Gestor'

  const [ordens, setOrdens] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [assunto, setAssunto] = useState('')
  const [tempoEstimado, setTempoEstimado] = useState('')
  const [ficheiros, setFicheiros] = useState([])
  const [loading, setLoading] = useState(true)

  // Função para buscar ordens (simulação)
  const fetchOrdens = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await axios.get(`${API_URL}/api/ordens`)
      setOrdens(response.data.ordens)
    } catch (error) {
      console.error('Erro ao buscar ordens:', error)
    } finally {
      setLoading(false)
    }
  }

  // Efeito para carregar ordens ao montar o componente
  React.useEffect(() => {
    fetchOrdens()
  }, [])

  const handleFileChange = (e) => {
    // Simulação de upload de ficheiros
    setFicheiros([...ficheiros, ...Array.from(e.target.files)])
  }

  const handleAddOrdem = async (e) => {
    e.preventDefault()
    if (!assunto || !tempoEstimado) {
      alert('Assunto e tempo estimado são obrigatórios.')
      return
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      // Simulação de upload de ficheiros (o upload real seria mais complexo)
      const ficheirosUrls = ficheiros.map(f => `/url/do/ficheiro/${f.name}`)

      const response = await axios.post(`${API_URL}/api/ordens`, {
        assunto,
        tempo_estimado: tempoEstimado,
        ficheiros: ficheirosUrls,
      })

      setOrdens([response.data.ordem, ...ordens])
      setAssunto('')
      setTempoEstimado('')
      setFicheiros([])
      setShowAddForm(false)
      alert('Ordem de serviço criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar ordem:', error)
      alert(`Erro ao criar ordem: ${error.response?.data?.message || 'Erro de rede'}`)
    }
  }

  const handleDeleteOrdem = (id) => {
    // Implementar lógica de exclusão (apenas gestor)
    alert(`Ordem ${id} excluída (simulação)`)
    setOrdens(ordens.filter(o => o.id !== id))
  }

  if (loading) {
    return <div className="p-4 text-center">A carregar ordens...</div>
  }

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
        {isGestor && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-5 h-5 mr-1" /> Adicionar
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4">
        {showAddForm && isGestor && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Nova Ordem</h2>
            <form onSubmit={handleAddOrdem} className="space-y-4">
              <div>
                <label htmlFor="assunto" className="block text-sm font-medium text-gray-700">Assunto</label>
                <input
                  type="text"
                  id="assunto"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="tempoEstimado" className="block text-sm font-medium text-gray-700">Tempo Estimado (minutos)</label>
                <input
                  type="number"
                  id="tempoEstimado"
                  value={tempoEstimado}
                  onChange={(e) => setTempoEstimado(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="ficheiros" className="block text-sm font-medium text-gray-700">Upload de Ficheiros (PDF, DOCX, imagens)</label>
                <input
                  type="file"
                  id="ficheiros"
                  onChange={handleFileChange}
                  multiple
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {ficheiros.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    Ficheiros selecionados: {ficheiros.map(f => f.name).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                <Button type="submit">Criar Ordem</Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {ordens.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma ordem de serviço encontrada.</p>
          ) : (
            ordens.map((ordem) => (
              <div
                key={ordem.id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {ordem.assunto}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{ordem.tempo_estimado} minutos</span>
                    </div>
                    <p className="text-xs text-gray-500">Criado por: {ordem.criado_por_nome} em {new Date(ordem.criado_em).toLocaleDateString()}</p>
                    
                    {ordem.ficheiros && ordem.ficheiros.length > 0 && (
                      <div className="flex items-center mt-2 text-sm text-blue-600">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>{ordem.ficheiros.length} Anexo(s)</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/ordens-servico/${ordem.id}`)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Ver detalhes
                    </Button>
                    {isGestor && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrdem(ordem.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

